/**
 * TileHistory class keeps track of tile values at specific (x, y) coordinates.
 * It is typically used to remember which tile frames have been painted, 
 * allowing consistent animation rendering over time.
 */
function TileHistory() {
  this.clear();
}

/**
 * Converts x and y coordinates into a unique string key for storage.
 * @param {number} x - The x-coordinate of the tile.
 * @param {number} y - The y-coordinate of the tile.
 * @returns {string} A string key representing the coordinates, e.g. "3,5".
 */
var toKey = function(x, y) {
  return [x, y].join(',');
};

/**
 * Clears all stored tile history data.
 * After calling this method, no tile positions will have stored values.
 */
TileHistory.prototype.clear = function() {
  this.data = {};
};

/**
 * Retrieves the stored tile value at the given coordinates.
 * @param {number} x - The x-coordinate to query.
 * @param {number} y - The y-coordinate to query.
 * @returns {*} The tile value stored at (x, y), or undefined if none exists.
 */
TileHistory.prototype.getTile = function(x, y) {
  var key = toKey(x, y);
  return this.data[key];
};

/**
 * Stores a tile value at the specified (x, y) coordinates.
 * @param {number} x - The x-coordinate of the tile to store.
 * @param {number} y - The y-coordinate of the tile to store.
 * @param {*} value - The tile value to store.
 */
TileHistory.prototype.setTile = function(x, y, value) {
  var key = toKey(x, y);
  this.data[key] = value;
};

export { TileHistory };
