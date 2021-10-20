// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ReefRoyalty.sol";

contract CollectionFactory{
    
    mapping(address=>address[]) userToContracts;
    
    event CollectionCreated(address indexed creator,address indexed contractAddress);
    
    function createCollection(string memory name_,string memory symbol_) external {
        ReefRoyalty NFTContract = new ReefRoyalty(name_,symbol_,msg.sender);
        userToContracts[msg.sender].push(address(NFTContract));
        emit CollectionCreated(msg.sender,address(NFTContract));
    }
}