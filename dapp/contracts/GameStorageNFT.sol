// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GameStorageNFT is ERC721 {
    constructor() ERC721("GameStorageNFT", "GSNFT") {}

    function mintNFT(address recipient, uint256 gameHashId) public returns (uint256) {
        
        _mint(recipient, gameHashId);

        return gameHashId;
    }
}