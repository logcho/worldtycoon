"use client";

import * as React from "react";

import { Sprite } from "@pixi/react";
import { Spritesheet, Texture } from "pixi.js";

import type { PixiRef } from "@pixi/react";

import { TOOLS } from "~/config/tools";
import { useEventListener } from "~/hooks/use-event-listner";
import { useStore } from "~/hooks/use-store";

let cachedSpritesheet: Spritesheet | null = null;

export const ToolOverlay: React.FC<{
  coordinates: { x: number; y: number };
}> = ({ coordinates }) => {
  const spriteRef = React.useRef<PixiRef<typeof Sprite> | null>(null);
  const [spritesheet, setSpritesheet] = React.useState<Spritesheet | null>(
    null,
  );

  const { tool } = useStore();

  React.useEffect(() => {
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
          {},
        ),
        meta: { scale: "1" },
      });

      await sheet.parse();
      cachedSpritesheet = sheet;
      setSpritesheet(sheet);
    };

    void loadSpritesheet();
  }, []);

  useEventListener("pointermove", () => {
    if (spriteRef.current) {
      spriteRef.current.x =
        16 * (coordinates.x - Math.floor((TOOLS[tool]!.size - 1) / 2));
      spriteRef.current.y =
        16 * (coordinates.y - Math.floor((TOOLS[tool]!.size - 1) / 2));
    }
  });

  return spritesheet ?
      <Sprite
        ref={spriteRef}
        texture={spritesheet.textures[tool]}
        visible={tool !== null}
      />
    : null;
};
