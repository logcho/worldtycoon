/**
 * Clamps a value between a minimum and maximum boundary.
 * 
 * @param {number} value - The value to clamp.
 * @param {number} min - The minimum allowed value.
 * @param {number} max - The maximum allowed value.
 * @returns {number} - Returns the clamped value.
 */
var clamp = function(value, min, max) {
  if (value < min)
    return min;
  if (value > max)
    return max;

  return value;
};

/**
 * Creates a property descriptor object for defining a constant property.
 * The property will be non-configurable, non-enumerable, and read-only.
 * 
 * @param {*} value - The constant value to set on the property.
 * @returns {PropertyDescriptor} - Descriptor for use in Object.defineProperty.
 */
var makeConstantDescriptor = function(value) {
  return {
    configurable: false,
    enumerable: false,
    writable: false,
    value: value
  };
};

/**
 * Normalizes a DOM element ID by ensuring it starts with a '#' character.
 * If the input already starts with '#', it returns the input unchanged.
 * 
 * @param {string} id - The DOM element ID string to normalize.
 * @returns {string} - Normalized ID string starting with '#'.
 */
var normaliseDOMid = function(id) {
  return (id[0] !== '#' ? '#' : '') + id;
};

/**
 * Emits an event by invoking the internal _emitEvent method with given message and value.
 * Meant to be used as a helper method bound to an object that implements _emitEvent.
 * 
 * @param {string} message - The event name or message.
 * @param {*} value - The value/data to pass with the event.
 */
var reflectEvent = function(message, value) {
  this._emitEvent(message, value);
};

/**
 * Collection of miscellaneous utility functions.
 */
var MiscUtils = {
  clamp: clamp,
  makeConstantDescriptor: makeConstantDescriptor,
  normaliseDOMid: normaliseDOMid,
  reflectEvent: reflectEvent
};

export { MiscUtils };
