// util.h
#ifndef UTIL_H
#define UTIL_H

#include <string>
#include <sstream>
#include <iomanip>
#include <vector>
#include <cstdint>

// Function to convert a string to hex with 0x prefix
std::string stringToHex(const std::string& input) {
    std::ostringstream hexStream;
    hexStream << "0x";
    for (unsigned char c : input) {
        hexStream << std::hex << std::setw(2) << std::setfill('0') << (int)c;
    }
    return hexStream.str();
}

// Function to convert hex to string
std::string hexToString(const std::string& hexInput) {
    if (hexInput.substr(0, 2) != "0x") {
        throw std::invalid_argument("Invalid hex input: Missing 0x prefix");
    }
    std::string result;
    for (size_t i = 2; i < hexInput.size(); i += 2) {
        std::string byteString = hexInput.substr(i, 2);
        char byte = static_cast<char>(std::stoul(byteString, nullptr, 16));
        result.push_back(byte);
    }
    return result;
}


// Function to convert an integer to hex with 0x prefix
std::string intToHex(int number) {
    std::ostringstream hexStream;
    hexStream << "0x" << std::hex << number;
    return hexStream.str();
}

// Function to convert hex to int
int hexToInt(const std::string& hexInput) {
    if (hexInput.substr(0, 2) != "0x") {
        throw std::invalid_argument("Invalid hex input: Missing 0x prefix");
    }
    return std::stoi(hexInput.substr(2), nullptr, 16);
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