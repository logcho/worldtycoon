"use client";

import "@rainbow-me/rainbowkit/styles.css";

import * as React from "react";

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { WagmiProvider } from "wagmi";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

import { env } from "~/lib/env";

export const Providers: React.FCC<{
  RAINBOW_PROJECT_ID: string;
  RAINBOW_APP_NAME: string;
}> = ({ children, RAINBOW_PROJECT_ID, RAINBOW_APP_NAME }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  const rainbowConfig = getDefaultConfig({
    appName: RAINBOW_APP_NAME,
    projectId: RAINBOW_PROJECT_ID,
    chains: [
      mainnet,
      polygon,
      optimism,
      arbitrum,
      base,
      ...(env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
    ],
    ssr: true,
  });

  return (
    <WagmiProvider config={rainbowConfig}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <RainbowKitProvider theme={darkTheme()}>
            {children}
          </RainbowKitProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
