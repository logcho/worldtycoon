"use client";

import { Button } from "@/components/ui/button";
import { useRollupsServer } from "@/hooks/rollupts";
import { useEffect, useState } from "react";
import { Address, Hex, stringToHex } from "viem";
import ToolBox from "./game/tool-box";
import GameBar from "./game/game-bar";
import Stage from "./game/stage";
export default function Playground(){

    const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS as Address;

    const [input, setInput] = useState<Hex>();

    const { loading, success, error, write, notices } = useRollupsServer(
        DAPP_ADDRESS,
        input,
    );

    useEffect(() => {
        setInput(stringToHex(`{"method":"doTool","tool":0,"x":0,"y":0}`))    
    }, []);
    
    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <GameBar />
            <div className="flex flex-col md:flex-row w-full h-full bg-red-400">
                <ToolBox />
                <Stage />
            </div>
        </main>
    );
}