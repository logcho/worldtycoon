/**
 * @file game-util.h
 * @brief Utility functions for converting game data to and from hex
 * @author Logan Choi
 * @date 2025-05-22
 */

#ifndef GAME_UTIL_H
#define GAME_UTIL_H

#include <vector>

/**
 * @brief Converts a raw 2D map array to a std::vector of uint16_t values.
 * 
 * This function takes a pointer to a 2D array (represented as a flat buffer of `unsigned short` values)
 * and converts it into a `std::vector<uint16_t>`, based on the given dimensions.
 *
 * @param data Pointer to the beginning of the map data (flattened 2D array).
 * @param width The number of columns in the map.
 * @param height The number of rows in the map.
 * @return A vector of uint16_t containing the map data.
 */
std::vector<uint16_t> convertMapToUint16Vector(unsigned short* data, int width, int height) {
    size_t size = width * height;
    std::vector<uint16_t> mapArray(data, data + size);
    return mapArray;
}

#endif // GAME_UTIL_H