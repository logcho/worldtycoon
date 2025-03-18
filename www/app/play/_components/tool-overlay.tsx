"use client";

import * as React from "react";

import { Container, Sprite, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";

import type { PixiRef } from "@pixi/react";
import type { Spritesheet } from "pixi.js";

import type { Tool } from "~/config/tools";

import { TOOLS } from "~/config/tools";
import { loadToolsSpritesheet } from "~/lib/sprites";
import { Hex } from "viem";

export const ToolOverlay: React.FC<{
  selectedTool?: Tool;
  coordinates: { x: number; y: number };
  scale: number;
  position: { x: number; y: number };
}> = ({ selectedTool, coordinates, scale, position }) => {
  const spriteRef = React.useRef<PixiRef<typeof Sprite>>(null);
  const [spritesheet, setSpritesheet] = React.useState<Spritesheet | null>(
    null,
  );

  React.useEffect(() => {
    loadToolsSpritesheet().then(setSpritesheet).catch(console.error);
  }, []);

  React.useEffect(() => {
    if (spriteRef.current && selectedTool) {
      const toolIndex = TOOLS.findIndex((t) => t.id === selectedTool.id);
      if (toolIndex !== -1) {
        spriteRef.current.x =
          16 *
            (coordinates.x - Math.floor((selectedTool.size - 1) / 2)) *
            scale +
          position.x;
        spriteRef.current.y =
          16 *
            (coordinates.y - Math.floor((selectedTool.size - 1) / 2)) *
            scale +
          position.y;
      }
    }
  }, [selectedTool, coordinates, scale, position]);

  return (
    <Container>
      {spritesheet && selectedTool && (
        <Sprite
          ref={spriteRef}
          texture={
            spritesheet.textures[
              TOOLS.findIndex((t) => t.id === selectedTool.id)
            ]
          }
          alpha={0.5}
          scale={scale}
        />
      )}
      <Text
        text={`${selectedTool?.label ?? "No Tool"} (${coordinates.x}, ${
          coordinates.y
        })`}
        x={10}
        y={10}
        style={
          new TextStyle({
            fontFamily: "monospace",
            fontSize: 12,
            fill: 0xffffff,
          })
        }
      />
    </Container>
  );
};
