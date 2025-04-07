import * as React from "react";
import { useRouter } from "next/navigation";

import { Stage } from "@pixi/react";
import { Hex, toHex } from "viem";
import { useAccount } from "wagmi";

import type { Tool } from "~/config/tools";

import { HEIGHT, WIDTH } from "~/config/constants";
import { cn } from "~/lib/utils";

import { Map } from "./map";
import { ToolOverlay } from "./tool-overlay";
import { useEffect, useState } from "react";
import { Query } from "./query";
// const MIN_ZOOM = 0.5;
// const MAX_ZOOM = 2;
// const ZOOM_STEP = 0.1;
export type StageAreaProps = {
  selectedTool?: Tool;
  write?: () => void;
  setInput?: (input: Hex) => void;
  map: Hex;
  isBudgeting: boolean;
}

export const StageArea: React.FC<StageAreaProps> = ({ 
  selectedTool, 
  write, 
  setInput, 
  map, 
  isBudgeting, 
}) => {
  const router = useRouter();
  const { address } = useAccount();

  if (!address) {
    router.replace("/");
  }

  // const containerRef = React.useRef<HTMLDivElement>(null);
  // const [scale] = React.useState(1);
  // const [windowSize, setWindowSize] = useState({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });
  // const [isDragging, setIsDragging] = useState(false);
  // const [position, setPosition] = useState({ x: 0, y: 0 });
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [startCoordinates, setStartCoordinates] = useState({ x: 0, y: 0})
  const [endCoordinates, setEndCoordinates] = useState({ x: 0, y: 0})
  const [isQuerying, setIsQuerying] = useState(false);
  const width = 120;
  const height = 100;

  // Center the stage initially
  // useEffect(() => {
  //   if (containerRef.current) {
  //     const { clientWidth, clientHeight } = containerRef.current;
  //     setPosition({
  //       x: (clientWidth - WIDTH * 16) / 2,
  //       y: (clientHeight - HEIGHT * 16) / 2,
  //     });
  //   }
  // }, []);

  // Handle zoom with mouse wheel
  // const handleWheel = React.useCallback(
  //   (e: WheelEvent) => {
  //     e.preventDefault();

  //     const container = containerRef.current;
  //     if (!container) return;

  //     const rect = container.getBoundingClientRect();
  //     const mouseX = e.clientX - rect.left - position.x;
  //     const mouseY = e.clientY - rect.top - position.y;

  //     const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
  //     const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale + delta));
  //     const scaleFactor = newScale / scale;

  //     setScale(newScale);
  //     setPosition({
  //       x: position.x - mouseX * (scaleFactor - 1),
  //       y: position.y - mouseY * (scaleFactor - 1),
  //     });
  //   },
  //   [scale, position],
  // );

  // Handle drag start
  // const handleMouseDown = React.useCallback(
  //   (e: React.MouseEvent<HTMLDivElement>) => {
  //     if (e.button === 0 && !(e.target as HTMLElement).closest("button")) {
  //       setIsDragging(true);
  //       setDragStart({
  //         x: e.clientX - position.x,
  //         y: e.clientY - position.y,
  //       });
  //     }
  //   },
  //   [position],
  // );

  // Handle drag
  // const handleMouseMove = React.useCallback(
  //   (e: MouseEvent) => {
  //     if (isDragging) {
  //       const container = containerRef.current;
  //       if (!container) return;

  //       const { clientWidth, clientHeight } = container;
  //       const minX = -(WIDTH * 16 * scale - clientWidth);
  //       const minY = -(HEIGHT * 16 * scale - clientHeight);

  //       const newX = e.clientX - dragStart.x;
  //       const newY = e.clientY - dragStart.y;
  //       setPosition({
  //         x: Math.min(clientWidth / 4, Math.max(minX - clientWidth / 4, newX)),
  //         y: Math.min(
  //           clientHeight / 4,
  //           Math.max(minY - clientHeight / 4, newY),
  //         ),
  //       });
  //     }
  //   },
  //   [isDragging, dragStart, scale],
  // );

  // Handle drag end
  // const handleMouseUp = React.useCallback(() => {
  //   setIsDragging(false);
  // }, []);

  // Add event listeners
  // React.useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   // container.addEventListener("wheel", handleWheel, { passive: false });
  //   window.addEventListener("mousemove", handleMouseMove);
  //   window.addEventListener("mouseup", handleMouseUp);

  //   return () => {
  //     // container.removeEventListener("wheel", handleWheel);
  //     window.removeEventListener("mousemove", handleMouseMove);
  //     window.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, [handleMouseMove, handleMouseUp]);

  // React.useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   const handleResize = () => {
  //     setWindowSize({
  //       width: container.clientWidth,
  //       height: container.clientHeight,
  //     });
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  return (
    <div
      className="h-[calc(100dvh-5rem)]! overflow-auto"
      style={{
        scrollbarWidth: "none", // Get rid of scrollbar
      }}
      // {...props}
      // ref={containerRef}
      // onMouseDown={handleMouseDown}
      // className={cn(
      //   "h-[calc(100dvh-5rem)]! cursor-grab overflow-auto select-none",
      //   isDragging && "cursor-grabbing",
      //   className,
      // )}
    >
      <Stage
        // width={windowSize.width}
        // height={windowSize.height}
        width={width * 16}
        height={height * 16}
        options={{
          autoDensity: true,
          antialias: true,
        }}
      >
        <Map
          value={map}
          scale={1}
          // position={position}
          // coordinates={coordinates}
          selectedTool={selectedTool}
          onMouseDown={(tile) => {
            if(selectedTool){
              setStartCoordinates({ x: tile.x, y: tile.y })
              if (selectedTool.num == 5){
                setIsQuerying(true)
              }
              if(selectedTool.num != 5 && selectedTool.num != 6 && selectedTool.num != 8 && selectedTool.num != 9){
                write && write();
              }
            }
          }}
          onMouseMove={(tile) => {
            // setEndCoordinates({ x: tile.x, y: tile.y })
            setEndCoordinates({ x: tile.x, y: tile.y })
            setCoordinates({ x: tile.x, y: tile.y })

            // if(mouseDown){
            //   setEndCoordinates({ x: tile.x, y: tile.y })
            // } else{
            //   setCoordinates({ x: tile.x, y: tile.y })
            // }
          }}
          onMouseUp={(tile) => {
            if(selectedTool){
              // setMouseDown(false);
              // setDeltaX(tile.x);
              // setDeltaY(tile.y);    
              if(selectedTool.num == 6 || selectedTool.num == 8 || selectedTool.num == 9){
                  // setEndCoordinates({ x: tile.x, y: tile.y })
                  write && write();
              }
            }
          }}
          isBudgeting={isBudgeting}
        />
        <ToolOverlay
          selectedTool={selectedTool}
          coordinates={coordinates}
          endCoordinates={endCoordinates}
          startCoordinates={startCoordinates}
          scale={1}
          // position={position}
          setInput={setInput}
          isBudgeting={isBudgeting}
        />
      </Stage>
      <Query
          visible={isQuerying}
          address={address}
          x={coordinates.x}
          y={coordinates.y}
          setVisible={setIsQuerying}
          
      />
    </div>
  );
};
