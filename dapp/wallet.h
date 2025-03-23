#ifndef WALLET_H
#define WALLET_H

#include <unordered_map>
#include <string>
#include "uint256_t/uint256_t.h"


class Wallet {
    private:
        std::unordered_map<std::string, uint256_t> wallets;
    public:
        Wallet(){}
        void depositToken(const std::string& address, uint256_t amount){
            wallets[address] += amount; // Add amount to the existing balance
        }
        void depositToken(const std::string& address, const std::string& hexAmount) {
            uint256_t amount(hexAmount.substr(2), 16);  // Convert from hex string (remove "0x")
            depositToken(address, amount); // Call the original method
        }
        bool withdrawToken(const std::string& address, uint256_t amount) {
            auto it = wallets.find(address);
            if (it == wallets.end() || it->second < amount) {
                return false;  // Insufficient balance or address not found
            }
            it->second -= amount;  // Deduct amount from balance
            return true;
        }
        bool withdrawToken(const std::string& address, const std::string& hexAmount) {
            uint256_t amount(hexAmount.substr(2), 16);  // Convert from hex string (remove "0x")
            return withdrawToken(address, amount); // Call the original method with checks
        }
        uint256_t getTokenBalance(const std::string& address){
            auto it = wallets.find(address);
            return (it != wallets.end()) ? it->second : uint256_t(0); // Return balance or 0 if not found 
        }
        bool transferToken(const std::string& sender, const std::string& recipient, uint256_t amount) {
            if (wallets[sender] < amount) {
                return false; // Not enough balance
            }
            wallets[sender] -= amount;
            wallets[recipient] += amount;
            return true; // Transfer successful
        }
        bool transferToken(const std::string& sender, const std::string& recipient, const std::string& hexAmount) {
            uint256_t amount(hexAmount.substr(2), 16);  // Convert from hex string (remove "0x")
            return transferToken(sender, recipient, amount);
        }
};

#endif // WALLET_H