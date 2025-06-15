import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { erc20Abi, erc721Abi } from "viem";

export default defineConfig({
    out: "src/hooks/contracts.tsx",
    contracts: [
        {
            abi: erc20Abi,
            name: "erc20",
        },
        { 
            abi: erc721Abi, 
            name: "erc721" 
        },
    ],
    plugins: [react()],
});