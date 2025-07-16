"use client";

import { useRouter } from "next/navigation";
import Border from "./_components/border";
import BridgeTabs from "./_components/bridge-tabs";
import FooterSection from "./_components/footer";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Address } from "viem";
import { useEffect } from "react";
import { useGetCityBalance } from "@/hooks/inspect";
import { Spinner } from "@/components/ui/spinner";

export default function Bridge() {
  const router = useRouter();
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address as Address | undefined;
  const { trigger, cityBalance, isLoading } = useGetCityBalance(address);

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

      {primaryWallet === undefined || isLoading ? (
        <div className="h-screen w-full flex items-center justify-center">
          <Spinner className="text-white w-6 h-6" />
        </div>
      ) : (
        <>
          <BridgeTabs trigger={trigger} cityBalance={cityBalance} />
          <Border />
          <FooterSection />
        </>
      )}
    </main>
  );
}
