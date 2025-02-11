"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu, X } from "lucide-react";

import { nav } from "~/config/nav";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";

import { Button } from "../ui/button";
import { NavLink } from "./nav-link";

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header
      className={cn(
        "sticky inset-0 z-50 h-20 bg-[#111] p-4",
        // pathname === "/" && "fixed h-20",
      )}
    >
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-6">
          {pathname === "/" ?
            <Link href="/" className="mt-14 hidden md:block">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={120}
                height={120}
                className="scale-75 md:scale-100"
              />
            </Link>
          : <Link href="/" className="-mt-2 hidden md:block">
              <p className="font-bitmap text-4xl font-semibold text-yellow-500 [text-shadow:_1px_1px_0_#e1e1e1]">
                {siteConfig.name}
              </p>
            </Link>
          }

          <Button
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-none p-1 md:hidden bg-[#111] text-white hover:bg-[#222]"
          >
            {isOpen ?
              <X className="size-8" />
            : <Menu className="size-8" />}
          </Button>

          <nav className="hidden items-center gap-6 font-fixedsys text-2xl text-[#babec7] md:flex">
            {nav.map(({ name, href }) => (
              <NavLink
                key={name}
                href={href}
                className={cn(
                  "relative z-0 flex items-center gap-4 px-3 py-1 uppercase transition-colors hover:text-yellow-400",
                  "before:absolute before:inset-0 before:-z-10 before:h-full before:w-0 before:bg-stone-500 before:transition-all before:duration-300 hover:before:w-full",
                )}
              >
                <div className="size-2.5 bg-current" />
                {name}
              </NavLink>
            ))}
          </nav>

          <nav
            className={cn(
              "fixed inset-x-0 top-20 h-0 w-full overflow-hidden bg-foreground/75 backdrop-blur-sm transition-[height] duration-300",
              isOpen ? "h-52" : "h-0",
            )}
          >
            <div className="flex flex-col items-center gap-6 p-4 font-fixedsys text-[#babec7]">
              {nav.map(({ name, href }) => (
                <NavLink
                  key={name}
                  href={href}
                  className={cn(
                    "relative z-0 flex min-w-32 items-center justify-center gap-4 px-3 py-1 text-center text-2xl uppercase transition-colors hover:text-yellow-400",
                    "before:absolute before:inset-0 before:-z-10 before:h-full before:w-0 before:bg-stone-500 before:transition-all before:duration-300 hover:before:w-full",
                  )}
                >
                  {name}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>

        <div>
          {/* <Link
            href="/login"
            className="border border-stone-600 px-8 py-3 font-fixedsys text-lg text-red-500 transition-colors hover:bg-stone-500/25 hover:text-red-400"
          >
            LOG IN
          </Link> */}

          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
