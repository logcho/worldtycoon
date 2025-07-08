"use client";

import { useState } from "react";
import type { Tool } from "@/config/tools";
import ToolBox from "./tool-box";
import { Address, Hex, hexToString } from "viem";
import MapCanvas from "./map-canvas";
import { useRollupsServer } from "@/hooks/rollupts";
import StatsBar from "./stats-bar";

export default function StageArea({defaultMap, defaultStats}: {defaultMap: Hex, defaultStats: Hex}) {
  const [selectedTool, setSelectedTool] = useState<Tool | undefined>();

  const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS as Address;
  const [input, setInput] = useState<Hex | undefined>();
  // const { loading, success, error, write, notices } = useRollupsServer(
  const { write, notices } = useRollupsServer(
      DAPP_ADDRESS,
      input,
  );
  const [
    map,
    stats,
  ] = notices;
  console.log("Stats: ", hexToString(defaultStats));

  return (
    <div className="flex flex-col md:flex-row w-full h-[calc(100vh_-_5rem)] mt-20">
      <StatsBar defaultStats={defaultStats} statsValue={stats} />
      <ToolBox selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
      <MapCanvas tool={selectedTool} defaultMap={defaultMap} mapValue={map} setInput={setInput} write={write} />
    </div>
  );
}
