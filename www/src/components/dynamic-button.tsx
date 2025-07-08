import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "./ui/button";
import { fixedsys } from "@/lib/fonts";

export default function DynamicButton(){

    const { primaryWallet, setShowAuthFlow } = useDynamicContext();

    return primaryWallet ?
        <DynamicWidget />
        :
        <Button
            className={`${fixedsys.className} inline-flex h-11 w-32 items-center justify-center bg-[#333] text-xl text-[#dcd8c0] shadow-md transition-all duration-300 [text-shadow:_1px_1px_0_#000] hover:bg-[#444] hover:text-[#e1e1e1] hover:shadow-[4px_4px_0_#000] hover:[text-shadow:_2px_2px_0_#000]`}
            onClick={() => setShowAuthFlow(true)}
        >
            Connect
        </Button>
}