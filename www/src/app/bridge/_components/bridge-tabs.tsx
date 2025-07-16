"use client";

import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DynamicButton from "@/components/dynamic-button";
import { fixedsys } from "@/lib/fonts";
import { Address, formatUnits, Hex, hexToNumber, stringToHex } from "viem";
import {
  useReadErc20BalanceOf,
  useReadErc20Decimals,
  useReadErc20Symbol,
  useReadErc721GetApproved,
} from "@/hooks/contracts";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useWriteInputBoxAddInput } from "@/hooks/inputbox";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { useWriteErc721PortalDepositErc721Tokens } from "@/hooks/erc721portal";
import { useWriteErc721Approve } from "@/hooks/contracts";
import MiniMap from "./mini-map";

type MapFunds = {
  map: Hex;
  funds: Hex;
};


type BridgeTabsProps = {
  cityBalance?: number;
  mapFunds?: MapFunds;
  trigger: () => void;
};

export default function BridgeTabs({ cityBalance, trigger, mapFunds }: BridgeTabsProps) {
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address as Address | undefined;

  const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as Address;
  const DAPP_ADDRESS = process.env.NEXT_PUBLIC_DAPP_ADDRESS as Address;
  const ERC721_PORTAL = process.env.NEXT_PUBLIC_ERC721_PORTAL as Address;
  const NTF_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NTF_CONTRACT_ADDRESS as Address;

  const { data: symbol } = useReadErc20Symbol({ address: TOKEN_ADDRESS });
  const { data: decimals = 18 } = useReadErc20Decimals({ address: TOKEN_ADDRESS });

  const map = mapFunds ? mapFunds.map : undefined;
  const funds = mapFunds ? hexToNumber(mapFunds.funds) : undefined;

  const {
    data: balance = 0,
    isLoading: balanceLoading,
  } = useReadErc20BalanceOf({
    address: TOKEN_ADDRESS,
    args: address ? [address] : undefined,
  });

  const formattedBalance = balance ? formatUnits(balance, decimals) : "0";
  const canWithdraw = funds !== undefined;

  const { writeContractAsync, status: withdrawStatus } = useWriteInputBoxAddInput();

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [tokenIdToLoad, setTokenIdToLoad] = useState<bigint | undefined>(undefined);

  // Track last seen values to confirm blockchain state change
  const withdrawPayload = stringToHex(`{"method":"withdraw"}`);
  const mintPayload = stringToHex(`{"method":"mint"}`);

  /** Withdraw SIM tokens from the city safe to the user's wallet. */
  const withdraw = async () => {
    try {
      setIsWithdrawing(true);
      await writeContractAsync({ args: [DAPP_ADDRESS, withdrawPayload] });
      setTimeout(() => trigger(), 5000);
    } catch (error) {
      console.error("Withdraw error:", error);
      setIsWithdrawing(false);
    }
  };

  /** Mint an NFT representing the user's city. */
  const mint = async () => {
    try {
      setIsWithdrawing(true);
      await writeContractAsync({ args: [DAPP_ADDRESS, mintPayload] });
      setTimeout(() => trigger(), 5000);
    } catch (error) {
      console.error("Mint error:", error);
      setIsWithdrawing(false);
    }
  };

  const {
    writeContractAsync: approveToken,
    status: approveStatus,
  } = useWriteErc721Approve();

  const {
    writeContractAsync: depositToken,
    status: depositStatus,
  } = useWriteErc721PortalDepositErc721Tokens();

  const {
    data: approvedAddress,
    refetch: refetchApprovedAddress,
  } = useReadErc721GetApproved({
    address: NTF_CONTRACT_ADDRESS,
    args: tokenIdToLoad !== undefined ? [tokenIdToLoad] : undefined,
  });

  /** Approves the ERC721 token for loading into the dApp via the portal contract. */
  const approveNFT = async () => {
    if (!address || !tokenIdToLoad) return;
    try {
      setIsApproving(true);
      await approveToken({
        address: NTF_CONTRACT_ADDRESS,
        args: [ERC721_PORTAL, tokenIdToLoad],
      });
    } catch (error) {
      console.error("ERC721 Approve error:", error);
      setIsApproving(false);
    }
  };

  /** Deposits the approved ERC721 token into the dApp, effectively "loading" the city. */
  const depositNFT = async () => {
    if (tokenIdToLoad === undefined) return;
    try {
      setIsDepositing(true)
      const data = stringToHex(`Deposited NFT (${tokenIdToLoad})`);
      await depositToken({
        args: [NTF_CONTRACT_ADDRESS, DAPP_ADDRESS, tokenIdToLoad, data, data],
      });
    } catch (error) {
      console.error("ERC721 Deposit error:", error);
      setIsDepositing(false);
    }
  };

  useEffect(() => {
    if (approveStatus === "success") {
      const timeout = setTimeout(() => {
        refetchApprovedAddress();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [approveStatus, refetchApprovedAddress]);

  useEffect(() => {
    if (isApproving && approvedAddress == ERC721_PORTAL) {
      setIsApproving(false);
    }
  }, [approvedAddress, isApproving]);

  useEffect(() => {
    if (depositStatus === "success") {
      const timeout = setTimeout(() => {
        trigger();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [depositStatus, trigger]);


  const canApprove = tokenIdToLoad !== undefined;

  const canDeposit = tokenIdToLoad !== undefined && approvedAddress == ERC721_PORTAL;

  const [tab, setTab] = useState<"withdraw" | "mint" | "load">("withdraw");

  return (
    <section className="flex items-center justify-center w-full h-screen">
      <Tabs
        value={tab}
        onValueChange={(val) => setTab(val as "withdraw" | "mint" | "load")}
        className={`${fixedsys.className} w-full max-w-xl rounded-2xl bg-card/30 p-6 shadow-xl backdrop-blur-md`}
      >
        <TabsList className="bg-card/50 grid w-full grid-cols-3 rounded-xl shadow-md *:rounded-lg *:data-[state=active]:shadow-md">
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="mint">Mint</TabsTrigger>
          <TabsTrigger value="load">Load</TabsTrigger>
        </TabsList>

        {/* Withdraw Tab */}
        <TabsContent value="withdraw" className="space-y-6 pt-4">
          {mapFunds ? (
            <>
              <div className="space-y-2 rounded-xl bg-card/40 p-5 shadow-md">
                <div className="text-xs text-muted-foreground">Withdraw</div>
                <div className="flex items-center gap-3">
                  <DynamicButton />
                  <span className="truncate text-xs text-muted-foreground font-bitmap">@Cryptopolis</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  City Funds: <span className="font-bold text-primary">{funds} {symbol ?? ""}</span>
                </div>
              </div>
              <ArrowDownIcon />
              <div className="space-y-2 rounded-xl bg-card/40 p-5 shadow-md">
                <div className="text-xs text-muted-foreground">To Wallet</div>
                <DynamicButton />
                <div className="text-xs text-muted-foreground">
                  Wallet Balance: <span className="font-bold text-primary">{balanceLoading ? "Loading..." : `${formattedBalance} ${symbol ?? ""}`}</span>
                </div>
              </div>
              <Button
                className="w-full py-4 font-bold"
                disabled={!canWithdraw || withdrawStatus === "pending" || isWithdrawing}
                onClick={withdraw}
              >
                {(withdrawStatus === "pending" || isWithdrawing) ? <Spinner className="text-black" /> : "Withdraw SIM"}
              </Button>
            </>
          ) : (
            <div className="rounded-xl bg-card/40 p-5 shadow-md text-center text-sm text-muted-foreground">
              No city found. Load or create a city to withdraw funds.
            </div>
          )}
        </TabsContent>

        {/* Mint Tab */}
        <TabsContent value="mint" className="space-y-6 pt-4">
          {mapFunds ? (
            <>
              <div className="space-y-2 rounded-xl bg-card/40 p-5 shadow-md">
                <div className="text-xs text-muted-foreground">Your City</div>
                <div className="flex items-center gap-3">
                  <DynamicButton />
                  <span className="truncate text-xs text-muted-foreground font-bitmap">@Cryptopolis</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  City Funds: <span className="font-bold text-primary">{funds} {symbol ?? ""}</span>
                  <MiniMap mapValue={map} />
                </div>
              </div>
              <ArrowDownIcon />
              <div className="space-y-2 rounded-xl bg-card/40 p-5 shadow-md">
                <div className="text-xs text-muted-foreground">To Wallet</div>
                <DynamicButton />
                <div className="text-xs text-muted-foreground">
                  Wallet Balance: <span className="font-bold text-primary">{balanceLoading ? "Loading..." : `${formattedBalance} ${symbol ?? ""}`}</span>
                </div>
              </div>
              <Button
                className="w-full py-4 font-bold"
                disabled={!canWithdraw || withdrawStatus === "pending" || isWithdrawing}
                onClick={mint}
              >
                {(withdrawStatus === "pending" || isWithdrawing) ? <Spinner className="text-black" /> : "Mint City NFT"}
              </Button>
            </>
          ) : (
            <div className="rounded-xl bg-card/40 p-5 shadow-md text-center text-sm text-muted-foreground">
              No city found. Load or create a city to mint it as an asset.
            </div>
          )}
        </TabsContent>

        {/* Load Tab */}
        <TabsContent value="load" className="space-y-6 pt-4">
          <div className="rounded-xl bg-card/40 p-5 shadow-md space-y-4">
            {mapFunds ? (
              <div className="text-center text-sm text-muted-foreground">
                You already have a city loaded. You can only have one city at a time.
              </div>
            ) : (
              <>
                <Label className="text-xs text-muted-foreground">Enter Token ID to Load City</Label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground shadow-inner"
                  placeholder="e.g. 42"
                  onChange={(e) => {
                    const val = e.target.value;
                    setTokenIdToLoad(val ? BigInt(val) : undefined);
                  }}
                />

                <Button
                  className="w-full py-3 font-bold"
                  disabled={!canApprove}
                  onClick={() => tokenIdToLoad && approveNFT()}
                >
                  {(approveStatus === "pending" || isApproving) ? (
                    <Spinner className="text-black" />
                  ) : (
                    "Approve"
                  )}
                </Button>

                <Button
                  className="w-full py-3 font-bold"
                  disabled={!canDeposit}
                  onClick={() => depositNFT()}
                >
                  {isDepositing ? (
                    <Spinner className="text-black" />
                  ) : (
                    "Load City"
                  )}
                </Button>
              </>
            )}
          </div>
        </TabsContent>

      </Tabs>
    </section>
  );
}

const ArrowDownIcon = () => (
  <div className="flex justify-center">
    <div className="rounded-full bg-card/50 p-2 shadow-md ring-1 ring-border">
      <ArrowDown className="h-4 w-4 text-muted-foreground" />
    </div>
  </div>
);
