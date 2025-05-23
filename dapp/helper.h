/**
 * @file cartesi.h
 * @brief Helper functions.
 * @author Logan Choi
 * @date 2025-05-21
 */

#ifndef HELPER_H
#define HELPER_H

#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>

/**
 * @brief Converts a string to lowercase.
 *
 * This function transforms all characters in the input string to their lowercase equivalents
 * using the C++ standard library.
 *
 * @param s The input string to convert.
 * @return A new string where all characters are lowercase.
 */
std::string toLower(const std::string& s) {
    std::string result = s;
    std::transform(result.begin(), result.end(), result.begin(),
                   [](unsigned char c) { return std::tolower(c); });
    return result;
}

/**
 * @brief Compares two strings for equality, ignoring case.
 *
 * This function uses `toLower()` to convert both input strings to lowercase before comparing them,
 * making the comparison case-insensitive.
 *
 * @param a The first string to compare.
 * @param b The second string to compare.
 * @return True if the strings are equal when case is ignored, false otherwise.
 */
bool isEqual(const std::string& a, const std::string& b) {
    return toLower(a) == toLower(b);
}

#endif // HELPER_H