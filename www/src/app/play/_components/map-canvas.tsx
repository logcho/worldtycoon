/*
  MapCanvas.tsx
  ------------------
  This React component renders a tile-based map using a canvas element. It supports animated tiles,
  tool overlays, mouse interaction for placing tools, and batching tool placement into hex-encoded payloads.
*/

"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import type { Tool } from "@/config/tools";
import { Hex, stringToHex } from "viem";
import { HEIGHT, WIDTH, TILE_SIZE } from "@/config/constants";
import { tileAnimations, animationFrameToKey } from "@/config/animation-tiles";
import { fixedsys } from "@/lib/fonts";
import type { PlacedSprite } from "./stage-area";
// Image paths
const TILESET_URL = "/images/tilesets/micropolis_tiles.png";
const TOOLSET_URL = "/images/tools/tools.png";

// Tile definition type
export type Tile = {
  x: number;
  y: number;
  powered: boolean;
  conductor: boolean;
  burnable: boolean;
  bulldozable: boolean;
  animated: boolean;
  center: boolean;
  type: number;
};

// Decode raw tile data into tile metadata
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

export default function MapCanvas({
  tool,
  defaultMap,
  mapValue,
  setInput,
  write,
  building,
  batching,
  placedSprites,
  setPlacedSprites,
}: {
  tool?: Tool;
  defaultMap: Hex;
  mapValue: Hex;
  setInput: (hex: Hex | undefined) => void;
  write: () => void;
  building: boolean;
  batching: boolean;
  placedSprites: PlacedSprite[];
  setPlacedSprites: React.Dispatch<React.SetStateAction<PlacedSprite[]>>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tilesetRef = useRef<HTMLImageElement | null>(null);
  const toolsetRef = useRef<HTMLImageElement | null>(null);
  const animatedTilesRef = useRef<Tile[]>([]);
  const coordRef = useRef<{ x: number; y: number } | null>(null);

  const [coord, setCoord] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const hexMap = mapValue ?? defaultMap;
  const map = useMemo(() => {
    const pairs = hexMap.substring(2).match(/.{1,4}/g) || [];
    return new Uint16Array(pairs.map((pair) => parseInt(pair, 16)));
  }, [hexMap]);

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = WIDTH * TILE_SIZE;
      canvas.height = HEIGHT * TILE_SIZE;
    }
  }, []);

  // Load tileset/toolset
  useEffect(() => {
    const tilesetImg = new Image();
    const toolsetImg = new Image();

    tilesetImg.src = TILESET_URL;
    toolsetImg.src = TOOLSET_URL;

    tilesetImg.onload = () => {
      tilesetRef.current = tilesetImg;
      draw(coord);
    };

    toolsetImg.onload = () => {
      toolsetRef.current = toolsetImg;
      draw(coord);
    };
  }, []);

  useEffect(() => {
    draw(coord);
  }, [coord, placedSprites, map]);

  // Animation loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      const canvas = canvasRef.current;
      const tilesetImg = tilesetRef.current;
      if (!canvas || !tilesetImg) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      draw(coord);
      drawAnimation(ctx, tilesetImg);
      animationFrameId = requestAnimationFrame(animate);
    };

    draw(coord);
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [coord, placedSprites, map]);

  // Update batch payload when placedSprites changes and batching is on
  useEffect(() => {
    if (!batching || placedSprites.length === 0) return;

    const payload = {
      method: "batchTool",
      tools: placedSprites.map((s) => s.tool.index),
      xs: placedSprites.map((s) => s.x),
      ys: placedSprites.map((s) => s.y),
    };

    setInput(stringToHex(JSON.stringify(payload)));
    console.log("Payload:", payload);
  }, [placedSprites, batching]);

  // Clear placedSprites only when batching turns off
  useEffect(() => {
    if (!batching) {
      setPlacedSprites([]); // Only when batching is turned off
    }
  }, [batching]);


  const draw = (hoverCoord: { x: number; y: number } | null) => {
    const canvas = canvasRef.current;
    const tilesetImg = tilesetRef.current;
    const toolsetImg = toolsetRef.current;
    if (!canvas || !tilesetImg || !toolsetImg) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(ctx, tilesetImg);
    drawOverlay(ctx, toolsetImg, tool, hoverCoord);
  };

  const drawMap = (ctx: CanvasRenderingContext2D, tilesetImg: HTMLImageElement) => {
    const tilesetCols = Math.floor(tilesetImg.width / TILE_SIZE);
    const animatedTiles: Tile[] = [];

    for (let row = 0; row < HEIGHT; row++) {
      for (let col = 0; col < WIDTH; col++) {
        const idx = col * HEIGHT + row;
        const tile = decodeTile(col, row, map[idx]);
        const sx = (tile.type % tilesetCols) * TILE_SIZE;
        const sy = Math.floor(tile.type / tilesetCols) * TILE_SIZE;
        ctx.drawImage(tilesetImg, sx, sy, TILE_SIZE, TILE_SIZE, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        if (tile.animated) animatedTiles.push(tile);
      }
    }
    animatedTilesRef.current = animatedTiles;

    ctx.save();
    ctx.globalAlpha = 0.4;
    placedSprites.forEach(({ x, y, tool }) => {
      const sx = tool.x * TILE_SIZE;
      const sy = tool.y * TILE_SIZE;
      const sw = tool.w * TILE_SIZE;
      const sh = tool.h * TILE_SIZE;
      const offsetX = tool.w % 2 === 1 ? Math.floor(tool.w / 2) : tool.w / 2 - 1;
      const offsetY = tool.h % 2 === 1 ? Math.floor(tool.h / 2) : tool.h / 2 - 1;
      const dx = (x - offsetX) * TILE_SIZE;
      const dy = (y - offsetY) * TILE_SIZE;
      ctx.drawImage(toolsetRef.current!, sx, sy, sw, sh, dx, dy, sw, sh);
    });
    ctx.restore();
  };

  const drawOverlay = (ctx: CanvasRenderingContext2D, toolImage: HTMLImageElement, tool: Tool | undefined, tilePos: { x: number; y: number } | null) => {
    if (!tool || !tilePos) return;

    const sx = tool.x * TILE_SIZE;
    const sy = tool.y * TILE_SIZE;
    const sw = tool.w * TILE_SIZE;
    const sh = tool.h * TILE_SIZE;
    const offsetX = tool.w % 2 === 1 ? Math.floor(tool.w / 2) : tool.w / 2 - 1;
    const offsetY = tool.h % 2 === 1 ? Math.floor(tool.h / 2) : tool.h / 2 - 1;
    const dx = (tilePos.x - offsetX) * TILE_SIZE;
    const dy = (tilePos.y - offsetY) * TILE_SIZE;

    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.drawImage(toolImage, sx, sy, sw, sh, dx, dy, sw, sh);
    ctx.restore();
  };

  const drawAnimation = (ctx: CanvasRenderingContext2D, tilesetImg: HTMLImageElement) => {
    const tilesetCols = Math.floor(tilesetImg.width / TILE_SIZE);
    const now = performance.now();
    const frameDuration = 100;

    animatedTilesRef.current.forEach(tile => {
      const animationKey = animationFrameToKey[tile.type]
      const sequence = tileAnimations[animationKey];
      if (!sequence || sequence.length === 0) return;
      const frame = Math.floor((now % (frameDuration * sequence.length)) / frameDuration);
      const currentFrame = sequence[frame];
      const sx = (currentFrame % tilesetCols) * TILE_SIZE;
      const sy = Math.floor(currentFrame / tilesetCols) * TILE_SIZE;
      const dx = tile.x * TILE_SIZE;
      const dy = tile.y * TILE_SIZE;
      ctx.drawImage(tilesetImg, sx, sy, TILE_SIZE, TILE_SIZE, dx, dy, TILE_SIZE, TILE_SIZE);
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    const newCoord = { x, y };

    if (!coordRef.current || coordRef.current.x !== x || coordRef.current.y !== y) {
      coordRef.current = newCoord;
      setCoord(newCoord);
    }

    if (isDragging && tool && tool.w === 1 && tool.h === 1) {
      const alreadyPlaced = placedSprites.some(s => s.x === x && s.y === y);
      if (!alreadyPlaced && !isOverlapping(x, y, tool)) {
        setPlacedSprites(prev => [...prev, { x, y, tool }]);
      }
    }

    if (tool && building) {
      const input = `{"method":"doTool","tool":${tool.index},"x":${x},"y":${y}}`;
      setInput(stringToHex(input));
    }
  };

  const handleMouseDown = () => {
    if (!coord || !tool) return;
    if (tool.size === 1) {
      setIsDragging(true);
      const alreadyPlaced = placedSprites.some(s => s.x === coord.x && s.y === coord.y);
      if (!alreadyPlaced && batching) setPlacedSprites(prev => [...prev, { x: coord.x, y: coord.y, tool }]);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (building) write();
    }
  };

  const handleClick = () => {
    if (!coord || !tool) return;
    if (!isOverlapping(coord.x, coord.y, tool)) {
      if (building) write();
      if(batching) setPlacedSprites(prev => [...prev, { x: coord.x, y: coord.y, tool }]);
    }
  };

  const handleMouseLeave = () => setCoord(null);

  const isOverlapping = (newX: number, newY: number, newTool: Tool) => {
    const newTopLeftX = newX - (newTool.w % 2 === 1 ? Math.floor(newTool.w / 2) : newTool.w / 2 - 1);
    const newTopLeftY = newY - (newTool.h % 2 === 1 ? Math.floor(newTool.h / 2) : newTool.h / 2 - 1);
    const newBottomRightX = newTopLeftX + newTool.w;
    const newBottomRightY = newTopLeftY + newTool.h;

    return placedSprites.some(({ x, y, tool }) => {
      const topLeftX = x - (tool.w % 2 === 1 ? Math.floor(tool.w / 2) : tool.w / 2 - 1);
      const topLeftY = y - (tool.h % 2 === 1 ? Math.floor(tool.h / 2) : tool.h / 2 - 1);
      const bottomRightX = topLeftX + tool.w;
      const bottomRightY = topLeftY + tool.h;

      return !(newBottomRightX <= topLeftX || newTopLeftX >= bottomRightX || newBottomRightY <= topLeftY || newTopLeftY >= bottomRightY);
    });
  };

  return (
    <div className="relative md:w-5/6 w-full h-full overflow-auto custom-scroll">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      {coord && (
        <div className={`${fixedsys.className} fixed md:bottom-4 md:right-4 bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-xs shadow backdrop-blur pointer-events-none`}>
          ({coord.x}, {coord.y})
        </div>
      )}
    </div>
  );
}
