"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowDown } from "lucide-react";
import { useQueryState } from "nuqs";
import { erc20Abi, formatUnits, parseUnits, stringToHex } from "viem";
import { useAccount, useContractRead } from "wagmi";

import type { Address } from "viem";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useInspectBalance, useInspectFunds } from "~/hooks/inspect";
import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteErc20Approve,
  useWriteErc20PortalDepositErc20Tokens,
  useWriteInputBoxAddInput,
} from "~/hooks/wagmi";
import { cn } from "~/lib/utils";

export const BridgeTabs: React.FC = () => {
  // const symbol = "SIM"; // XXX: should actually come from querying token metadata
  // const decimals = 18; // XXX: should actually come from querying token metadata

  const tokenAddress = "0x92C6bcA388E99d6B304f1Af3c3Cd749Ff0b591e2"; // Simoleons
  const erc20PortalAddress = "0x9c21aeb2093c32ddbc53eef24b873bdcd1ada1db";
  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`; // Default address for running locally change upon deployment

  const { data: symbol } = useContractRead({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "symbol",
  });

  const { data: decimals = 18 } = useContractRead({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const router = useRouter();
  const { address } = useAccount();

  if (!address) {
    router.replace("/");
  }

  const [tab, setTab] = useQueryState("tab", { defaultValue: "deposit" });
  const {
    balance: l2Balance,
    isLoading: l2BalanceLoading,
    error: l2BalanceError,
  } = useInspectBalance(address!);
  const {
    funds,
    isLoading: fundsLoading,
    error: fundsError,
  } = useInspectFunds(address!);
  // console.log(balance);

  const { data: l1Balance, isLoading: l1BalanceLoading } =
    useReadErc20BalanceOf({
      address: tokenAddress,
      args: [address!],
    });
  const { data: allowance, isLoading: allowanceLoading } =
    useReadErc20Allowance({
      address: tokenAddress,
      args: [address!, erc20PortalAddress],
    });

  const [amount, setAmount] = useState<bigint>(0n);

  const { writeContractAsync: approveToken } = useWriteErc20Approve();
  const { writeContractAsync: depositToken } =
    useWriteErc20PortalDepositErc20Tokens();
  const { writeContractAsync: write } = useWriteInputBoxAddInput();

  const approve = async (address: Address, amount: string) => {
    try {
      await approveToken({
        address,
        args: [erc20PortalAddress, parseUnits(amount, decimals || 18)],
      });
      console.log("ERC20 Approval successful");
    } catch (error) {
      console.error("Error in approving ERC20:", error);
      throw error;
    }
  };

  const [isDepositing, setIsDepositing] = useState(false); // New loading state
  const deposit = async (amount: string) => {
    try {
      const data = stringToHex(`Deposited (${amount}).`);
      await depositToken({
        args: [
          tokenAddress,
          dAppAddress,
          parseUnits(amount, decimals || 18),
          data,
        ],
      });
    } catch (error) {
      console.error("Error in depositing ERC20:", error);
      throw error;
    }
  };
  // TODO: Add loading states to deposit

  const withdraw = async (amount: string) => {
    try {
      const data = await write({
        args: [dAppAddress, stringToHex(`{"method": "withdraw"}`)],
      });
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const canApprove =
    l1Balance != undefined &&
    allowance !== undefined &&
    amount > 0 &&
    allowance < parseUnits(amount.toString(), decimals || 18) &&
    parseUnits(amount.toString(), decimals) <= (l1Balance ?? 0n);

  const canDeposit =
    l1Balance != undefined &&
    allowance != undefined &&
    amount > 0 &&
    parseUnits(amount.toString(), decimals) <= allowance &&
    parseUnits(amount.toString(), decimals) <= l1Balance;

  const canWithdraw = funds !== undefined && funds > 0;
  const canTransfer = true;

  const [gameHash, setGameHash] = useState("");

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="bg-card/40 font-fixedsys w-full max-w-xl space-y-4 rounded-2xl p-6 shadow-lg backdrop-blur-sm"
    >
      <TabsList className="bg-card/50 grid w-full grid-cols-3 rounded-xl shadow-md *:rounded-lg *:data-[state=active]:shadow-md">
        <TabsTrigger value="deposit">Deposit</TabsTrigger>
        <TabsTrigger value="nft">NFT</TabsTrigger>
        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
      </TabsList>

      <TabsContent value="deposit" className="space-y-4">
        <div className="bg-card/50 space-y-2 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground text-sm">From:</p>
            <div className="flex items-center gap-2">
              <ConnectButton
                showBalance={{
                  smallScreen: false,
                  largeScreen: false,
                }}
                chainStatus="none"
              />
            </div>
          </div>

          <Input
            type="number"
            value={amount.toString()}
            onChange={(e) => setAmount(BigInt(e.target.value))}
            placeholder="0"
            className={cn(
              "bg-foreground/10 w-full text-2xl outline-hidden",
              // hide number arrows
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            )}
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Balance:{" "}
              {l1BalanceLoading ?
                "Loading..."
              : `${formatUnits(l1Balance ?? 0n, decimals)} ${symbol}`}
            </span>
            <span className="text-muted-foreground">
              Allowance:{" "}
              {allowanceLoading ?
                "Loading..."
              : `${formatUnits(allowance ?? 0n, decimals)} ${symbol}`}
            </span>
          </div>
        </div>

        <ArrowDownIcon />

        <div className="bg-card/50 space-y-2 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground text-sm">To:</p>
            <div className="flex items-center gap-1">
              <ConnectButton
                showBalance={{
                  smallScreen: false,
                  largeScreen: false,
                }}
                chainStatus="none"
              />
              <span className="font-bitmap text-muted-foreground">
                @Cryptopolis
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Balance:{" "}
            {l2BalanceLoading ?
              "Loading..."
            : l2BalanceError ?
              "Error"
            : `${formatUnits(l2Balance ?? 0n, decimals)} SIM`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="shadow-md"
            disabled={!canApprove}
            onClick={() => approve(tokenAddress, amount.toString())}
          >
            Approve
          </Button>
          <Button
            className="shadow-md"
            disabled={!canDeposit}
            onClick={() => deposit(amount.toString())}
          >
            {isDepositing ?
              <Spinner className="text-black" />
            : "Deposit"}
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="nft" className="space-y-4">
        <div className="bg-card/50 space-y-2 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground text-sm">From:</p>
            <div className="flex items-center gap-2">
              <ConnectButton
                showBalance={{
                  smallScreen: false,
                  largeScreen: false,
                }}
                chainStatus="none"
              />
            </div>
          </div>

          <Input
            type="string"
            value={gameHash}
            onChange={(e) => setGameHash(e.target.value)}
            placeholder="0x"
            className={cn(
              "bg-foreground/10 w-full text-2xl outline-hidden",
              // hide number arrows
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            )}
          />

          
        </div>

        <ArrowDownIcon />

        <div className="bg-card/50 space-y-2 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground text-sm">To:</p>
            <div className="flex items-center gap-1">
              <ConnectButton
                showBalance={{
                  smallScreen: false,
                  largeScreen: false,
                }}
                chainStatus="none"
              />
              <span className="font-bitmap text-muted-foreground">
                @Cryptopolis
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="shadow-md"
            disabled={!canApprove}
            onClick={() => approve(tokenAddress, amount.toString())}
          >
            Approve
          </Button>
          <Button
            className="shadow-md"
            disabled={!canDeposit}
            onClick={() => deposit(amount.toString())}
          >
            {isDepositing ?
              <Spinner className="text-black" />
            : "Load"}
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="withdraw" className="space-y-4">
        <div className="bg-card/50 space-y-2 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground text-sm">From:</p>

            <div className="flex items-center gap-1 [&_div]:truncate">
              <ConnectButton
                showBalance={{
                  smallScreen: false,
                  largeScreen: false,
                }}
                chainStatus="none"
              />
              <span className="font-bitmap text-muted-foreground">
                @Cryptopolis
              </span>
            </div>
          </div>
          {/* No need for input withdraw will delete city in exchange for city funds  */}
          {/* <Input
            type="number"
            value={amount.toString()}
            onChange={(e) => setAmount(BigInt(e.target.value))}
            placeholder="0"
            className={cn(
              "bg-foreground/10 w-full text-2xl outline-hidden",
              // hide number arrows
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            )}
          /> */}
          <p className="text-muted-foreground text-sm">
            Funds:{" "}
            {fundsLoading ?
              "Loading..."
            : fundsError ?
              "Error"
            : `${funds} SIM`}
          </p>
        </div>

        <ArrowDownIcon />

        <div className="bg-card/50 space-y-2 rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground text-sm">To:</p>
            <div className="flex items-center gap-2">
              <ConnectButton
                showBalance={{
                  smallScreen: false,
                  largeScreen: false,
                }}
                chainStatus="none"
              />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            {l1BalanceLoading ?
              "Loading..."
            : `${formatUnits(l1Balance ?? 0n, decimals)} ${symbol}`}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full shadow-md"
          disabled={!canWithdraw}
          onClick={() => withdraw(amount.toString())}
        >
          Withdraw
        </Button>
        {/* <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="shadow-md"
            disabled={!canWithdraw}
            onClick={() => withdraw(amount.toString())}
          >
            Withdraw
          </Button>
          <Button
            className="shadow-md"
            disabled={!canTransfer}
            onClick={() => {
              // write({
              //   args: [
              //     dAppAddress,
              //     `0xa9059cbb000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000043c33c1937564800000`,
              //   ]
              // })
            }}
          >
            {isDepositing ? (
              <Spinner className="text-black" />
            ) : (
              "Transfer"
            )}
          </Button>
        </div> */}
      </TabsContent>
    </Tabs>
  );
};

export const ArrowDownIcon: React.FC = () => (
  <div className="flex justify-center">
    <span className="bg-card/50 aspect-square rounded-full p-2 shadow-md">
      <ArrowDown className="size-4" />
    </span>
  </div>
);
