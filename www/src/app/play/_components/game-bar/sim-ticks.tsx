"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fixedsys } from "@/lib/fonts";
import { Label } from "@/components/ui/label";
import { Hex, stringToHex } from "viem";

export default function SimTicks({
  setSimulating,
  simulating,
  write,
  loading,
  setInput,
}: {
  setSimulating: (simulating: boolean) => void;
  simulating: boolean;
  write: () => void;
  loading: boolean;
  setInput: (input: Hex) => void;
}) {
  const [ticks, setTicks] = useState<number>(1);

  useEffect(() => {
    if (simulating) {
      setInput(
        stringToHex(
          `{"method": "simTick", "ticks": ${ticks}}`
        )
      );
    }
  }, [simulating, ticks, setInput]);

  return (
    <div className={`${fixedsys.className}`}>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="bg-yellow-400 text-xl text-white"
            onClick={() => setSimulating(!simulating)}
          >
            Sim Tick
          </Button>
        </DialogTrigger>

        <DialogContent className={`${fixedsys.className}`}>
          <DialogHeader>
            <DialogTitle>Sim Tick</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Label>
                Number of Ticks
            </Label>
            <Input
              type="number"
              value={ticks}
              onChange={(e) => setTicks(Number(e.target.value))}
              placeholder="Enter number of months"
              min={1}
            />
            <p className="text-yellow-400">
            {/* <p> */}
                One tick is around one month!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button onClick={write} disabled={loading}>
              {loading ? "Loading..." : "Confirm"}
            </Button>

            <DialogTrigger asChild>
              <Button disabled={loading} onClick={() => setSimulating(false)}>
                Okay
              </Button>
            </DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
