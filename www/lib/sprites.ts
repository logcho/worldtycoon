import { Spritesheet, Texture } from "pixi.js";

export const TOOL_FRAMES = [
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
] as const;

let cachedToolsSpritesheet: Spritesheet | null = null;

export const loadToolsSpritesheet = async () => {
  if (cachedToolsSpritesheet) {
    return cachedToolsSpritesheet;
  }

  const texture = Texture.from("/images/tools.png");

  const frames = TOOL_FRAMES.map(({ x, y, w, h }) => ({
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
  cachedToolsSpritesheet = sheet;
  return sheet;
};

export const isOverlapping = (
  x1: number,
  y1: number,
  size1: number,
  x2: number,
  y2: number,
  size2: number,
): boolean => {
  // Calculate the boundaries of both tools
  const tool1Left = x1 - Math.floor((size1 - 1) / 2);
  const tool1Right = x1 + Math.floor(size1 / 2);
  const tool1Top = y1 - Math.floor((size1 - 1) / 2);
  const tool1Bottom = y1 + Math.floor(size1 / 2);

  const tool2Left = x2 - Math.floor((size2 - 1) / 2);
  const tool2Right = x2 + Math.floor(size2 / 2);
  const tool2Top = y2 - Math.floor((size2 - 1) / 2);
  const tool2Bottom = y2 + Math.floor(size2 / 2);

  // Check if the tools overlap
  return !(
    tool1Right < tool2Left ||
    tool1Left > tool2Right ||
    tool1Bottom < tool2Top ||
    tool1Top > tool2Bottom
  );
};
