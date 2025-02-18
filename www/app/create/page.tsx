"use client";
import * as React from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

import { useInspectBalance } from "~/hooks/game";
import { useAccount } from "wagmi";

const CreatePage: React.FC = () => {
  const router = useRouter();
  const { address } = useAccount();

  if (!address) {
    router.replace("/");
  }

  const { balance, isLoading, error } = useInspectBalance(address);


  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="w-full max-w-xl space-y-4 rounded-2xl bg-card/40 p-6 font-fixedsys shadow-lg backdrop-blur">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Balance: {isLoading ? "Loading..." : error ? "Error" : `${balance} SIM`}</h2>
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
            city safe
          </p>
        </div>

        <Button className="w-full shadow-md" size="lg">
          Create City
        </Button>
      </div>
    </div>
  );
};

export default CreatePage;
