"use client";
import { FC, useEffect, useState } from "react";
import { Address, Hex, fromHex } from "viem";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useQueryTool } from "~/hooks/inspect";
import { useAccount } from "wagmi";

export type QueryProps = {
  setVisible?: (input: boolean) => void;
  address?: Address;
  x: number;
  y: number;
  visible: boolean;
};

type Stats = {
  populationDensity: number;
  landValue: number;
  crimeRate: number;
  pollution: number;
  growthRate: number;
};


export const Query: FC<QueryProps> = ({
  setVisible,
  address,
  x,
  y,
  visible,
}) => {

  if(!address) return null;
  
  const { stats, isLoading, error } = useQueryTool(address, x, y, visible);


  const [popDens, setPopDens] = useState("-");
  const [landVal, setLandVal] = useState("-");
  const [crime, setCrime] = useState("-");
  const [pollution, setPollution] = useState("-");
  const [growth, setGrowth] = useState("-");

  useEffect(() => {
    if (stats) {
      try {
        const statsJSON = JSON.parse(stats) as Stats;
        setPopDens(String(statsJSON.populationDensity));
        setLandVal(String(statsJSON.landValue));
        setCrime(String(statsJSON.crimeRate));
        setPollution(String(statsJSON.pollution));
        setGrowth(String(statsJSON.growthRate));
      } catch (err) {
        console.error("Failed to parse stats:", err);
      }
    }
  }, [stats]);

  if (!visible) return null;

  return (
    <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-background z-50">
      <Card className="w-[300px] font-fixedsys text-center space-y-4 p-4 shadow-lg">
        <CardContent className="space-y-4">
          <h2 className="text-lg font-bold bg-cyan-600 text-white py-1">Query</h2>
          <div className="grid grid-cols-2 gap-y-1 text-left text-sm">
            {/* <span className="font-bold">Zone</span>
            <span className="font-bold">0</span> */}

            <span className="font-bold">Density</span>
            <span className="font-bold">{popDens}</span>

            <span className="font-bold">Value</span>
            <span className="font-bold">{landVal}</span>

            <span className="font-bold">Crime</span>
            <span className="font-bold">{crime}</span>

            <span className="font-bold">Pollution</span>
            <span className="font-bold">{pollution}</span>

            <span className="font-bold">Growth</span>
            <span className="font-bold">{growth}</span>
          </div>
          <Button
            className="w-full"
            onClick={() => setVisible && setVisible(false)}
          >
            Okay
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
