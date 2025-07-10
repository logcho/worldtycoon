"use client";

import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DynamicButton from "@/components/dynamic-button";
import { fixedsys } from "@/lib/fonts";

export default function BridgeTabs() {
  return (
    <Tabs
      value="withdraw"
      className={`${fixedsys.className} bg-card/40 w-full max-w-xl space-y-4 rounded-2xl p-6 shadow-lg backdrop-blur-sm`}
    >
      <TabsList className="bg-card/50 grid w-full grid-cols-2 rounded-xl shadow-md *:rounded-lg *:data-[state=active]:shadow-md">
        <TabsTrigger value="withdraw" className="text-sm">Withdraw</TabsTrigger>
        <TabsTrigger value="deposit" className="text-sm">Mint</TabsTrigger>
      </TabsList>

      <TabsContent value="withdraw" className="space-y-6">
        <div className="bg-card/50 space-y-4 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground text-sm">From:</p>
            <div className="flex items-center gap-2 [&_div]:truncate ml-4">
              <DynamicButton />
              <span className="font-bitmap text-muted-foreground text-sm">
                @Cryptopolis
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Funds: 123 SIM</p>
        </div>

        <ArrowDownIcon />

        <div className="bg-card/50 space-y-4 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground text-sm">To:</p>
            <div className="flex items-center gap-2 ml-4">
              <DynamicButton />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Balance: 456 SIM</p>
        </div>

        <Button variant="outline" className="w-full shadow-md text-sm py-4">
          Withdraw
        </Button>
      </TabsContent>
    </Tabs>
  );
}

const ArrowDownIcon: React.FC = () => (
  <div className="flex justify-center">
    <span className="bg-card/50 aspect-square rounded-full p-2 shadow-md">
      <ArrowDown className="w-4 h-4" />
    </span>
  </div>
);
