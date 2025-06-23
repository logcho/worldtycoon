/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 */

import { Random } from './random';
import { Tile } from './tile';
import { ANIMBIT, BULLBIT } from "./tileFlags";
import * as TileValues from "./tileValues";

/**
 * Helper function to unwrap a Tile object into its numeric value if needed,
 * then calls the provided function `f` with that numeric tile value.
 * This allows the predicates below to operate on either Tile objects or raw values.
 * 
 * @param {(tileValue: number) => boolean} f - Function operating on tile numeric values.
 * @returns {(tile: Tile | number) => boolean} A function that unwraps Tile and calls `f`.
 */
var unwrapTile = function(f) {
  return function(tile) {
    if (tile instanceof Tile)
      tile = tile.getValue();
    return f.call(null, tile);
  };
};

/**
 * Checks if a tile value corresponds to a bulldozable tile.
 * Bulldozable tiles include various rubble, power base tiles, and explosion tiles.
 * @param {Tile | number} tile - The tile or tile value to check.
 * @returns {boolean} True if the tile is bulldozable, false otherwise.
 */
var canBulldoze = unwrapTile(function(tileValue) {
  return (tileValue >= TileValues.FIRSTRIVEDGE  && tileValue <= TileValues.LASTRUBBLE) ||
         (tileValue >= TileValues.POWERBASE + 2 && tileValue <= TileValues.POWERBASE + 12) ||
         (tileValue >= TileValues.TINYEXP       && tileValue <= TileValues.LASTTINYEXP + 2);
});

/**
 * Checks if a tile is commercial (zone).
 * Commercial tiles fall between COMBASE and INDBASE values.
 * @param {Tile | number} tile - Tile or tile value.
 * @returns {boolean} True if commercial, false otherwise.
 */
var isCommercial = unwrapTile(function(tile) {
  return tile >= TileValues.COMBASE && tile < TileValues.INDBASE;
});

/**
 * Checks if a tile is a commercial zone center tile.
 * Requires tile to have zone bit set and be commercial.
 * @param {Tile} tile - Tile instance.
 * @returns {boolean} True if commercial zone center tile.
 */
var isCommercialZone = function(tile) {
  return tile.isZone() && isCommercial(tile);
};

/**
 * Checks if a tile is driveable (road or powered rail).
 * @param {Tile | number} tile - Tile or tile value.
 * @returns {boolean} True if driveable.
 */
var isDriveable = unwrapTile(function(tile) {
  return (tile >= TileValues.ROADBASE && tile <= TileValues.LASTROAD) ||
         (tile >= TileValues.RAILHPOWERV && tile <= TileValues.LASTRAIL);
});

/**
 * Checks if a tile represents fire.
 * Fire tiles are between FIREBASE and ROADBASE.
 * @param {Tile | number} tile
 * @returns {boolean}
 */
var isFire = unwrapTile(function(tile) {
  return tile >= TileValues.FIREBASE && tile < TileValues.ROADBASE;
});

/**
 * Checks if a tile is flood water.
 * @param {Tile | number} tile
 * @returns {boolean}
 */
var isFlood = unwrapTile(function(tile) {
  return tile >= TileValues.FLOOD && tile < TileValues.LASTFLOOD;
});

/**
 * Checks if a tile is industrial.
 * Tiles between INDBASE and PORTBASE.
 * @param {Tile | number} tile
 * @returns {boolean}
 */
var isIndustrial = unwrapTile(function(tile) {
  return tile >= TileValues.INDBASE && tile < TileValues.PORTBASE;
});

/**
 * Checks if a tile is an industrial zone center tile.
 * Requires zone bit and industrial tile check.
 * @param {Tile} tile
 * @returns {boolean}
 */
var isIndustrialZone = function(tile) {
  return tile.isZone() && isIndustrial(tile);
};

/**
 * Checks if a tile is a manual explosion tile.
 * Between TINYEXP and LASTTINYEXP.
 * @param {Tile | number} tile
 * @returns {boolean}
 */
var isManualExplosion = unwrapTile(function(tile) {
  return tile >= TileValues.TINYEXP && tile <= TileValues.LASTTINYEXP;
});

/**
 * Checks if a tile is a rail tile.
 * Between RAILBASE and RESBASE.
 * @param {Tile | number} tile
 * @returns {boolean}
 */
var isRail = unwrapTile(function(tile) {
  return tile >= TileValues.RAILBASE && tile < TileValues.RESBASE;
});

/**
 * Checks if a tile is residential.
 * Between RESBASE and HOSPITALBASE.
 * @param {Tile | number} tile
 * @returns {boolean}
 */
var isResidential = unwrapTile(function(tile) {
  return tile >= TileValues.RESBASE && tile < TileValues.HOSPITALBASE;
});

/**
 * Checks if a tile is a residential zone center tile.
 * Requires zone bit and residential tile check.
 * @param {Tile} tile
 * @returns {boolean}
 */
var isResidentialZone = function(tile) {
  return tile.isZone() && isResidential(tile);
};

/**
 * Checks if a tile is a road tile.
 * Between ROADBASE and POWERBASE.
 * @param {Tile | number} tile
 * @returns {boolean}
 */
var isRoad = unwrapTile(function(tile) {
  return tile >= TileValues.ROADBASE && tile < TileValues.POWERBASE;
});

/**
 * Normalizes road tiles by mapping tiles within the road range to a base road tile value.
 * This helps in standardizing different road tile variants.
 * @param {Tile | number} tile
 * @returns {number} Normalized tile value or original tile value if outside road range.
 */
var normalizeRoad = unwrapTile(function(tile) {
  return (tile >= TileValues.ROADBASE && tile <= TileValues.LASTROAD + 1) ? (tile & 15) + 64 : tile;
});

/**
 * Generates a random fire tile with a small variation in animation frame.
 * @returns {Tile} New Tile instance representing fire with animation bit set.
 */
var randomFire = function() {
  return new Tile(TileValues.FIRE + (Random.getRandom16() & 3), ANIMBIT);
};

/**
 * Generates a random rubble tile with small variation.
 * Bulldozable bit is set on the tile.
 * @returns {Tile} New Tile instance representing rubble with bulldozable bit.
 */
var randomRubble = function() {
  return new Tile(TileValues.RUBBLE + (Random.getRandom16() & 3), BULLBIT);
};

/**
 * Collection of utility functions to analyze and manipulate tiles.
 */
var TileUtils = {
  canBulldoze: canBulldoze,
  isCommercial: isCommercial,
  isCommercialZone: isCommercialZone,
  isDriveable: isDriveable,
  isFire: isFire,
  isFlood: isFlood,
  isIndustrial: isIndustrial,
  isIndustrialZone: isIndustrialZone,
  isManualExplosion: isManualExplosion,
  isRail: isRail,
  isResidential: isResidential,
  isResidentialZone: isResidentialZone,
  isRoad: isRoad,
  normalizeRoad: normalizeRoad,
  randomFire: randomFire,
  randomRubble: randomRubble
};

export { TileUtils };
