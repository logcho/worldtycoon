"use client";

import * as React from "react";

import type { Tool } from "~/config/tools";

import { useEventListener } from "~/hooks/use-event-listner";

import { StageArea } from "./stage-area";
import { ToolsSidebar } from "./tools-sidebar";
import { useRollupsServer } from "~/hooks/rollups";
import { useState } from "react";
import { fromHex, Hex, stringToHex } from "viem";
import { json } from "stream/consumers";
import { Navbar } from "./header/navbar";

interface PlaygroundProps {
  initialMap: Hex;  // Hex parameter
}

export const Playground: React.FC<PlaygroundProps> = ({
  initialMap
}) => {
  const [selectedTool, setSelectedTool] = React.useState<Tool>();

  // TODO: implement rollup server
  // note don't worry about transaction confirmation window for now
  const dapp = "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e";
  const [input, setInput] = useState<Hex>();
  const { loading, success, error, write, notices } = useRollupsServer(dapp, input);
  const [map, population, totalFunds, cityTime] = notices;
  // console.log(map);
  // if(totalFunds) console.log(fromHex(totalFunds, 'bigint')); verified works

  useEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setSelectedTool(undefined);
    }
  });

  return (
    <>
      <Navbar 
        population={population}
        totalFunds={totalFunds}
        cityTime={cityTime}
      />
      <div className="w-dvh flex">
        <ToolsSidebar
          selectedTool={selectedTool}
          onSelectTool={(tool) => setSelectedTool(tool)}
          className="w-1/5"
        />
        <StageArea 
          selectedTool={selectedTool} 
          className="!w-4/5" 
          write={write}
          setInput={setInput}
          map={map || initialMap}
        />
      </div>
    </>
  );
};
