import * as React from "react";
import { useRouter } from "next/navigation";

import { Stage } from "@pixi/react";
import { useAccount } from "wagmi";

import type { Tool } from "~/config/tools";

import { HEIGHT, WIDTH } from "~/config/constants";
import { useInspect } from "~/hooks/use-inspect";
import { cn } from "~/lib/utils";

import { Map } from "./map";
import { ToolOverlay } from "./tool-overlay";

export const StageArea: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    selectedTool?: Tool;
  }
> = ({ className, selectedTool, ...props }) => {
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
    <div {...props} className={cn("!h-[calc(100dvh-3.5rem)]", className)}>
      <Stage width={WIDTH * 16} height={HEIGHT * 16}>
        <Map
          value={reports[0]?.payload}
          scale={1}
          selectedTool={selectedTool}
          onMouseMove={(tile) => setCoordinates({ x: tile.x, y: tile.y })}
        />
        <ToolOverlay selectedTool={selectedTool} coordinates={coordinates} />
      </Stage>
    </div>
  );
};
