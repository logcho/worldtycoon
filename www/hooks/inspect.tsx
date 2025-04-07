import { useEffect, useState } from "react";

import { useQuery } from "@apollo/client";
import {
  Address,
  decodeEventLog,
  encodeFunctionData,
  Hex,
  hexToBigInt,
  hexToNumber,
  hexToString,
  parseAbi,
  stringToHex,
  TransactionReceipt,
} from "viem";

import { useInspect } from "./use-inspect";
import { inputBoxAbi, useWriteInputBoxAddInput } from "./wagmi";

export const useInspectBalance = (address: Address) => {
  // Generate the hexified key
  const key = JSON.stringify({ method: "balanceOf", address });

  const { data, isLoading, error } = useInspect(key);

  // Extract the balance from the response
  const balance =
    data?.reports?.[0]?.payload ?
      hexToBigInt(data.reports[0].payload)
    : undefined;

  return { balance, isLoading, error };
};

export const useInspectMap = (address: Address) => {
  // Generate the hexified key
  const key = JSON.stringify({ method: "getMap", address });

  const { data, isLoading, error } = useInspect(key);

  // Extract the map from the response
  const map = data?.reports?.[0]?.payload ? data.reports[0].payload : undefined;

  return { map, isLoading, error };
};

export const useInspectFunds = (address: Address) => {
  // Generate the hexified key
  const key = JSON.stringify({ method: "getFunds", address });

  const { data, isLoading, error } = useInspect(key);

  // Extract the balance from the response
  const funds =
    data?.reports?.[0]?.payload ?
      hexToBigInt(data.reports[0].payload)
    : undefined;

  return { funds, isLoading, error };
};

export const useQueryTool = (address: Address, x: number, y: number, isQuerying: boolean) => {
  // Generate the hexified key
  const key = JSON.stringify({ method: "useQuery", address, x, y });

  const { data, isLoading, error } = useInspect(key, {enabled: isQuerying, refetchInterval: 1000});

  // Extract the balance from the response
  const stats =
    data?.reports?.[0]?.payload ?
      hexToString(data.reports[0].payload)
    : undefined;

  return { stats, isLoading, error };
};


