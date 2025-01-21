#include <stdio.h>
#include <iostream>
#include <unordered_map>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

#include "engine/micropolis.h"

#include "util.h"

// Function to create a report
void createReport(httplib::Client &cli, const std::string &payload) {

    // Create JSON object with the message (payload)
    auto report = std::string("{\"payload\":\"") + payload + std::string("\"}");

    // Send the POST request to the /report endpoint with the JSON payload
    auto r = cli.Post("/report", report, "application/json");

    
    std::cout << "Received report status " << r.value().status << std::endl;
}
// Function to create a notice
void createNotice(httplib::Client &cli, const std::string &payload) {

    // Create JSON object with the message (payload)
    auto notice = std::string("{\"payload\":\"") + payload + std::string("\"}");

    // Send the POST request to the /report endpoint with the JSON payload
    auto r = cli.Post("/notice", notice, "application/json");

    
    std::cout << "Received notice status " << r.value().status << std::endl;
}

void createVoucher(httplib::Client &cli, const std::string& address, int amount){
    // Create JSON object with the message (payload)
    auto voucher = std::string("{\"payload\":\"") + payload + std::string("\"}");

    // Send the POST request to the /report endpoint with the JSON payload
    auto r = cli.Post("/notice", notice, "application/json");
    
    std::cout << "Received notice status " << r.value().status << std::endl;
}
// Create Reports and Notices for engine 
void createEngineReport(httplib::Client &cli, Micropolis* game){
    createReport(cli,vectorToHex(convertMap(game->map[0], WORLD_W, WORLD_H)));
    // createReport(cli,intToHex(game->totalFunds))
    // createReport(cli,intToHex(game->cityPop));
    // createReport(cli,intToHex(game->cityTime));
}
void createEngineNotice(httplib::Client &cli, Micropolis* game){
    createNotice(cli,vectorToHex(convertMap(game->map[0], WORLD_W, WORLD_H)));
    // createNotice(cli,intToHex(game->totalFunds))
    // createNotice(cli,intToHex(game->cityPop));
    // createNotice(cli,intToHex(game->cityTime));
}

std::unordered_map<std::string, Micropolis*> games;

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;

    // User and payload
    std::string user = data.get("metadata").get("msg_sender").to_str();
    std::string payload = hexToString(data.get("payload").to_str());
    // Cout to confirm
    // std::cout << "user: " << user << std::endl;
    // std::cout << "payload: " << payload << std::endl;
    // JSON payload parsed
    picojson::value parsed_payload;
    std::string err = picojson::parse(parsed_payload, payload);

    if (!err.empty()) {
        std::cerr << "JSON parsing error: " << err << std::endl;
        return "accept";
    }
    // Check if the "method" field is present
    if (!parsed_payload.contains("method")) {
        std::cerr << "Missing 'method' field in payload" << std::endl;
        return "accept";
    }

    // Extract the method field
    std::string method = parsed_payload.get("method").to_str();
    std::cout << "method: " << method << std::endl;

    // Start game by generating city
    if (method == "start") {
        // Check if user is already in games
        if (games.find(user) != games.end()) return "reject";

        games[user] = new Micropolis();

        int seed = std::stoi(parsed_payload.get("seed").to_str());
        games[user]->generateSomeCity(seed);

        std::cout << "Generated city: success" << std::endl;
        createEngineNotice(cli, games[user]);

        return "accept";
    } 
    // Use tool on game at x y
    else if (method == "doTool") {
        // Check if user exists in games
        if (games.find(user) == games.end()) return "reject";

        EditingTool tool = static_cast<EditingTool>(std::stoi(parsed_payload.get("tool").to_str()));
        int x = std::stoi(parsed_payload.get("x").to_str());
        int y = std::stoi(parsed_payload.get("y").to_str());
        games[user]->doTool(tool, x, y);

        std::cout << "Did tool: success" << std::endl;
        createEngineNotice(cli, games[user]);

        return "accept";
    }

    return "accept";
}


std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    // std::cout << "Received inspect request data " << data << std::endl;
    // std::cout << "payload: " << payload << std::endl;
    std::string payload = data.get("payload").to_str();
    std::cout << payload << std::endl;
    payload = hexToString(payload);
    std::cout << payload << std::endl;

    // JSON payload parsed
    picojson::value parsed_payload;
    std::string err = picojson::parse(parsed_payload, payload);
    if (!err.empty()) {
        std::cerr << "JSON parsing error: " << err << std::endl;
        return "accept";
    }
    // Check if the "method" field is present
    if (!parsed_payload.contains("method")) {
        std::cerr << "Missing 'method' field in payload" << std::endl;
        return "accept";
    }
    // Extract the method field
    std::string method = parsed_payload.get("method").to_str();
    // std::cout << "method: " << method << std::endl;

    if(method == "getEngine"){
        std::string user = parsed_payload.get("user").to_str();
        if(games.find(user) != games.end()){
            createEngineReport(cli, games[user]);
        }
        return "accept";
    }

    // if(games.find(payload) != games.end()){
    //     unsigned short *map = games[payload]->map[0];
    //     std::vector<uint16_t> mapArray = convertMap(map, WORLD_W, WORLD_H);
    //     // Cout map and dimenstions
    //     // std::cout << "map w:" << WORLD_W << std::endl;
    //     // std::cout << "map h:" << WORLD_H << std::endl;
    //     // printGrid(mapArray, WORLD_W, WORLD_H);
    //     std::string mapHex = vectorToHex(mapArray);
    //     createReport(cli, mapHex);
    // }
    

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


