#include <stdio.h>
#include <iostream>
#include <unordered_map>
#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"
#include "engine/micropolis.h"
#include "uint256_t/uint256_t.h"
#include "cartesi.h"
#include "eth-util.h"
#include "game-util.h"

std::unordered_map <std::string, Micropolis> cities;
std::unordered_map <std::string, Micropolis> cityStorage;

std::string TOKEN_CONTRACT_ADDRESS = "0x92c6bca388e99d6b304f1af3c3cd749ff0b591e2"; // Test Token: 0x92c6bca388e99d6b304f1af3c3cd749ff0b591e2
std::string NFT_CONTRACT_ADDRESS = "";
std::string BUY_IN_AMOUNT = "0x00000000000000000000000000000000000000000000043c33c1937564800000"; // 20,000 18n decimals

std::string getCityStats(Micropolis city){
    picojson::object statsJson;
    statsJson["population"] = picojson::value(static_cast<double>(city.cityPop));
    statsJson["totalFunds"] = picojson::value(static_cast<double>(city.totalFunds));
    statsJson["cityTime"] = picojson::value(static_cast<double>(city.cityTime));
    std::string stats = picojson::value(statsJson).serialize();
    return stats;
}

void createGameNotices(httplib::Client &cli, Micropolis city){
    createMapNotice(cli, convertMapToUint16Vector(city.map[0], WORLD_W, WORLD_H));
    std::string stats = getCityStats(city);
    createNotice(cli, eth::stringToHex(stats));
}

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::string msgSender = data.get("metadata").get("msg_sender").to_str();
    std::string payload = data.get("payload").to_str();
    std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
    std::cout << "Message Sender: " << msgSender << std::endl;
    std::cout << "Payload: " << payload << std::endl;
    if(isERC20Deposit(msgSender)){
        picojson::object deposit = parseERC20Deposit(payload);
        std::string success = deposit["success"].to_str();
        std::string token = deposit["token"].to_str();
        std::string sender = deposit["sender"].to_str();
        std::string amount = deposit["amount"].to_str();
        std::cout << "Success: " << success << std::endl;
        std::cout << "Token: " << token << std::endl;
        std::cout << "Sender: " << sender << std::endl;
        std::cout << "Amount: " << amount << std::endl;
        if(toLower(token) == TOKEN_CONTRACT_ADDRESS){
            if(amount >= BUY_IN_AMOUNT){ // Check if amount if greater than 20,000 18n decimals
                if(deposit.count("execLayerData")){ // Check if there is execLayerData
                    std::string execLayerData = deposit["execLayerData"].to_str();
                    std::string decodedData = eth::hexToString(execLayerData);
                    picojson::value parsedData;
                    std::cout << "Exec Layer Data: " << execLayerData << std::endl;
                    std::string err = picojson::parse(parsedData, decodedData); // Attempt to parse decoded execLayerData into picojson::value
                    if (!err.empty()){ // If not JSON string handle accordingly
                        std::cout << "decodedData is not a valid JSON string" << std::endl;
                        std::cout << "Decoded Data: " << decodedData << std::endl;
                        std::cout << std::setw(20) << std::setfill('-') << "" << std::endl;
                        return "reject";
                    }
                    std::string method = parsedData.get("method").to_str();
                    std::cout << "Method: " << method << std::endl;
                    if(method == "create"){ 
                        if(cities.count(sender)){ // If city already exists at address, reject
                            std::cout << "City already exists at address: " << sender << std::endl;
                            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
                            return "reject";
                        }
                        else{
                            std::cout << "City does not yet exist at address: " << sender << std::endl;
                            std::cout << "Generating city..." << std::endl;
                            cities[sender] = Micropolis();
                            cities[sender].generateMap();
                            cities[sender].setSpeed(3);
                            cities[sender].setPasses(50);            
                            std::cout << "City generated for: " << sender << std::endl;
                            createGameNotices(cli, cities[sender]);
                            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
                            return "accept";
                        }
                    }
                }
            }   
        }
    }
    else if(isERC721Deposit(msgSender)){
        picojson::object deposit = parseERC721Deposit(payload);
        std::string sender = deposit["sender"].to_str();
        std::string token = deposit["token"].to_str();
        std::string tokenId = deposit["tokenId"].to_str();
        std::cout << "Token: " << token << std::endl;
        std::cout << "Sender: " << sender << std::endl;
        std::cout << "Token ID: " << tokenId << std::endl;
        if(toLower(token) == NFT_CONTRACT_ADDRESS){
            // TODO: Handle NFT deposit
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            return "accept";
        }
    }
    else{
        picojson::value parsedPayload;
        std::string decodedPayload = eth::hexToString(payload); // Decode payload from hex
        std::string err = picojson::parse(parsedPayload, decodedPayload); // Parse payload as pisojson::value
        if(!err.empty()){
            std::cout << "decodedPayload is not a valid JSON string" << std::endl;
            std::cout << "Decoded Payload: " << decodedPayload << std::endl;
                std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            return "reject";
        }
        std::string method = parsedPayload.get("method").to_str();
        std::cout << "Method: " << method << std::endl;
        if(method == "doTool"){ // Method: doTool
            if(!cities.count(msgSender)){
                std::cout << "City does not yet exist at address: " << msgSender << std::endl;
                std::cout << "Unable to doTool" << std::endl;
                std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
                return "reject";
            }
            std::cout << "City exists at address: " << msgSender << std::endl;
            int tool = std::stoi(parsedPayload.get("tool").to_str());
            int x = std::stoi(parsedPayload.get("x").to_str());
            int y = std::stoi(parsedPayload.get("y").to_str());
            EditingTool editingTool = static_cast<EditingTool>(tool);
            std::cout << "Doing tool " << tool << " at (" << x << "," << y << ")..." << std::endl; // Output before attempting doTool
            cities[msgSender].doTool(editingTool, x, y);
            cities[msgSender].simTick(); // Simulate tick after doTool
            std::cout << "Success!" << std::endl; // Output after attempting doTool
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            createGameNotices(cli, cities[msgSender]);
            return "accept";
        }
        else if(method == "simTick"){ // Method: simTick
            if(!cities.count(msgSender)){
                std::cout << "City does not yet exist at address: " << msgSender << std::endl;
                std::cout << "Unable to simTick" << std::endl;
                std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
                return "reject";
            }
            int ticks = std::stoi(parsedPayload.get("ticks").to_str()); // Output before attempting simTick
            std::cout << "Simulating " << ticks << " ticks" << std:: endl;
            for(uint i = 0; i < ticks; i++){ // Loop through number of ticks
                cities[msgSender].simTick();
            }
            std::cout << "Finished simulating!" << std:: endl; // Output after attempting simTick
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            createGameNotices(cli, cities[msgSender]);
            return "accept";
        }
        else if(method == "doBudget"){ // Method: doBudget
            if(!cities.count(msgSender)){
                std::cout << "City does not yet exist at address: " << msgSender << std::endl;
                std::cout << "Unable to doBudget" << std::endl;
                std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
                return "reject";
            }
            // TODO: Handle doBudget logic
        }
    }

    std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
    return "accept";
}

std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    std::string payload = data.get("payload").to_str();
    std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
    std::cout << "Payload: " << payload << std::endl;
    picojson::value parsedPayload;
    std::string decodedPayload = eth::hexToString(payload); // Decode payload from hex
    std::string err = picojson::parse(parsedPayload, decodedPayload); // Parse payload as pisojson::value
    if(!err.empty()){
        std::cout << "decodedPayload is not a valid JSON string" << std::endl;
        std::cout << "Decoded Payload: " << decodedPayload << std::endl;
    }
    std::string method = parsedPayload.get("method").to_str();
    std::cout << "Method: " << method << std::endl;

    if(method == "hasCity"){ // Method: inspect
        std::string address = parsedPayload.get("address").to_str();
        // TODO: Handle hasCity logic
        std::cout << "Checking if user has city...";
        std::string hasCity = eth::boolToHex(cities.count(address));
        std::cout << "Finished checking!" << std::endl;
        createReport(cli, hasCity);
        std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
        return "accept";
    }
    else if(method == "inspect"){ // Method: inspect
        std::string address = parsedPayload.get("address").to_str();
        if(!cities.count(address)){
            std::cout << "City does not yet exist at address: " << address << std::endl;
            std::cout << "Unable to inspect" << std::endl;
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            return "reject";
        }
        // TODO: Handle inspect logic
    }
    else if(method == "getEvaluation"){
        std::string address = parsedPayload.get("address").to_str();
        if(!cities.count(address)){
            std::cout << "City does not yet exist at address: " << address << std::endl;
            std::cout << "Unable to getEvaluation" << std::endl;
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            return "reject";
        }
        // TODO: Handle getEvaluation logic
    }
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
