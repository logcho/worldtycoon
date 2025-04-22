import { useEffect, useState } from "react";

import { gql, useQuery } from "@apollo/client";
import { Address, decodeEventLog, Hex, TransactionReceipt } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

import {
  inputBoxAbi,
  useSimulateInputBoxAddInput,
  useWriteInputBoxAddInput,
} from "./wagmi";

export const NOTICES_QUERY = gql`
  query notices {
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`;

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
  const { data: simulateData } = useSimulateInputBoxAddInput({
    args: [dapp, input!],
  });

  const {
    isPending: writePending,
    isSuccess: writeSuccess,
    error: writeError,
    writeContractAsync,
    data: writeData,
  } = useWriteInputBoxAddInput();

  const { data: receipt } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  const [notices, setNotices] = useState<Hex[]>([]);

  const write = async () => {
    if (simulateData) await writeContractAsync(simulateData.request);
  };

  const inputIndex = useInputIndex(receipt);

  // const {
  //   loading: queryLoading,
  //   error: queryError,
  //   data: queryData,
  // } = useQuery(NOTICES_QUERY, {
  //   skip: !inputIndex, // Ensures query runs only when inputIndex is defined
  //   pollInterval: 1000,
  // });

  const {
    data: gameNoticeData,
    loading: gameNoticeLoading,
    error: gameNoticeError,
  } = useQuery(GAME_NOTICES, {
    skip: !inputIndex,
    variables: { inputIndex: Number(inputIndex) },
    pollInterval: 1000,
  });

  useEffect(() => {
    console.log("inputIndex", Number(inputIndex));
    console.log("Game Notices", gameNoticeData);
    if (gameNoticeData) {
      setNotices([
        gameNoticeData.map?.payload,
        gameNoticeData.stat?.payload,
      ].filter(Boolean)); // remove any undefined/null values just in case
    }
  }, [inputIndex, gameNoticeData])


  // useEffect(() => {
  //   console.log("Game Notices", gameNoticeData)

  //   if (inputIndex && queryData) {
  //     const queriedNotices = queryData.notices.edges;
  //     // console.log(queriedNotices);
  //     // Filter notices based on inputIndex
  //     const filteredNotices = queriedNotices
  //       .filter(({ node }: any) => {
  //         // Log the value for debugging
  //         if (BigInt(node.input.index) === inputIndex) {
  //           console.log("node.input.index:", node.input.index);
  //         }
  //         return BigInt(node.input.index) === inputIndex; // Ensure both are `bigint`
  //       })
  //       .map(({ node }: any) => {
  //         // Ensure we are mapping to node.payload
  //         return node.payload;
  //       });

  //     // Log the filteredNotices to verify its content
  //     // console.log("filteredNotices:", filteredNotices);
  //     setNotices(filteredNotices);
  //   }
  // }, [inputIndex, queryData]);

  // Console log data
  // Set true if debugging
  if (false) {
    if (simulateData) {
      console.log("----------------");
      console.log("simulateData");
      console.log(simulateData);
      console.log("----------------");
    }
    if (writeData) {
      console.log("----------------");
      console.log("writeData");
      console.log(writeData);
      console.log("----------------");
    }
    if (receipt) {
      console.log("----------------");
      console.log("receipt");
      console.log(receipt);
      console.log("----------------");
    }
    if (inputIndex) {
      console.log("----------------");
      console.log("inputIndex");
      console.log(inputIndex);
      console.log("----------------");
    }
    if (notices) {
      console.log("----------------");
      console.log("notices");
      console.log(notices);
      console.log("----------------");
    }
  }

  return {
    loading: writePending || gameNoticeLoading,
    success: writeSuccess,
    error: writeError,
    write,
    notices,
  };
};
