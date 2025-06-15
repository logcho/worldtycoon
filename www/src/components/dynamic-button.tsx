import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "./ui/button";

export default function DynamicButton(){

    const { primaryWallet, setShowAuthFlow } = useDynamicContext();

    return primaryWallet ?
        <DynamicWidget />
        :
        <Button
            onClick={() => setShowAuthFlow(true)}
        >
            Connect
        </Button>
}