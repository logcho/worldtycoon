import * as TileFlags from "./tileFlags";
import { DIRT, TILE_COUNT, TILE_INVALID } from "./tileValues";

/**
 * Utility type to extract keys of Tile methods that return boolean.
 */
type TilePredicateKey = {
  [K in keyof Tile]: Tile[K] extends () => boolean ? K : never;
}[keyof Tile];

/**
 * Represents a tile with a value and associated flags describing its properties.
 * Supports manipulation and querying of tile flags and value.
 */
export class Tile {

  private value: number;

  /**
   * Creates a new Tile instance with a base tile value and optional flags.
   * @param value - The base tile value (default is DIRT).
   * @param flags - Bit flags representing tile properties (default 0).
   * @throws Throws if value or flags are invalid.
   */
  constructor(value: number = DIRT, flags: number = 0) {
    this.validateArguments(value, flags, "Tile constructor");
    this.value = value | flags;
  }

  /**
   * Returns the base tile value without flags.
   */
  getValue(): number {
    return this.valueFromCombinedValue(this.value);
  }

  /**
   * Returns the bit flags associated with the tile.
   */
  getFlags(): number {
    return this.flagsFromCombinedValue(this.value);
  }

  /**
   * Returns the raw combined value of tile value and flags.
   * Note: Exposes internal representation; usage should be limited.
   */
  getRawValue(): number {
    // TODO: Can we remove the caller of this to avoid leaking this implementation detail?
    return this.value;
  }

  /**
   * Adds one or more flags to the tile.
   * @param flags - Bit flags to add.
   * Does nothing if flags equal NOFLAGS.
   * @throws Throws if flags are invalid.
   */
  addFlags(flags: number) {
    this.validateFlags(flags, "addFlags");

    if (flags === TileFlags.NOFLAGS) {
      return;
    }

    this.value |= flags;
  }

  /**
   * Sets the tile's base value, preserving or replacing flags as needed.
   * @param desiredValue - New tile value, can include embedded flags.
   * @throws Throws if desiredValue is out of valid range.
   */
  setValue(desiredValue: number) {
    if (desiredValue < TILE_INVALID) {
      throw new Error(`setValue called with out-of-range value ${desiredValue}`);
    }

    // Extract base value and flags from combined value
    const value = this.valueFromCombinedValue(desiredValue);
    const bitMask = this.flagsToSetFromCombinedValue(desiredValue);
    this.set(value, bitMask);
  }

  /**
   * Sets the tile's flags to the given flags, replacing existing flags.
   * @param flags - New bit flags to set.
   * @throws Throws if flags are invalid.
   */
  setFlags(flags: number) {
    this.validateFlags(flags, "setFlags");

    const existingValue = this.value & ~TileFlags.ALLBITS;
    this.value = existingValue | flags;
  }

  /**
   * Removes specified flags from the tile.
   * @param flags - Bit flags to remove.
   * Does nothing if flags equal NOFLAGS.
   * @throws Throws if flags are invalid.
   */
  removeFlags(flags: number) {
    this.validateFlags(flags, "removeFlags");

    if (flags === TileFlags.NOFLAGS) {
      return;
    }

    this.value &= ~flags;
  }

  /**
   * Copies value and flags from another tile.
   * @param tile - Source tile to copy from.
   */
  setFrom(tile: Tile) {
    this.value = tile.value;
  }

  /**
   * Sets both the base tile value and flags explicitly.
   * @param value - Base tile value (without flags).
   * @param flags - Flags to set.
   * @throws Throws if either value or flags are invalid.
   */
  set(value: number, flags: number) {
    this.validateArguments(value, flags, "set");

    this.value = value | flags;
  }

  /**
   * Returns true if the tile is animated.
   */
  isAnimated(): boolean {
    return this.checkBits(TileFlags.ANIMBIT);
  }

  /**
   * Returns true if the tile can be bulldozed.
   */
  isBulldozable(): boolean {
    return this.checkBits(TileFlags.BULLBIT);
  }

  /**
   * Returns true if the tile conducts power.
   */
  isConductive(): boolean {
    return this.checkBits(TileFlags.CONDBIT);
  }

  /**
   * Returns true if the tile is combustible.
   */
  isCombustible(): boolean {
    return this.checkBits(TileFlags.BURNBIT);
  }

  /**
   * Returns true if the tile is currently powered.
   */
  isPowered(): boolean {
    return this.checkBits(TileFlags.POWERBIT);
  }

  /**
   * Returns true if the tile is part of a zone.
   */
  isZone(): boolean {
    return this.checkBits(TileFlags.ZONEBIT);
  }

  /**
   * Returns a string representation of the tile's value and its qualities.
   */
  toString(): string {
    const qualities = ["animated", "bulldozable", "combustible", "conductive", "powered", "zone"];
    const qualitiesText = qualities.map((quality) => this.getQualityText(quality)).join(", ");

    const tileValue = this.getValue();
    return `Tile# ${tileValue}: ${qualitiesText}`;
  }

  /**
   * Returns formatted string describing a single quality and whether it applies.
   * @param quality - The name of the quality to check.
   */
  private getQualityText(quality: string): string {
    const predicate = this.predicateForQuality(quality);
    const qualityValue = this[predicate]();
    return `${quality}: ${this.summariseBoolean(qualityValue)}`;
  }

  /**
   * Converts a quality name to the corresponding predicate method name.
   * Example: "animated" -> "isAnimated"
   * @param quality - Quality name.
   */
  private predicateForQuality(quality: string): TilePredicateKey {
    return `is${quality[0].toUpperCase()}${quality.slice(1)}` as TilePredicateKey;
  }

  /**
   * Converts a boolean to a visual summary (checkmark or cross).
   * @param bool - Boolean value.
   */
  private summariseBoolean(bool: boolean): string {
    return bool ? `✔` : `✘`;
  }

  /**
   * Extracts the base tile value from a combined value (value + flags).
   * @param value - Combined value.
   */
  private valueFromCombinedValue(value: number): number {
    return value & TileFlags.BIT_MASK;
  }

  /**
   * Extracts the flags from a combined value.
   * @param value - Combined value.
   */
  private flagsFromCombinedValue(value: number): number {
    return value & TileFlags.ALLBITS;
  }

  /**
   * Determines flags to set based on combined value.
   * Returns embedded flags if any; otherwise returns current tile's flags.
   * @param value - Combined value.
   */
  private flagsToSetFromCombinedValue(value: number): number {
    const embeddedFlags = this.flagsFromCombinedValue(value);
    return embeddedFlags > 0 ? embeddedFlags : this.getFlags();
  }

  /**
   * Checks if specific bits are set in the tile's current value.
   * @param flag - Flag bits to check.
   */
  private checkBits(flag: number): boolean {
    return (this.value & flag) > 0;
  }

  /**
   * Validates both value and flags.
   * @param value - Tile base value.
   * @param flags - Tile flags.
   * @param context - Context string for error messages.
   * @throws Throws if value or flags are invalid.
   */
  private validateArguments(value: number, flags: number, context: string) {
    this.validateValue(value, context);
    this.validateFlags(flags, context);
  }

  /**
   * Validates that the value is within valid tile value range.
   * @param value - Tile value.
   * @param context - Context string for error messages.
   * @throws Throws if value is out of range.
   */
  private validateValue(value: number, context: string) {
    if (this.valueIsInvalid(value)) {
      throw new Error(`${context} called with out-of-range value ${value}`);
    }
  }

  /**
   * Validates that the flags are within valid tile flag bits.
   * @param flags - Tile flags.
   * @param context - Context string for error messages.
   * @throws Throws if flags are invalid.
   */
  private validateFlags(flags: number, context: string) {
    if (this.flagsAreInvalid(flags)) {
      throw new Error(`${context} called with out-of-range flags 0x${flags.toString(16)}`);
    }
  }

  /**
   * Checks if a tile value is invalid (out of range).
   * @param value - Tile value.
   */
  private valueIsInvalid(value: number): boolean {
    return value < TILE_INVALID || value >= TILE_COUNT;
  }

  /**
   * Checks if flags contain invalid bits or are outside allowed range.
   * @param flags - Tile flags.
   */
  private flagsAreInvalid(flags: number): boolean {
    return flags !== 0 && (flags < TileFlags.BIT_START || (flags & ~TileFlags.ALLBITS) !== 0);
  }
}
