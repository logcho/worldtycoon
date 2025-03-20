"use client"
import * as React from "react";

import { Playground } from "./_components/playground";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useInspectMap } from "~/hooks/inspect";
import CreatePage from "./_components/create";


const PlayPage: React.FC = () => {
  const router = useRouter();
  const { isDisconnected, address } = useAccount();

  if (isDisconnected) {
    router.replace("/");
  }
  const { map } = useInspectMap(address!);

  return map ? <Playground initialMap={map} /> : <CreatePage />;
};

export default PlayPage;
