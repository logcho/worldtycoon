"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Stage } from "@pixi/react";
import { useAccount } from "wagmi";

import { HEIGHT, WIDTH } from "~/config/constants";
import { useInspect } from "~/hooks/use-inspect";
import { cn } from "~/lib/utils";

import { Map } from "./map";
import { ToolOverlay } from "./tool-overlay";

export const StageArea: React.FC<
  React.CanvasHTMLAttributes<HTMLCanvasElement>
> = ({ className, ...props }) => {
  const router = useRouter();
  const { address } = useAccount();

  if (!address) {
    router.replace("/");
  }

  const [coordinates, setCoordinates] = React.useState({ x: 0, y: 0 });

  const { data } = useInspect(
    JSON.stringify({
      method: "getEngine",
      user: address,
    }),
  );

  const reports = data?.reports ?? [];

  return (
    <Stage
      {...props}
      width={WIDTH * 16}
      height={HEIGHT * 16}
      className={cn("!h-[calc(100dvh-3.5rem)]", className)}
    >
      <Map
        value={reports[0]?.payload}
        scale={1}
        onMouseMove={(tile) => setCoordinates({ x: tile.x, y: tile.y })}
      />
      <ToolOverlay coordinates={coordinates} />
    </Stage>
  );
};
