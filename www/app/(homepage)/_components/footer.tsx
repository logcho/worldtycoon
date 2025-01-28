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
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos,
            accusantium illum? Ipsum quasi aperiam nam? <p className="py-2" />
            Voluptatem provident iure, dicta tempore nesciunt exercitationem
            adipisci repudiandae quidem. Sapiente eos beatae ut quae! Asperiores
            ipsum error nulla expedita laboriosam adipisci, quidem amet ratione,
            harum eos nesciunt veritatis beatae quis, ea odit voluptatem ad
            recusandae mollitia quas ut? Laborum beatae sapiente maiores?
            <p className="py-2" /> At doloremque dicta inventore quidem quae
            fuga ducimus totam. Ipsum debitis perferendis corporis officiis
            accusantium repellat fugiat labore sint laborum aperiam modi,
            distinctio iste, quos harum dolores repellendus numquam quo adipisci
            natus, nemo magni doloremque atque unde?
            <p className="py-2" /> Assumenda maxime vero, ipsa in adipisci
            veritatis nemo earum eius amet voluptatum dicta ducimus tempora
            dolores eaque nesciunt harum pariatur, suscipit modi.
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

        <footer className="flex h-full items-center justify-between gap-4 bg-foreground px-6">
          <div className=""></div>
          <p className="text-center font-bitmap text-xl text-background md:text-2xl">
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
