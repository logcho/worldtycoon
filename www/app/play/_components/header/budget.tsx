"use client";

import { FC, useEffect, useState } from "react";

import { Hex, stringToHex } from "viem";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { cn } from "~/lib/utils";

type BudgetProps = {
  cityTax: number;
  cashFlow: number;
  funds: number;
  taxFund: number;
  roadPercent: number;
  roadFund: number;
  firePercent: number;
  fireFund: number;
  policePercent: number;
  policeFund: number;
  loading?: boolean;
  setInput?: (input: Hex) => void;
  write?: () => void;
  setIsOpen: (input: boolean) => void;
  isOpen: boolean;
};
// Time units in the game engine
const CITYTIMES_PER_MONTH = 4;
const CITYTIMES_PER_YEAR = CITYTIMES_PER_MONTH * 12;

export const Budget: FC<BudgetProps> = ({
  cityTax,
  cashFlow,
  funds,
  taxFund,
  roadPercent,
  roadFund,
  firePercent,
  fireFund,
  policePercent,
  policeFund,
  loading,
  setInput,
  write,
  setIsOpen,
  isOpen,
}) => {
  const [tax, setTax] = useState(cityTax);
  const [rp, setRP] = useState(roadPercent);
  const [fp, setFP] = useState(firePercent);
  const [pp, setPP] = useState(policePercent);

  // Divide percentages by 100
  useEffect(() => {
    if (setInput && isOpen) {
      setInput(
        stringToHex(
          `{"method": "doBudget", "roads": ${rp / 100}, "fire": ${fp / 100}, "police": ${pp / 100}, "tax": ${tax}}`,
        ),
      );
    }
  }, [tax, rp, fp, pp]);

  const formatPercentage = (value: number) => {
    return value.toFixed(0);
  };

  return (
    <div className="font-fixedsys">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setTax(cityTax);
            setRP(roadPercent);
            setFP(firePercent);
            setPP(policePercent);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="bg-muted text-xl text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            Budget
          </Button>
        </DialogTrigger>
        <DialogContent className="font-fixedsys">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <p>Tax Collected: ${taxFund}</p>
            <p>Cashflow: ${cashFlow}</p>
            <p>Current Funds: ${funds}</p>
            <p>Collected Funds: ${funds + taxFund}</p>

            <Card className="col-span-1 bg-black text-white">
              <CardContent className="space-y-2 p-2">
                <p>Roads</p>
                <Slider
                  value={[rp]}
                  onValueChange={(value) => setRP(value[0]!)}
                  max={100}
                  step={1}
                />
                <p>
                  {formatPercentage(rp)}% of ${roadFund} = ${formatPercentage((rp / 100) * roadFund)}
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-1 bg-black text-white">
              <CardContent className="space-y-2 p-2">
                <p>Fire</p>
                <Slider
                  value={[fp]}
                  onValueChange={(value) => setFP(value[0]!)}
                  max={100}
                  step={1}
                />
                <p>
                  {formatPercentage(fp)}% of ${fireFund} = ${formatPercentage((fp / 100) * fireFund)}
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-1 bg-black text-white">
              <CardContent className="space-y-4 p-5">
                <p>Police</p>
                <Slider
                  value={[pp]}
                  onValueChange={(value) => setPP(value[0]!)}
                  max={100}
                  step={1}
                />
                <p>
                  {formatPercentage(pp)}% of ${policeFund} = ${formatPercentage((pp / 100) * policeFund)}
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-1 bg-black text-white">
              <CardContent className="space-y-4 p-5">
                <p>Tax</p>
                <Slider
                  value={[tax]}
                  onValueChange={(value) => setTax(value[0]!)}
                  max={100}
                  step={1}
                />
                <p>Tax rate: {tax}%</p>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                write && write();
              }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Confirm"}
            </Button>

            <DialogTrigger asChild>
              <Button disabled={loading} onClick={() => setIsOpen(!isOpen)}>
                Okay
              </Button>
            </DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
  // return (
  //     <div
  //         className="font-fixedsys"
  //     >

  //         { visible && (
  //             <div>
  //                 Hello World
  //             </div>
  //         )}
  //     </div>
  // )
};
