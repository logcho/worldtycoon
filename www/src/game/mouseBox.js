/**
 * MouseBox utility object to draw a rectangular box, typically used for selection or highlighting,
 * on a given canvas context with customizable styling options.
 */
var MouseBox = {
  /**
   * Draws a rectangular box on the specified canvas context at a given position and size.
   * 
   * @param {HTMLCanvasElement} c - The canvas element on which to draw.
   * @param {{x: number, y: number}} pos - The starting position (top-left corner) to draw the box.
   * @param {number} width - The width of the rectangle.
   * @param {number} height - The height of the rectangle.
   * @param {Object} options - Drawing options.
   * @param {number} [options.lineWidth=3.0] - The width of the rectangle's outline stroke.
   * @param {string} [options.colour='yellow'] - The color of the rectangle's stroke.
   * @param {boolean} [options.outline=false] - Whether to draw an outline or invert the line positioning.
   */
  draw: function(c, pos, width, height, options) {
    var lineWidth = options.lineWidth || 3.0;
    var strokeStyle = options.colour || 'yellow';
    var shouldOutline = (('outline' in options) && options.outline === true) || false;

    // Modifiers adjust the position and size based on whether outline mode is enabled
    var startModifier = -1;
    var endModifier = 1;
    if (!shouldOutline) {
      startModifier = 1;
      endModifier = -1;
    }

    // Calculate starting coordinates adjusted by line width and modifiers
    var startX = pos.x + startModifier * lineWidth / 2;
    width = width + endModifier * lineWidth;
    var startY = pos.y + startModifier * lineWidth / 2;
    height = height + endModifier * lineWidth;

    // Get the 2D rendering context from the canvas element
    var ctx = c.getContext('2d');

    // Set the line width and stroke color for the rectangle
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;

    // Draw the rectangular stroke on the canvas
    ctx.strokeRect(startX, startY, width, height);
  }
};

export { MouseBox };
