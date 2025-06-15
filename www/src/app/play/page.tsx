"use client";
import { useRouter } from "next/navigation";
import CreatePage from "./_components/create";
import PlayPage from "./_components/play";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect } from "react";
export default function Play(){

    const router = useRouter();
    
    const { primaryWallet } = useDynamicContext();

    useEffect(() => {
        if(!primaryWallet){
            router.replace("/");
        }
        else{
            console.log("Wallet Address: ", primaryWallet.address);
        }
    }, [primaryWallet])
    
    const hasCity = false
    // TODO: Add logic when connecting to backend
    return hasCity ? <PlayPage /> : <CreatePage />;
}