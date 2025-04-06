#include <stdio.h>
#include <iostream>
#include <iomanip>
#include <unordered_map>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

#include "engine/micropolis.h"

#include "util.h"
#include "wallet.h"

const std::string ERC20_PORTAL_ADDRESS = "0x9c21aeb2093c32ddbc53eef24b873bdcd1ada1db";
const std::string TOKEN = "0x92c6bca388e99d6b304f1af3c3cd749ff0b591e2";

const std::string GAME_WALLET = "0x0000000000000000000000000000000000000001";
const std::string PEOPLE_WALLET = "0x0000000000000000000000000000000000000002";

Wallet* walletHandler = new Wallet();
std::unordered_map<std::string, Micropolis*> games;

// Left-pads a hex string to 64 characters (32 bytes)
std::string padTo32Bytes(const std::string &hex) {
    std::string clean = (hex.substr(0, 2) == "0x") ? hex.substr(2) : hex;
    return std::string(64 - clean.length(), '0') + clean;
}

// Prepares the calldata for ERC-20 transfer(address,uint256)
std::string encodeTransferCall(const std::string &recipient, const std::string &amountHex) {
    std::string methodId = "a9059cbb"; // Precomputed for transfer(address,uint256)

    // Pad recipient address and amount
    std::string paddedRecipient = padTo32Bytes(recipient);
    std::string paddedAmount = padTo32Bytes(amountHex);

    return "0x" + methodId + paddedRecipient + paddedAmount;
}

void createReport(httplib::Client &cli, const std::string &payload) {
    std::string report = std::string("{\"payload\":\"") + payload + std::string("\"}");
    auto r = cli.Post("/report", report, "application/json");    
    // Expect status 202
    std::cout << "Received report status " << r.value().status << std::endl;
}

void createNotice(httplib::Client &cli, const std::string &payload) {
    std::string notice = std::string("{\"payload\":\"") + payload + std::string("\"}");
    auto r = cli.Post("/notice", notice, "application/json");    
    // Expect status 201
    std::cout << "Received notice status " << r.value().status << std::endl;
}

void generateVoucher(httplib::Client &cli, const std::string &recipient, std::string amount) {
    std::string transferCall = encodeTransferCall(recipient, amount);
    // Format the payload expected by Cartesi
    std::string payload = "{\"destination\":\"" + TOKEN + "\",\"payload\":\"" + transferCall + "\"}";
    // Payload should be abi transfer to erc20 address
    auto r = cli.Post("/voucher", payload, "application/json");
    if (r) {
        std::cout << "[VOUCHER] Sent: " << payload << std::endl;
        std::cout << "Received status: " << r->status << std::endl;
    } else {
        std::cerr << "[ERROR] Failed to send voucher" << std::endl;
    }
}

void createGameNotices(httplib::Client &cli, const Micropolis *game){
    createNotice(cli, vectorToHexUint16(convertMap(game->map[0], WORLD_W, WORLD_H))); // Map
    createNotice(cli, uint64ToHex(game->cityPop)); // Population
    createNotice(cli, uint64ToHex(game->totalFunds)); // City funds
    createNotice(cli, uint64ToHex(game->cityTime)); // City time
    createNotice(cli, uint64ToHex(game->cityTax)); // City tax
    createNotice(cli, uint64ToHex(game->taxFund)); // Tax Fund
    createNotice(cli, uint64ToHex(static_cast<int>(game->firePercent * 100))); // Fire percent
    createNotice(cli, uint64ToHex(static_cast<int>(game->policePercent * 100))); // Police percent
    createNotice(cli, uint64ToHex(static_cast<int>(game->roadPercent * 100))); // Road percent
    createNotice(cli, uint64ToHex(game->fireFund));
    createNotice(cli, uint64ToHex(game->policeFund));
    createNotice(cli, uint64ToHex(game->roadFund));
    createNotice(cli, stringToHex(std::to_string(game->cashFlow)));
    std::cout << std::to_string(game->cashFlow) << std::endl;
    // std::cout << static_cast<int>(game->firePercent * 100) << std::endl;

    // std::cout << game->cityTax << std::endl;
}

bool isERC20Deposit(const std::string& address) {
    return address == ERC20_PORTAL_ADDRESS;
}

picojson::object parseERC20Deposit(const std::string& payload) {    
    picojson::object obj;
    obj["success"] = picojson::value(hexToBool(slice(payload, 0, 1)));
    obj["token"] = picojson::value(slice(payload, 1, 21));
    obj["sender"] = picojson::value(slice(payload, 21, 41));
    obj["amount"] = picojson::value(slice(payload, 41, 73));
    return obj;
}

std::string handleERC20Deposit(httplib::Client &cli, const std::string& address, const std::string& payload){
    picojson::object deposit = parseERC20Deposit(payload);
    std::string user = deposit["sender"].to_str();
    std::cout << "Success: " << deposit["success"].to_str() << std::endl;
    std::cout << "Token: " << deposit["token"].to_str() << std::endl;
    std::cout << "Sender: " << deposit["sender"].to_str() << std::endl;
    std::cout << "Amount: " << deposit["amount"].to_str() << std::endl;
    
    walletHandler->depositToken(user, deposit["amount"].to_str());
    std::cout << "User " << user << " balance after deposit: " << walletHandler->getTokenBalance(user) << std::endl;     
    return "accept";
}

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::string address = data.get("metadata").get("msg_sender").to_str();
    std::string payload = data.get("payload").to_str();
    std::cout << std::setw(20) << std::setfill('-') << "" << std::endl;
    std::cout << "Address: " << address << std::endl;
    std::cout << "Payload: " << payload << std::endl;
    std::cout << std::setw(20) << std::setfill('-') << "" << std::endl;
    if(isERC20Deposit(address)){
        return handleERC20Deposit(cli, address, payload);
    }   
    else{
        picojson::value parsed_payload;
        std::string decoded_payload = hexToString(payload);
        std::string err = picojson::parse(parsed_payload, decoded_payload);
        if (!err.empty()) return "reject";
        std::string method = parsed_payload.get("method").to_str();
        std::cout << "method: " << method << std::endl;
        if(method == "start"){
            if (games.find(address) != games.end()) return "reject";
            games[address] = new Micropolis();
            games[address]->setSpeed(3);
            games[address]->setPasses(100);
            games[address]->generateMap();
            std::cout << "City generated for" << address << std::endl;
            std::string hexAmount = "0x00000000000000000000000000000000000000000000043c33c1937564800000"; // 20000 18n
            if (walletHandler->transferToken(address, GAME_WALLET, hexAmount)) {
                std::cout << "Transfer successful!" << std::endl;
                std::cout << "Balance of " << address << " is " << walletHandler->getTokenBalance(address) << std::endl;
            } else {
                std::cout << "Transfer failed: Insufficient funds!" << std::endl;
                std::cout << "Balance of " << address << " is " << walletHandler->getTokenBalance(address) << std::endl;
                return "reject";
            }
            createGameNotices(cli, games[address]);
            return "accept";
        }
        // else if(method == "start"){
        //     if (games.find(address) == games.end()) return "reject";
        //     createGameNotices(cli, games[address]);
        //     return "accept";
        // }
        else if(method == "doTool"){
            if (games.find(address) == games.end()) return "reject";
            EditingTool tool = static_cast<EditingTool>(std::stoi(parsed_payload.get("tool").to_str()));
            int x = std::stoi(parsed_payload.get("x").to_str());
            int y = std::stoi(parsed_payload.get("y").to_str());
            games[address]->doTool(tool, x, y);
            // for(int i = 0; i < 100; i++){
            //     games[address]->simTick();
            // }
            games[address]->simTick();
            std::cout << "Using tool " << parsed_payload.get("tool").to_str() << " at (" << x << ", " << y << ") to game " << address << std::endl;
            createGameNotices(cli, games[address]);
            return "accept";
        }
        else if(method == "doBudget"){
            if (games.find(address) == games.end()) return "reject";
            double roads = std::stod(parsed_payload.get("roads").to_str());
            double fire = std::stod(parsed_payload.get("fire").to_str());
            double police = std::stod(parsed_payload.get("police").to_str());
            int tax = std::stoi(parsed_payload.get("tax").to_str());

            games[address]->firePercent = fire;
            games[address]->policePercent = police;
            games[address]->roadPercent = roads;
            games[address]->setCityTax(tax);
            
            // for(int i = 0; i < 100; i++){
            //     games[address]->simTick();
            // }
            std::cout << "Setting budget " << "roads: " << games[address]->roadPercent << " fire: " << games[address]->firePercent << " police: " << games[address]->policePercent << " tax: " << tax << " for game " << address << std::endl;
            createGameNotices(cli, games[address]);
            return "accept";
        }
        else if(method == "withdraw"){
            if (games.find(address) == games.end()) return "reject";
            // std::cout << parsed_payload.get("amount").to_str() << std::endl;
            // uint256_t amount(parsed_payload.get("amount").to_str(), 10);
            uint256_t decimals("1000000000000000000", 10); // 18 decimals
            uint256_t formattedBalance = games[address]->totalFunds * decimals;
            // std::cout << decimals << std::endl;
            // std::cout << formattedBalance << std::endl;
            // std::cout << amount << std::endl;
            std::string hexAmount = "0x" + formattedBalance.str(16, 32);
            // std::cout << hexAmount << std::endl;
            generateVoucher(cli, address, hexAmount);
            delete games[address];     // Deallocate the memory
            games.erase(address); 
            return "accept";
        }
    }
    return "reject";
}

std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    std::string payload = data.get("payload").to_str();
    std::cout << std::setw(20) << std::setfill('-') << "" << std::endl;
    std::cout << "Payload: " << payload << std::endl;
    std::cout << "Converted Payload: " << hexToString(payload) << std::endl;
    picojson::value parsed_payload;
    std::string decoded_payload = hexToString(payload);
    std::string err = picojson::parse(parsed_payload, decoded_payload);
    if (!err.empty()) return "reject";
    else{
        std::string method = parsed_payload.get("method").to_str();
        if(method == "balanceOf"){
            std::string address = parsed_payload.get("address").to_str();
            std::transform(address.begin(), address.end(), address.begin(), ::tolower);
            uint256_t balance = walletHandler->getTokenBalance(address);
            std::cout << "Balance of " << address << " is " << balance << std::endl;

            std::ostringstream hexStream;
            hexStream << "0x" << std::setw(64) << std::setfill('0') << std::hex << balance;
            createReport(cli, hexStream.str());
        }
        else if(method == "getMap"){
            std::string address = parsed_payload.get("address").to_str();
            std::transform(address.begin(), address.end(), address.begin(), ::tolower);
            if (games.find(address) == games.end()) return "reject";
            createReport(cli, vectorToHexUint16(convertMap(games[address]->map[0], WORLD_W, WORLD_H)));
        }
        else if(method == "getFunds"){
            std::string address = parsed_payload.get("address").to_str();
            std::transform(address.begin(), address.end(), address.begin(), ::tolower);
            if (games.find(address) == games.end()) createReport(cli, uint64ToHex(0)); // Funds is 0 if city does not exist
            else createReport(cli, uint64ToHex(games[address]->totalFunds));
        }
    }
    std::cout << std::setw(20) << std::setfill('-') << "" << std::endl;
    return "accept";
}

int main(int argc, char **argv)
{
    std::map<std::string, decltype(&handle_advance)> handlers = {
        {std::string("advance_state"), &handle_advance},
        {std::string("inspect_state"), &handle_inspect},
    };
    httplib::Client cli(getenv("ROLLUP_HTTP_SERVER_URL"));
    cli.set_read_timeout(20, 0);
    std::string status("accept");
    std::string rollup_address;
    while (true)
    {
        std::cout << "Sending finish" << std::endl;
        auto finish = std::string("{\"status\":\"") + status + std::string("\"}");
        auto r = cli.Post("/finish", finish, "application/json");
        std::cout << "Received finish status " << r.value().status << std::endl;
        if (r.value().status == 202)
        {
            std::cout << "No pending rollup request, trying again" << std::endl;
        }
        else
        {
            picojson::value rollup_request;
            picojson::parse(rollup_request, r.value().body);
            picojson::value metadata = rollup_request.get("data").get("metadata");
            auto request_type = rollup_request.get("request_type").get<std::string>();
            auto handler = handlers.find(request_type)->second;
            auto data = rollup_request.get("data");
            status = (*handler)(cli, data);
        }
    }
    return 0;
}


