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
    std::cout << "address: " << address << std::endl;
    std::cout << "Payload: " << payload << std::endl;
    std::cout << std::setw(20) << std::setfill('-') << "" << std::endl;
    if(isERC20Deposit(address)){
        picojson::object deposit = parseERC20Deposit(payload);
        std::string user = deposit["sender"].to_str();;
        
        // gameBalance += depositAmount;
        walletHandler->depositERC20(user, deposit["value"].to_str().substr(2));
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
            games[address]->generateMap();
            std::cout << "City generated for" << address << std::endl;
            return "accept";
        }
        else if(method == "doTool"){
            if (games.find(address) == games.end()) return "reject";
            EditingTool tool = static_cast<EditingTool>(std::stoi(parsed_payload.get("tool").to_str()));
            int x = std::stoi(parsed_payload.get("x").to_str());
            int y = std::stoi(parsed_payload.get("y").to_str());
            games[address]->doTool(tool, x, y);
            std::cout << "Using tool " << parsed_payload.get("tool").to_str() << " at (" << x << ", " << y << ") to game " << address << std::endl;
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


