/**
 * @file eth-util.h
 * @brief Utility functions for converting to and from hex in eth format
 * @author Logan Choi 
 * @date 2025-05-21
 */

#ifndef ETH_UTIL_H
#define ETH_UTIL_H

#include <sstream>
#include <iomanip>
#include <vector>

namespace eth {
    /**
     * @brief Converts a regular string to its hexadecimal representation.
     * 
     * This function converts each character in the input string to a two-digit
     * hexadecimal number and prefixes the resulting string with "0x".
     * 
     * @param input The input string to convert to hex.
     * @return A string containing the hex representation prefixed with "0x".
     */
    std::string stringToHex(const std::string& input){
        std::ostringstream hexStream;
        hexStream << "0x";
        for(unsigned char c : input){
            hexStream << std::hex <<  std::setw(2) << std::setfill('0') << (int)c;
        }
        return hexStream.str();
    }

    /**
     * @brief Converts a hex-encoded string (prefixed with "0x") back to a regular string.
     * 
     * This function parses the input hex string, validating the "0x" prefix,
     * then converts each pair of hex digits back to their ASCII character equivalent.
     * 
     * @param hexInput The hex string to convert, which must start with "0x".
     * @throws std::invalid_argument if the input string does not start with "0x".
     * @return The decoded string.
     */
    std::string hexToString(const std::string& hexInput){
        if(hexInput.substr(0, 2) != "0x"){
            throw std::invalid_argument("Invalid hex input: Missing 0x prefix");
        }
        std::string result;
        for(size_t i = 2; i < hexInput.size(); i += 2){
            std::string byteString = hexInput.substr(i, 2);
            char byte = static_cast<char>(std::stoul(byteString, nullptr, 16));
            result.push_back(byte);
        }
        return result;
    }

    /**
     * @brief Converts a vector of uint16_t values to a hex-encoded string.
     * 
     * This function converts each 16-bit integer in the input vector to a 4-digit
     * hexadecimal number and concatenates them into a single hex string prefixed with "0x".
     * 
     * @param values The vector of uint16_t values to convert.
     * @return A hex string representing the concatenated uint16_t values, prefixed with "0x".
     */
    std::string uint16VectorToHex(const std::vector<uint16_t>& values){
        std::ostringstream hexStream;
        hexStream << "0x";
        for(auto value : values){
            hexStream << std::hex << std::setw(4) << std::setfill('0') << (int)value;
        }
        return hexStream.str();
    }

    /**
     * @brief Converts a hex-encoded string to a vector of uint16_t values.
     * 
     * This function parses the input hex string (which must start with "0x") and converts
     * each group of 4 hex digits into a uint16_t value, assembling them into a vector.
     * 
     * @param hexInput The hex string to convert, expected to be prefixed with "0x".
     * @throws std::invalid_argument if the input string does not start with "0x".
     * @return A vector of uint16_t values decoded from the hex string.
     */
    std::vector<uint16_t> hexToVectorUint16(const std::string& hexInput){
        if(hexInput.substr(0, 2) != "0x"){
            throw std::invalid_argument("Invalid hex input: Missing 0x prefix");
        }
        std::vector<uint16_t> result;
        for(size_t i = 2; i < hexInput.size(); i += 4){
            std::string byteString = hexInput.substr(i, 4);
            uint16_t value = static_cast<uint16_t>(std::stoul(byteString, nullptr, 16));
            result.push_back(value);
        }
        return result;
    }


    /**
     * @brief Converts a boolean value to its hex string representation.
     * 
     * This function returns `"0x01"` if the input is true, and `"0x00"` if false.
     * 
     * @param value The boolean value to convert.
     * @return A hex string representing the boolean value.
     */
    std::string boolToHex(bool value) {
        return value ? "0x01" : "0x00";
    }

    /**
     * @brief Converts a hex string representation back to a boolean value.
     * 
     * This function interprets the string `"0x01"` as true; all other inputs are false.
     * 
     * @param hexInput The hex string to convert (expected `"0x01"` or `"0x00"`).
     * @return True if `hexInput` is `"0x01"`, false otherwise.
     */
    bool hexToBool(const std::string& hexInput) {
        return hexInput == "0x01";
    }

    /**
     * @brief Extracts a slice (substring) from a hex-encoded string.
     * 
     * This function extracts a substring from the input hex string between the
     * specified `start` and `end` byte indices (not character indices). The input
     * hex string must start with the "0x" prefix.
     * 
     * @param hexInput The input hex string prefixed with "0x".
     * @param start The starting byte index (inclusive) of the slice.
     * @param end The ending byte index (exclusive) of the slice.
     * 
     * @throws std::invalid_argument if the input string does not start with "0x".
     * @return A hex string slice from `start` to `end`, including the "0x" prefix.
     */
    std::string slice(const std::string& hexInput, size_t start, size_t end) {
        if (hexInput.substr(0, 2) != "0x") {
            throw std::invalid_argument("Invalid hex input: Missing 0x prefix");
        }
        return "0x" + hexInput.substr(start * 2 + 2, (end - start) * 2);
    }

}
#endif // ETH_UTIL_H