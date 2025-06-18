"use client";

import DynamicButton from "@/components/dynamic-button";
import Link from "next/link";
import Image from "next/image";

export default function GameBar(){
    return (
        <header className="bg-black flex flex-row items-center justify-between w-full h-20 p-4 z-50">
            <DynamicButton />
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
        </header>
    )
}
