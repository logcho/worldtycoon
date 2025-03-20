"use client";

import * as React from "react";

import { Container, Sprite } from "@pixi/react";
import { Spritesheet, Texture } from "pixi.js";

import type { Hex } from "viem";

import type { Tool } from "~/config/tools";

import { HEIGHT, WIDTH } from "~/config/constants";
import { TOOLS } from "~/config/tools";
import { isOverlapping, loadToolsSpritesheet } from "~/lib/sprites";

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

const ROWS = [...Array(HEIGHT).keys()];
const COLS = [...Array(WIDTH).keys()];
const COORDINATES = Array.from(ROWS, (_, y) =>
  Array.from(COLS, (_, x) => ({ x, y })),
).flat();

export const Map: React.FC<{
  value?: Hex;
  scale: number;
  position: { x: number; y: number };
  coordinates: { x: number; y: number };
  loading?: boolean;
  selectedTool?: Tool;
  onMouseMove?: (tile: Tile) => void;
  write?: () => void;
}> = ({
  value,
  scale,
  position,
  coordinates,
  selectedTool,
  onMouseMove,
  write,
}) => {
  const [spritesheet, setSpritesheet] = React.useState<Spritesheet | null>(
    null,
  );
  const [toolsSpritesheet, setToolsSpritesheet] =
    React.useState<Spritesheet | null>(null);
  const [placedSprites, setPlacedSprites] = React.useState<PlacedSprite[]>([]);

  // default value is a blank map
  value =
    value ??
    `0x${[...Array(WIDTH * HEIGHT).keys()].map(() => "0000").join("")}`;

  // Split the hex string into pairs of characters
  const pairs = value.substring(2).match(/.{1,4}/g);

  // Convert each pair to a decimal number and create a Uint16Array
  const map = new Uint16Array(pairs!.map((pair) => parseInt(pair, 16)));

  // create optimized spritesheet
  React.useLayoutEffect(() => {
    const texture = Texture.from("/images/micropolis_tiles.png");

    const frames = [...Array(1024).keys()].map((i) => ({
      frame: {
        x: (i % 32) * 16,
        y: Math.floor(i / 32) * 16,
        w: 16,
        h: 16,
      },
    }));

    const sheet = new Spritesheet(texture, {
      frames: frames.reduce(
        (acc, frame, index) => ({ ...acc, [index]: frame }),
        {},
      ),
      meta: { scale: "1" },
    });

    sheet
      .parse()
      .then(() => setSpritesheet(sheet))
      .catch(console.error);
  }, []);

  // Load tools spritesheet
  React.useLayoutEffect(() => {
    loadToolsSpritesheet().then(setToolsSpritesheet).catch(console.error);
  }, []);

  const handleTileClick = (x: number, y: number) => {
    // @logcho here you can use coordinates
    if (selectedTool) {
      // Check if the new tool would overlap with any existing tools
      const wouldOverlap = placedSprites.some((sprite) =>
        isOverlapping(
          x,
          y,
          selectedTool.size,
          sprite.x,
          sprite.y,
          sprite.tool.size,
        ),
      );

      if (!wouldOverlap) {
        setPlacedSprites((prev) => [...prev, { x, y, tool: selectedTool }]);
        write && write();
      }
    }
  };

  const TileImage = (x: number, y: number) => {
    const t = map[x * 100 + y] ?? 0;
    const tile = decodeTile(x, y, t);
    const coord = `(${x},${y})`;

    return spritesheet ?
        <Container>
          <Sprite
            key={coord}
            eventMode="static"
            cursor={selectedTool ? "pointer" : "default"}
            texture={spritesheet.textures[tile.type]}
            x={x * 16 * scale}
            y={y * 16 * scale}
            scale={scale}
            onmousemove={() => onMouseMove?.(tile)}
            onclick={() => handleTileClick(x, y)}
          />
        </Container>
      : null;
  };

  return (
    <Container position={[position.x, position.y]}>
      {COORDINATES.map(({ x, y }) => TileImage(x, y))}
      {toolsSpritesheet &&
        placedSprites.map((sprite, index) => {
          const toolIndex = TOOLS.findIndex((t) => t.id === sprite.tool.id);
          if (toolIndex === -1) return null;

          return (
            <Container
              key={index}
              x={
                16 * (sprite.x - Math.floor((sprite.tool.size - 1) / 2)) * scale
              }
              y={
                16 * (sprite.y - Math.floor((sprite.tool.size - 1) / 2)) * scale
              }
            >
              <Sprite
                texture={toolsSpritesheet.textures[toolIndex]}
                scale={scale}
              />
            </Container>
          );
        })}
    </Container>
  );
};
