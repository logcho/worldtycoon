"use client";

import { Button } from "@/components/ui/button";
import { fixedsys } from "@/lib/fonts";
import { Address, formatUnits, parseUnits, stringToHex } from "viem";
import {
  useReadErc20Allowance,
  useReadErc20BalanceOf,
  useReadErc20Decimals,
  useReadErc20Symbol,
  useWriteErc20Approve,
} from "@/hooks/contracts";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useWriteErc20PortalDepositErc20Tokens } from "@/hooks/erc20portal";
import { useEffect, useState, useRef } from "react";
import { Spinner } from "@/components/ui/spinner";

type CreatePageProps = {
  /** 
   * Function to trigger external refetch or update logic after city creation 
   */
  trigger: () => void;
};

export default function CreatePage({ trigger }: CreatePageProps) {
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address as Address | undefined;

  // Environment variables for token and contract addresses
  const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as Address;
  const ERC20_PORTAL = process.env.NEXT_PUBLIC_ERC20_PORTAL as Address;
  const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS as Address;

  // Fetch token symbol and decimals for display and parsing
  const { data: symbol } = useReadErc20Symbol({ address: TOKEN_ADDRESS });
  const { data: decimals = 18 } = useReadErc20Decimals({ address: TOKEN_ADDRESS });

  // Read current allowance for ERC20 spending by the portal contract
  const {
    data: allowance = 0,
    refetch: refetchAllowance,
  } = useReadErc20Allowance({
    address: TOKEN_ADDRESS,
    args: [address!, ERC20_PORTAL],
  });

  // Read current ERC20 token balance for the user
  const {
    data: balance = 0,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useReadErc20BalanceOf({
    address: TOKEN_ADDRESS,
    args: address ? [address] : undefined,
  });

  // Format balance for user-friendly display
  const formattedBalance = balance ? formatUnits(balance, decimals) : "0";

  // Setup contract write functions and status trackers
  const {
    writeContractAsync: approveToken,
    status: approveStatus,
  } = useWriteErc20Approve();

  const {
    writeContractAsync: depositToken,
    status: depositStatus,
  } = useWriteErc20PortalDepositErc20Tokens();

  // Required token amount for approval and deposit actions
  const requiredAmount = parseUnits("20000", decimals);

  // Determine if user can approve or deposit based on balances and allowance
  const canApprove = balance >= requiredAmount;
  const canDeposit = allowance >= requiredAmount;

  // Local loading states to track ongoing approval and deposit processes,
  // controlled until blockchain state changes confirm completion
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  // Keep previous allowance and balance values to detect changes
  const lastAllowanceRef = useRef(allowance);
  const lastBalanceRef = useRef(balance);

  /**
   * Initiates ERC20 token approval for the portal contract.
   * Updates loading state to show spinner during transaction.
   */
  const approve = async () => {
    try {
      setIsApproving(true);
      await approveToken({
        address: TOKEN_ADDRESS,
        args: [ERC20_PORTAL, requiredAmount],
      });
    } catch (error) {
      console.error("Error in approving ERC20:", error);
      setIsApproving(false);
    }
  };

  /**
   * Initiates token deposit to create the city.
   * Updates loading state to show spinner during transaction.
   */
  const deposit = async () => {
    try {
      setIsDepositing(true);
      const data = stringToHex(`{"method":"create"}`);
      await depositToken({
        args: [TOKEN_ADDRESS, DAPP_ADDRESS, requiredAmount, data],
      });
    } catch (error) {
      console.error("Error in depositing ERC20:", error);
      setIsDepositing(false);
    }
  };

  /**
   * After approval transaction signature, wait for a delay then refetch allowance.
   * This delay accounts for blockchain indexer update lag.
   */
  useEffect(() => {
    if (approveStatus === "success") {
      const timeout = setTimeout(() => {
        refetchAllowance();
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [approveStatus, refetchAllowance]);

  /**
   * After deposit transaction signature, wait for a delay then refetch balance and trigger external update.
   */
  useEffect(() => {
    if (depositStatus === "success") {
      const timeout = setTimeout(() => {
        refetchBalance();
        trigger();
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [depositStatus, refetchBalance, trigger]);

  /**
   * Detect allowance increase to stop approval loading spinner only after blockchain state confirms change.
   */
  useEffect(() => {
    if (isApproving && allowance > lastAllowanceRef.current) {
      setIsApproving(false);
      lastAllowanceRef.current = allowance;
    }
  }, [allowance, isApproving]);

  /**
   * Detect balance decrease to stop deposit loading spinner only after blockchain state confirms change.
   */
  useEffect(() => {
    if (isDepositing && balance < lastBalanceRef.current) {
      setIsDepositing(false);
      lastBalanceRef.current = balance;
    }
  }, [balance, isDepositing]);

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
            deposited into the city safe.{" "}
            <span className="text-yellow-600">
              You'll first need to approve the deposit to create your city!
            </span>
          </p>
        </div>

        <Button
          className="w-full shadow-md"
          size="lg"
          onClick={approve}
          disabled={!canApprove || approveStatus === "pending" || isApproving || isDepositing}
        >
          {(approveStatus === "pending" || isApproving) ? (
            <Spinner className="text-black" />
          ) : (
            "Approve Create"
          )}
        </Button>

        <Button
          className="w-full shadow-md"
          size="lg"
          onClick={deposit}
          disabled={!canDeposit || depositStatus === "pending" || isDepositing}
        >
          {(depositStatus === "pending" || isDepositing) ? (
            <Spinner className="text-black" />
          ) : (
            "Create City"
          )}
        </Button>
      </div>
    </main>
  );
}
