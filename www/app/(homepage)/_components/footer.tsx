import * as React from "react";
import Image from "next/image";

import { Icons } from "~/components/icons";
import { siteConfig } from "~/config/site";

export const FooterSection: React.FC = () => {
  return (
    <section className="flex h-dvh snap-center flex-col bg-[url('/images/do_pets.png')] bg-cover bg-center bg-no-repeat">
      <div className="container flex w-full grow flex-col gap-6 px-10 pt-24">
        <h1 className="border-b-2 border-b-red-500 pb-2 font-fixedsys text-3xl text-red-500 [text-shadow:_2px_4px_0_#000] md:text-4xl">
          Our Mission
        </h1>

        <div
          className="m-auto h-fit w-full max-w-4xl space-y-2 rounded-[2rem] bg-[#151515]/80 p-2 backdrop-blur-sm duration-700 animate-in slide-in-from-left-1/2 md:space-y-4 md:p-6"
          style={{
            border: "16px solid transparent",
            borderImage: "url('/images/border.png') 16 stretch",
          }}
        >
          <div className="font-fixedsys text-lg text-gray-300">
            World Tycoon represents a revolutionary fusion of traditional
            city-building gameplay with blockchain technology, creating an
            ecosystem where your strategic decisions have real-world value.{" "}
            <p className="py-2" />
            Our mission is to empower players by providing a platform where
            gaming expertise translates into tangible rewards. Through
            Cartesi&apos;s advanced blockchain infrastructure, we&apos;ve
            created a decentralized gaming experience that maintains the depth
            and engagement of classic city simulators while introducing
            innovative economic mechanics. <p className="py-2" />
            We believe in a future where gaming transcends entertainment,
            becoming a legitimate avenue for wealth creation and economic
            participation. By combining immersive gameplay with cryptocurrency
            integration, we&apos;re building more than just a game - we&apos;re
            creating an ecosystem where players can truly own their achievements
            and trade their success. <p className="py-2" />
            Join us in revolutionizing the gaming industry by being part of a
            community where strategic thinking, resource management, and city
            planning skills can lead to real-world prosperity. Welcome to the
            future of gaming - welcome to World Tycoon.
          </div>
        </div>
      </div>

      <div className="h-24 w-full">
        <Image
          src="/images/border_2.png"
          alt="border"
          width={1000}
          height={100}
          className="h-1.5 w-screen shadow-md"
        />

        <footer className="flex h-full items-center justify-between gap-4 bg-background px-6 text-foreground">
          <div className=""></div>
          <p className="text-center font-bitmap text-xl md:text-2xl">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 md:gap-8">
            <a
              href={siteConfig.links.discord.url}
              title="Discord"
              target="_blank"
              className="text-red-500 transition-colors hover:text-rose-600 hover:drop-shadow-md"
            >
              <Icons.DiscordIcon size={36} />
            </a>
            <a
              href={siteConfig.links.x.url}
              title="Twitter"
              target="_blank"
              className="text-red-500 transition-colors hover:text-rose-600 hover:drop-shadow-md"
            >
              <Icons.TwitterIcon size={32} />
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
};
