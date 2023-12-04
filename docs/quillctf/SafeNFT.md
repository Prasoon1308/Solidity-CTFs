# QuillCTF 7: Safe NFT

## Objective
- Claim multiple NFTs for the price of one.

## Target Contract
```solidity
// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


contract safeNFT is ERC721Enumerable {
    uint256 price;
    mapping(address=>bool) public canClaim;

    constructor(string memory tokenName, string memory tokenSymbol,uint256 _price) ERC721(tokenName, tokenSymbol) {
        price = _price; //price = 0.01 ETH
    }

    function buyNFT() external payable {
        require(price==msg.value,"INVALID_VALUE");
        canClaim[msg.sender] = true;
    }

    function claim() external {
        require(canClaim[msg.sender],"CANT_MINT");
        _safeMint(msg.sender, totalSupply()); 
        canClaim[msg.sender] = false;
    }
 
}
```

## The Attack
The `_safeMint` function performs a callback to the recipient of the token to check that they're willing to accept the transfer. However, we're the recipient of the token, which means we just got a callback at which point we can do whatever we like, including calling mintNFT again. If we do this, we can reenter the function and call many times to claim more than one NFT for a single token price.

Basically, `onERC721Received` function of the `IERC721Receiver` interface is executed when a contract calls the _safeMint function and hence we can exploit this function to reenter and claim more than one NFT.