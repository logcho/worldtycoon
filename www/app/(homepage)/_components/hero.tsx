import * as React from "react";
import Image from "next/image";

import { HomePageActionButtons } from "./action-buttons";

export const HeroSection: React.FC = () => {
  return (
    <section className="grid h-dvh snap-center place-items-center">
      <div className="flex flex-col items-center">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={200}
          height={200}
          className="mx-auto drop-shadow-md"
        />

        <p className="-mt-4 text-center font-bitmap text-3xl font-semibold [text-shadow:_1px_2px_0_#000] md:text-4xl">
          Build Your Empire, Earn Real Crypto, Rule the World
        </p>

        <p className="font-fixedsys text-3xl font-medium -tracking-wider text-red-600 [text-shadow:_2px_4px_0_#111] md:text-4xl">
          Join the blockchain revolution in city building!
        </p>

        <HomePageActionButtons />
      </div>
    </section>
  );
};
