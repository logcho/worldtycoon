"use client";

import { useRouter } from "next/navigation";

import { useAccount } from "wagmi";

import type * as React from "react";

const PlayLayout: React.FCC = ({ children }) => {
  const router = useRouter();
  const { isDisconnected } = useAccount();

  if (isDisconnected) {
    router.replace("/");
  }

  return children;
};

export default PlayLayout;
