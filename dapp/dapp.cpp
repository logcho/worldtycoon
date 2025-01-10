#include <stdio.h>
#include <iostream>
#include <unordered_map>


#include "3rdparty/cpp-httplib/httplib.h"
#include "3rdparty/picojson/picojson.h"

#include "engine/micropolis.h"

#include "util.h"

std::unordered_map<std::string, Micropolis*> games;

std::string handle_advance(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received advance request data " << data << std::endl;

    // User and payload
    std::string user = data.get("metadata").get("msg_sender").to_str();
    std::string payload = hexToString(data.get("payload").to_str());

    // Cout to confirm
    std::cout << "user: " << user << std::endl;
    std::cout << "payload: " << payload << std::endl;
    

    // JSON payload parsed
    picojson::value parsed_payload;
    picojson::parse(parsed_payload, payload);

    // Method: start, doTool
    std::string method = parsed_payload.get("method").to_str();

    std::cout << "method: " << method << std::endl;

    if(method == "start"){
        // Check is user is already in games
        if(games.find(user) == games.end()) games[user] = new Micropolis();

        // TODO: add a param for seed
        games[user]->generateSomeCity(0);

        std::cout << "Generated city: success" << std::endl;
    }
    else if(method == "doTool"){
        // Check is user is already in games
        if(games.find(user) == games.end()) return "reject";
    }

    return "accept";
}

std::string handle_inspect(httplib::Client &cli, picojson::value data)
{
    std::cout << "Received inspect request data " << data << std::endl;
    std::string payload = hexToString(data.get("payload").to_str());

    std::cout << "payload: " << payload << std::endl;

    if(games.find(payload) != games.end()){

        unsigned short *map = games[payload]->map[0];

        std::cout << "map w:" << WORLD_W << std::endl;
        std::cout << "map h:" << WORLD_H << std::endl;

        std::vector<uint16_t> mapArray = convertMap(map, WORLD_W, WORLD_H);
        printGrid(mapArray, WORLD_W, WORLD_H);
    }
    else{
        std::cout << "User is not foundd in games" << std::endl;
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
