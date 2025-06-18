import { createUseWriteContract } from "wagmi/codegen";

export const inputBoxAbi = [
    { type: "error", inputs: [], name: "InputSizeExceedsLimit" },
    {
      type: "event",
      anonymous: false,
      inputs: [
        { name: "dapp", internalType: "address", type: "address", indexed: true },
        {
          name: "inputIndex",
          internalType: "uint256",
          type: "uint256",
          indexed: true,
        },
        {
          name: "sender",
          internalType: "address",
          type: "address",
          indexed: false,
        },
        { name: "input", internalType: "bytes", type: "bytes", indexed: false },
      ],
      name: "InputAdded",
    },
    {
      type: "function",
      inputs: [
        { name: "_dapp", internalType: "address", type: "address" },
        { name: "_input", internalType: "bytes", type: "bytes" },
      ],
      name: "addInput",
      outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      inputs: [
        { name: "_dapp", internalType: "address", type: "address" },
        { name: "_index", internalType: "uint256", type: "uint256" },
      ],
      name: "getInputHash",
      outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      inputs: [{ name: "_dapp", internalType: "address", type: "address" }],
      name: "getNumberOfInputs",
      outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
      stateMutability: "view",
    },
  ] as const;
  
export const inputBoxAddress =
    "0x59b22D57D4f067708AB0c00552767405926dc768" as const;

export const useWriteInputBoxAddInput = /*#__PURE__*/ createUseWriteContract({
    abi: inputBoxAbi,
    address: inputBoxAddress,
    functionName: "addInput",
  });
  