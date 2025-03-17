"use client"
import * as React from "react";

import { Playground } from "./_components/playground";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

const PlayPage: React.FC = () => {
  const router = useRouter();
  const { isDisconnected } = useAccount();

  if (isDisconnected) {
    router.replace("/");
  }

  return <Playground />;
};

export default PlayPage;
