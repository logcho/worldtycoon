"use client";

import StageArea from "./stage-area";
import { Hex } from "viem";

type Game = {
    map: Hex;
    stats: Hex;
};

export default function Playground({game}: {game : Game}) {

    console.log(game);

    return (
        <main className="flex flex-col h-screen w-full">
            <StageArea defaultMap={game.map} defaultStats={game.stats} />
        </main>
    );
}