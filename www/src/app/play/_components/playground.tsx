"use client";

import ToolBox from "./tool-box";
import StageArea from "./stage-area";
import GameBar from "./game-bar";
export default function Playground(){
    
    return (
        <main className="flex flex-col items-center justify-center h-screen w-full">
            <GameBar />
            <StageArea />
        </main>
    );
}