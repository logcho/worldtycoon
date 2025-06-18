"use client";

// import { useRollupsServer } from "@/hooks/rollupts";
// import { useEffect, useState } from "react";
// import { Address, Hex, stringToHex } from "viem";
import ToolBox from "./tool-box";
import Map from "./map";
export default function Playground(){


    // TODO: Finish connecting backend 
    // const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS as Address;

    // // const [input, setInput] = useState<Hex>();

    // // const { loading, success, error, write, notices } = useRollupsServer(
    // //     DAPP_ADDRESS,
    // //     input,
    // // );
    
    return (
        <main className="flex flex-col md:flex-row items-center justify-center h-screen w-full pt-20">
            <ToolBox />
            <Map />
        </main>
    );
}