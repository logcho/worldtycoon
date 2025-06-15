
import { Children, FC } from "react";
import {
    DynamicContextProvider,
    DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

  
export type DynamicProvider = {
    children?: React.ReactNode;
};

const DynamicProvider: FC<DynamicProvider> = (props) => {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
                walletConnectors: [
                    EthereumWalletConnectors,
                ],
            }}
        >
            {props.children}
        </DynamicContextProvider>
    )
}

export default DynamicProvider;