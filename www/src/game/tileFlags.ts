/**
 * Bit-masks representing various status flags for tiles.
 * Each flag corresponds to a single bit in a 16-bit status integer.
 */

// No flags set.
export const NOFLAGS  = 0x0000;

/** 
 * POWERBIT - bit 15 (0x8000): Indicates the tile currently has power.
 */
export const POWERBIT = 0x8000;

/**
 * CONDBIT - bit 14 (0x4000): Indicates the tile can conduct electricity.
 */
export const CONDBIT  = 0x4000;

/**
 * BURNBIT - bit 13 (0x2000): Indicates the tile can be lit on fire (combustible).
 */
export const BURNBIT  = 0x2000;

/**
 * BULLBIT - bit 12 (0x1000): Indicates the tile is bulldozable.
 */
export const BULLBIT  = 0x1000;

/**
 * ANIMBIT - bit 11 (0x0800): Indicates the tile is animated.
 */
export const ANIMBIT  = 0x0800;

/**
 * ZONEBIT - bit 10 (0x0400): Indicates the tile is the center tile of a zone.
 */
export const ZONEBIT  = 0x0400;

/**
 * Combination bit masks for convenience:
 */

// Bulldozable and burnable flags combined.
export const BLBNBIT   = BULLBIT | BURNBIT;

// Bulldozable, burnable, and conductive flags combined.
export const BLBNCNBIT = BULLBIT | BURNBIT | CONDBIT;

// Burnable and conductive flags combined.
export const BNCNBIT   = BURNBIT | CONDBIT;

// Animated, conductive, and burnable flags combined.
export const ASCBIT    = ANIMBIT | CONDBIT | BURNBIT;

/**
 * ALLBITS - combination of all individual status bits.
 * Represents any possible flag bit for a tile.
 */
export const ALLBITS   = POWERBIT | CONDBIT | BURNBIT | BULLBIT | ANIMBIT | ZONEBIT;

/**
 * BIT_START - the lowest bit position used for flags (bit 10, value 0x0400).
 */
export const BIT_START = 0x0400;

/**
 * BIT_END - the highest bit position used for flags (bit 15, value 0x8000).
 */
export const BIT_END = 0x8000;

/**
 * BIT_MASK - mask to isolate the tile's base value bits (all bits below BIT_START).
 * Typically used to strip flags from a combined tile value.
 */
export const BIT_MASK = BIT_START - 1; // 0x03FF (bits 0-9)
