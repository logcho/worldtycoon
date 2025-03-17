"use client"
import * as React from "react";

import { BridgeTabs } from "./_components/brige-tabs";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { NuqsAdapter } from "nuqs/adapters/next/app";


const BridgePage: React.FC = () => {
  const router = useRouter();
  const { isDisconnected } = useAccount();

  return (
    <NuqsAdapter>
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat">
        <BridgeTabs />
      </div>
    </NuqsAdapter>
    
  );
};

export default BridgePage;
