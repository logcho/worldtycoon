"use client";

import { Spritesheet, Texture } from "pixi.js";
import React, { FC, useEffect, useState, useRef } from "react";
import { Sprite } from "@pixi/react";
import { tools } from "../models/Tool";

// Cache the spritesheet to avoid re-parsing
let cachedSpritesheet: Spritesheet | null = null;

export type ToolOverlayProps = {
    tool: number;
    x?: number;
    y?: number;
};

export const ToolOverlay: FC<ToolOverlayProps> = ({ tool, x = 0, y = 0 }) => {
    const [spritesheet, setSpritesheet] = useState<Spritesheet | null>(null);
    const spriteRef = useRef<any>(null);

    // Load the spritesheet only once
    useEffect(() => {
        if (cachedSpritesheet) {
            setSpritesheet(cachedSpritesheet);
            return;
        }

        const loadSpritesheet = async () => {
            const texture = Texture.from("/images/tools.png");
            const frames = [
                { x: 0, y: 0, w: 3, h: 3 },
                { x: 3, y: 0, w: 3, h: 3 },
                { x: 6, y: 0, w: 3, h: 3 },
                { x: 0, y: 3, w: 3, h: 3 },
                { x: 3, y: 3, w: 3, h: 3 },
                { x: 6, y: 3, w: 1, h: 1 },
                { x: 7, y: 3, w: 1, h: 1 },
                { x: 8, y: 3, w: 1, h: 1 },
                { x: 6, y: 4, w: 1, h: 1 },
                { x: 7, y: 4, w: 1, h: 1 },
                { x: 0, y: 6, w: 4, h: 4 },
                { x: 8, y: 4, w: 1, h: 1 },
                { x: 4, y: 6, w: 4, h: 4 },
                { x: 0, y: 10, w: 4, h: 4 },
                { x: 4, y: 10, w: 4, h: 4 },
                { x: 0, y: 14, w: 6, h: 6 },
                { x: 7, y: 3, w: 1, h: 1 },
                { x: 6, y: 5, w: 1, h: 1 },
                { x: 7, y: 5, w: 1, h: 1 },
                { x: 8, y: 5, w: 1, h: 1 },
            ].map(({ x, y, w, h }) => ({
                frame: { x: 16 * x, y: 16 * y, w: 16 * w, h: 16 * h },
            }));

            const sheet = new Spritesheet(texture, {
                frames: frames.reduce(
                    (acc, frame, index) => ({ ...acc, [index]: frame }),
                    {}
                ),
                meta: {
                    scale: "1",
                },
            });

            await sheet.parse();
            cachedSpritesheet = sheet;
            setSpritesheet(sheet);
        };

        loadSpritesheet();
    }, []);

    // Update sprite position using ref
    useEffect(() => {
        if (spriteRef.current) {
            spriteRef.current.x = 16 * (x - Math.floor((tools[tool].size - 1) / 2));
            spriteRef.current.y = 16 * (y - Math.floor((tools[tool].size - 1) / 2));
        }
    }, [tool, x, y]);

    return spritesheet ? (
        <Sprite
            ref={spriteRef}
            texture={spritesheet.textures[tool]}
            visible={tool >= 0}
        />
    ) : null;
};
