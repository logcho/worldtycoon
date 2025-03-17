"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatUnits, parseUnits, stringToHex } from "viem";
import { useAccount } from "wagmi";

import { Button } from "~/components/ui/button";
import { useInspectBalance, useInspectMap } from "~/hooks/inspect";
import { useWriteInputBoxAddInput } from "~/hooks/wagmi";

const CreatePage: React.FC = () => {
  const symbol = "SIM"; // XXX: should actually come from querying token metadata
  const decimals = 18; // XXX: should actually come from querying token metadata

  const dAppAddress = `0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e`; // Default address for running locally change upon deployment

  const amount = "20000";

  const router = useRouter();
  const { address } = useAccount();

  if (!address) {
    router.replace("/");
  }

  const { balance, isLoading, error } = useInspectBalance(address!);
  const { map } = useInspectMap(address!);

  if(map){
    router.replace("play");
  }

  const { writeContractAsync } = useWriteInputBoxAddInput();

  const create = async () => {
    await writeContractAsync({
      args: [dAppAddress, stringToHex(`{"method":"start"}`)],
    });
  };

  const canCreate =
    balance != undefined && balance >= parseUnits(amount.toString(), decimals);

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-xl space-y-4 rounded-2xl bg-card/40 p-6 font-fixedsys shadow-lg backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">
            Balance:{" "}
            {isLoading ?
              "Loading..."
            : error ?
              "Error"
            : `${formatUnits(balance ?? 0n, decimals)} ${symbol}`}
          </h2>
          <ConnectButton
            showBalance={{
              smallScreen: false,
              largeScreen: false,
            }}
            chainStatus="none"
          />
        </div>

        <div className="rounded-xl bg-card/50 p-4 text-center shadow-md">
          <p className="text-muted-foreground">
            20000 SIM will be debited from your account and deposited into the
            city safe. If you want to add funds to your account go to bridge.
          </p>
        </div>

        <Button
          className="w-full shadow-md"
          size="lg"
          disabled={!canCreate}
          onClick={create}
        >
          Create City
        </Button>
      </div>
    </div>
  );
};

export default CreatePage;
