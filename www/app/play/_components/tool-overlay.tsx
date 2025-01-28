"use client";

import * as React from "react";

import { Container, Sprite, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";

import type { PixiRef } from "@pixi/react";
import type { Spritesheet } from "pixi.js";

import type { Tool } from "~/config/tools";

import { TOOLS } from "~/config/tools";
import { loadToolsSpritesheet } from "~/lib/sprites";

export const ToolOverlay: React.FC<{
  selectedTool?: Tool;
  coordinates: { x: number; y: number };
}> = ({ selectedTool, coordinates }) => {
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
          16 * (coordinates.x - Math.floor((selectedTool.size - 1) / 2));
        spriteRef.current.y =
          16 * (coordinates.y - Math.floor((selectedTool.size - 1) / 2));
      }
    }
  }, [selectedTool, coordinates]);

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
