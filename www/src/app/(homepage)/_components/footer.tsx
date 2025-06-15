import { fixedsys } from "@/lib/fonts";

export default function FooterSection(){
    return (
        <footer className="bg-black flex flex-row items-center justify-between gap-4 h-24 w-full">
            <div className=""></div>
            <p className={`text-white ${fixedsys.className}`}>
                © 2025 World Tycoon. All rights reserved.
            </p>
            <div className="flex items-center gap-4 md:gap-8">

            </div>
        </footer>
    )
}