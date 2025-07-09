"use client";

import { useRef, useEffect, useState } from "react";
import type { Tool } from "@/config/tools";
import { Hex, stringToHex } from "viem";
import { HEIGHT, WIDTH, TILE_SIZE } from "@/config/constants";
import { tileAnimations } from "@/config/animation-tiles";
import { fixedsys } from "@/lib/fonts";
const TILESET_URL = "/images/tilesets/micropolis_tiles.png";
const TOOLSET_URL = "/images/tools/tools.png";

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

export type PlacedSprite = {
  x: number;
  y: number;
  tool: Tool;
};

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
}: {
  tool?: Tool;
  defaultMap: Hex;
  mapValue: Hex;
  setInput: (hex: Hex | undefined) => void;
  write: () => void;
  building: boolean;
  batching: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tilesetRef = useRef<HTMLImageElement | null>(null);
  const toolsetRef = useRef<HTMLImageElement | null>(null);
  const animatedTilesRef = useRef<Tile[]>([]);

  const [coord, setCoord] = useState<{ x: number; y: number } | null>(null);
  const [placedSprites, setPlacedSprites] = useState<PlacedSprite[]>([]);

  const [isDragging, setIsDragging] = useState(false);

  const hexMap = mapValue ?? defaultMap;
  const pairs = hexMap.substring(2).match(/.{1,4}/g);
  const map = new Uint16Array(pairs!.map((pair) => parseInt(pair, 16)));

  // Set canvas size once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = WIDTH * TILE_SIZE;
      canvas.height = HEIGHT * TILE_SIZE;
    }
  }, []);

  // Load tileset and toolset images
  useEffect(() => {
    const tilesetImg = new Image();
    tilesetImg.src = TILESET_URL;
    tilesetImg.onload = () => {
      tilesetRef.current = tilesetImg;
      draw(coord); // Populate animatedTilesRef early
    };

    const toolsetImg = new Image();
    toolsetImg.src = TOOLSET_URL;
    toolsetImg.onload = () => {
      toolsetRef.current = toolsetImg;
      draw(coord);
    };
  }, []);

  // Redraw when hover coord, placed sprites or map change
  useEffect(() => {
    draw(coord);
  }, [coord, placedSprites, map]);

  // Animation loop: redraw full map + overlay + animation every frame
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      const canvas = canvasRef.current;
      const tilesetImg = tilesetRef.current;
      if (!canvas || !tilesetImg) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw static tiles, placed tools, and overlay
      draw(coord);
      // Draw animated tiles on top
      drawAnimation(ctx, tilesetImg);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Draw once before starting animation loop to initialize animatedTilesRef
    draw(coord);

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [coord, placedSprites, map]);

  const draw = (hoverCoord: { x: number; y: number } | null) => {
    const canvas = canvasRef.current;
    const tilesetImg = tilesetRef.current;
    const toolsetImg = toolsetRef.current;
    if (!canvas || !tilesetImg || !toolsetImg) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas before drawing fresh frame
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
        const tileCode = decodeTile(col, row, map[idx]);
        const sx = (tileCode.type % tilesetCols) * TILE_SIZE;
        const sy = Math.floor(tileCode.type / tilesetCols) * TILE_SIZE;
        const dx = col * TILE_SIZE;
        const dy = row * TILE_SIZE;

        ctx.drawImage(tilesetImg, sx, sy, TILE_SIZE, TILE_SIZE, dx, dy, TILE_SIZE, TILE_SIZE);
        if (tileCode.animated) animatedTiles.push(tileCode);
      }
    }

    animatedTilesRef.current = animatedTiles;

    if (!toolsetRef.current) return;
    ctx.save();
    ctx.globalAlpha = 0.4;
    placedSprites.forEach(({ x, y, tool }) => {
      const sx = tool.x * TILE_SIZE;
      const sy = tool.y * TILE_SIZE;
      const sw = tool.w * TILE_SIZE;
      const sh = tool.h * TILE_SIZE;
    
      // Apply offset **when drawing**, NOT when recording
      const offsetX = tool.w % 2 === 1 ? Math.floor(tool.w / 2) : tool.w / 2 - 1;
      const offsetY = tool.h % 2 === 1 ? Math.floor(tool.h / 2) : tool.h / 2 - 1;
    
      const dx = (x - offsetX) * TILE_SIZE;
      const dy = (y - offsetY) * TILE_SIZE;
    
      ctx.drawImage(toolsetRef.current!, sx, sy, sw, sh, dx, dy, sw, sh);
    });
    
    ctx.restore();
  };

  const drawOverlay = (
    ctx: CanvasRenderingContext2D,
    toolImage: HTMLImageElement,
    tool: Tool | undefined,
    mouseTilePos: { x: number; y: number } | null
  ) => {
    if (!tool || !mouseTilePos) return;

    const sourceX = tool.x * TILE_SIZE;
    const sourceY = tool.y * TILE_SIZE;
    const sourceWidth = tool.w * TILE_SIZE;
    const sourceHeight = tool.h * TILE_SIZE;

    const offsetX = tool.w % 2 === 1 ? Math.floor(tool.w / 2) : tool.w / 2 - 1;
    const offsetY = tool.h % 2 === 1 ? Math.floor(tool.h / 2) : tool.h / 2 - 1;
    const destX = (mouseTilePos.x - offsetX) * TILE_SIZE;
    const destY = (mouseTilePos.y - offsetY) * TILE_SIZE;

    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.drawImage(toolImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, sourceWidth, sourceHeight);
    ctx.restore();
  };

  const drawAnimation = (ctx: CanvasRenderingContext2D, tilesetImg: HTMLImageElement) => {
    const tilesetCols = Math.floor(tilesetImg.width / TILE_SIZE);
    const animatedTiles = animatedTilesRef.current;
    if (!animatedTiles || animatedTiles.length === 0) return;

    for (const tile of animatedTiles) {
      const sequence = tileAnimations[tile.type];
      if (!sequence || sequence.length === 0) continue;
    
      const frameDuration = 100;
      const totalFrames = sequence.length;
      const now = performance.now();
    
      // Loop frame index within the sequence length
      const frame = Math.floor((now % (frameDuration * totalFrames)) / frameDuration);
    
      const currentFrame = sequence[frame];
      const sx = (currentFrame % tilesetCols) * TILE_SIZE;
      const sy = Math.floor(currentFrame / tilesetCols) * TILE_SIZE;
      const dx = tile.x * TILE_SIZE;
      const dy = tile.y * TILE_SIZE;

      ctx.drawImage(tilesetImg, sx, sy, TILE_SIZE, TILE_SIZE, dx, dy, TILE_SIZE, TILE_SIZE);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    const newCoord = { x, y };
    if (!coord || coord.x !== x || coord.y !== y) {
      setCoord(newCoord);
    }  
    // Only drag if tool is size 1x1 and dragging is active
    if (isDragging && tool && tool.w === 1 && tool.h === 1) {
      const alreadyPlaced = placedSprites.some((s) => s.x === x && s.y === y);
      if (!alreadyPlaced) {
        setPlacedSprites((prev) => [...prev, { x, y, tool }]);
      }
    }
  
    if (tool && building) {
      const input = `{"method":"doTool","tool":${tool.index},"x":${x},"y":${y}}`;
      setInput(stringToHex(input));
    }
   
  };
  
  const handleMouseDown = () => {
    if (!coord || !tool) return;
    if (tool.w === 1 && tool.h === 1) {
      setIsDragging(true);
      const alreadyPlaced = placedSprites.some((s) => s.x === coord.x && s.y === coord.y);
      if (!alreadyPlaced) {
        setPlacedSprites((prev) => [...prev, { x: coord.x, y: coord.y, tool }]);
      }
    }
  };
  
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if(building) write();
    }
  };

  const handleMouseLeave = () => setCoord(null);

  const handleClick = () => {
    if (!coord || !tool) return;
    placeTool();
    if(building) write();
  };

  const placeTool = () => {
    if (!coord || !tool) return;

    // Record the actual clicked coordinate
    const actualX = coord.x;
    const actualY = coord.y;

    const overlaps = placedSprites.some(({ x, y, tool: placedTool }) => {
    const placedOffsetX = placedTool.w % 2 === 1 ? Math.floor(placedTool.w / 2) : placedTool.w / 2 - 1;
    const placedOffsetY = placedTool.h % 2 === 1 ? Math.floor(placedTool.h / 2) : placedTool.h / 2 - 1;

    const placedTopLeftX = x - placedOffsetX;
    const placedTopLeftY = y - placedOffsetY;

    const newOffsetX = tool.w % 2 === 1 ? Math.floor(tool.w / 2) : tool.w / 2 - 1;
    const newOffsetY = tool.h % 2 === 1 ? Math.floor(tool.h / 2) : tool.h / 2 - 1;
    const newTopLeftX = actualX - newOffsetX;
    const newTopLeftY = actualY - newOffsetY;
      return !(
        newTopLeftX + tool.w <= placedTopLeftX ||
        newTopLeftY + tool.h <= placedTopLeftY ||
        newTopLeftX >= placedTopLeftX + placedTool.w ||
        newTopLeftY >= placedTopLeftY + placedTool.h
      );
    });

    if (overlaps) return;

    setPlacedSprites((prev) => [...prev, { x: actualX, y: actualY, tool }]);
  };

  useEffect(() => {
    if (batching) {
      if (placedSprites.length === 0) return; // nothing to send yet
  
      // Split into parallel arrays
      const tools = placedSprites.map(s => s.tool.index);  // or s.tool.index if that’s your field
      const xs    = placedSprites.map(s => s.x); 
      const ys    = placedSprites.map(s => s.y); 
  
      // Build the payload and hex‑encode it
      const payload = {
        method: "batchTool",
        tools,
        xs,
        ys,
      };
  
      setInput(stringToHex(JSON.stringify(payload)));
      console.log("Payload: ",payload);
    } else {
      // batching just turned off → clear the local stash
      setPlacedSprites([]);
    }
  }, [batching, placedSprites]);
  

  return (
    <div className="relative md:w-5/6 w-full h-full overflow-auto">
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
