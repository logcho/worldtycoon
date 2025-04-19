import { FC } from "react";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
  anvil,
  // arbitrum,
  // arbitrumGoerli,
  base,
  baseSepolia,
  // mainnet,
  // optimism,
  // optimismGoerli,
  // sepolia,
} from "wagmi/chains";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    anvil,
    // mainnet,
    // sepolia,
    // arbitrum,
    // arbitrumGoerli,
    // optimismGoerli,
    // optimism,
    base,
    baseSepolia,
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export type WalletProvider = {
  children?: React.ReactNode;
};

const queryClient = new QueryClient();

const WalletProvider: FC<WalletProvider> = (props) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{props.children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;
