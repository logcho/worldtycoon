/**
 * Interface to abstract Math global functions for easier testing or substitution.
 */
interface MathGlobal {
    /**
     * Returns a pseudo-random number between 0 (inclusive) and 1 (exclusive).
     */
    random(): number;
  
    /**
     * Returns the largest integer less than or equal to a given number.
     * @param n - The number to floor.
     */
    floor(n: number): number;
  }
  
  /**
   * Type alias for a random number generator function that returns an integer
   * between 0 and maxValue inclusive.
   */
  type UpperBoundedRNG = (maxValue: number) => number;
  
  /**
   * Type alias for a random number generator function that returns a 16-bit integer (0-65535).
   */
  type SixteenBitRNG = () => number;
  
  /**
   * Determines if an event with a given chance occurs, using a 16-bit RNG.
   * The chance is treated as a bitmask, and returns true if the RNG's output bitwise AND chance equals 0.
   * @param chance - The bitmask representing the chance of an event occurring.
   * @param rng - Optional RNG function producing 16-bit values. Defaults to `getRandom16`.
   * @returns True if the event occurs, false otherwise.
   */
  function getChance(chance: number, rng: SixteenBitRNG = getRandom16): boolean {
    // tslint:disable-next-line:no-bitwise
    return (rng() & chance) === 0;
  }
  
  /**
   * Generates a random integer between 0 and max (inclusive) using an "Erlang"-style approach.
   * It picks two random numbers and returns the minimum, resulting in a biased distribution favoring lower values.
   * @param max - The inclusive upper bound for the random number.
   * @param rng - Optional RNG function returning a random integer up to max. Defaults to `getRandom`.
   * @returns A random integer between 0 and max, biased towards smaller numbers.
   */
  function getERandom(max: number, rng: UpperBoundedRNG = getRandom): number {
    const firstCandidate = rng(max);
    const secondCandidate = rng(max);
    return Math.min(firstCandidate, secondCandidate);
  }
  
  /**
   * Returns a random integer between 0 and max (inclusive) using the provided MathGlobal interface.
   * @param max - The inclusive upper bound for the random number.
   * @param mathGlobal - Optional Math-like object with random and floor methods. Defaults to global Math.
   * @returns A random integer between 0 and max.
   */
  function getRandom(max: number, mathGlobal: MathGlobal = Math): number {
    return mathGlobal.floor(mathGlobal.random() * (max + 1));
  }
  
  /**
   * Returns a random 16-bit integer between 0 and 65535 (inclusive).
   * @param rng - Optional RNG function that returns an integer up to a given max. Defaults to `getRandom`.
   * @returns A 16-bit random integer.
   */
  function getRandom16(rng: UpperBoundedRNG = getRandom): number {
    return rng(65535);
  }
  
  /**
   * Returns a signed 16-bit random integer in the range [-32768, 32767].
   * It uses an unsigned 16-bit RNG and converts the value to signed by adjusting if the value is >= 32768.
   * @param rng - Optional RNG function that returns unsigned 16-bit integers. Defaults to `getRandom16`.
   * @returns A signed 16-bit random integer.
   */
  function getRandom16Signed(rng: SixteenBitRNG = getRandom16): number {
    const value = rng();
  
    if (value < 32768) {
      return value;
    } else {
      return -(2 ** 16) + value;
    }
  }
  
  /**
   * Collection of random number utility functions.
   */
  const Random = {
    getChance,
    getERandom,
    getRandom,
    getRandom16,
    getRandom16Signed,
  };
  
  export { Random };
  