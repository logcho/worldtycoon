import * as React from "react";
import Image from "next/image";

import { ArrowRight } from "lucide-react";

export const RulesSection: React.FC = () => {
  return (
    <section className="flex h-dvh snap-center flex-col items-center justify-center gap-8 bg-gradient-to-b from-[#2D0808] via-[#1A0505] to-[#0D0303] p-4 pt-24 text-background">
      {/* Utility/Rules Section */}
      <div
        className="h-[36vh] w-full max-w-4xl space-y-2 rounded-[2rem] bg-[#151515]/80 p-2 backdrop-blur-sm duration-700 animate-in slide-in-from-right-1/2 md:space-y-4 md:p-6"
        style={{
          border: "16px solid transparent",
          borderImage: "url('/images/border.png') 16 stretch",
        }}
      >
        <div className="flex items-center gap-4">
          <Image
            src="/images/flamepet.gif"
            alt="Utility Icon"
            width={48}
            height={48}
            className="object-contain"
          />
          <h2 className="font-fixedsys text-2xl uppercase tracking-wide text-[#ff4444] md:text-4xl md:-tracking-wider">
            Utility
          </h2>
        </div>

        <h3 className="font-fixedsys tracking-wide text-neutral-200 md:text-xl">
          BUILD, EARN & THRIVE IN THE BLOCKCHAIN ERA
        </h3>

        <ul className="grid list-disc gap-x-4 font-bitmap text-lg text-gray-300 *:leading-5 md:grid-cols-2 md:text-xl">
          <li>
            Earn real cryptocurrency tokens through successful city management
          </li>
          <li>
            Strategic zoning for residential, commercial, and industrial growth
          </li>
          <li>
            Powered by Cartesi&apos;s blockchain infrastructure for true
            ownership
          </li>
          <li>Compete globally and trade assets in the crypto ecosystem</li>
          <li>Build and manage essential infrastructure and public services</li>
          <li>
            Create a sustainable economy through smart resource allocation
          </li>
        </ul>

        <a
          href="#"
          className="mt-6 flex items-center gap-2 font-fixedsys text-[#ff4444] hover:text-[#ff6666]"
        >
          Learn more
          <ArrowRight className="size-4" />
        </a>
      </div>

      {/* Features Section */}
      <div
        className="h-[36vh] w-full max-w-4xl space-y-2 rounded-[2rem] bg-[#151515]/80 p-2 backdrop-blur-sm duration-700 animate-in slide-in-from-left-1/2 md:space-y-4 md:p-6"
        style={{
          border: "16px solid transparent",
          borderImage: "url('/images/border.png') 16 stretch",
        }}
      >
        <div className="flex items-center gap-4">
          <Image
            src="/images/holdtear.png"
            alt="Utility Icon"
            width={48}
            height={48}
            className="object-contain"
          />
          <h2 className="font-fixedsys text-2xl uppercase tracking-wide text-[#ff4444] md:text-4xl md:-tracking-wider">
            Features
          </h2>
        </div>

        <ul className="grid list-disc gap-x-4 font-bitmap text-lg text-gray-300 *:leading-5 md:grid-cols-2 md:text-xl">
          <li>Decentralized gameplay with true asset ownership</li>
          <li>Dynamic economy affected by player decisions</li>
          <li>Real-time city simulation with advanced AI citizens</li>
          <li>Strategic resource management and infrastructure planning</li>
          <li>Global marketplace for trading city assets and resources</li>
        </ul>

        <a
          href="#"
          className="mt-2 flex items-center gap-2 font-fixedsys text-[#ff4444] hover:text-[#ff6666] md:mt-6"
        >
          Learn more
          <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
};
