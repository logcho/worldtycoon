"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Hex, hexToNumber, hexToString } from "viem";

import { Budget } from "./budget";
import { CityStats } from "./citystats";

interface NavbarProps {
  population?: Hex;
  totalFunds?: Hex;
  cityTime?: Hex;
  cityTax?: Hex;
  taxFund?: Hex;
  firePercent?: Hex;
  policePercent?: Hex;
  roadPercent?: Hex;
  fireFund?: Hex;
  policeFund?: Hex;
  roadFund?: Hex;
  cashFlow?: Hex;
  loading?: boolean;
  setInput?: (input: Hex) => void;
  write?: () => void;
  setIsOpen: (input: boolean) => void;
  isOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
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
  loading,
  setInput,
  write,
  setIsOpen,
  isOpen,
}) => {
  const loaded =
    !!population &&
    !!totalFunds &&
    !!cityTime &&
    !!cityTax &&
    !!taxFund &&
    !!firePercent &&
    !!policePercent &&
    !!roadPercent &&
    !!fireFund &&
    !!policeFund &&
    !!roadFund &&
    !!cashFlow;

  // if(roadPercent) console.log(hexToNumber(roadPercent))
  return (
    <header className="sticky inset-0 z-50 h-20 bg-[#111] p-4">
      <div className="flex h-full items-center justify-between">
        <Link href="/" className="-mt-2 hidden w-[300px] md:block">
          <p className="font-bitmap text-4xl font-semibold text-neutral-200 [text-shadow:_1px_1px_0_#e1e1e1]">
            WORLD TYCOON
          </p>
        </Link>
        {loaded && (
          <div className="flex gap-4">
            <CityStats
              population={hexToNumber(population)}
              totalFunds={hexToNumber(totalFunds)}
              cityTime={hexToNumber(cityTime)}
            />
            <Budget
              cityTax={hexToNumber(cityTax)}
              cashFlow={Number(hexToString(cashFlow))}
              funds={hexToNumber(totalFunds)}
              taxFund={hexToNumber(taxFund)}
              roadPercent={hexToNumber(roadPercent)}
              roadFund={hexToNumber(roadFund)}
              firePercent={hexToNumber(firePercent)}
              fireFund={hexToNumber(fireFund)}
              policePercent={hexToNumber(policePercent)}
              policeFund={hexToNumber(policeFund)}
              loading={loading}
              setInput={setInput}
              write={write}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
            />
          </div>
        )}

        <div className="flex w-full items-center justify-end">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
