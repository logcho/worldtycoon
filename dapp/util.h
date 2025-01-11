// util.h
#ifndef UTIL_H
#define UTIL_H

#include <string>
#include <sstream>
#include <iomanip>
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

// Converts a string to a hex string with a "0x" prefix
std::string stringToHex(const std::string &str) {
    std::string hexStr = "0x";  // Add the "0x" prefix
    // Convert each character to a two-digit hex value
    for (unsigned char c : str) {
        char buf[3];
        snprintf(buf, sizeof(buf), "%02x", c);
        hexStr.append(buf);
    }
    return hexStr;
}

std::string intToHex(int value) {
    std::stringstream ss;
    ss << "0x" << std::hex << value;
    return ss.str();
}


std::string vectorToHex(const std::vector<uint16_t>& vec) {
    std::ostringstream oss;
    oss << "0x";  // Add the prefix

    for (const auto& num : vec) {
        // Convert each uint16_t to a 4-character hex string (zero-padded)
        oss << std::setfill('0') << std::setw(4) << std::hex << num;
    }

    return oss.str();
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