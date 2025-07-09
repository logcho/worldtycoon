import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/header/navbar";
import DynamicProvider from "@/providers/dynamic-provider";
import GraphQLProvider from "@/providers/graphql-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Tycoon",
  description: "City building on blockchain",
  authors: [{ name: "Logan Choi", url: "https://github.com/logcho" }, { name: "Logan Choi", url: "https://www.linkedin.com/in/logcho04/" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GraphQLProvider>
      <DynamicProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Navbar />               
            {children}
          </body>
        </html>
      </DynamicProvider>
    </GraphQLProvider>
  );
}
