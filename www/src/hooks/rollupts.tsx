import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Address, decodeEventLog, Hex, TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

import {
  inputBoxAbi,
  useWriteInputBoxAddInput,
} from "./inputbox";

/**
 * GraphQL query to fetch the game-related notices for a specific input index.
 * Includes two notices: "map" and "stat".
 */
export const GAME_NOTICES = gql`
  query GameNotices($inputIndex: Int!) {
    map: notice(noticeIndex: 0, inputIndex: $inputIndex) {
      index
      payload
      input {
        index
        timestamp
        msgSender
        blockNumber
      }
    }
    stat: notice(noticeIndex: 1, inputIndex: $inputIndex) {
      index
      payload
      input {
        index
        timestamp
        msgSender
        blockNumber
      }
    }
  }
`;

/**
 * Custom hook to extract the input index from a TransactionReceipt
 * by decoding the InputAdded event.
 *
 * @param receipt - The transaction receipt to inspect
 * @returns The decoded input index (if found), otherwise undefined
 */
const useInputIndex = (receipt?: TransactionReceipt): bigint | undefined => {
  const [inputIndex, setInputIndex] = useState<bigint | undefined>();

  useEffect(() => {
    if (!receipt) return;

    const index = receipt.logs
      .map((log) => {
        try {
          const decoded = decodeEventLog({
            abi: inputBoxAbi,
            eventName: "InputAdded",
            topics: log.topics,
            data: log.data,
          });
          return decoded.args.inputIndex;
        } catch {
          return undefined;
        }
      })
      .find((val): val is bigint => val !== undefined);

    setInputIndex(index);
  }, [receipt]);

  return inputIndex;
};

/**
 * Hook to submit an input to the Cartesi DApp via the InputBox,
 * wait for confirmation, and fetch resulting GraphQL notices.
 *
 * @param dapp - The address of the target DApp
 * @param input - The encoded hex payload to send
 * @returns status and actions for submitting input and fetching notices
 */
export const useRollupsServer = (dapp: Address, input?: Hex) => {
  const {
    writeContractAsync,
    data: writeHash,
    isPending: writePending,
    isSuccess: writeSuccess,
    error: writeError,
  } = useWriteInputBoxAddInput();

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: writeHash,
  });

  const inputIndex = useInputIndex(receipt);
  const [notices, setNotices] = useState<Hex[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger write and mark as loading manually
  const write = async () => {
    if (!dapp || !input) return;

    try {
      setIsLoading(true);
      await writeContractAsync({
        args: [dapp, input],
      });
    } catch (err) {
      console.error("Error writing input:", err);
      setIsLoading(false); // Fail-safe
    }
  };

  const {
    data: gameNoticeData,
    loading: gameNoticeLoading,
    error: gameNoticeError,
  } = useQuery(GAME_NOTICES, {
    skip: !inputIndex,
    variables: { inputIndex: Number(inputIndex) },
    pollInterval: 1000,
  });

  // Detect when notices have been fully updated
  useEffect(() => {
    if (gameNoticeData) {
      const newNotices = [
        gameNoticeData.map?.payload,
        gameNoticeData.stat?.payload,
      ].filter(Boolean) as Hex[];

      setNotices(newNotices);

      if (newNotices.length === 2) {
        setIsLoading(false);
      }
    }
  }, [gameNoticeData]);

  return {
    loading: isLoading,
    success: writeSuccess,
    error: writeError || gameNoticeError,
    write,
    notices,
  };
};

