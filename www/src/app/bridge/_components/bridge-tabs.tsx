"use client";

import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DynamicButton from "@/components/dynamic-button";
import { fixedsys } from "@/lib/fonts";
import { Address, formatUnits, stringToHex } from "viem";
import { useReadErc20BalanceOf, useReadErc20Decimals, useReadErc20Symbol } from "@/hooks/contracts";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useWriteInputBoxAddInput } from "@/hooks/inputbox";
import { useState, useEffect, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";

type BridgeTabsProps = {
  cityBalance: number;
  trigger: () => void; // ⬅ Add this
};

export default function BridgeTabs({ cityBalance, trigger }: BridgeTabsProps) {
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address as Address | undefined;

  const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as Address;
  const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS as Address;

  const { data: symbol } = useReadErc20Symbol({ address: TOKEN_ADDRESS });
  const { data: decimals = 18 } = useReadErc20Decimals({ address: TOKEN_ADDRESS });

  const {
    data: balance = 0,
    isLoading: balanceLoading,
  } = useReadErc20BalanceOf({
    address: TOKEN_ADDRESS,
    args: address ? [address] : undefined,
  });

  const formattedBalance = balance ? formatUnits(balance, decimals) : "0";
  const canWithdraw = cityBalance > 0;

  const { writeContractAsync, status: withdrawStatus } = useWriteInputBoxAddInput();

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const lastCityBalanceRef = useRef(cityBalance);

  const withdrawPayload = stringToHex(`{"method":"withdraw"}`);

  const withdraw = async () => {
    try {
      setIsWithdrawing(true);
      await writeContractAsync({
        args: [DAPP_ADDRESS, withdrawPayload],
      });

      // Refetch city balance after a delay (e.g. indexer lag)
      setTimeout(() => {
        trigger();
      }, 5000); // Adjust delay if needed
    } catch (error) {
      console.error("Error in withdrawing:", error);
      setIsWithdrawing(false);
    }
  };

  useEffect(() => {
    if (isWithdrawing && cityBalance < lastCityBalanceRef.current) {
      setIsWithdrawing(false);
      lastCityBalanceRef.current = cityBalance;
    }
  }, [cityBalance, isWithdrawing]);

  return (
    <section className="flex items-center justify-center w-full h-screen">
      <Tabs
        value="withdraw"
        className={`${fixedsys.className} w-full max-w-xl rounded-2xl bg-card/30 p-6 shadow-xl backdrop-blur-md`}
      >
        <TabsList className="grid w-full grid-cols-1 rounded-xl bg-card/50 p-1 shadow-inner">
          <TabsTrigger
            value="withdraw"
            className="text-sm data-[state=active]:bg-card/80 data-[state=active]:shadow-md rounded-lg px-4 py-2 transition"
          >
            Withdraw
          </TabsTrigger>
        </TabsList>

        <TabsContent value="withdraw" className="space-y-6 pt-4">
          {/* From Section */}
          <div className="space-y-2 rounded-xl bg-card/40 p-5 shadow-md">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="flex items-center gap-3">
              <DynamicButton />
              <span className="truncate text-xs text-muted-foreground font-bitmap">
                @Cryptopolis
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Funds: <span className="font-bold text-primary">{cityBalance} SIM</span>
            </div>
          </div>

          <ArrowDownIcon />

          {/* To Section */}
          <div className="space-y-2 rounded-xl bg-card/40 p-5 shadow-md">
            <div className="text-xs text-muted-foreground">To</div>
            <div className="flex items-center gap-3">
              <DynamicButton />
            </div>
            <div className="text-xs text-muted-foreground">
              Balance:{" "}
              <span className="font-bold text-primary">
                {balanceLoading ? "Loading..." : `${formattedBalance} ${symbol ?? ""}`}
              </span>
            </div>
          </div>
          <Button
            className="w-full py-4 text-sm font-bold shadow-lg hover:shadow-xl transition-all"
            disabled={!canWithdraw || withdrawStatus === "pending" || isWithdrawing}
            onClick={withdraw}
          >
            {(withdrawStatus === "pending" || isWithdrawing) ? (
              <Spinner className="text-black" />
            ) : (
              "Create Voucher"
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </section>
  );
}

const ArrowDownIcon: React.FC = () => (
  <div className="flex justify-center">
    <div className="rounded-full bg-card/50 p-2 shadow-md ring-1 ring-border">
      <ArrowDown className="h-4 w-4 text-muted-foreground" />
    </div>
  </div>
);
