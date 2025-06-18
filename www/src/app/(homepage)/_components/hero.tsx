import Image from "next/image"
import { fixedsys, bitmap } from "@/lib/fonts"
import ActionButtons from "./action-buttons"
export default function HeroSection() {
    return (
        <section className="flex flex-col items-center justify-center h-screen w-full">
            <div className="flex flex-col items-center justify-center">
                <Image
                    src={"/images/logo/logo.png"}
                    alt="logo"
                    width={200}
                    height={200}
                />
                <p className={`${bitmap.className} text-center text-3xl font-semibold text-white [text-shadow:_1px_2px_0_#000] md:text-4xl`}>
                    Build Your Empire, Earn Real Crypto, Rule the World
                </p>

                <p className={`${fixedsys.className} text-center text-3xl font-medium text-yellow-600 [text-shadow:_2px_4px_0_#111] md:text-4xl`}>
                    Join the blockchain revolution in city building!
                </p>
                <ActionButtons />
            </div>
        </section>
    )
}