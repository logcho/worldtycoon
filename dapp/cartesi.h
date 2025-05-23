/**
 * @file cartesi.h
 * @brief Utility functions for utilizing cartesi.
 * @author Logan Choi
 * @date 2025-05-21
 */

#ifndef CARTESI_H
#define CARTESI_H

#include <iostream>
#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"
#include "helper.h"
#include "eth-util.h"

/**
 * @brief Address of the standard ERC-20 portal contract.
 *
 * This address is used to identify deposits of ERC-20 tokens through the portal.
 */
const std::string ERC20_PORTAL_ADDRESS = "0x9c21aeb2093c32ddbc53eef24b873bdcd1ada1db";

/**
 * @brief Address of the standard ERC-721 portal contract.
 *
 * This address is used to identify deposits of ERC-721 (NFT) tokens through the portal.
 */
const std::string ERC721_PORTAL_ADDRESS = "0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87";

/**
 * @brief Sends a notice with the given payload to the /notice endpoint.
 *
 * This function constructs a JSON payload using the provided hex string
 * and sends it as a POST request to the `/notice` endpoint of the given HTTP client.
 *
 * @param cli The httplib::Client object configured to communicate with the target server.
 * @param payload A hex-encoded string representing the payload to be sent.
 */
void createNotice(httplib::Client& cli, const std::string& payload){
    std::string notice = "{\"payload\":\"" + payload + "\"}";
    std::cout << "Creating notice..." << std::endl;
    auto r = cli.Post("/notice", notice, "application/json");    
    std::cout << "Received notice status " << r.value().status << std::endl;
}

/**
 * @brief Sends a report with the given payload to the /report endpoint.
 *
 * This function constructs a JSON payload using the provided hex string
 * and sends it as a POST request to the `/report` endpoint of the given HTTP client.
 *
 * @param cli The httplib::Client object configured to communicate with the target server.
 * @param payload A hex-encoded string representing the payload to be sent.
 */
void createReport(httplib::Client& cli, const std::string& payload){
    std::string report = "{\"payload\":\"" + payload + "\"}";
    std::cout << "Creating report..." << std::endl;
    auto r = cli.Post("/report", report, "application/json");    
    std::cout << "Received report status " << r.value().status << std::endl;
}

/**
 * @brief Sends a voucher with the given payload and destination to the /voucher endpoint.
 *
 * This function constructs a JSON payload using the provided hex string
 * and sends it as a POST request to the `/voucher` endpoint of the given HTTP client.
 *
 * @param cli The httplib::Client object configured to communicate with the target server.
 * @param payload A hex-encoded string representing the payload to be sent.
 * @param destination A string representing the address of the payload.
 */
void createVoucher(httplib::Client& cli, const std::string& payload, const std::string& destination){
    std::string voucher = "{\"destination\": " + destination + "\", \"payload\": \"" + payload + "\"}";
    std::cout << "Creating voucher..." << std::endl;
    auto r = cli.Post("/voucher", voucher, "application/json");    
    std::cout << "Received voucher status " << r.value().status << std::endl;
}

/**
 * @brief Checks whether a given address is the ERC-20 portal address.
 *
 * This function performs a case-insensitive comparison between the provided
 * address and a predefined ERC-20 portal address constant.
 *
 * @param address The address string to check.
 * @return true if the address matches the ERC-20 portal address, false otherwise.
 */
bool isERC20Deposit(const std::string address){
    return toLower(address) == ERC20_PORTAL_ADDRESS;
}

/**
 * @brief Checks whether a given address is the ERC-721 portal address.
 *
 * This function performs a case-insensitive comparison between the provided
 * address and a predefined ERC-721 portal address constant.
 *
 * @param address The address string to check.
 * @return true if the address matches the ERC-721 portal address, false otherwise.
 */
bool isERC721Deposit(const std::string address){
    return toLower(address) == ERC721_PORTAL_ADDRESS;
}

/**
 * @brief Parses an ERC-20 deposit payload into a JSON object.
 *
 * This function extracts and decodes key fields from a hex-encoded ERC-20 deposit payload:
 * - `success`: A boolean flag indicating whether the deposit succeeded.
 * - `token`: The address of the ERC-20 token contract.
 * - `sender`: The address of the sender who initiated the deposit.
 * - `amount`: The amount of tokens deposited.
 * - `execLayerData` (optional): Any additional execution layer data appended to the payload.
 *
 * The function assumes the first 73 bytes (146 hex characters) are fixed-format.
 * If extra data remains, it will be included under the `execLayerData` key.
 *
 * @param payload A hex-encoded string representing the deposit payload.
 * @return A picojson::object containing parsed fields: success, token, sender, amount, and optionally execLayerData.
 */
picojson::object parseERC20Deposit(const std::string& payload) {    
    picojson::object obj;

    // Parse known fixed segments
    obj["success"] = picojson::value(eth::hexToBool(eth::slice(payload, 0, 1)));
    obj["token"] = picojson::value(eth::slice(payload, 1, 21));
    obj["sender"] = picojson::value(eth::slice(payload, 21, 41));
    obj["amount"] = picojson::value(eth::slice(payload, 41, 73));

    // Optional: extract execution layer data if present
    const size_t execStart = 73;
    size_t totalBytes = (payload.length() - 2) / 2; // minus 2 for "0x", divide by 2 for bytes
    if (totalBytes > execStart) {
        obj["execLayerData"] = picojson::value(eth::slice(payload, execStart, totalBytes));
    }

    return obj;
}

/**
 * @brief Parses an ERC-721 deposit payload into a JSON object.
 *
 * This function extracts and decodes key fields from a hex-encoded ERC-721 deposit payload:
 * - `token`: the address of the ERC-721 contract.
 * - `sender`: the address of the user who deposited the NFT.
 * - `tokenId`: the ID of the NFT that was deposited.
 *
 * @param payload A hex-encoded string representing the deposit payload.
 * @return A picojson::object containing parsed fields: token, sender, and tokenId.
 */
picojson::object parseERC721Deposit(const std::string& payload) {
    picojson::object obj;
    obj["token"] = picojson::value(eth::slice(payload, 0, 20));     
    obj["sender"] = picojson::value(eth::slice(payload, 20, 40));    
    obj["tokenId"] = picojson::value(eth::slice(payload, 40, 72));   
    return obj;
}

/**
 * @brief Converts mapVector into hex then sends as a notice to /notice endpoint
 * 
 * This function takes the map data converted into a vector and encodes it into a hex string
 * and sends it as a POST request to the `/notice` endpoint of the given HTTP client.
 * 
 * @param cli The httplib::Client object configured to communicate with the target server.
 * @param mapVector A uint16 vector representing map data
 */
void createMapNotice(httplib::Client& cli, const std::vector<uint16_t>& mapVector){
    createNotice(cli, eth::uint16VectorToHex(mapVector)); // Map
}

#endif // CARTESI_H