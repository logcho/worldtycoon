import * as Direction from "./direction";

/**
 * Represents a change in position along the x and y axes.
 */
class DirectionDelta {
  /**
   * Creates a new DirectionDelta instance.
   * @param xDelta - The horizontal change (positive is right, negative is left).
   * @param yDelta - The vertical change (positive is down, negative is up).
   */
  constructor(readonly xDelta: number, readonly yDelta: number) {}
}

/** 
 * Alias for direction type from Direction module.
 */
type MovementDirection = Direction.Direction;

/**
 * Returns the delta change in x and y coordinates for a given movement direction.
 * @param direction - The direction to convert into coordinate deltas.
 * @returns A DirectionDelta representing the x and y changes for the given direction.
 * @throws Throws an error if an unknown direction is passed.
 */
function getDeltaFor(direction: MovementDirection): DirectionDelta {
  switch (direction) {
    case Direction.NORTH:
      return new DirectionDelta(0, -1);
    case Direction.NORTHEAST:
      return new DirectionDelta(1, -1);
    case Direction.EAST:
      return new DirectionDelta(1, 0);
    case Direction.SOUTHEAST:
      return new DirectionDelta(1, 1);
    case Direction.SOUTH:
      return new DirectionDelta(0, 1);
    case Direction.SOUTHWEST:
      return new DirectionDelta(-1, 1);
    case Direction.WEST:
      return new DirectionDelta(-1, 0);
    case Direction.NORTHWEST:
      return new DirectionDelta(-1, -1);
    default:
      throw new Error(`Unexpected direction!`);
  }
}

/**
 * Represents a coordinate position on a 2D grid.
 */
export class Position {
  /**
   * Creates a new Position instance.
   * @param x - The horizontal coordinate.
   * @param y - The vertical coordinate.
   */
  constructor(readonly x: number, readonly y: number) {}

  /**
   * Returns a new Position moved one step in the given direction.
   * @param position - The starting position.
   * @param direction - The direction to move.
   * @returns A new Position moved from the original position by one step in the given direction.
   */
  static move(position: Position, direction: MovementDirection): Position {
    const { x, y } = position;
    const { xDelta, yDelta } = getDeltaFor(direction);
    return new Position(x + xDelta, y + yDelta);
  }

  /**
   * Returns the origin position (0, 0).
   * @returns A Position at the origin.
   */
  static origin(): Position {
    return new Position(0, 0);
  }

  /**
   * Returns a string representation of the position.
   * @returns The string in format `(x, y)`.
   */
  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}
