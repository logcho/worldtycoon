import { assert } from "./debugAssert";
import { Position } from "./position";

/**
 * Represents a rectangular bounded region defined by an inclusive start coordinate (x, y)
 * and a width and height specifying the size of the region.
 * Coordinates within the bounds satisfy:
 *    inclusiveStartX <= x < exclusiveEndX
 *    inclusiveStartY <= y < exclusiveEndY
 */
export class Bounds {
  
  /**
   * Creates a new Bounds object starting at origin (0,0) with specified width and height.
   * 
   * @param width Width of the bounds (must be > 0)
   * @param height Height of the bounds (must be > 0)
   * @returns A new Bounds instance at origin with given size
   */
  static fromOrigin(width: number, height: number): Bounds {
    return new Bounds(0, 0, width, height);
  }

  private readonly exclusiveEndX: number;
  private readonly exclusiveEndY: number;

  /**
   * Constructs a Bounds instance with the specified starting coordinates and size.
   * 
   * @param inclusiveStartX The inclusive starting X coordinate (left edge)
   * @param inclusiveStartY The inclusive starting Y coordinate (top edge)
   * @param widthCount Width of the bounded region (must be > 0)
   * @param heightCount Height of the bounded region (must be > 0)
   */
  constructor(
    private readonly inclusiveStartX: number,
    private readonly inclusiveStartY: number,
    widthCount: number,
    heightCount: number
  ) {
    assert(widthCount > 0, "bounded region must have a width");
    assert(heightCount > 0, "bounded region must have a height");

    this.exclusiveEndX = inclusiveStartX + widthCount;
    this.exclusiveEndY = inclusiveStartY + heightCount;
  }

  /**
   * Determines whether the provided Position is contained within the bounds.
   * The bounds are inclusive at the start, exclusive at the end.
   * 
   * @param position The Position to test for containment
   * @returns True if the position lies inside the bounds, false otherwise
   */
  contains(position: Position): boolean {
    const { x, y } = position;
    return this.xInBounds(x) && this.yInBounds(y);
  }

  /**
   * Returns a string representation of the bounds showing
   * the top-left and bottom-right corners (inclusive coordinates).
   * 
   * @returns String representation of the bounds
   */
  toString(): string {
    const upperCorner = new Position(this.inclusiveStartX, this.inclusiveStartY);
    const lowerCorner = new Position(this.exclusiveEndX - 1, this.exclusiveEndY - 1);
    return `Bounds Rectangle: ${upperCorner} - ${lowerCorner}`;
  }

  /**
   * Checks if the given x coordinate lies within the horizontal bounds.
   * 
   * @param x X coordinate to check
   * @returns True if x is inside bounds, false otherwise
   */
  private xInBounds(x: number): boolean {
    return x >= this.inclusiveStartX && x < this.exclusiveEndX;
  }

  /**
   * Checks if the given y coordinate lies within the vertical bounds.
   * 
   * @param y Y coordinate to check
   * @returns True if y is inside bounds, false otherwise
   */
  private yInBounds(y: number): boolean {
    return y >= this.inclusiveStartY && y < this.exclusiveEndY;
  }
}
