import { FC } from "react";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  anvil,
  mainnet,
  sepolia,
  arbitrum,
  arbitrumGoerli,
  optimismGoerli,
  optimism,
  base,
  baseSepolia,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    anvil,
    mainnet,
    sepolia,
    arbitrum,
    arbitrumGoerli,
    optimismGoerli,
    optimism,
    base,
    baseSepolia,
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export type WalletProvider = {
    children?: React.ReactNode;
}

const queryClient = new QueryClient();

const WalletProvider: FC<WalletProvider> = (props) =>{
    return(
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
                {props.children}
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
    )
}

export default WalletProvider;