import {
    Address,
    Hex,
    TransactionReceipt,
    decodeEventLog,
    encodeFunctionData,
    hexToBigInt,
    hexToNumber,
    parseAbi,
    stringToHex,
} from "viem";
import { useInspect } from "./use-inspect";
import { useEffect, useState } from "react";
import { inputBoxAbi, useWriteInputBoxAddInput } from "./wagmi";
import { CompletionStatus, InputNoticesDocument } from "./graphql/graphql";
import { useQuery } from "@apollo/client";

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

/**
 * Hook to get the inputIndex from a transaction receipt
 * @param receipt transaction receipt
 * @returns inputIndex inside the transaction receipt
 */
const useInputIndex = (receipt?: TransactionReceipt): bigint | undefined => {
    const [inputIndex, setInputIndex] = useState<bigint | undefined>();
    useEffect(() => {
        // runs when receipt changes
        if (receipt) {
            // search for InputAdded event in receipt logs
            const inputIndex = receipt.logs
                .map((log) => {
                    try {
                        // decode the event
                        const decodedLog = decodeEventLog({
                            abi: inputBoxAbi,
                            eventName: "InputAdded",
                            topics: log.topics,
                            data: log.data,
                        });
                        return decodedLog.args.inputIndex;
                    } catch (e: any) {
                        return undefined;
                    }
                })
                .filter((id): id is bigint => !!id)
                .at(0);

            // set inputIndex state variable
            setInputIndex(inputIndex);
        }
    }, [receipt]);
    return inputIndex;
};

export const useRollupsServer = (dapp: Address, input?: Hex) => {
    // Hook for sending transaction
    const { isPending, isSuccess, error, writeContract, data } = useWriteInputBoxAddInput();
    // State to manually trigger transaction execution
    useEffect(() => {
        if (input) {
            writeContract({
                args: [dapp, input],
            });
        }
    }, [input, writeContract, dapp]);

    // Get input index after transaction execution
    const inputIndex = useInputIndex(data?.hash);

    // Query for input outputs (after transaction is mined)
    const query = useQuery(InputNoticesDocument, {
        variables: { inputIndex: Number(inputIndex) },
        skip: !inputIndex,
        pollInterval: 1000,
    });

    // State for notices
    const [notices, setNotices] = useState<Hex[]>([]);
    const [queryLoading, setQueryLoading] = useState(false);

    useEffect(() => {
        if (inputIndex && query.data) {
            setQueryLoading(true);
            if (query.data.input.status === CompletionStatus.Accepted) {
                const payloads = query.data.input.notices.edges
                    .map((notice) => notice.node)
                    .sort((a, b) => a.index - b.index) // Ensure sorting is correct
                    .map((notice) => notice.payload as Hex);
                setNotices(payloads);
                setQueryLoading(false);
            }
        }
    }, [inputIndex, query.data]);

    return {
        write: writeContract, // Function to manually send transaction
        notices, // Notices from the input
        loading: isPending || queryLoading, // Transaction/query loading state
        isSuccess, // Status of the transaction
        error, // Transaction error handling
    };
};