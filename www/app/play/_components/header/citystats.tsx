"use client";
import { FC } from "react";

type CityStatsProps = {
    population: number;
    totalFunds: number;
    cityTime: number;
};

// Time units in the game engine
const CITYTIMES_PER_MONTH = 4;
const CITYTIMES_PER_YEAR = CITYTIMES_PER_MONTH * 12;

export const CityStats: FC<CityStatsProps> = ({
    population,
    totalFunds,
    cityTime,
}) => {
    const numberFormatter = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
    });

    const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });

    const dateFormat = new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
    });

    const month = 1 + Math.floor((cityTime % CITYTIMES_PER_YEAR) / CITYTIMES_PER_MONTH);
    const year = 1900 + Math.floor(cityTime / CITYTIMES_PER_YEAR);
    const date = new Date(Date.UTC(year, month, 1));

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md">
                <span>👨‍👧‍👦</span>
                <span>{numberFormatter.format(population)}</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md">
                <span>💰</span>
                <span>{currencyFormatter.format(totalFunds)}</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md">
                <span>📆</span>
                <span>{dateFormat.format(date)}</span>
            </div>
        </div>
    );
};
