"use client";

import { useRef, useEffect, useMemo } from "react";
import { Hex } from "viem";
import { WIDTH, HEIGHT, TILE_SIZE } from "@/config/constants";

const TILESET_URL = "/images/tilesets/micropolis_tiles.png";

type Tile = {
  x: number;
  y: number;
  type: number;
};

const decodeTile = (x: number, y: number, tile: number): Tile => ({
  x,
  y,
  type: tile & 0x03ff,
});

export default function MiniMap({ mapValue }: { mapValue?: Hex }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tilesetRef = useRef<HTMLImageElement | null>(null);

  // Parse map or fallback to all 0x0000 tiles
  const map = useMemo(() => {
    if (!mapValue) {
      return new Uint16Array(WIDTH * HEIGHT); // filled with 0s by default
    }

    const hexStr = mapValue.substring(2); // remove "0x"
    const pairs = hexStr.match(/.{1,4}/g) || [];
    return new Uint16Array(pairs.map((pair) => parseInt(pair, 16)));
  }, [mapValue]);

  // Setup canvas size and draw when tileset is loaded
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = WIDTH * TILE_SIZE;
      canvas.height = HEIGHT * TILE_SIZE;
    }

    const img = new Image();
    img.src = TILESET_URL;
    img.onload = () => {
      tilesetRef.current = img;
      drawMap();
    };
  }, [map]);

  const drawMap = () => {
    const canvas = canvasRef.current;
    const tileset = tilesetRef.current;
    if (!canvas || !tileset) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tilesetCols = Math.floor(tileset.width / TILE_SIZE);

    for (let row = 0; row < HEIGHT; row++) {
      for (let col = 0; col < WIDTH; col++) {
        const idx = col * HEIGHT + row;
        const tile = decodeTile(col, row, map[idx]);
        const sx = (tile.type % tilesetCols) * TILE_SIZE;
        const sy = Math.floor(tile.type / tilesetCols) * TILE_SIZE;
        const dx = col * TILE_SIZE;
        const dy = row * TILE_SIZE;
        ctx.drawImage(tileset, sx, sy, TILE_SIZE, TILE_SIZE, dx, dy, TILE_SIZE, TILE_SIZE);
      }
    }
  };

  return (
    <div className="relative w-[120px] h-[100px] overflow-hidden border border-white/20">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 scale-[0.0625] origin-top-left"
      />
    </div>
  );
}
