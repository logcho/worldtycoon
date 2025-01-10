// util.h
#ifndef UTIL_H
#define UTIL_H

#include <string>
#include <vector>
#include <cstdint>

std::string hexToString(const std::string &hex){
    std::string cleanedHex = (hex.substr(0, 2) == "0x") ? hex.substr(2) : hex;
    std::string result;
    for (size_t i = 0; i < cleanedHex.length(); i += 2) {
        std::string byteString = cleanedHex.substr(i, 2);
        char ch = static_cast<char>(std::stoi(byteString, nullptr, 16));
        result += ch;
    }
    return result;
}

// Convert the map to a vector<uint16_t> with dynamic width and height
std::vector<uint16_t> convertMap(unsigned short* data, int width, int height) {
    // Calculate the total number of elements
    size_t size = width * height;

    // Create a vector to hold the flattened map data
    std::vector<uint16_t> mapArray(data, data + size);

    return mapArray;
}

// Print the map data as a grid
void printGrid(const std::vector<uint16_t>& mapArray, int width, int height) {
    for (int row = 0; row < height; ++row) {
        for (int col = 0; col < width; ++col) {
            std::cout << std::setw(4) << mapArray[row * width + col] << " ";
        }
        std::cout << std::endl;
    }
}

#endif // UTIL_H