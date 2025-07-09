import { Badge } from "@/components/ui/badge";
import { Hex, hexToString } from "viem";
import { fixedsys } from "@/lib/fonts";
import { Budget } from "./budget";
import SimTicks from "./sim-ticks";
import Batching from "./batching";

function parseStats(statsHex: Hex) {
    const statsStr = hexToString(statsHex);
    const stats = JSON.parse(statsStr);
    return {
        cityTime: stats.cityTime,
        population: stats.population,
        totalFunds: stats.totalFunds,
        cityTax: stats.cityTax,
        taxFund: stats.taxFund,
        firePercent: stats.firePercent,
        policePercent: stats.policePercent,
        roadPercent: stats.roadPercent,
        fireFund: stats.fireFund,
        policeFund: stats.policeFund,
        roadFund: stats.roadFund,
        cashFlow: stats.cashFlow,
    };
}

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

// Time units in the game engine
const CITYTIMES_PER_MONTH = 4;
const CITYTIMES_PER_YEAR = CITYTIMES_PER_MONTH * 12;

export default function GameBar({
    defaultStats,
    statsValue,
    setBatching,
    batching,
    setBudgeting,
    budgeting,
    setSimulating,
    simulating,
    write,
    setInput,
    loading,
}: {
    defaultStats: Hex;
    statsValue?: Hex;
    setBatching: (batching: boolean) => void;
    batching: boolean;
    setBudgeting: (batching: boolean) => void;
    budgeting: boolean;
    setSimulating: (simulating: boolean) => void;
    simulating: boolean;
    write: () => void;
    setInput: (input: Hex) => void;
    loading: boolean;
}) {
    const { cityTime, 
            population, 
            totalFunds,
            cityTax,
            taxFund,
            firePercent,
            policePercent,
            roadPercent,
            fireFund,
            policeFund,
            roadFund,
            cashFlow,
        } = statsValue
        ? parseStats(statsValue)
        : parseStats(defaultStats);

    const month = 1 + Math.floor((cityTime % CITYTIMES_PER_YEAR) / CITYTIMES_PER_MONTH);
    const year = 1900 + Math.floor(cityTime / CITYTIMES_PER_YEAR);
    const date = new Date(Date.UTC(year, month, 1));

    return (
        <div
            className={`
                ${fixedsys.className}
                fixed left-1/2 transform -translate-x-1/2
                bottom-0 md:top-0 md:bottom-auto
                text-white
                z-50 h-20
                flex items-center justify-center gap-x-4
            `}
        >
            <Badge variant="secondary" className="text-xl">
                <span>👨‍👧‍👦</span>
                <span>{numberFormatter.format(population)}</span>
            </Badge>

            <Badge variant="secondary" className="text-xl">
                <span>💰</span>
                <span>{currencyFormatter.format(totalFunds)}</span>
            </Badge>

            <Badge variant="secondary" className="text-xl">
                <span>📆</span>
                <span>{dateFormat.format(date)}</span>
            </Badge>
            
            <div className="hidden md:flex items-center gap-x-4">
                <Budget
                    cityTax={cityTax}
                    cashFlow={cashFlow}
                    funds={totalFunds}
                    taxFund={taxFund}
                    roadPercent={roadPercent * 100}
                    roadFund={roadFund}
                    firePercent={firePercent * 100}
                    fireFund={fireFund}
                    policePercent={policePercent * 100}
                    policeFund={policeFund}
                    loading={loading}
                    setInput={setInput}
                    write={write}
                    setBudgeting={setBudgeting}
                    budgeting={budgeting}
                />

                <SimTicks
                    setSimulating={setSimulating}
                    simulating={simulating}
                    loading={loading}
                    setInput={setInput}
                    write={write}
                />

                <Batching
                    batching={batching}
                    setBatching={setBatching}
                    loading={loading}
                    write={write}
                />
            </div>

            


        </div>
    );
}
