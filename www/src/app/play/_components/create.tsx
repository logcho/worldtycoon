"use client";

import { Button } from "@/components/ui/button";
import { fixedsys } from "@/lib/fonts";
import { Address, formatUnits, parseUnits, stringToHex } from "viem";
import { useReadErc20Allowance, useReadErc20BalanceOf, useReadErc20Decimals, useReadErc20Symbol, useWriteErc20Approve } from "@/hooks/contracts";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useWriteErc20PortalDepositErc20Tokens } from "@/hooks/erc20portal";
import { useEffect } from "react";

export default function CreatePage() {
    const { primaryWallet } = useDynamicContext();
    const address = primaryWallet?.address as Address | undefined;

    const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as Address;
    const ERC20_PORTAL = process.env.NEXT_PUBLIC_ERC20_PORTAL as Address;
    const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS as Address;

    const { data: symbol } = useReadErc20Symbol({
        address: TOKEN_ADDRESS,
    });

    const { data: decimals = 18 } = useReadErc20Decimals({
        address: TOKEN_ADDRESS,
    });

    const { data: allowance = 0 } = useReadErc20Allowance({
        address: TOKEN_ADDRESS,
        args: [address!, ERC20_PORTAL]
    });

    const {
        data: balance = 0,
        isLoading: balanceLoading,
        isError: balanceError,
    } = useReadErc20BalanceOf({
        address: TOKEN_ADDRESS,
        args: address ? [address] : undefined,
    });

    const formattedBalance = balance
        ? formatUnits(balance, decimals)
        : "0";

    const { writeContractAsync: approveToken, isPending: approveLoading } = useWriteErc20Approve();
    const { writeContractAsync: depositToken, isPending: depositLoading } = useWriteErc20PortalDepositErc20Tokens();

    const approve = async () => {
        try {
            await approveToken({
                address: TOKEN_ADDRESS,
                args: [ERC20_PORTAL, parseUnits("20000", 18)],
            });
            console.log("ERC20 Approval successful");
        } catch (error) {
            console.error("Error in approving ERC20:", error);
            throw error;
        }
    };

    const deposit = async () => {
        try {
            const data = stringToHex(`{"method": "create"}`);
            await depositToken({
                args: [
                    TOKEN_ADDRESS,
                    DAPP_ADDRESS,
                    parseUnits("20000", 18),
                    data,
                ],
            });
        } catch (error) {
            console.error("Error in depositing ERC20:", error);
            throw error;
        }
    };

    const canApprove = balance >= parseUnits("20000", 18);
    const canDeposit = allowance >= parseUnits("20000", 18);

    console.log(allowance);

    return (
        <main className="bg-[url('/images/backgrounds/bg.png')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center w-full h-screen">
        <div
            className={`${fixedsys.className} bg-card/40 w-full max-w-xl space-y-4 rounded-2xl p-6 shadow-lg backdrop-blur-sm`}
        >
            <div className="flex items-center justify-between">
            <h2 className="text-xl">
                Balance: {balanceLoading ? "Loading..." : `${formattedBalance} ${symbol ?? ""}`}
            </h2>
            </div>

            <div className="bg-card/50 rounded-xl p-4 text-center shadow-md">
            <p className="text-muted-foreground">
                20000 {symbol ?? "TOKEN"} will be debited from your account and
                deposited into the city safe. <span className="text-yellow-600">You'll first need to approve the deposit 
                to create your city!</span>
            </p>
            </div>
            <Button 
                className="w-full shadow-md" 
                size="lg"
                onClick={approve}
            >
                Approve Create
            </Button>
            <Button 
                className="w-full shadow-md" 
                size="lg"
                onClick={deposit}
                disabled={!canDeposit}
            >
                Create City
            </Button>
        </div>
        </main>
    );
}