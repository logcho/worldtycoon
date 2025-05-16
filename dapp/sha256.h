#include <array>
#include <cstdint>
#include <cstring>
#include <iomanip>
#include <sstream>
#include <string>
#include <vector>

namespace sha256_internal {
    inline uint32_t rotr(uint32_t x, uint32_t n) { return (x >> n) | (x << (32 - n)); }

    constexpr std::array<uint32_t, 64> k = {{
        0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,
        0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
        0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,
        0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
        0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,
        0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
        0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,
        0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
        0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,
        0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
        0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,
        0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
        0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,
        0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
        0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,
        0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    }};
}

std::string sha256(const std::string& input) {
    using namespace sha256_internal;

    std::vector<uint8_t> data(input.begin(), input.end());
    uint64_t bit_len = data.size() * 8;

    // Append the '1' bit
    data.push_back(0x80);
    while ((data.size() + 8) % 64 != 0) data.push_back(0);

    // Append the original message length in bits
    for (int i = 7; i >= 0; --i)
        data.push_back(static_cast<uint8_t>((bit_len >> (i * 8)) & 0xff));

    // Initial hash values
    uint32_t h[8] = {
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    };

    for (size_t i = 0; i < data.size(); i += 64) {
        uint32_t w[64];
        for (int j = 0; j < 16; ++j) {
            w[j] = (data[i + j * 4 + 0] << 24) |
                   (data[i + j * 4 + 1] << 16) |
                   (data[i + j * 4 + 2] << 8)  |
                   (data[i + j * 4 + 3]);
        }
        for (int j = 16; j < 64; ++j) {
            uint32_t s0 = rotr(w[j-15], 7) ^ rotr(w[j-15], 18) ^ (w[j-15] >> 3);
            uint32_t s1 = rotr(w[j-2], 17) ^ rotr(w[j-2], 19) ^ (w[j-2] >> 10);
            w[j] = w[j-16] + s0 + w[j-7] + s1;
        }

        uint32_t a = h[0], b = h[1], c = h[2], d = h[3];
        uint32_t e = h[4], f = h[5], g = h[6], h_ = h[7];

        for (int j = 0; j < 64; ++j) {
            uint32_t S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
            uint32_t ch = (e & f) ^ (~e & g);
            uint32_t temp1 = h_ + S1 + ch + k[j] + w[j];
            uint32_t S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
            uint32_t maj = (a & b) ^ (a & c) ^ (b & c);
            uint32_t temp2 = S0 + maj;

            h_ = g;
            g = f;
            f = e;
            e = d + temp1;
            d = c;
            c = b;
            b = a;
            a = temp1 + temp2;
        }

        h[0] += a; h[1] += b; h[2] += c; h[3] += d;
        h[4] += e; h[5] += f; h[6] += g; h[7] += h_;
    }

    std::ostringstream result;
    result << "0x";
    for (int i = 0; i < 8; ++i)
        result << std::hex << std::setw(8) << std::setfill('0') << h[i];

    return result.str();
}
