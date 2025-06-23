import { Bounds } from "./bounds";
import * as Direction from './direction';
import { Position } from './position';
import { Tile } from './tile';
import { BNCNBIT, ZONEBIT } from "./tileFlags";
import { TILE_INVALID } from "./tileValues";

/**
 * GameMap represents a 2D tile map grid.
 * @constructor
 * @param {number} width - Width of the map in tiles
 * @param {number} height - Height of the map in tiles
 * @param {number|Tile} [defaultValue] - Default tile value to fill the map with
 */
function GameMap(width, height, defaultValue) {
  if (!(this instanceof GameMap))
    return new GameMap(width, height, defaultValue);

  if (arguments.length > 1 && typeof(width) === 'number' &&
      (width < 1 || height < 1))
    throw new Error('GameMap constructor called with invalid width or height ' + width + ' ' + height);

  if (arguments.length === 0) {
    width = 120;
    height = 100;
    defaultValue = new Tile().getValue();
  } else if (arguments.length === 1) {
    defaultValue = (typeof width === 'number') ? width : width.getValue();
    width = 120;
    height = 100;
  } else if (arguments.length === 2) {
    defaultValue = new Tile().getValue();
  } else if (arguments.length === 3 && typeof(defaultValue) === 'object') {
    defaultValue = defaultValue.getValue();
  }

  this.width = width;
  this.height = height;
  this.bounds = Bounds.fromOrigin(width, height);

  this._data = Array.from({ length: width * height }, () => new Tile(defaultValue));

  this.cityCentreX = Math.floor(this.width / 2);
  this.cityCentreY = Math.floor(this.height / 2);
  this.pollutionMaxX = this.cityCentreX;
  this.pollutionMaxY = this.cityCentreY;
}

/**
 * Internal index calculation helper.
 */
GameMap.prototype._calculateIndex = function(x, y) {
  return x + y * this.width;
};

/**
 * Returns whether the given position is in map bounds.
 * @param {Position} pos
 * @returns {boolean}
 */
GameMap.prototype.isPositionInBounds = function(pos) {
  return this.bounds.contains(pos);
};

/**
 * Returns whether the x/y coordinates are within bounds.
 */
GameMap.prototype.testBounds = function(x, y) {
  return this.isPositionInBounds(new Position(x, y));
};

/**
 * Gets the Tile object at x, y. Returns TILE_INVALID if out of bounds.
 */
GameMap.prototype.getTile = function(x, y, newTile) {
  if (typeof x === 'object') {
    y = x.y;
    x = x.x;
  }

  if (!this.testBounds(x, y)) {
    console.warn('getTile called with bad bounds', x, y);
    return new Tile(TILE_INVALID);
  }

  const tile = this._data[this._calculateIndex(x, y)];
  if (!newTile) return tile;

  newTile.setFrom(tile);
  return tile;
};

/**
 * Gets the tile value at a specific position.
 */
GameMap.prototype.getTileValue = function(x, y) {
  if (typeof x === 'object') {
    y = x.y;
    x = x.x;
  }
  if (!this.testBounds(x, y))
    throw new Error(`getTileValue out of bounds: (${x}, ${y})`);
  return this._data[this._calculateIndex(x, y)].getValue();
};

/**
 * Gets tile flags at a position (rarely used).
 */
GameMap.prototype.getTileFlags = function(x, y) {
  if (typeof x === 'object') {
    y = x.y;
    x = x.x;
  }
  if (!this.testBounds(x, y))
    throw new Error(`getTileFlags out of bounds: (${x}, ${y})`);
  return this._data[this._calculateIndex(x, y)].getFlags();
};

/**
 * Gets an area of Tile objects (rarely used).
 */
GameMap.prototype.getTiles = function(x, y, w, h) {
  if (arguments.length === 3) {
    h = w;
    w = y;
    y = x.y;
    x = x.x;
  }
  if (!this.testBounds(x, y))
    throw new Error(`getTiles out of bounds: (${x}, ${y})`);

  const res = [];
  for (let row = y; row < y + h; row++) {
    res[row - y] = [];
    for (let col = x; col < x + w; col++) {
      res[row - y].push(this._data[this._calculateIndex(col, row)]);
    }
  }
  return res;
};

/**
 * Returns an array of tile raw values for painting.
 */
GameMap.prototype.getTileValuesForPainting = function(x, y, w, h, result = []) {
  if (arguments.length === 3) {
    h = w;
    w = y;
    y = x.y;
    x = x.x;
  }

  for (let row = y; row < y + h; row++) {
    for (let col = x; col < x + w; col++) {
      const index = (row - y) * w + (col - x);
      if (!this.testBounds(col, row)) {
        result[index] = TILE_INVALID;
      } else {
        result[index] = this._data[this._calculateIndex(col, row)].getRawValue();
      }
    }
  }

  return result;
};

/**
 * Gets a tile value in a direction from a position, with fallback.
 */
GameMap.prototype.getTileFromMapOrDefault = function(pos, dir, defaultTile) {
  switch (dir) {
    case Direction.NORTH:
      return pos.y > 0 ? this.getTileValue(pos.x, pos.y - 1) : defaultTile;
    case Direction.EAST:
      return pos.x < this.width - 1 ? this.getTileValue(pos.x + 1, pos.y) : defaultTile;
    case Direction.SOUTH:
      return pos.y < this.height - 1 ? this.getTileValue(pos.x, pos.y + 1) : defaultTile;
    case Direction.WEST:
      return pos.x > 0 ? this.getTileValue(pos.x - 1, pos.y) : defaultTile;
    default:
      return defaultTile;
  }
};

/**
 * Sets a tile's value and flags.
 */
GameMap.prototype.setTile = function(x, y, value, flags) {
  if (arguments.length === 3) {
    flags = value;
    value = y;
    y = x.y;
    x = x.x;
  }
  if (!this.testBounds(x, y))
    throw new Error(`setTile out of bounds: (${x}, ${y})`);

  this._data[this._calculateIndex(x, y)].set(value, flags);
};

/**
 * Replaces the tile at x/y with a new Tile object.
 */
GameMap.prototype.setTo = function(x, y, tile) {
  if (tile === undefined) {
    tile = y;
    y = x.y;
    x = x.x;
  }
  if (!this.testBounds(x, y))
    throw new Error(`setTo out of bounds: (${x}, ${y})`);
  this._data[this._calculateIndex(x, y)] = tile;
};

/**
 * Sets just the tile value.
 */
GameMap.prototype.setTileValue = function(x, y, value) {
  if (arguments.length === 2) {
    value = y;
    y = x.y;
    x = x.x;
  }
  if (!this.testBounds(x, y))
    throw new Error(`setTileValue out of bounds: (${x}, ${y})`);
  this._data[this._calculateIndex(x, y)].setValue(value);
};

/**
 * Sets tile flags.
 */
GameMap.prototype.setTileFlags = function(x, y, flags) {
  if (arguments.length === 2) {
    flags = y;
    y = x.y;
    x = x.x;
  }
  if (!this.testBounds(x, y))
    throw new Error(`setTileFlags out of bounds: (${x}, ${y})`);
  this._data[this._calculateIndex(x, y)].setFlags(flags);
};

/**
 * Adds tile flags.
 */
GameMap.prototype.addTileFlags = function(x, y, flags) {
  if (arguments.length === 2) {
    flags = y;
    y = x.y;
    x = x.x;
  }
  if (!this.testBounds(x, y))
    throw new Error(`addTileFlags out of bounds: (${x}, ${y})`);
  this._data[this._calculateIndex(x, y)].addFlags(flags);
};

/**
 * Removes tile flags.
 */
GameMap.prototype.removeTileFlags = function(x, y, flags) {
  if (arguments.length === 2) {
    flags = y;
    y = x.y;
    x = x.x;
  }
  if (!this.testBounds(x, y))
    throw new Error(`removeTileFlags out of bounds: (${x}, ${y})`);
  this._data[this._calculateIndex(x, y)].removeFlags(flags);
};

/**
 * Paints a zone centered at (centreX, centreY) with the given tile and size.
 */
GameMap.prototype.putZone = function(centreX, centreY, centreTile, size) {
  if (!this.testBounds(centreX, centreY) ||
      !this.testBounds(centreX - 1 + size - 1, centreY - 1 + size - 1))
    throw new Error(`putZone out of bounds`);

  let tile = centreTile - 1 - size;
  const startX = centreX - 1;
  const startY = centreY - 1;

  for (let y = startY; y < startY + size; y++) {
    for (let x = startX; x < startX + size; x++) {
      const flags = (x === centreX && y === centreY) ? (BNCNBIT | ZONEBIT) : BNCNBIT;
      this.setTo(x, y, new Tile(tile, flags));
      tile++;
    }
  }
};

export { GameMap };
