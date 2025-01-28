"use client";

import * as React from "react";

import { Sprite } from "@pixi/react";
import { Spritesheet, Texture } from "pixi.js";

import type { Hex } from "viem";

import { HEIGHT, WIDTH } from "~/config/constants";

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
  loading?: boolean;
  onMouseMove?: (tile: Tile) => void;
  onMouseClick?: (tile: Tile) => void;
}> = ({ value, onMouseMove }) => {
  const [spritesheet, setSpritesheet] = React.useState<Spritesheet | null>(
    null,
  );

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

    console.log({ sheet });

    sheet
      .parse()
      .then(() => setSpritesheet(sheet))
      .catch(console.error);
  }, []);

  const TileImage = (x: number, y: number) => {
    const t = map[x * 100 + y] ?? 0;
    const tile = decodeTile(x, y, t);
    const coord = `(${x},${y})`;

    return spritesheet ?
        <Sprite
          key={coord}
          eventMode="static"
          // cursor={loading ? "wait" : "cell"}
          texture={spritesheet.textures[tile.type]}
          // onpointerdown={(_event) => {
          //     onMouseClick && onMouseClick(tile);
          // }}
          onpointermove={() => onMouseMove?.(tile)}
          width={16}
          height={16}
          x={x * 16}
          y={y * 16}
        />
      : <React.Fragment key={coord} />;
  };

  return COORDINATES.map(({ x, y }) => TileImage(x, y));
};
