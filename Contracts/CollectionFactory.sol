// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ReefRoyalty.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";


contract CollectionFactory is Ownable{
    
    using Counters for Counters.Counter;
    Counters.Counter private collectionId_;
    
    uint256 price;
    
    struct collectionInfo{
        address contractAddress;
        string metaDataHash;
        address creator;
    }
    
    mapping(address=>collectionInfo[]) userToContracts;
    
    mapping(uint256=>collectionInfo) collectionByIndex;
    
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
        
        collectionId_.increment();
        ReefRoyalty NFTContract = new ReefRoyalty(name_,symbol_,msg.sender);
        collectionInfo memory Info = collectionInfo(
                                                    address(NFTContract),
                                                    metaData,
                                                    msg.sender
                                                    );
        userToContracts[msg.sender].push(Info);
        collectionByIndex[collectionId_.current()] = Info;
        emit CollectionCreated(msg.sender,address(NFTContract),metaData);
    }
    
    function editMetaData(uint collectionId,string calldata newHash) external{
        require(userToContracts[msg.sender].length <= collectionId);
        userToContracts[msg.sender][collectionId].metaDataHash = newHash;
    }
    
    function getUserCollections() external view returns(collectionInfo[] memory){
        return userToContracts[msg.sender];
    }
    
    function totalCollections() external view returns(uint){
        return collectionId_.current();
    }
    
    function getCollectionsPaginated(uint startIndex,uint endIndex) external view returns(collectionInfo[] memory,bool){
        require(endIndex>=startIndex,"End Index needs to be greater than or equal to start Index");
        uint length = endIndex-startIndex + 1;
        collectionInfo[] memory Info = new collectionInfo[](length);
        uint j = 0;
        for(uint i=startIndex;i<=endIndex;i++){
            Info[j] = collectionByIndex[i];
            j++;
        }
        if(endIndex<collectionId_.current()){
            return(Info,false);
        }
        else{
            return(Info,true);
        }
        
    }
    
}