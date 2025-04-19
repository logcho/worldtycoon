"use client";

import { json } from "stream/consumers";
import * as React from "react";
import { useEffect, useState } from "react";

import { fromHex, Hex, hexToNumber, hexToString, stringToHex } from "viem";

import type { Tool } from "~/config/tools";

import { useRollupsServer } from "~/hooks/rollups";
import { useEventListener } from "~/hooks/use-event-listner";

import { Navbar } from "./header/navbar";
import { StageArea } from "./stage-area";
import { ToolsSidebar } from "./tools-sidebar";

interface PlaygroundProps {
  initialMap: Hex; // Hex parameter
}

export const Playground: React.FC<PlaygroundProps> = ({ initialMap }) => {
  const [selectedTool, setSelectedTool] = React.useState<Tool>();
  const [isBudgeting, setIsBudgeting] = useState(false);
  // TODO: implement rollup server
  // note don't worry about transaction confirmation window for now
  const dapp = "0x54F460c33B68AB672091A696709C0182FF48BE5D";
  const [input, setInput] = useState<Hex>();
  const { loading, success, error, write, notices } = useRollupsServer(
    dapp,
    input,
  );
  const [
    map,
    stats,
    // population,
    // totalFunds,
    // cityTime,
    // cityTax,
    // taxFund,
    // firePercent,
    // policePercent,
    // roadPercent,
    // fireFund,
    // policeFund,
    // roadFund,
    // cashFlow,
  ] = notices;
  if (stats) console.log(hexToString(stats));
  // const [map, population, totalFunds, cityTime, cityTax] = notices;
  // if(totalFunds) console.log(fromHex(totalFunds, 'bigint')); verified works
  useEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setSelectedTool(undefined);
    }
  });

  // console.log("Is budgeting: ", isBudgeting)

  return (
    <>
      <Navbar
        stats={stats}
        setInput={setInput}
        write={write}
        setIsOpen={setIsBudgeting}
        isOpen={isBudgeting}
      />
      <div className="flex w-dvw overflow-hidden">
        <ToolsSidebar
          selectedTool={selectedTool}
          onSelectTool={(tool) => setSelectedTool(tool)}
          className="w-1/5"
        />
        <StageArea
          selectedTool={selectedTool}
          // className="w-4/5!"
          write={write}
          setInput={setInput}
          map={map || initialMap}
          isBudgeting={isBudgeting}
        />
      </div>
    </>
  );
};
