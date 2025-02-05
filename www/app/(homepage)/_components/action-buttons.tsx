"use client";

import * as React from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { Link } from "~/components/ui/link";

export const HomePageActionButtons: React.FC = () => {
  const { status } = useAccount();

  return (
    <div className="flex flex-col items-center gap-4 py-10">
      {status === "connected" ?
        <>
          <Link
            href="/play"
            className="inline-flex h-11 w-32 items-center justify-center bg-[#333] font-fixedsys text-xl text-[#dcd8c0] shadow-md transition-all duration-300 [text-shadow:_1px_1px_0_#000] hover:bg-[#444] hover:text-[#e1e1e1] hover:shadow-[4px_4px_0_#000] hover:[text-shadow:_2px_2px_0_#000]"
          >
            Play
          </Link>

          <Link
            href="/create"
            className="inline-flex h-11 w-32 items-center justify-center bg-[#333] font-fixedsys text-xl text-[#dcd8c0] shadow-md transition-all duration-300 [text-shadow:_1px_1px_0_#000] hover:bg-[#444] hover:text-[#e1e1e1] hover:shadow-[4px_4px_0_#000] hover:[text-shadow:_2px_2px_0_#000]"
          >
            Create
          </Link>
        </>
      : <ConnectButton />}
    </div>
  );
};
