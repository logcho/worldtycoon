"use client";

import { useRouter } from "next/navigation";

import { useAccount } from "wagmi";

import type * as React from "react";

const CreateLayout: React.FCC = ({ children }) => {
  const router = useRouter();
  const { isDisconnected } = useAccount();

  if (isDisconnected) {
    router.replace("/");
  }

  return children;
};

export default CreateLayout;
