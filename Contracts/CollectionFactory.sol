// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ReefRoyalty.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";


contract CollectionFactory is Ownable{
    
    uint256 price;
    
    struct contractInfo{
        address contractAddress;
        string metaDataHash;
    }
    
    mapping(address=>contractInfo[]) userToContracts;
    
    event CollectionCreated(address indexed creator,address indexed contractAddress,string indexed metaData);
    
    constructor(uint256 price_){
        price = price_;
    }
    
    function setPrice(uint256 newPrice_) external onlyOwner{
        price = newPrice_;
    }
    
    function getPrice() external view returns(uint256){
        return price;
    }
    
    function retrieveBalance() external onlyOwner{
        payable(owner()).transfer(address(this).balance);
    }
    
    function createCollection(string calldata name_,string calldata symbol_,string calldata metaData) external payable{
        require(msg.value >= price,"ReefRoyalty: Pay the required amount");
        ReefRoyalty NFTContract = new ReefRoyalty(name_,symbol_,msg.sender);
        contractInfo memory Info = contractInfo(address(NFTContract),
        metaData
        );
        userToContracts[msg.sender].push(Info);
        emit CollectionCreated(msg.sender,address(NFTContract),metaData);
    }
    
    function editMetaData(uint collectionId,string calldata newHash) external{
        require(userToContracts[msg.sender].length <= collectionId);
        userToContracts[msg.sender][collectionId].metaDataHash = newHash;
    }
    
    function getUserCollections() external view returns(contractInfo[] memory){
        return userToContracts[msg.sender];
    }
    
}