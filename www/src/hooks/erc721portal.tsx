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
  address: "0x237f8dd094c0e47f4236f12b4fa01d6dae89fb87",
  functionName: "depositERC721Token",
});
