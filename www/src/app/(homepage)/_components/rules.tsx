import Image from "next/image";
import { fixedsys, bitmap } from "@/lib/fonts";
export default function RulesSection(){
    return (
        <section className="bg-linear-to-b from-[#2d2508] via-[#1a1705] to-[#0d0c03] flex flex-col items-center justify-evenly h-screen w-full p-4">
            <div
                className="animate-in slide-in-from-right-1/2 min-h-[36vh] h-fit w-full max-w-4xl space-y-2 rounded-[2rem] bg-[#151515]/80 p-2 backdrop-blur-xs duration-700 md:space-y-4 md:p-6"
                style={{
                    border: "16px solid transparent",
                    borderImage: "url('/images/borders/border_2.png') 16 stretch",
                  }}
            >
                <div className="flex items-center gap-4">
                    <Image
                        src="/images/tools/r_tool.png"
                        alt="Utility Icon"
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                    <h2 className={`${fixedsys.className} text-2xl tracking-wide text-yellow-500 uppercase md:text-4xl md:-tracking-wider`}>
                        Utility
                    </h2>
                </div>
                <h3 className={`${fixedsys.className} tracking-wide text-neutral-200 md:text-xl`}>
                    BUILD, EARN & THRIVE IN THE BLOCKCHAIN ERA
                </h3>

                <ul className={`${bitmap.className} grid list-disc gap-x-4 text-lg text-gray-300 *:leading-5 md:grid-cols-2 md:text-xl`}>
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
            </div>
            <div
                className="animate-in slide-in-from-right-1/2 min-h-[36vh] h-fit w-full max-w-4xl space-y-2 rounded-[2rem] bg-[#151515]/80 p-2 backdrop-blur-xs duration-700 md:space-y-4 md:p-6"
                style={{
                    border: "16px solid transparent",
                    borderImage: "url('/images/borders/border_2.png') 16 stretch",
                  }}
            >
                <div className="flex items-center gap-4">
                    <Image
                        src="/images/tools/power_tool.png"
                        alt="Utility Icon"
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                     <h2 className={`${fixedsys.className} text-2xl tracking-wide text-yellow-500 uppercase md:text-4xl md:-tracking-wider`}>
                        Features
                    </h2>
                </div>
                <h3 className={`${fixedsys.className} tracking-wide text-neutral-200 md:text-xl`}>
                    MINT, TRADE, & SELL CITY NFTs
                </h3>
                <ul className={`${bitmap.className} grid list-disc gap-x-4 text-lg text-gray-300 *:leading-5 md:grid-cols-2 md:text-xl`}>
                    <li>Decentralized gameplay with true asset ownership</li>
                    <li>Real-time city simulation</li>
                    <li>Dynamic economy affected by player decisions</li>
                    <li>Control over ingame budget</li>
                    <li>Minting cities as NFTs</li>
                    <li>Withdraw ingame funds as real tokens</li>
                </ul>
            </div>
            
        </section>
    )
}