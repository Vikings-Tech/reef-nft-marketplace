//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol";


contract ReefRoyalty is Ownable,ReentrancyGuard,ERC721Enumerable,ERC721URIStorage{
    
    address creator;
    
    using Counters for Counters.Counter;
    
    Counters.Counter private tokenId_;
    
     uint tokenRoyalty;
     
     modifier onlyCreator() {
         require(msg.sender == creator,"Royalty Contract : Caller is not creator");
         _;
     }
     
     constructor(string memory name_,string memory symbol_,address creator_,uint royalty_) ERC721(name_,symbol_) {
        creator = creator_;
        tokenRoyalty = royalty_;
     }
     
    
    function mint() external onlyCreator() {
        tokenId_.increment();
        uint256 tokenId = tokenId_.current();
        _mint(msg.sender,tokenId);
    }
    
    function royaltyInfo(uint256 _salePrice) external view returns (
        uint256 royaltyAmount
    ){
        royaltyAmount = (_salePrice*tokenRoyalty)/100;
    }
    
    receive() external payable{
        
    }
    
    function withdraw() external onlyCreator{
        payable(creator).transfer(address(this).balance);
    }
    function getCreator() external view returns(address){
        return creator;
    }
    
     function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}