"use client";
import { useRouter } from "next/navigation";
import CreatePage from "./_components/create";
import PlayPage from "./_components/play";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { Address, hexToBool } from "viem";
import { fetchHasCity } from "@/hooks/inspect";
export default function Play(){

    const router = useRouter();

    const { trigger } = fetchHasCity();
    const [hasCity, setHasCity] = useState(false);

    
    const { primaryWallet } = useDynamicContext();
    const address = primaryWallet?.address as Address | undefined;

    useEffect(() => {
        if(!primaryWallet){
            router.replace("/");
        }
    }, [primaryWallet])


    useEffect(() => {
        if (address) {
            trigger(address)
                .then((res) => {
                console.log("Report:", res?.reports?.[0]?.payload);
                const payload = res?.reports?.[0]?.payload;
                if (payload) {
                    const hasCityBool = hexToBool(payload);
                    setHasCity(hasCityBool);
                    console.log("Has city:", hasCityBool);
                }
                })
                .catch((err) => {
                    console.error("Error checking hasCity:", err);
                });
        }
    }, [address, trigger]);
    
    return hasCity ? <PlayPage /> : <CreatePage />;
}