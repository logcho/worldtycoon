"use client";

import { useRouter } from "next/navigation";
import Border from "./_components/border";
import BridgeTabs from "./_components/bridge-tabs";
import FooterSection from "./_components/footer";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Address } from "viem";
import { useEffect } from "react";
import { useGetMapFunds } from "@/hooks/inspect";

export default function Bridge() {
  const router = useRouter();
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address as Address | undefined;
  const { trigger, mapFunds } = useGetMapFunds(address);

  // Redirect if no wallet
  useEffect(() => {
    if (primaryWallet === null) {
      router.replace("/");
    }
  }, [primaryWallet, router]);

  // Trigger balance fetch
  useEffect(() => {
    if (address) {
      trigger();
    }
  }, [address, trigger]);

  return (
    <main className="bg-[url('/images/backgrounds/bg.png')] bg-cover bg-center bg-no-repeat w-full h-screen custom-scroll">
      <BridgeTabs trigger={trigger} mapFunds={mapFunds} />
      <Border />
      <FooterSection />
    </main>
  );
}
