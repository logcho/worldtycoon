"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import DynamicButton from "@/components/dynamic-button";
import { fixedsys } from "@/lib/fonts";
import { Menu, X } from "lucide-react";
import { nav } from "@/config/nav";
import { NavLink } from "./nav-link";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const playNav = pathname === "/play";

  if (playNav) {
    return (
      <header
        className={`${fixedsys.className} bg-black flex fixed items-center justify-between w-full h-20 p-4 z-50`}
      >
        <div className="flex items-center gap-6">
          <Link href="/" className="block">
            <Image
              src="/images/logos/logo2.png"
              alt="logo2"
              width={120}
              height={120}
              className="scale-75 md:scale-100"
            />
          </Link>
        </div>
        <DynamicButton />
      </header>
    );
  }

  return (
    <header
      className={`${fixedsys.className} bg-black flex fixed items-center justify-between w-full h-20 p-4 z-50`}
    >
      <div className="flex items-center gap-6">
        <Link href="/" className="mt-14 hidden md:block">
          <Image
            src="/images/logos/logo.png"
            alt="logo"
            width={120}
            height={120}
            className="scale-75 md:scale-100"
          />
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-none p-1 text-white hover:bg-[#222] md:hidden"
        >
          {isOpen ? <X className="size-8" /> : <Menu className="size-8" />}
        </button>

        <nav className="hidden items-center gap-6 text-2xl text-[#babec7] md:flex uppercase">
          {nav.map(({ name, href }) => (
            <NavLink
              key={name}
              href={href}
              className={`relative z-0 flex items-center gap-4 px-3 py-1 transition-colors hover:text-yellow-400
                before:absolute before:inset-0 before:-z-10 before:h-full before:w-0 before:bg-stone-500
                before:transition-all before:duration-300 hover:before:w-full`}
            >
              <div className="size-2.5 bg-current" />
              {name}
            </NavLink>
          ))}
        </nav>

        <nav
          className={`bg-black/80 fixed inset-x-0 top-20 w-full overflow-hidden backdrop-blur-xs transition-[height] duration-300 md:hidden
            ${isOpen ? "h-52" : "h-0"}`}
        >
          <div className="flex flex-col items-center gap-6 p-4 text-2xl text-[#babec7] uppercase">
            {nav.map(({ name, href }) => (
              <NavLink
                key={name}
                href={href}
                className={`relative z-0 flex min-w-32 items-center justify-center gap-4 px-3 py-1 text-center transition-colors hover:text-yellow-400
                  before:absolute before:inset-0 before:-z-10 before:h-full before:w-0 before:bg-stone-500
                  before:transition-all before:duration-300 hover:before:w-full`}
              >
                {name}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      <DynamicButton />
    </header>
  );
}
