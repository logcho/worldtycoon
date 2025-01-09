import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  anvil,
  arbitrum,
  arbitrumGoerli,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismGoerli,
  sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    anvil,
    arbitrum,
    arbitrumGoerli,
    base,
    baseSepolia,
    mainnet,
    optimism,
    optimismGoerli,
    sepolia,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});