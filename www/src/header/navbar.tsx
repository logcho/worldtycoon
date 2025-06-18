"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import DynamicButton from "@/components/dynamic-button";

export default function Navbar() {
  const pathname = usePathname();

  // Determine flex direction class based on pathname
  const flexDirectionClass = pathname === "/play" ? "flex-row-reverse" : "flex-row";

  return (
    <header
      className={`bg-black flex fixed ${flexDirectionClass} items-center justify-between w-full h-20 p-4 z-50`}
    >
      <div className="flex items-center gap-6">
        <Link href="/" className="mt-14 hidden md:block">
          <Image
            src="/images/logo/logo.png"
            alt="logo"
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
