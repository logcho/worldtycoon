"use client";

import { useEffect, useRef } from "react";
import { GameMap } from "@/game/gameMap"
const TILE_SIZE = 16;
const MAP_WIDTH = 120;
const MAP_HEIGHT = 100;
const TILESET_URL = "/images/tilesets/micropolis_tiles.png";

export default function GameCanvas(){
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const map = new GameMap(MAP_WIDTH, MAP_HEIGHT);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
    
        canvas.width = MAP_WIDTH * TILE_SIZE;
        canvas.height = MAP_HEIGHT * TILE_SIZE;
    
        const img = new Image();
        img.src = TILESET_URL;
    
        img.onload = () => {
          for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
              const tileValue = map.getTileValue(x, y);
              const sx = (tileValue % 32) * TILE_SIZE;
              const sy = Math.floor(tileValue / 32) * TILE_SIZE;
    
              ctx.drawImage(
                img,
                sx,
                sy,
                TILE_SIZE,
                TILE_SIZE,
                x * TILE_SIZE,
                y * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
              );
            }
          }
        };
      }, []);


    return (
        <div className="md:w-5/6 md:h-full w-full h-5/6 bg-green-400 overflow-auto">
            <canvas ref={canvasRef} />
        </div>
    )
}