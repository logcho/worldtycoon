"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowDown } from "lucide-react";
import { useQueryState } from "nuqs";
import { useAccount } from "wagmi";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

import { useInspectBalance } from "~/hooks/game";
import {
  useReadErc20BalanceOf,
  useReadErc20Allowance,
  useWriteErc20Approve,
} from "~/hooks/wagmi";
import { formatUnits } from 'viem'


export const BridgeTabs: React.FC = () => {
  const router = useRouter();
  const { address } = useAccount();

  if (!address) {
    router.replace("/");
  }

  const [tab, setTab] = useQueryState("tab", { defaultValue: "deposit" });
  const { balance, isLoading, error } = useInspectBalance(address);
  // console.log(balance);

  const token = "0x92C6bcA388E99d6B304f1Af3c3Cd749Ff0b591e2";
  const erc20PortalAddress = "0x9c21aeb2093c32ddbc53eef24b873bdcd1ada1db"
  const { data: l1Balance, isLoading: l1BalanceLoading } = useReadErc20BalanceOf({
    address: token,
    args: [address],
    watch: true,
  });
  const { data: allowance, isLoading: allowanceLoading } = useReadErc20Allowance({
    address: token,
    args: [address, erc20PortalAddress],
    watch: true,
  });



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
            placeholder="0"
            className={cn(
              "w-full bg-foreground/10 text-2xl outline-none",
              // hide number arrows
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            )}
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Balance: {l1BalanceLoading ? "Loading..." : `${formatUnits(l1Balance ?? 0n, 18)} SIM`}</span>
            <span className="text-muted-foreground">Allowance: {allowanceLoading ? "Loading..." : `${allowance} SIM`}</span>
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
          <p className="text-sm text-muted-foreground">Balance: {isLoading ? "Loading..." : error ? "Error" : `${balance} SIM`}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="shadow-md">
            Approve
          </Button>
          <Button className="shadow-md">Deposit</Button>
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
