"use client";

import { useRouter } from "next/navigation";
import CreatePage from "./_components/create";
import Playground from "./_components/playground";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect } from "react";
import { Address } from "viem";
import { useGetCity } from "@/hooks/inspect";

export default function Play() {
  const router = useRouter();
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address as Address | undefined;

  const { trigger, game } = useGetCity(address);
  // Redirect to homepage if not logged in
  useEffect(() => {
    if (primaryWallet === null) {
      router.replace("/");
    }
  }, [primaryWallet, router]);

  // Trigger check for city on address load
  useEffect(() => {
    if (address) {
      trigger();
    }
  }, [address, trigger]);

  // Render based on whether the user has a city
  return game ? <Playground game={game} /> : <CreatePage trigger={trigger} />;
}
