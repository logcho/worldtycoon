"use client";

import { FC } from "react";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { WagmiProvider, createConfig } from "wagmi";
import { anvil, base, baseSepolia } from "viem/chains";
import { http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const wagmiConfig = createConfig({
    chains: [anvil, base, baseSepolia],
    transports: {
        [anvil.id]: http(),
        [base.id]: http(),
        [baseSepolia.id]: http(),
    },
    ssr: true,
});

export type DynamicProviderProps = {
    children?: React.ReactNode;
};

const queryClient = new QueryClient();

const DynamicProvider: FC<DynamicProviderProps> = ({ children }) => {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <DynamicContextProvider
                    settings={{
                        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
                        walletConnectors: [EthereumWalletConnectors],
                    }}
                >
                    {children}
                </DynamicContextProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};

export default DynamicProvider;
