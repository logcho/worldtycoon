// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GameStorageNFT is ERC721 {
    // Store token URIs
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("GameStorageNFT", "GSNFT") {}

    // Mint function with recipient, tokenId, and IPFS URL
    function mintNFT(address recipient, uint256 tokenId, string memory uri) public {
        _mint(recipient, tokenId);
        _tokenURIs[tokenId] = uri;
    }

    // Override tokenURI to return stored URI
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
}
