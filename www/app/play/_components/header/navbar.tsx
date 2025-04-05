"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Hex, hexToNumber } from "viem";

import { CityStats } from "./citystats";
import { Budget } from "./budget";
interface NavbarProps {
  population?: Hex;
  totalFunds?: Hex;
  cityTime?: Hex;

  loading?: boolean;
  setInput?: (input: Hex) => void;
  write?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  population,
  totalFunds,
  cityTime,
  loading,
  setInput,
  write,
}) => {
  const loaded = !!population && !!totalFunds && !!cityTime;
  return (
    <header className="sticky inset-0 z-50 h-20 bg-[#111] p-4">
      <div className="flex h-full items-center justify-between">
        <Link href="/" className="-mt-2 hidden w-[300px] md:block">
          <p className="font-bitmap text-4xl font-semibold text-neutral-200 [text-shadow:_1px_1px_0_#e1e1e1]">
            WORLD TYCOON
          </p>
        </Link>
        {loaded &&
          <div className="flex gap-4">
          <CityStats
            population={hexToNumber(population)}
            totalFunds={hexToNumber(totalFunds)}
            cityTime={hexToNumber(cityTime)}
          />
          <Budget 
              cityTax={20}
              cashFlow={0}
              funds={hexToNumber(totalFunds)}
              taxFund={0}
              roadPercent={0}
              roadFund={0}
              firePercent={0}
              fireFund={0}
              policePercent={0}
              policeFund={0}
              loading={loading}
              setInput={setInput}
              write={write}
          />
          </div>
        }




        <div className="flex w-full items-center justify-end">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
