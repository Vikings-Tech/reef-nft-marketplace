// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";

contract CollectionFactory{
    
    mapping(address=>address[]) userToContracts;
    
    event CollectionCreated(address indexed creator,address indexed contractAddress);
    
    function createCollection(string memory name_,string memory symbol_) external {
        ERC721 NFTContract = new ERC721(name_,symbol_);
        userToContracts[msg.sender].push(address(NFTContract));
        emit CollectionCreated(msg.sender,address(NFTContract));
    }
}