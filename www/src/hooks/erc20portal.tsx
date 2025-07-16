import { createUseWriteContract } from "wagmi/codegen";

export const erc20PortalAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_inputBox",
        internalType: "contract IInputBox",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositERC20Tokens",
    inputs: [
      { name: "_token", internalType: "contract IERC20", type: "address" },
      { name: "_dapp", internalType: "address", type: "address" },
      { name: "_amount", internalType: "uint256", type: "uint256" },
      { name: "_execLayerData", internalType: "bytes", type: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getInputBox",
    inputs: [],
    outputs: [{ name: "", internalType: "contract IInputBox", type: "address" }],
    stateMutability: "view",
  },
] as const;

export const useWriteErc20PortalDepositErc20Tokens = createUseWriteContract({
  abi: erc20PortalAbi,
  address: "0x92c6bca388e99d6b304f1af3c3cd749ff0b591e2",
  functionName: "depositERC20Tokens",
});
