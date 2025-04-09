"use client";

import * as React from "react";
import { FC, useEffect, useRef, useState } from "react";

import { Container, Sprite, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { Hex, stringToHex } from "viem";

import type { PixiRef } from "@pixi/react";
import type { Spritesheet } from "pixi.js";

import type { Tool } from "~/config/tools";

import { TOOLS } from "~/config/tools";
import { loadToolsSpritesheet } from "~/lib/sprites";

export type ToolOverProps = {
  selectedTool?: Tool;
  coordinates: { x: number; y: number };
  endCoordinates: { x: number; y: number };
  startCoordinates: { x: number; y: number };
  scale: number;
  // position: { x: number; y: number };
  setInput?: (input: Hex) => void;
  isBudgeting: boolean;
};
export const ToolOverlay: FC<ToolOverProps> = ({
  selectedTool,
  coordinates,
  endCoordinates,
  startCoordinates,
  scale,
  // position,
  setInput,
  isBudgeting,
}) => {
  const spriteRef = useRef<PixiRef<typeof Sprite>>(null);
  const [spritesheet, setSpritesheet] = useState<Spritesheet | null>(null);

  useEffect(() => {
    loadToolsSpritesheet().then(setSpritesheet).catch(console.error);
  }, []);

  useEffect(() => {
    if (spriteRef.current && selectedTool) {
      const toolIndex = TOOLS.findIndex((t) => t.id === selectedTool.id);
      if (toolIndex !== -1) {
        spriteRef.current.x =
          16 *
          (coordinates.x - Math.floor((selectedTool.size - 1) / 2)) *
          scale;
        // position.x;
        spriteRef.current.y =
          16 *
          (coordinates.y - Math.floor((selectedTool.size - 1) / 2)) *
          scale;
        // position.y;
      }
      if (setInput && !isBudgeting) {
        setInput(
          stringToHex(
            `{"method": "doTool", "x": ${coordinates.x}, "y": ${coordinates.y}, "tool": ${selectedTool.num}}`,
          ),
        );
        const isDraggable =
          selectedTool.num == 5 ||
          selectedTool.num == 6 ||
          selectedTool.num == 8 ||
          selectedTool.num == 9;
        if (isDraggable) {
          if (startCoordinates != endCoordinates) {
            setInput(
              stringToHex(
                `{"method": "dragTool", "fromX": ${startCoordinates.x}, "fromY": ${startCoordinates.y}, "toX": ${endCoordinates.x}, "toY": ${endCoordinates.y}, "tool": ${selectedTool.num}}`,
              ),
            );
          }
        }
        // else if(setInput){
        //   setInput(
        //     stringToHex(
        //       `{"method": "dragTool", "fromX": ${coordinates.x}, "fromY": ${coordinates.y}, "toX": ${endCoordinates.x}, "toY": ${endCoordinates.y}, "tool": ${selectedTool.num}}`,
        //     ),
        //   );
        // }
      }
    }
  }, [selectedTool, coordinates, scale]);

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
