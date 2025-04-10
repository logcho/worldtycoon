"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatUnits, parseUnits, stringToHex } from "viem";
import { useAccount } from "wagmi";

import { Button } from "~/components/ui/button";
import { useInspectBalance, useInspectMap } from "~/hooks/inspect";
import { useWriteInputBoxAddInput } from "~/hooks/wagmi";

import { Navbar } from "./header/navbar";

const CreatePage: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const symbol = "SIM"; // XXX: should actually come from querying token metadata
  const decimals = 18; // XXX: should actually come from querying token metadata

  const dAppAddress = `0xb842774c8EC2fEf32d0102dE532c352081e0Bb92`; // Default address for running locally change upon deployment

  const amount = "20000";

  const router = useRouter();
  const { address } = useAccount();

  if (!address) {
    router.replace("/");
  }

  const { balance, isLoading, error } = useInspectBalance(address!);
  const { map } = useInspectMap(address!);

  if (map) {
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
    <>
      <Navbar setIsOpen={setIsOpen} isOpen={isOpen} />
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat">
        <div className="bg-card/40 font-fixedsys w-full max-w-xl space-y-4 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
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

          <div className="bg-card/50 rounded-xl p-4 text-center shadow-md">
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
    </>
  );
};

export default CreatePage;
