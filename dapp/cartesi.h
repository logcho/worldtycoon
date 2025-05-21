/**
 * @file cartesi.h
 * @brief Utility functions for utilizing cartesi.
 * @author Logan Choi
 * @date 2025-05-21
 */

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"
#include "helper.h"

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
void createNotice(const httplib::Client& cli, const std::string& payload){
    std::string notice = "{\"payload\":\"" + payload + "\"}";
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
void createReport(const httplib::Client& cli, const std::string& payload){
    std::string report = "{\"payload\":\"" + payload + "\"}";
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
void createVoucher(const httplib::Client& cli, const std::string& payload, const std::string& destination){
    std::string voucher = "{\"destination\": " + destination + "\", \"payload\": \"" + payload + "\"}";
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
 * - `success`: a boolean flag indicating whether the deposit succeeded.
 * - `token`: the address of the ERC-20 token contract.
 * - `sender`: the address of the sender who initiated the deposit.
 * - `amount`: the amount of tokens deposited.
 *
 * @param payload A hex-encoded string representing the deposit payload.
 * @return A picojson::object containing parsed fields: success, token, sender, and amount.
 */
picojson::object parseERC20Deposit(const std::string& payload) {    
    picojson::object obj;
    obj["success"] = picojson::value(hexToBool(slice(payload, 0, 1)));
    obj["token"] = picojson::value(slice(payload, 1, 21));
    obj["sender"] = picojson::value(slice(payload, 21, 41));
    obj["amount"] = picojson::value(slice(payload, 41, 73));
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
    obj["token"] = picojson::value(slice(payload, 0, 20));     
    obj["sender"] = picojson::value(slice(payload, 20, 40));    
    obj["tokenId"] = picojson::value(slice(payload, 40, 72));   
    return obj;
}

