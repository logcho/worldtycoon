"use client";

import { useState } from "react";
import type { Tool } from "@/config/tools";
import ToolBox from "./tool-box";
import { Address, Hex } from "viem";
import MapCanvas from "./map-canvas";
import { useRollupsServer } from "@/hooks/rollupts";
import GameBar from "./game-bar/game-bar";


// Placed tool sprite
export type PlacedSprite = {
  x: number;
  y: number;
  tool: Tool;
};


export default function StageArea({defaultMap, defaultStats}: {defaultMap: Hex, defaultStats: Hex}) {
  const [selectedTool, setSelectedTool] = useState<Tool | undefined>();
  const [budgeting, setBudgeting] = useState<boolean>(false);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [batching, setBatching] = useState<boolean>(false);
  const [placedSprites, setPlacedSprites] = useState<PlacedSprite[]>([]);

  const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS as Address;
  const [input, setInput] = useState<Hex | undefined>();
  const { loading, write, notices } = useRollupsServer(
      DAPP_ADDRESS,
      input,
  );
  const [
    map,
    stats,
  ] = notices;

  const building = !budgeting && !simulating && !batching;

  return (
    <div 
      className="flex flex-col md:flex-row w-full h-[calc(100vh_-_5rem)] mt-20"     
      style={{ cursor: loading ? "wait" : "default" }}
    >
      <GameBar 
        defaultStats={defaultStats} 
        statsValue={stats} 
        batching={batching} setBatching={setBatching} 
        budgeting={budgeting} setBudgeting={setBudgeting} 
        simulating={simulating} setSimulating={setSimulating}
        setInput={setInput}
        write={write}
        loading={loading}
        setPlacedSprites={setPlacedSprites}
      />
      <ToolBox 
        selectedTool={selectedTool} 
        setSelectedTool={setSelectedTool} 
      />
      <MapCanvas 
        tool={selectedTool} 
        defaultMap={defaultMap} 
        mapValue={map} 
        setInput={setInput} 
        write={write} 
        building={building}
        batching={batching} 
        placedSprites={placedSprites}
        setPlacedSprites={setPlacedSprites}
      />
    </div>
  );
}
