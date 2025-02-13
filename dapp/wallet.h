#ifndef WALLET_H
#define WALLET_H

#include <unordered_map>
#include <string>
#include "uint256_t/uint256_t.h"


class Wallet {
    private:
        std::unordered_map<std::string, uint256_t> erc20;
    public:
        Wallet(){}

        void depositERC20(const std::string& address, uint256_t amount){
            erc20[address] += amount; // Add amount to the existing balance
        }
        void depositERC20(const std::string& address, const std::string& hexAmount) {
            uint256_t amount(hexAmount.substr(2), 16);  // Convert from hex string (remove "0x")
            depositERC20(address, amount); // Call the original method
        }
        void withdrawERC20(const std::string& address, uint256_t amount){
            erc20[address] -= amount; // Deduct amount from balance
        }
        void withdrawERC20(const std::string& address, const std::string& hexAmount) {
            uint256_t amount(hexAmount.substr(2), 16);  // Convert from hex string (remove "0x")
            withdrawERC20(address, amount); // Call the original method
        }

        uint256_t getERC20Balance(const std::string& address){
            auto it = erc20.find(address);
            return (it != erc20.end()) ? it->second : uint256_t(0); // Return balance or 0 if not found 
        }
};

#endif // WALLET_H