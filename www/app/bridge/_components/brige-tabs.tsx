"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowDown } from "lucide-react";
import { useQueryState } from "nuqs";
import { formatUnits, parseUnits, stringToHex } from "viem";
import { useAccount } from "wagmi";

import type { Address } from "viem";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useInspectBalance } from "~/hooks/game";
import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useWriteErc20Approve,
  useWriteErc20PortalDepositErc20Tokens,
} from "~/hooks/wagmi";
import { cn } from "~/lib/utils";

export const BridgeTabs: React.FC = () => {
  const symbol = "SIM"; // XXX: should actually come from querying token metadata
  const decimals = 18; // XXX: should actually come from querying token metadata

  const tokenAddress = "0x92C6bcA388E99d6B304f1Af3c3Cd749Ff0b591e2";
  const erc20PortalAddress = "0x9c21aeb2093c32ddbc53eef24b873bdcd1ada1db";
  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`; // Default address for running locally change upon deployment

  const router = useRouter();
  const { address } = useAccount();

  if (!address) {
    router.replace("/");
  }

  const [tab, setTab] = useQueryState("tab", { defaultValue: "deposit" });
  const { balance, isLoading, error } = useInspectBalance(address!);
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

  const approve = async (address: Address, amount: string) => {
    try {
      await approveToken({
        address,
        args: [erc20PortalAddress, parseUnits(amount, decimals)],
      });
      console.log("ERC20 Approval successful");
    } catch (error) {
      console.error("Error in approving ERC20:", error);
      throw error;
    }
  };

  const deposit = async (amount: string) => {
    try {
      const data = stringToHex(`Deposited (${amount}).`);
      await depositToken({
        args: [tokenAddress, dAppAddress, parseUnits(amount, decimals), data],
      });
      console.log("ERC20 Deposit successful");
    } catch (error) {
      console.error("Error in depositing ERC20:", error);
      throw error;
    }
  };

  const canApprove =
    l1Balance != undefined &&
    allowance !== undefined &&
    amount > 0 &&
    allowance < parseUnits(amount.toString(), decimals) &&
    parseUnits(amount.toString(), decimals) <= (l1Balance ?? 0n);

  const canDeposit =
    l1Balance != undefined &&
    allowance != undefined &&
    amount > 0 &&
    parseUnits(amount.toString(), decimals) <= allowance &&
    parseUnits(amount.toString(), decimals) <= l1Balance;

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="w-full max-w-xl space-y-4 rounded-2xl bg-card/40 p-6 font-fixedsys shadow-lg backdrop-blur"
    >
      <TabsList className="grid w-full grid-cols-2 rounded-xl bg-card/50 shadow-md *:rounded-lg data-[state=active]:*:shadow-md">
        <TabsTrigger value="deposit">Deposit</TabsTrigger>
        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
      </TabsList>

      <TabsContent value="deposit" className="space-y-4">
        <div className="space-y-2 rounded-xl bg-card/50 p-4 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-sm text-muted-foreground">From:</p>
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
              "w-full bg-foreground/10 text-2xl outline-none",
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

        <div className="space-y-2 rounded-xl bg-card/50 p-4 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-sm text-muted-foreground">To:</p>
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
          <p className="text-sm text-muted-foreground">
            Balance:{" "}
            {isLoading ?
              "Loading..."
            : error ?
              "Error"
            : `${formatUnits(balance ?? 0n, decimals)} SIM`}
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
            Deposit
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="withdraw" className="space-y-4">
        <div className="space-y-2 rounded-xl bg-card/50 p-4 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-sm text-muted-foreground">From:</p>

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

          <Input
            type="number"
            placeholder="0"
            className={cn(
              "w-full bg-foreground/10 text-2xl outline-none",
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            )}
          />
          <p className="text-sm text-muted-foreground">Balance: 0 SIM</p>
        </div>

        <ArrowDownIcon />

        <div className="space-y-2 rounded-lg bg-card/50 p-4 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-sm text-muted-foreground">To:</p>
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
          <p className="text-sm text-muted-foreground">Balance: 0 SIM</p>
        </div>

        <Button className="w-full shadow-md">Withdraw</Button>
      </TabsContent>
    </Tabs>
  );
};

export const ArrowDownIcon: React.FC = () => (
  <div className="flex justify-center">
    <span className="aspect-square rounded-full bg-card/50 p-2 shadow-md">
      <ArrowDown className="size-4" />
    </span>
  </div>
);
