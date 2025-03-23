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

bool isERC20Deposit(const std::string& address) {
    return address == ERC20_PORTAL_ADDRESS;
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
    // Format the payload expected by Cartesi
    std::string payload = "{\"destination\":\"" + recipient + "\",\"payload\":\"" + amount + "\"}";
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
}

picojson::object parseERC20Deposit(const std::string& payload) {    
    picojson::object obj;
    obj["success"] = picojson::value(hexToBool(slice(payload, 0, 1)));
    obj["token"] = picojson::value(slice(payload, 1, 21));
    obj["sender"] = picojson::value(slice(payload, 21, 41));
    obj["amount"] = picojson::value(slice(payload, 41, 73));
    return obj;
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
        picojson::object deposit = parseERC20Deposit(payload);
        std::string user = deposit["sender"].to_str();
        std::cout << "Success: " << deposit["success"].to_str() << std::endl;
        std::cout << "Token: " << deposit["token"].to_str() << std::endl;
        std::cout << "Sender: " << deposit["sender"].to_str() << std::endl;
        std::cout << "Amount: " << deposit["amount"].to_str() << std::endl;
        
        walletHandler->depositERC20(user, deposit["amount"].to_str());
        std::cout << "User " << user << " balance after deposit: " << walletHandler->getERC20Balance(user) << std::endl;     
        return "accept";
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
            games[address]->setSpeed(1000);
            games[address]->generateMap();
            std::cout << "City generated for" << address << std::endl;
            std::string hexAmount = "0x00000000000000000000000000000000000000000000043c33c1937564800000"; // 20000 18n
            if (walletHandler->transferERC20(address, GAME_WALLET, hexAmount)) {
                std::cout << "Transfer successful!" << std::endl;
                std::cout << "Balance of " << address << " is " << walletHandler->getERC20Balance(address) << std::endl;
            } else {
                std::cout << "Transfer failed: Insufficient funds!" << std::endl;
                std::cout << "Balance of " << address << " is " << walletHandler->getERC20Balance(address) << std::endl;
                return "reject";
            }
            createGameNotices(cli, games[address]);
            return "accept";
        }
        else if(method == "doTool"){
            if (games.find(address) == games.end()) return "reject";
            EditingTool tool = static_cast<EditingTool>(std::stoi(parsed_payload.get("tool").to_str()));
            int x = std::stoi(parsed_payload.get("x").to_str());
            int y = std::stoi(parsed_payload.get("y").to_str());
            games[address]->doTool(tool, x, y);
            games[address]->simTick();
            std::cout << "Using tool " << parsed_payload.get("tool").to_str() << " at (" << x << ", " << y << ") to game " << address << std::endl;
            createGameNotices(cli, games[address]);
            return "accept";
        }
        else if(method == "withdraw"){
            if (games.find(address) == games.end()) return "reject";
            std::string amount = parsed_payload.get("amount").to_str();
            generateVoucher(cli, address, amount);
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
            uint256_t balance = walletHandler->getERC20Balance(address);
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


