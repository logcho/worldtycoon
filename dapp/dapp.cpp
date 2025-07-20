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

std::unordered_map <std::string, Micropolis*> cities;
std::unordered_map <std::string, Micropolis*> cityStorage;

const std::string TOKEN_CONTRACT_ADDRESS = "0x92c6bca388e99d6b304f1af3c3cd749ff0b591e2"; // Test Token: 0x92c6bca388e99d6b304f1af3c3cd749ff0b591e2
const std::string NFT_CONTRACT_ADDRESS = "0x36c02da8a0983159322a80ffe9f24b1acff8b570"; // Test Contract Address: 0x36c02da8a0983159322a80ffe9f24b1acff8b570
const std::string BUY_IN_AMOUNT = "0x00000000000000000000000000000000000000000000043c33c1937564800000"; // 20,000 18n decimals

uint256_t tokenId = 1;

std::string getCityStats(Micropolis* city){
    picojson::object statsJson;
    statsJson["population"] = picojson::value(static_cast<double>(city->cityPop));
    statsJson["totalFunds"] = picojson::value(static_cast<double>(city->totalFunds));
    statsJson["cityTime"] = picojson::value(static_cast<double>(city->cityTime));
    statsJson["cityTax"] = picojson::value(static_cast<double>(city->cityTax));
    statsJson["taxFund"] = picojson::value(static_cast<double>(city->taxFund));
    statsJson["firePercent"] = picojson::value(city->firePercent);  
    statsJson["policePercent"] = picojson::value(city->policePercent);   
    statsJson["roadPercent"] = picojson::value(city->roadPercent);     
    statsJson["fireFund"] = picojson::value(static_cast<double>(city->fireFund));
    statsJson["policeFund"] = picojson::value(static_cast<double>(city->policeFund));
    statsJson["roadFund"] = picojson::value(static_cast<double>(city->roadFund));
    statsJson["cashFlow"] = picojson::value(static_cast<double>(city->cashFlow)); 
    std::string stats = picojson::value(statsJson).serialize();
    return stats;
}

void createGameNotices(httplib::Client &cli, Micropolis* city){
    createMapNotice(cli, convertMapToUint16Vector(city->map[0], WORLD_W, WORLD_H));
    std::string stats = getCityStats(city);
    createNotice(cli, eth::stringToHex(stats));
}

void createGameReport(httplib::Client &cli, Micropolis* city){
    createMapReport(cli, convertMapToUint16Vector(city->map[0], WORLD_W, WORLD_H));
    std::string stats = getCityStats(city);
    createReport(cli, eth::stringToHex(stats));
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

                            std::cout << "Assigning city..." << std::endl;                            
                            cities[sender] = new Micropolis();
                            std::cout << "City assigned!" << std::endl;

                            std::cout << "Generating map..." << std::endl;
                            cities[sender]->generateMap();
                            std::cout << "Map generated!" << std::endl;      

                            std::cout << "Setting speed..." << std::endl;
                            cities[sender]->setSpeed(1);
                            std::cout << "Speed set!" << std::endl;      

                            std::cout << "Setting passes..." << std::endl;
                            cities[sender]->setPasses(300);      
                            std::cout << "Passes set!" << std::endl;  

                            std::cout << "City successfully created for: " << sender << "!" << std::endl;

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
            uint256_t num(tokenId.substr(2), 16);
            std::string id = num.str();
            std::cout << "ID: " << id << std::endl;
            if(cityStorage.count(id)){
                std::cout << "Setting City..." << std::endl;
                cities[sender] = cityStorage[id];
                cityStorage.erase(id);
                std::cout << "City Loaded!" << std::endl;
            }
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
            std::cout << "Decoded Payload: " << decodedPayload << std::endl;
            int tool = std::stoi(parsedPayload.get("tool").to_str());
            int x = std::stoi(parsedPayload.get("x").to_str());
            int y = std::stoi(parsedPayload.get("y").to_str());
            EditingTool editingTool = static_cast<EditingTool>(tool);
            std::cout << "Doing tool " << tool << " at (" << x << "," << y << ")..." << std::endl; // Output before attempting doTool
            cities[msgSender]->doTool(editingTool, x, y);
            cities[msgSender]->simTick(); // Simulate tick after doTool
            std::cout << "Success!" << std::endl; // Output after attempting doTool
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            createGameNotices(cli, cities[msgSender]);
            return "accept";
        }
        else if(method == "batchTool"){ // Method: batchTool
            if(!cities.count(msgSender)){
                std::cout << "City does not yet exist at address: " << msgSender << std::endl;
                std::cout << "Unable to batchTool" << std::endl;
                std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
                return "reject";
            }
            std::cout << "City exists at address: " << msgSender << std::endl;
            std::cout << "Decoded Payload: " << decodedPayload << std::endl;
            picojson::array toolsArray = parsedPayload.get("tools").get<picojson::array>();
            picojson::array xsArray = parsedPayload.get("xs").get<picojson::array>();
            picojson::array ysArray = parsedPayload.get("ys").get<picojson::array>();

            if (toolsArray.size() != xsArray.size() || xsArray.size() != ysArray.size()) {
                std::cout << "Array sizes do not match!" << std::endl;
                return "reject";
            }

            for (size_t i = 0; i < toolsArray.size(); ++i) {
                int tool = static_cast<int>(toolsArray[i].get<double>());
                int x = static_cast<int>(xsArray[i].get<double>());
                int y = static_cast<int>(ysArray[i].get<double>());

                EditingTool editingTool = static_cast<EditingTool>(tool);
                std::cout << "Doing tool " << tool << " at (" << x << "," << y << ")..." << std::endl;
                cities[msgSender]->doTool(editingTool, x, y);
            }

            cities[msgSender]->simTick(); // Apply tick after batch processing
            std::cout << "Batch tool actions complete." << std::endl;
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl;

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
                cities[msgSender]->simTick();
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
            double roads = std::stod(parsedPayload.get("roads").to_str());
            double fire = std::stod(parsedPayload.get("fire").to_str());
            double police = std::stod(parsedPayload.get("police").to_str());
            int tax = std::stoi(parsedPayload.get("tax").to_str());

            cities[msgSender]->firePercent = fire;
            cities[msgSender]->policePercent = police;
            cities[msgSender]->roadPercent = roads;
            cities[msgSender]->setCityTax(tax);

            std::cout << "Setting budget " << "roads: " << cities[msgSender]->roadPercent << " fire: " << cities[msgSender]->firePercent << " police: " << cities[msgSender]->policePercent << " tax: " << cities[msgSender]->cityTax << " for city " << msgSender << std::endl;
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            createGameNotices(cli, cities[msgSender]);
        }
        else if(method == "withdraw"){ // Method: doBudget
            if(!cities.count(msgSender)){
                std::cout << "City does not yet exist at address: " << msgSender << std::endl;
                std::cout << "Unable to withdraw" << std::endl;
                std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
                return "reject";
            }
            uint256_t decimals("1000000000000000000", 10); // 18 decimals
            uint256_t formattedBalance = cities[msgSender]->totalFunds * decimals;
            std::string hexAmount = "0x" + formattedBalance.str(16, 32);

            std::cout << "Generating voucher for withdrawal..." << std::endl;
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console

            createTransferVoucher(cli, msgSender, hexAmount, TOKEN_CONTRACT_ADDRESS);

            // Delete city after withdrawing
            delete cities[msgSender];
            cities.erase(msgSender);
            std::cout << "City deleted!" << std::endl;
    
            return "accept";
        }
        else if(method == "mint"){ // Method: mint
            if(!cities.count(msgSender)){
                std::cout << "City does not yet exist at address: " << msgSender << std::endl;
                std::cout << "Unable to mint" << std::endl;
                std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
                return "reject";
            }
            std::string image = parsedPayload.get("image").to_str();
            std::cout << "Image URL: " << image << std::endl;
            std::string stringTokenId = tokenId.str();
            std::cout << "String Token Id: " << stringTokenId << std::endl;
            cityStorage[stringTokenId] = cities[msgSender];
            // Delete key from city after withdrawing
            cities.erase(msgSender);
            std::cout << "Generating voucher for minting..." << std::endl;
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            createMintNFTVoucher(cli, msgSender, stringTokenId, image, NFT_CONTRACT_ADDRESS);           
            tokenId++;

            return "accept";
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
        return "accept";
    }
    std::string method = parsedPayload.get("method").to_str();
    std::cout << "Method: " << method << std::endl;

    if(method == "hasCity"){ // Method: hasCity
        std::string address = toLower(parsedPayload.get("address").to_str());
        // TODO: Handle hasCity logic
        std::cout << "Checking if " << address << " has a city..." << std::endl;
        std::string hasCity = eth::boolToHex(cities.count(address));
        std::cout << "Finished checking " << hasCity << "!" << std::endl;
        createReport(cli, hasCity);
        std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
        return "accept";
    }
    else if(method == "inspect"){ // Method: inspect
        std::string address = toLower(parsedPayload.get("address").to_str());
        if(!cities.count(address)){
            std::cout << "City does not yet exist at address: " << address << std::endl;
            std::cout << "Unable to inspect" << std::endl;
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            return "reject";
        }
        // TODO: Handle inspect logic
    }
    else if(method == "getEvaluation"){ // Method: getEvaluation
        std::string address = toLower(parsedPayload.get("address").to_str());
        if(!cities.count(address)){
            std::cout << "City does not yet exist at address: " << address << std::endl;
            std::cout << "Unable to getEvaluation" << std::endl;
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            return "reject";
        }
        // TODO: Handle getEvaluation logic
    }
    else if(method == "getCity"){ // Method: getCity
        std::string address = toLower(parsedPayload.get("address").to_str());
        if(!cities.count(address)){
            std::cout << "City does not yet exist at address: " << address << std::endl;
            std::cout << "Unable to getCity" << std::endl;
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            return "reject";
        }
        createGameReport(cli, cities[address]);
    }
    else if(method == "getMapFunds"){ // Method: getMapFunds
        std::string address = toLower(parsedPayload.get("address").to_str());
        if(!cities.count(address)){
            std::cout << "City does not yet exist at address: " << address << std::endl;
            std::cout << "Unable to getCity" << std::endl;
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            return "reject";
        }
        createMapReport(cli, convertMapToUint16Vector(cities[address]->map[0], WORLD_W, WORLD_H)); // Map Report
        createReport(cli, eth::numberToHex(cities[address]->totalFunds)); // City Funds
    }
    else if(method == "getCityBalance"){ // Method: getCity
        std::string address = toLower(parsedPayload.get("address").to_str());
        if(!cities.count(address)){
            std::cout << "City does not yet exist at address: " << address << std::endl;
            std::cout << std::setw(20) << std::setfill('-') << "" << std::endl; // Output a divider for readability within console
            createReport(cli, "0x00");
            return "accept";
        }
        createReport(cli, eth::numberToHex(cities[address]->totalFunds));
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
