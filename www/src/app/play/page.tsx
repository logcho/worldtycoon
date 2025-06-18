"use client";
import { useRouter } from "next/navigation";
import CreatePage from "./_components/create";
import PlayPage from "./_components/play";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect } from "react";
import { Address } from "viem";
import { useHasCity } from "@/hooks/inspect"; // ✅ updated hook name

export default function Play() {
  const router = useRouter();
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address as Address | undefined;

  const { trigger, hasCity, isLoading, error } = useHasCity(address);

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
  return hasCity ? <PlayPage /> : <CreatePage trigger={trigger} />;
}
