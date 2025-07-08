import { Badge } from "@/components/ui/badge";
import { Hex, hexToString } from "viem";
import { fixedsys } from "@/lib/fonts";


function parseStats(statsHex: Hex) {
    const statsStr = hexToString(statsHex);
    const stats = JSON.parse(statsStr);
    return {
        cityTime: stats.cityTime,
        population: stats.population,
        totalFunds: stats.totalFunds,
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

export default function StatsBar({ defaultStats, statsValue }: { defaultStats: Hex; statsValue?: Hex }) {
    const {cityTime, population, totalFunds} = statsValue ? parseStats(statsValue) : parseStats(defaultStats);

    return (    
        <div
        className={`
            ${fixedsys.className}
            fixed left-1/2 transform -translate-x-1/2
            bottom-0 md:top-0 md:bottom-auto
            text-white
            z-50 h-20
            flex items-center justify-center gap-x-4`}
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
                <span>{dateFormat.format(cityTime)}</span>
            </Badge>
        </div>
    );
}
