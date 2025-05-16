#include <stdio.h>
#include <iostream>
#include <iomanip>
#include <unordered_map>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

#include "engine/micropolis.h"

#include "util.h"
#include "wallet.h"
#include "sha256.h"

const std::string ERC20_PORTAL_ADDRESS = "0x9c21aeb2093c32ddbc53eef24b873bdcd1ada1db";
const std::string ERC721_PORTAL_ADDRESS = "0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87";
const std::string TOKEN = "0x92C6bcA388E99d6B304f1Af3c3Cd749Ff0b591e2";

std::string contract = "0x36C02dA8a0983159322a80FFE9F24b1acfF8B570";

const std::string GAME_WALLET = "0x0000000000000000000000000000000000000001";
const std::string PEOPLE_WALLET = "0x0000000000000000000000000000000000000002";

Wallet* walletHandler = new Wallet();
std::unordered_map<std::string, Micropolis*> games;
std::unordered_map<std::string, Micropolis*> storage;

std::string saveGameState(const Micropolis* game) {
    picojson::object gameState;

    // Basic fields
    gameState["funds"] = picojson::value((double)game->totalFunds);
    gameState["cityTime"] = picojson::value((double)game->cityTime);
    gameState["autoBulldoze"] = picojson::value((bool)game->autoBulldoze);
    gameState["autoBudget"] = picojson::value((bool)game->autoBudget);
    gameState["autoGoto"] = picojson::value((bool)game->autoGoto);
    gameState["enableSound"] = picojson::value((bool)game->enableSound);
    gameState["cityTax"] = picojson::value((double)game->cityTax);
    gameState["simSpeed"] = picojson::value((double)game->simSpeed);

    // Funding percentages
    picojson::object funding;
    funding["police"] = picojson::value((double)game->policePercent);
    funding["fire"] = picojson::value((double)game->firePercent);
    funding["road"] = picojson::value((double)game->roadPercent);
    gameState["fundingPercentages"] = picojson::value(funding);

    // Map data
    picojson::array mapArray;
    for (int y = 0; y < WORLD_H; ++y) {
        picojson::array row;
        for (int x = 0; x < WORLD_W; ++x) {
            row.push_back(picojson::value((double)game->map[x][y]));
        }
        mapArray.push_back(picojson::value(row));
    }
    gameState["map"] = picojson::value(mapArray);

    // History arrays
    auto dumpHist = [](const short* hist, int length) -> picojson::array {
        picojson::array arr;
        for (int i = 0; i < length; ++i) {
            arr.push_back(picojson::value((double)hist[i]));
        }
        return arr;
    };

    picojson::object histories;
    histories["residential"] = picojson::value(dumpHist(game->resHist, HISTORY_LENGTH));
    histories["commercial"]  = picojson::value(dumpHist(game->comHist, HISTORY_LENGTH));
    histories["industrial"]  = picojson::value(dumpHist(game->indHist, HISTORY_LENGTH));
    histories["crime"]       = picojson::value(dumpHist(game->crimeHist, HISTORY_LENGTH));
    histories["pollution"]   = picojson::value(dumpHist(game->pollutionHist, HISTORY_LENGTH));
    histories["money"]       = picojson::value(dumpHist(game->moneyHist, HISTORY_LENGTH));
    histories["misc"]        = picojson::value(dumpHist(game->miscHist, MISC_HISTORY_LENGTH));
    gameState["histories"]   = picojson::value(histories);

    picojson::value jsonValue(gameState);
    return jsonValue.serialize(true);  // pretty-printed JSON string
}

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

std::string encodeMintNFTCall(const std::string &recipient, const std::string &gameHash) {
    std::string methodId = "3c168eab"; // keccak256("mintNFT(address,uint256)") first 4 bytes
    
    // recipient is a hex string like "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
    // remove "0x" and pad left to 64 chars (32 bytes)
    std::string cleanRecipient = recipient.substr(2);
    std::string paddedRecipient = padTo32Bytes(cleanRecipient);
    
    // gameHash is a uint256 hex string, e.g. "0x123abc..."
    // remove "0x" and pad left to 64 chars (32 bytes)
    std::string cleanGameHash = gameHash.substr(2);
    std::string paddedGameHash = padTo32Bytes(cleanGameHash);
    
    // Combine all parts: methodId + recipient + gameHash
    std::string data = methodId + paddedRecipient + paddedGameHash;
    
    return "0x" + data;
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

void generateNFTVoucher(httplib::Client &cli, const std::string& NFTCall) {
    std::cout << "Contract: " << contract << std::endl;
    // Format the payload expected by Cartesi
    std::string payload = "{\"destination\":\"" + contract + "\",\"payload\":\"" + NFTCall + "\"}";
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
    createNotice(cli, vectorToHexUint16(convertMapToUint16Vector(game->map[0], WORLD_W, WORLD_H))); // Map

    // Create a picojson::object to hold your stats
    picojson::object statsJson;

    statsJson["population"] = picojson::value(static_cast<double>(game->cityPop));
    statsJson["totalFunds"] = picojson::value(static_cast<double>(game->totalFunds));
    statsJson["cityTime"] = picojson::value(static_cast<double>(game->cityTime));
    statsJson["cityTax"] = picojson::value(static_cast<double>(game->cityTax));
    statsJson["taxFund"] = picojson::value(static_cast<double>(game->taxFund));
    statsJson["firePercent"] = picojson::value(game->firePercent);     // Assuming float
    statsJson["policePercent"] = picojson::value(game->policePercent);   // Assuming float
    statsJson["roadPercent"] = picojson::value(game->roadPercent);     // Assuming float
    statsJson["fireFund"] = picojson::value(static_cast<double>(game->fireFund));
    statsJson["policeFund"] = picojson::value(static_cast<double>(game->policeFund));
    statsJson["roadFund"] = picojson::value(static_cast<double>(game->roadFund));
    statsJson["cashFlow"] = picojson::value(static_cast<double>(game->cashFlow)); // short → double

    // Serialize the object to a string
    std::string jsonStr = picojson::value(statsJson).serialize();

    // Convert JSON string to hex
    std::string hexPayload = stringToHex(jsonStr);

    // Send as a single notice
    createNotice(cli, hexPayload);
    // std::cout << std::to_string(game->cashFlow) << std::endl;
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
            // games[address]->setPasses(100);
            games[address]->setPasses(50);            
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
        else if(method == "dragTool"){
            if (games.find(address) == games.end()) return "reject";
            EditingTool tool = static_cast<EditingTool>(std::stoi(parsed_payload.get("tool").to_str()));
            int fromX = std::stoi(parsed_payload.get("fromX").to_str());
            int fromY = std::stoi(parsed_payload.get("fromY").to_str());
            int toX = std::stoi(parsed_payload.get("toX").to_str());
            int toY = std::stoi(parsed_payload.get("toY").to_str());
            games[address]->toolDrag(tool, fromX, fromY, toX, toY);
            // for(int i = 0; i < 100; i++){
            //     games[address]->simTick();
            // }
            // games[address]->simTick();
            std::cout << "Dragging tool " << parsed_payload.get("tool").to_str() << " from (" << fromX << ", " << fromY << ") to (" << toX << ", " << toY << ") for game at" << address << std::endl;
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
            if (games.count(address)) {
                delete games[address];
                games.erase(address);
            } 
            return "accept";
        }
        else if(method == "save"){
            if (games.find(address) == games.end()) return "reject";
            std::string gameState = saveGameState(games[address]);
            std::string gameStateHash = sha256(gameState);
            std::cout << "Game State Hash: " << gameStateHash << std::endl;
            storage[gameStateHash] = games[address];
            games.erase(address);
            std::string NFTCall = encodeMintNFTCall(address, gameStateHash);
            std::cout << "Encoded NFT Call: " << NFTCall << std::endl;
            generateNFTVoucher(cli, NFTCall);
            return "accept";
        }   
        else if(method == "load"){
            std::string gameStateHash = parsed_payload.get("hash").to_str();
            if(storage.count(gameStateHash)){
                std::cout << "Game found in storage" << std::endl;
            }
            else{
                std::cout << "Game not found in storage" << std::endl;
            }

        }
        else if(method == "setContract"){
            contract = parsed_payload.get("contract").to_str();
            std::cout << "Contract is now set to " << contract << std::endl;
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
            createReport(cli, vectorToHexUint16(convertMapToUint16Vector(games[address]->map[0], WORLD_W, WORLD_H)));
        }
        else if(method == "getFunds"){
            std::string address = parsed_payload.get("address").to_str();
            std::transform(address.begin(), address.end(), address.begin(), ::tolower);
            if (games.find(address) == games.end()) createReport(cli, uint64ToHex(0)); // Funds is 0 if city does not exist
            else createReport(cli, uint64ToHex(games[address]->totalFunds));
        }
        else if(method == "useQuery"){
            std::string address = parsed_payload.get("address").to_str();
            int x = std::stoi(parsed_payload.get("x").to_str());
            int y = std::stoi(parsed_payload.get("y").to_str());
            std::transform(address.begin(), address.end(), address.begin(), ::tolower);
            if (games.find(address) == games.end()) return "reject";
            // 0: population density
            // 1: land value.
            // 2: crime rate.
            // 3: pollution.
            // 4: growth rate.
            int populationDensity = games[address]->getDensity(0, x, y);
            int landValue = games[address]->getDensity(1, x, y);
            int crimeRate = games[address]->getDensity(2, x, y);
            int pollution = games[address]->getDensity(3, x, y);
            int growthRate = games[address]->getDensity(4, x, y);
            std::string stats = 
            "{"
            "\"populationDensity\":" + std::to_string(populationDensity) + "," +
            "\"landValue\":" + std::to_string(landValue) + "," +
            "\"crimeRate\":" + std::to_string(crimeRate) + "," +
            "\"pollution\":" + std::to_string(pollution) + "," +
            "\"growthRate\":" + std::to_string(growthRate) +
            "}";
            std::cout << stats << std::endl;
            createReport(cli, stringToHex(stats));
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


