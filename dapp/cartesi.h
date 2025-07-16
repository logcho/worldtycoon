/**
 * @file cartesi.h
 * @brief Utility functions for interacting with the Cartesi HTTP API.
 * @author Logan Choi
 * @date 2025-05-21
 */

#ifndef CARTESI_H
#define CARTESI_H

#include <iostream>
#include <vector>
#include <string>
#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"
#include "helper.h"
#include "eth-util.h"

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

/**
 * @brief Address of the standard ERC-20 portal contract.
 */
const std::string ERC20_PORTAL_ADDRESS = "0x9c21aeb2093c32ddbc53eef24b873bdcd1ada1db";

/**
 * @brief Address of the standard ERC-721 portal contract.
 */
const std::string ERC721_PORTAL_ADDRESS = "0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87";

// -----------------------------------------------------------------------------
// HTTP POST API calls
// -----------------------------------------------------------------------------

/**
 * @brief Sends a notice with the given payload to the /notice endpoint.
 * @param cli The configured httplib::Client object.
 * @param payload A hex-encoded string representing the notice payload.
 */
void createNotice(httplib::Client& cli, const std::string& payload) {
    std::string notice = "{\"payload\":\"" + payload + "\"}";
    std::cout << "Creating notice..." << std::endl;
    auto r = cli.Post("/notice", notice, "application/json");    
    std::cout << "Notice Created!" << std::endl;
    std::cout << "Received notice status " << r.value().status << std::endl;
}

/**
 * @brief Sends a report with the given payload to the /report endpoint.
 * @param cli The configured httplib::Client object.
 * @param payload A hex-encoded string representing the report payload.
 */
void createReport(httplib::Client& cli, const std::string& payload) {
    std::string report = "{\"payload\":\"" + payload + "\"}";
    std::cout << "Creating report..." << std::endl;
    auto r = cli.Post("/report", report, "application/json");  
    std::cout << "Report Created!" << std::endl;  
    std::cout << "Received report status " << r.value().status << std::endl;
}

// -----------------------------------------------------------------------------
// Token Transfer Encoding
// -----------------------------------------------------------------------------

/**
 * @brief Pads a hex string to 32 bytes (64 hex characters).
 * Removes "0x" prefix if present and prepends zeros to reach length.
 * @param hex The original hex string, with or without "0x" prefix.
 * @return A 64-character hex string padded on the left.
 */
std::string padTo32Bytes(const std::string& hex) {
    std::string clean = (hex.substr(0, 2) == "0x") ? hex.substr(2) : hex;
    return std::string(64 - clean.length(), '0') + clean;
}

/**
 * @brief Encodes a transfer(address,uint256) function call.
 * Generates the full ABI-encoded payload for a token transfer.
 * @param recipient The recipient address as a hex string (with or without "0x").
 * @param amountHex The amount in hex format (e.g. "0de0b6b3a7640000" for 1 ETH).
 * @return A hex-encoded string including function selector and arguments.
 */
std::string encodeTransferCall(const std::string& recipient, const std::string& amountHex) {
    std::string methodId = "a9059cbb"; // keccak256("transfer(address,uint256)") first 4 bytes
    return "0x" + methodId + padTo32Bytes(recipient) + padTo32Bytes(amountHex);
}

/**
 * @brief Sends a voucher to the /voucher endpoint with encoded ERC-20 transfer call.
 * @param cli The configured httplib::Client object.
 * @param recipient Address to send tokens to (hex string).
 * @param amount Amount to send (hex string).
 * @param destination The token address.
 */
void createTransferVoucher(httplib::Client& cli, const std::string& recipient, const std::string& amount, const std::string& destination) {
    std::string transferCall = encodeTransferCall(recipient, amount);
    std::string voucher = "{\"destination\":\"" + destination + "\", \"payload\": \"" + transferCall + "\"}";
    std::cout << "Creating voucher..." << std::endl;
    auto r = cli.Post("/voucher", voucher, "application/json");    
    std::cout << "Received voucher status " << r.value().status << std::endl;
}

/**
 * @brief Encodes a mintNFT(address,uint256) function call.
 * Generates the full ABI-encoded payload for minting an ERC-721 token.
 * @param recipient The recipient address as a hex string (with or without "0x").
 * @param tokenId The token ID as a hex string (with or without "0x").
 * @return A hex-encoded string including the function selector and arguments.
 */
std::string encodeMintNFTCall(const std::string &recipient, const std::string &tokenId) {
    std::string methodId = "3c168eab"; // keccak256("mintNFT(address,uint256)") first 4 bytes
    return "0x" + methodId + padTo32Bytes(recipient) + padTo32Bytes(tokenId);
}

/**
 * @brief Sends a voucher with an encoded mintNFT call to the /voucher endpoint.
 * This function formats and sends a payload to the Cartesi node to trigger
 * the minting of an NFT by calling the mintNFT function on the NFT contract.
 * @param cli The configured httplib::Client object used for HTTP requests.
 * @param recipient Address to send tokens to (hex string).
 * @param tokenId The token ID as a hex string (with or without "0x").
 * @param destination The token address.
 */
void createMintNFTVoucher(httplib::Client &cli, const std::string &recipient, const std::string &tokenId, const std::string& destination) {
    std::string mintNFT = encodeMintNFTCall(recipient, tokenId);
    // Format the payload expected by Cartesi
    std::string payload = "{\"destination\":\"" + destination + "\",\"payload\":\"" + mintNFT + "\"}";
    // Payload should be ABI encoded call to the NFT contract
    auto r = cli.Post("/voucher", payload, "application/json");
    if (r) {
        std::cout << "[VOUCHER] Sent: " << payload << std::endl;
        std::cout << "Received status: " << r->status << std::endl;
    } else {
        std::cerr << "[ERROR] Failed to send voucher" << std::endl;
    }
}

// -----------------------------------------------------------------------------
// Portal Address Checks
// -----------------------------------------------------------------------------

/**
 * @brief Returns true if the given address matches the ERC-20 portal address.
 * @param address The address to check.
 * @return true if matches, false otherwise.
 */
bool isERC20Deposit(const std::string& address) {
    return toLower(address) == ERC20_PORTAL_ADDRESS;
}

/**
 * @brief Returns true if the given address matches the ERC-721 portal address.
 * @param address The address to check.
 * @return true if matches, false otherwise.
 */
bool isERC721Deposit(const std::string& address) {
    return toLower(address) == ERC721_PORTAL_ADDRESS;
}

// -----------------------------------------------------------------------------
// Deposit Parsing
// -----------------------------------------------------------------------------

/**
 * @brief Parses an ERC-20 deposit payload into a JSON object.
 * Expected structure: success (1 byte), token (20), sender (20), amount (32), optional extra.
 * @param payload The hex-encoded payload.
 * @return picojson object with keys: success, token, sender, amount, execLayerData (optional).
 */
picojson::object parseERC20Deposit(const std::string& payload) {
    picojson::object obj;
    obj["success"] = picojson::value(eth::hexToBool(eth::slice(payload, 0, 1)));
    obj["token"] = picojson::value(eth::slice(payload, 1, 21));
    obj["sender"] = picojson::value(eth::slice(payload, 21, 41));
    obj["amount"] = picojson::value(eth::slice(payload, 41, 73));

    size_t execStart = 73;
    size_t totalBytes = (payload.length() - 2) / 2; // account for "0x"
    if (totalBytes > execStart) {
        obj["execLayerData"] = picojson::value(eth::slice(payload, execStart, totalBytes));
    }

    return obj;
}

/**
 * @brief Parses an ERC-721 deposit payload into a JSON object.
 * Expected structure: token (20 bytes), sender (20), tokenId (32).
 * @param payload The hex-encoded payload.
 * @return picojson object with keys: token, sender, tokenId.
 */
picojson::object parseERC721Deposit(const std::string& payload) {
    picojson::object obj;
    obj["token"] = picojson::value(eth::slice(payload, 0, 20));
    obj["sender"] = picojson::value(eth::slice(payload, 20, 40));
    obj["tokenId"] = picojson::value(eth::slice(payload, 40, 72));
    return obj;
}

// -----------------------------------------------------------------------------
// Map Encoding
// -----------------------------------------------------------------------------

/**
 * @brief Sends a notice of the map as a hex-encoded payload.
 * @param cli The configured httplib::Client object.
 * @param mapVector A vector of uint16 values representing the map.
 */
void createMapNotice(httplib::Client& cli, const std::vector<uint16_t>& mapVector) {
    createNotice(cli, eth::uint16VectorToHex(mapVector));
}

/**
 * @brief Sends a report of the map as a hex-encoded payload.
 * @param cli The configured httplib::Client object.
 * @param mapVector A vector of uint16 values representing the map.
 */
void createMapReport(httplib::Client& cli, const std::vector<uint16_t>& mapVector) {
    createReport(cli, eth::uint16VectorToHex(mapVector));
}

#endif // CARTESI_H
