import { createModularAccountV2Client } from "@account-kit/smart-contracts";
import { LocalAccountSigner } from "@aa-sdk/core";
import { baseSepolia, createAlchemyTransport } from "@alchemy/aa-core";
import { generatePrivateKey } from "viem/accounts";

export async function getSmartAccountClient() {
  const signer = LocalAccountSigner.privateKeyToAccountSigner(generatePrivateKey());

  const client = await createModularAccountV2Client({
    mode: "default", // or "7702" for EIP-7702 support
    chain: baseSepolia,
    transport: createAlchemyTransport({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
    }),
    signer,
  });

  return client;
}
