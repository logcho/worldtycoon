#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>

// Helper to convert string to lowercase
std::string toLower(const std::string& s) {
    std::string result = s;
    std::transform(result.begin(), result.end(), result.begin(),
                   [](unsigned char c) { return std::tolower(c); });
    return result;
}

// Case-insensitive comparison
bool isEqual(const std::string& a, const std::string& b) {
    return toLower(a) == toLower(b);
}
