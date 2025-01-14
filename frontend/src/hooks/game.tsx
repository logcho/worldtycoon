import {
    Address,
    Hex,
    encodeFunctionData,
    hexToBigInt,
    hexToNumber,
    parseAbi,
} from "viem";
import { UseInspect, useInspect } from "./inspect";
import { SWRConfiguration } from "swr";


export type GameInspect = {
    map?: Hex;
    // population?: number;
    // totalFunds?: number;
    // cityTime?: number;
};


export const useInspectEngine = (address: Address): UseInspect & GameInspect => {
    const swr = useInspect(
        JSON.stringify({
            method: "getEngine",
            user: address,
        })
    );
    const { reports } = swr;
    const [map] = reports;
    return {
        ...swr,
        map,
    };
};


// export const useInspectGame = (address: Address): UseInspect & GameInspect => {
//     const swr = useInspect(
//         encodeFunctionData({
//             abi: inspectAbi,
//             functionName: "getUserMap",
//             args: [address],
//         })
//     );
//     const { reports } = swr;
//     const [map, population, totalFunds, cityTime] = reports;
//     return {
//         ...swr,
//         map,
//         population: population ? hexToNumber(population) : undefined,
//         totalFunds: totalFunds ? hexToNumber(totalFunds) : undefined,
//         cityTime: cityTime ? hexToNumber(cityTime) : undefined,
//     };
// };

// export const useInspectMap = (seed: number): UseInspect & GameInspect => {
//     const swr = useInspect(
//         encodeFunctionData({
//             abi: inspectAbi,
//             functionName: "getMap",
//             args: [seed],
//         })
//     );
//     const { reports } = swr;
//     const [map, population, totalFunds, cityTime] = reports;
//     return {
//         ...swr,
//         map,
//         population: population ? hexToNumber(population) : undefined,
//         totalFunds: totalFunds ? hexToNumber(totalFunds) : undefined,
//         cityTime: cityTime ? hexToNumber(cityTime) : undefined,
//     };
// };

// export const useInspectBalance = (
//     address: Address,
//     options?: SWRConfiguration
// ): UseInspect & { balance?: bigint } => {
//     const swr = useInspect(
//         encodeFunctionData({
//             abi: inspectAbi,
//             functionName: "balanceOf",
//             args: [address],
//         }),
//         options
//     );
//     const { reports } = swr;
//     const [balance] = reports;
//     return {
//         ...swr,
//         balance: balance ? hexToBigInt(balance) : undefined,
//     };
// };