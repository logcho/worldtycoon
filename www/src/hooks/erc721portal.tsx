import { createUseWriteContract } from "wagmi/codegen";

export const erc721PortalAbi = [
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
    inputs: [
      { name: "_token", internalType: "contract IERC721", type: "address" },
      { name: "_dapp", internalType: "address", type: "address" },
      { name: "_tokenId", internalType: "uint256", type: "uint256" },
      { name: "_baseLayerData", internalType: "bytes", type: "bytes" },
      { name: "_execLayerData", internalType: "bytes", type: "bytes" },
    ],
    name: "depositERC721Token",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "getInputBox",
    outputs: [
      { name: "", internalType: "contract IInputBox", type: "address" },
    ],
    stateMutability: "view",
  },
] as const;

export const useWriteErc721PortalDepositErc721Tokens = createUseWriteContract({
  abi: erc721PortalAbi,
  address: "0x9C21AEb2093C32DDbC53eEF24B873BDCd1aDa1DB",
  functionName: "depositERC721Token",
});
