import * as React from "react";
import { useRouter } from "next/navigation";

import { Stage } from "@pixi/react";
import { useAccount } from "wagmi";

import type { Tool } from "~/config/tools";

import { HEIGHT, WIDTH } from "~/config/constants";
// import { useInspect } from "~/hooks/use-inspect";
import { useInspectMap } from "~/hooks/game";
import { cn } from "~/lib/utils";

import { Map } from "./map";
import { ToolOverlay } from "./tool-overlay";

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

export const StageArea: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    selectedTool?: Tool;
  }
> = ({ className, selectedTool, ...props }) => {
  const router = useRouter();
  const { address } = useAccount();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [coordinates, setCoordinates] = React.useState({ x: 0, y: 0 });

  if (!address) {
    router.replace("/");
  }

  const { map, isLoading, error } = useInspectMap(address);

  // Center the stage initially
  React.useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setPosition({
        x: (clientWidth - WIDTH * 16) / 2,
        y: (clientHeight - HEIGHT * 16) / 2,
      });
    }
  }, []);

  // Handle zoom with mouse wheel
  const handleWheel = React.useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - position.x;
      const mouseY = e.clientY - rect.top - position.y;

      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale + delta));
      const scaleFactor = newScale / scale;

      setScale(newScale);
      setPosition({
        x: position.x - mouseX * (scaleFactor - 1),
        y: position.y - mouseY * (scaleFactor - 1),
      });
    },
    [scale, position],
  );

  // Handle drag start
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button === 0 && !(e.target as HTMLElement).closest("button")) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    },
    [position],
  );

  // Handle drag
  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const container = containerRef.current;
        if (!container) return;

        const { clientWidth, clientHeight } = container;
        const minX = -(WIDTH * 16 * scale - clientWidth);
        const minY = -(HEIGHT * 16 * scale - clientHeight);

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        setPosition({
          x: Math.min(clientWidth / 4, Math.max(minX - clientWidth / 4, newX)),
          y: Math.min(
            clientHeight / 4,
            Math.max(minY - clientHeight / 4, newY),
          ),
        });
      }
    },
    [isDragging, dragStart, scale],
  );

  // Handle drag end
  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp]);

  return (
    <div
      {...props}
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className={cn(
        "!h-[calc(100dvh-3.5rem)] cursor-grab select-none overflow-hidden",
        isDragging && "cursor-grabbing",
        className,
      )}
    >
      <Stage
        width={WIDTH * 16}
        height={HEIGHT * 16}
        options={{
          autoDensity: true,
          antialias: true,
        }}
      >
        <Map
          value={map}
          scale={scale}
          position={position}
          selectedTool={selectedTool}
          onMouseMove={(tile) => setCoordinates({ x: tile.x, y: tile.y })}
        />
        <ToolOverlay
          selectedTool={selectedTool}
          coordinates={coordinates}
          scale={scale}
          position={position}
        />
      </Stage>
    </div>
  );
};
