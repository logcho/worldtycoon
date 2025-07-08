"use client";

import { useRef, useEffect, useState } from "react";
import type { Tool } from "@/config/tools";
import { Hex, stringToHex } from "viem";
import { HEIGHT, WIDTH, TILE_SIZE } from "@/config/constants";

// Asset paths
const TILESET_URL = "/images/tilesets/micropolis_tiles.png";
const TOOLSET_URL = "/images/tools/tools.png";

// Tile structure used in the map
export type Tile = {
  x: number;
  y: number;
  powered: boolean;
  conductor: boolean;
  burnable: boolean;
  bulldozable: boolean;
  animated: boolean;
  center: boolean;
  type: number; // Lower 10 bits of the tile
};

// Represents a placed tool's position on the map
export type PlacedSprite = {
  x: number;
  y: number;
  tool: Tool;
};

// Bit-mask decoder for tile attributes
const decodeTile = (x: number, y: number, tile: number): Tile => ({
  x,
  y,
  powered: (tile & 0x8000) !== 0,
  conductor: (tile & 0x4000) !== 0,
  burnable: (tile & 0x2000) !== 0,
  bulldozable: (tile & 0x1000) !== 0,
  animated: (tile & 0x0800) !== 0,
  center: (tile & 0x0400) !== 0,
  type: tile & 0x03ff,
});

// Main component
export default function MapCanvas({
  tool,
  defaultMap,
  mapValue,
  setInput,
  write,
}: {
  tool?: Tool;
  defaultMap: Hex;
  mapValue?: Hex;
  setInput?: (hex: Hex | undefined) => void;
  write?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tilesetRef = useRef<HTMLImageElement | null>(null);
  const toolsetRef = useRef<HTMLImageElement | null>(null);
  const animatedTilesRef = useRef<Tile[]>([]);
  
  const [coord, setCoord] = useState<{ x: number; y: number } | null>(null);
  const [placedSprites, setPlacedSprites] = useState<PlacedSprite[]>([]);
  // Use blank map if no value is passed
  mapValue =
    mapValue ??
    defaultMap;

  // Decode hex map into 16-bit tile values
  const pairs = mapValue.substring(2).match(/.{1,4}/g);
  const map = new Uint16Array(pairs!.map((pair) => parseInt(pair, 16)));

  // Load tileset and toolset images on mount
  useEffect(() => {
    const tilesetImg = new Image();
    tilesetImg.src = TILESET_URL;
    tilesetImg.onload = () => {
      tilesetRef.current = tilesetImg;
      draw(coord);
    };
    tilesetImg.onerror = () => console.error("Failed to load tileset image.");

    const toolsetImg = new Image();
    toolsetImg.src = TOOLSET_URL;
    toolsetImg.onload = () => {
      toolsetRef.current = toolsetImg;
      draw(coord);
    };
    toolsetImg.onerror = () => console.error("Failed to load toolset image.");
  }, []);

  // Redraw map when size, placement, or hover changes
  useEffect(() => {
    draw(coord);
  }, [coord, placedSprites]);

  // Main draw function
  const draw = (hoverCoord: { x: number; y: number } | null) => {
    const canvas = canvasRef.current;
    const tilesetImg = tilesetRef.current;
    const toolsetImg = toolsetRef.current;
    if (!canvas || !tilesetImg || !toolsetImg) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = WIDTH * TILE_SIZE;
    canvas.height = HEIGHT * TILE_SIZE;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap(ctx, tilesetImg);
    drawOverlay(ctx, toolsetImg, tool, hoverCoord);
  };

  // Draw static tiles and placed tools
  const drawMap = (
    ctx: CanvasRenderingContext2D,
    tilesetImg: HTMLImageElement
  ) => {
    const tilesetCols = Math.floor(tilesetImg.width / TILE_SIZE);
    const animated: Tile[] = []; // collect animated tiles

    for (let row = 0; row < HEIGHT; row++) {
      for (let col = 0; col < WIDTH; col++) {
        const idx = col * HEIGHT + row; // Column-major fix
        const tileCode = map[idx] & 0x03ff;

        const sx = (tileCode % tilesetCols) * TILE_SIZE;
        const sy = Math.floor(tileCode / tilesetCols) * TILE_SIZE;
        const dx = col * TILE_SIZE;
        const dy = row * TILE_SIZE;

        ctx.drawImage(tilesetImg, sx, sy, TILE_SIZE, TILE_SIZE, dx, dy, TILE_SIZE, TILE_SIZE);

        const decoded = decodeTile(col, row, tileCode);
        if (decoded.animated) animated.push(decoded);  
      }
    }

    animatedTilesRef.current = animated;

    // Draw placed tools with semi-transparency
    if (!toolsetRef.current) return;
    ctx.save();
    ctx.globalAlpha = 0.4;

    placedSprites.forEach(({ x, y, tool }) => {
      const sx = tool.x * TILE_SIZE;
      const sy = tool.y * TILE_SIZE;
      const sw = tool.w * TILE_SIZE;
      const sh = tool.h * TILE_SIZE;

      const dx = x * TILE_SIZE;
      const dy = y * TILE_SIZE;

      ctx.drawImage(toolsetRef.current!, sx, sy, sw, sh, dx, dy, sw, sh);
    });

    ctx.restore();
  };

  // Draw translucent tool overlay at hover position
  const drawOverlay = (
    ctx: CanvasRenderingContext2D,
    toolImage: HTMLImageElement,
    tool: Tool | undefined,
    mouseTilePos: { x: number; y: number } | null,
  ) => {
    if (!tool || !mouseTilePos) return;
  
    const sourceX = tool.x * TILE_SIZE;
    const sourceY = tool.y * TILE_SIZE;
    const sourceWidth = tool.w * TILE_SIZE;
    const sourceHeight = tool.h * TILE_SIZE;
  
    // Compute offset for X axis
    let offsetX: number;
    if (tool.w % 2 === 1) {
      // Odd width: center exactly
      offsetX = Math.floor(tool.w / 2);
    } else {
      // Even width: top-left of center square
      offsetX = (tool.w / 2) - 1;
    }
  
    // Compute offset for Y axis
    let offsetY: number;
    if (tool.h % 2 === 1) {
      // Odd height: center exactly
      offsetY = Math.floor(tool.h / 2);
    } else {
      // Even height: top-left of center square
      offsetY = (tool.h / 2) - 1;
    }
  
    const destX = (mouseTilePos.x - offsetX) * TILE_SIZE;
    const destY = (mouseTilePos.y - offsetY) * TILE_SIZE;
  
    ctx.save();
    ctx.globalAlpha = 0.4; // optional transparency
    ctx.drawImage(
      toolImage,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destX,
      destY,
      sourceWidth,
      sourceHeight
    );
    ctx.restore();
  };

  // Track mouse hover and prepare input command
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    setCoord({ x, y });

    if (tool && coord) {
      setInput?.(stringToHex(`{"method":"doTool","tool":${tool.index},"x":${coord.x},"y":${coord.y}}`));
      console.log(`{"method":"doTool","tool":${tool.index},"x":${coord.x},"y":${coord.y}}`);
    }
  };

  const handleMouseLeave = () => setCoord(null);

  const handleClick = () => {
    if (!coord || !tool) return;

    placeTool();
    write?.();
  };

  // Try to place the selected tool at the hovered position
  const placeTool = () => {
    if (!coord || !tool) return;
  
    const toolWidth = tool.w;
    const toolHeight = tool.h;
  
    // Use same offset logic as overlay for X axis
    let offsetX: number;
    if (toolWidth % 2 === 1) {
      offsetX = Math.floor(toolWidth / 2);
    } else {
      offsetX = (toolWidth / 2) - 1;
    }
  
    // Use same offset logic as overlay for Y axis
    let offsetY: number;
    if (toolHeight % 2 === 1) {
      offsetY = Math.floor(toolHeight / 2);
    } else {
      offsetY = (toolHeight / 2) - 1;
    }
  
    const topLeftX = coord.x - offsetX;
    const topLeftY = coord.y - offsetY;
  
    // Check for overlap with existing placed tools
    const overlaps = placedSprites.some(({ x, y, tool: placedTool }) => {
      return !(
        topLeftX + toolWidth <= x ||
        topLeftY + toolHeight <= y ||
        topLeftX >= x + placedTool.w ||
        topLeftY >= y + placedTool.h
      );
    });
  
    if (overlaps) return;
  
    // Add to placed sprites list
    setPlacedSprites((prev) => [
      ...prev,
      { x: topLeftX, y: topLeftY, tool },
    ]);
  };
  

  return (
    <div className="relative md:w-5/6 w-full h-full overflow-auto">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      {/* Tile coordinate tooltip */}
      {coord && (
        <div className="fixed bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs shadow backdrop-blur pointer-events-none">
          ({coord.x}, {coord.y})
        </div>
      )}
    </div>
  );
}
