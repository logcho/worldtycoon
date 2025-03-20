"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Hex, hexToNumber } from "viem";
import { CityStats } from "./citystats";

interface NavbarProps {
    population?: Hex,
    totalFunds?: Hex,
    cityTime?: Hex,
}

export const Navbar: React.FC<NavbarProps> = ({
    population,
    totalFunds,
    cityTime,
}) => {
    const loaded = !!population && !!totalFunds && !!cityTime;
    return (
        <header className="sticky inset-0 z-50 h-20 bg-[#111] p-4">
          <div className="flex h-full items-center justify-between">
            <Link href="/" className="-mt-2 hidden md:block w-[300px]">
            <p className="font-bitmap text-4xl font-semibold text-neutral-200 [text-shadow:_1px_1px_0_#e1e1e1]">
                WORLD TYCOON
            </p>
            </Link>

            {loaded ?
                <CityStats 
                    population={hexToNumber(population)}
                    totalFunds={hexToNumber(totalFunds)}
                    cityTime={hexToNumber(cityTime)}
                />
                :
                <>
                </>
            }

    
            <div className="flex w-full items-center justify-end">
              <ConnectButton />
            </div>
          </div>
        </header>
    );
};
