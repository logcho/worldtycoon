import { useEffect, useState } from "react";

import { gql, useQuery } from "@apollo/client";
import { Address, decodeEventLog, Hex, TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

import {
  inputBoxAbi,
  useSimulateInputBoxAddInput,
  useWriteInputBoxAddInput,
} from "./wagmi";

export const VOUCHERS_QUERY = gql`
  query vouchers {
    vouchers {
      edges {
        node {
          index
          input {
            index
          }
          destination
          payload
        }
      }
    }
  }
`;

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

export const retrieveVouchers = (dapp: Address, reciept?: TransactionReceipt) => {

  const [vouchers, setVouchers] = useState<Hex[]>([]);

  const inputIndex = useInputIndex(reciept);

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData,
  } = useQuery(VOUCHERS_QUERY, {
    skip: !inputIndex, // Ensures query runs only when inputIndex is defined
    pollInterval: 1000,
  });

  useEffect(() => {
    if (inputIndex && queryData) {
      const queriedNotices = queryData.notices.edges;
      // console.log(queriedNotices);
      // Filter notices based on inputIndex
      const filteredVouchers = queriedNotices
        .filter(({ node }: any) => {
          // Log the value for debugging
          if (BigInt(node.input.index) === inputIndex) {
            console.log("node.input.index:", node.input.index);
          }
          return BigInt(node.input.index) === inputIndex; // Ensure both are `bigint`
        })
        .map(({ node }: any) => {
          // Ensure we are mapping to node.payload
          return node.payload;
        });

      // Log the filteredNotices to verify its content
      // console.log("filteredNotices:", filteredNotices);
      setVouchers(filteredVouchers);
    }
  }, [inputIndex, queryData]);

  return {
    loading: queryLoading,
    vouchers,
  };
};
