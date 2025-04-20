"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Hex, hexToNumber, hexToString } from "viem"; // Ensure proper import of `hexToString`

import { Budget } from "./budget";
import { CityStats } from "./citystats";

interface NavbarProps {
  stats?: Hex;
  loading?: boolean;
  setInput?: (input: Hex) => void;
  write?: () => void;
  setIsOpen: (input: boolean) => void;
  isOpen: boolean;
}

type CityStatsType = {  // Renamed to avoid conflicts with the component name
  cashFlow: number;
  cityTax: number;
  cityTime: number;
  fireFund: number;
  firePercent: number;
  policeFund: number;
  policePercent: number;
  population: number;
  roadFund: number;
  roadPercent: number;
  taxFund: number;
  totalFunds: number;
};

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  loading,
  setInput,
  write,
  setIsOpen,
  isOpen,
}) => {

  const statsJSON = stats ? hexToString(stats) : `{
    "cashFlow": 0,
    "cityTax": 0,
    "cityTime": 0,
    "fireFund": 0,
    "firePercent": 0,
    "policeFund": 0,
    "policePercent": 0,
    "population": 0,
    "roadFund": 0,
    "roadPercent": 0,
    "taxFund": 0,
    "totalFunds": 0
  }`;

  let parsedStats: CityStatsType = {
    cashFlow: 0,
    cityTax: 0,
    cityTime: 0,
    fireFund: 0,
    firePercent: 0,
    policeFund: 0,
    policePercent: 0,
    population: 0,
    roadFund: 0,
    roadPercent: 0,
    taxFund: 0,
    totalFunds: 0,
  };

  try {
    parsedStats = JSON.parse(statsJSON) as CityStatsType;
  } catch (e) {
    console.error("Error parsing stats JSON", e);
  }

  const {
    cashFlow,
    cityTax,
    cityTime,
    fireFund,
    firePercent,
    policeFund,
    policePercent,
    population,
    roadFund,
    roadPercent,
    taxFund,
    totalFunds
  } = parsedStats;

  return (
    <header className="sticky inset-0 z-50 h-20 bg-[#111] p-4">
      <div className="flex h-full items-center justify-between">
        <Link href="/" className="-mt-2 hidden w-[300px] md:block">
          <p className="font-bitmap text-4xl font-semibold text-neutral-200 [text-shadow:_1px_1px_0_#e1e1e1]">
            WORLD TYCOON
          </p>
        </Link>
        

        <div className="flex gap-2">
          <CityStats 
            population={population}
            totalFunds={totalFunds}
            cityTime={cityTime}
          />
          <Budget
            cityTax={cityTax}
            cashFlow={cashFlow}
            funds={totalFunds}
            taxFund={taxFund}
            roadPercent={roadPercent*100}
            roadFund={roadFund}
            firePercent={firePercent*100}
            fireFund={fireFund}
            policePercent={policePercent*100}
            policeFund={policeFund}
            loading={loading}
            setInput={setInput}
            write={write}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
          />
        </div>


        <div className="flex w-full items-center justify-end">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
