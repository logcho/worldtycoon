import {
    Address,
    Hex,
    encodeFunctionData,
    hexToBigInt,
    hexToNumber,
    parseAbi,
    stringToHex,
} from "viem";
import { useInspect } from "./use-inspect";

export const useInspectBalance = (address: Address) => {
    // Generate the hexified key
    const key = (
        JSON.stringify({ method: "balanceOf", address })
    );

    const { data, isLoading, error } = useInspect(key);

    // Extract the balance from the response
    const balance = data?.reports?.[0]?.payload
        ? hexToBigInt(data.reports[0].payload)
        : undefined;

    return { balance, isLoading, error };
};

export const useInspectMap = (address: Address) => {
    // Generate the hexified key
    const key = (
        JSON.stringify({ method: "getMap", address })
    );

    const { data, isLoading, error } = useInspect(key);

    // Extract the map from the response
    const map = data?.reports?.[0]?.payload ? data.reports[0].payload : undefined;

    return { map, isLoading, error };
};

