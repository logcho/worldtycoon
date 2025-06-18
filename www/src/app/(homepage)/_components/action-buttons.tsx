"use client";
import Link from "next/link";
import { fixedsys } from "@/lib/fonts";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import DynamicButton from "@/components/dynamic-button";
export default function ActionButtons(){

    const { primaryWallet } = useDynamicContext();

    return (
        <div className="flex flex-col items-center gap-4 py-10">
            {primaryWallet ? // Condition is connected?
                <Link
                    href="/play"
                    className={`${fixedsys.className} inline-flex h-11 w-32 items-center justify-center bg-[#333] text-xl text-[#dcd8c0] shadow-md transition-all duration-300 [text-shadow:_1px_1px_0_#000] hover:bg-[#444] hover:text-[#e1e1e1] hover:shadow-[4px_4px_0_#000] hover:[text-shadow:_2px_2px_0_#000]`}
                >
                    Play
                </Link>
                :
                <DynamicButton />
            }
        </div>
    )
}