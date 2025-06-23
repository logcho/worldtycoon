/**
 * A function type that takes a Direction as an argument.
 */
export type DirectionFn = (direction: Direction) => void;

/**
 * Interface representing a Direction.
 * Provides methods to get the opposite direction,
 * and to rotate the direction clockwise or counter-clockwise.
 */
export interface Direction {
  /**
   * Returns the opposite direction.
   */
  oppositeDirection(): Direction;

  /**
   * Returns the direction rotated 45 degrees clockwise.
   */
  rotateClockwise(): Direction;

  /**
   * Returns the direction rotated 45 degrees counter-clockwise.
   */
  rotateCounterClockwise(): Direction;
}

/**
 * Class representing a specific direction with a name.
 * Implements the Direction interface.
 */
class DirectionValue implements Direction {
  /**
   * @param name The string name of the direction (e.g. "NORTH")
   */
  constructor(private readonly name: string) {}

  /**
   * Returns the opposite direction by rotating 180 degrees.
   */
  oppositeDirection(): Direction {
    return this.transform(4);
  }

  /**
   * Returns the direction rotated 45 degrees clockwise.
   */
  rotateClockwise(): Direction {
    return this.transform(1);
  }

  /**
   * Returns the direction rotated 45 degrees counter-clockwise.
   */
  rotateCounterClockwise(): Direction {
    return this.transform(allDirections.length - 1);
  }

  /**
   * Returns the string name of this direction.
   */
  toString(): string {
    return this.name;
  }

  /**
   * Helper method to rotate the direction by a given delta in the
   * circular array of directions.
   * 
   * @param delta Number of steps to rotate clockwise (modulo 8).
   * @returns The new rotated Direction.
   */
  private transform(delta: number): Direction {
    const ourIndex = directionIndex(this);
    const desired = ourIndex + delta;
    return allDirections[desired % allDirections.length];
  }
}

/**
 * Direction constants representing the eight principal compass directions.
 * These are immutable instances of DirectionValue.
 */
export const NORTH = Object.freeze(new DirectionValue("NORTH"));
export const NORTHEAST = Object.freeze(new DirectionValue("NORTHEAST"));
export const EAST = Object.freeze(new DirectionValue("EAST"));
export const SOUTHEAST = Object.freeze(new DirectionValue("SOUTHEAST"));
export const SOUTH = Object.freeze(new DirectionValue("SOUTH"));
export const SOUTHWEST = Object.freeze(new DirectionValue("SOUTHWEST"));
export const WEST = Object.freeze(new DirectionValue("WEST"));
export const NORTHWEST = Object.freeze(new DirectionValue("NORTHWEST"));

/**
 * Array of all eight directions in clockwise order starting from NORTH.
 */
const allDirections = [
  NORTH,
  NORTHEAST,
  EAST,
  SOUTHEAST,
  SOUTH,
  SOUTHWEST,
  WEST,
  NORTHWEST,
];

/**
 * Returns the index of the given direction within the allDirections array.
 * 
 * @param direction The DirectionValue instance to find.
 * @returns Index (0-7) of the direction in allDirections.
 */
function directionIndex(direction: DirectionValue): number {
  return allDirections.indexOf(direction);
}

/**
 * Array of the four cardinal directions.
 */
const cardinalDirections = [
  NORTH,
  EAST,
  SOUTH,
  WEST,
];

/**
 * Iterates over each cardinal direction and calls the provided callback with it.
 * 
 * @param callback Function to call for each cardinal direction.
 */
export function forEachCardinalDirection(callback: DirectionFn) {
  cardinalDirections.forEach((dir) => callback(dir));
}
