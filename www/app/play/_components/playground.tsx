"use client";

import { json } from "stream/consumers";
import * as React from "react";
import { useEffect, useState } from "react";

import { fromHex, Hex, hexToNumber, stringToHex } from "viem";

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
  const dapp = "0xb842774c8EC2fEf32d0102dE532c352081e0Bb92";
  const [input, setInput] = useState<Hex>();
  const { loading, success, error, write, notices } = useRollupsServer(
    dapp,
    input,
  );
  const [
    map,
    population,
    totalFunds,
    cityTime,
    cityTax,
    taxFund,
    firePercent,
    policePercent,
    roadPercent,
    fireFund,
    policeFund,
    roadFund,
    cashFlow,
  ] = notices;
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
        population={population}
        totalFunds={totalFunds}
        cityTime={cityTime}
        cityTax={cityTax}
        taxFund={taxFund}
        loading={loading}
        firePercent={firePercent}
        policePercent={policePercent}
        roadPercent={roadPercent}
        fireFund={fireFund}
        policeFund={policeFund}
        roadFund={roadFund}
        cashFlow={cashFlow}
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
