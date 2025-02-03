#include <stdio.h>
#include <iostream>
#include <iomanip>
#include <unordered_map>

#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

#include "engine/micropolis.h"

#include "util.h"

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

// void depositErc20(httplib::Client &cli, std::string account, std::string erc20, std::string amount){
//     picojson::object content{
//         {"address", picojson::value(account)},
//         {"erc20", picojson::value(erc20)},
//         {"amount", picojson::value(amount)}
//     };
//     picojson::object noticePayload{
//         {"type", picojson::value("erc20deposit")},
//         {"content", picojson::value(content)}
//     };
//     std::string payload = picojson::value(noticePayload).serialize();
//     auto response = cli.Post("/voucher", payload, "application/json");    
// }

// void createEngineReport(httplib::Client &cli, Micropolis* game){
//     createReport(cli,vectorToHex(convertMap(game->map[0], WORLD_W, WORLD_H)));
//     // createReport(cli,intToHex(game->totalFunds))
//     // createReport(cli,intToHex(game->cityPop));
//     // createReport(cli,intToHex(game->cityTime));
// }
// void createEngineNotice(httplib::Client &cli, Micropolis* game){
//     createNotice(cli,vectorToHex(convertMap(game->map[0], WORLD_W, WORLD_H)));
//     // createNotice(cli,intToHex(game->totalFunds))
//     // createNotice(cli,intToHex(game->cityPop));
//     // createNotice(cli,intToHex(game->cityTime));
// }

std::unordered_map<std::string, Micropolis*> games;

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::string user = data.get("metadata").get("msg_sender").to_str();
    std::string payload = data.get("payload").to_str();
    std::cout << std::setw(20) << std::setfill('-') << "" << std::endl;
    std::cout << "User: " << user << std::endl;
    std::cout << "Payload: " << payload << std::endl;
    std::cout << "Converted Payload: " << hexToString(payload) << std::endl;
    std::cout << std::setw(20) << std::setfill('-') << "" << std::endl;

    picojson::value parsed_payload;
    std::string err = picojson::parse(parsed_payload, payload);
    if (!err.empty()) return "reject";

    std::string method = parsed_payload.get("method").to_str();
    std::cout << "method: " << method << std::endl;

    if(method == "start"){
        if (games.find(user) != games.end()) return "reject";
        games[user] = new Micropolis();
        games[user]->generateMap();
        std::cout << "City generated for" << user << std::endl;
        return "accept";
    }
    else if(method == "doTool"){
        if (games.find(user) == games.end()) return "reject";
        EditingTool tool = static_cast<EditingTool>(std::stoi(parsed_payload.get("tool").to_str()));
        int x = std::stoi(parsed_payload.get("x").to_str());
        int y = std::stoi(parsed_payload.get("y").to_str());
        games[user]->doTool(tool, x, y);
        std::cout << "Using tool " << parsed_payload.get("tool").to_str() << " at (" << x << ", " << y << ") to game " << user << std::endl;
        return "accept";
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


