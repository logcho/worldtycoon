import "./globals.css";

import * as React from "react";

import { Navbar } from "~/components/header/navbar";
import { Providers } from "~/components/providers";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { env } from "~/lib/env";
import * as fonts from "~/lib/fonts";
import { cn } from "~/lib/utils";

export const metadata = {
  title: "Next.js + TypeScript Starter",
  description: "A starter template for Next.js and TypeScript",
};

const RootLayout: React.FCC = ({ children }) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(Object.values(fonts).map((font) => font.variable))}
    >
      <body className="min-h-dvh scroll-smooth font-sans antialiased">
        <Providers
          RAINBOW_PROJECT_ID={env.RAINBOW_PROJECT_ID}
          RAINBOW_APP_NAME={env.RAINBOW_APP_NAME}
        >
          <Navbar />
          {children}
        </Providers>

        <TailwindIndicator />
      </body>
    </html>
  );
};

export default RootLayout;
