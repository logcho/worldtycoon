"use client"
import "./globals.css";

import * as React from "react";

import { Navbar } from "~/components/header/navbar";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { env } from "~/lib/env";
import * as fonts from "~/lib/fonts";
import { cn } from "~/lib/utils";
import GraphQLProvider from "~/providers/GraphQLProvider";
import WalletProvider from "~/providers/WalletProvider";

const RootLayout: React.FCC = ({ children }) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(Object.values(fonts).map((font) => font.variable))}
    >
      <body className="min-h-dvh scroll-smooth font-sans antialiased">
        <WalletProvider>
          <GraphQLProvider>
            <Navbar />
            {children}
          </GraphQLProvider>
        </WalletProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
};

export default RootLayout;
