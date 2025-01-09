// util.h
#ifndef UTIL_H
#define UTIL_H

#include <string>

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

#endif // UTIL_H