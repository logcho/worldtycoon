"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAccount } from "wagmi";

import { StoreProvider } from "~/hooks/use-store";

const PlayLayout: React.FCC = ({ children }) => {
  const router = useRouter();
  const { isDisconnected } = useAccount();

  // if (isDisconnected) {
  //   router.replace("/");
  // }

  return children;
};

export default PlayLayout;
