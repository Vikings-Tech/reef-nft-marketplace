//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./IERC2981.sol";
import "./Splitter.sol";

contract ReefRoyalty is Ownable,ReentrancyGuard,ERC721Enumerable,ERC721URIStorage,PaymentSplitter{
    
    address creator;
    
    using Counters for Counters.Counter;
    
    Counters.Counter private tokenId_;
    
     mapping(uint256=>uint8) tokenRoyalty;
     
     modifier onlyCreator() {
         require(msg.sender == creator,"Royalty Contract : Caller is not creator");
         _;
     }
     
     constructor(string memory name_,string memory symbol_,address creator_) ERC721(name_,symbol_) {
        creator = creator_;
     }
     
    
    function mint(uint8 royalty) external onlyCreator() {
        require(royalty <= 100,"ReefRoyalty: Can't have more than 100% royalty");
        tokenId_.increment();
        uint256 tokenId = tokenId_.current();
        _mint(msg.sender,tokenId);
        tokenRoyalty[tokenId] = royalty;
    }
    
    function royaltySplitter(address[] memory payees, uint256[] memory shares_) external onlyCreator{
        setBeneficiaries(payees,shares_);
    }
    
    function royaltyInfo(uint256 _tokenId,uint256 _salePrice) external view returns (
        address receiver,
        uint256 royaltyAmount
    ){
        receiver = address(this);
        royaltyAmount = (_salePrice*tokenRoyalty[_tokenId])/100;
    }
    
    function pendingPayment(IERC20 token, address account) external view returns(uint256){
        uint256 totalReceived = token.balanceOf(address(this)) + totalReleased(token);
        return totalReceived * shares(account) / totalShares() - released(token, account);
    }
    
    function pendingPayment(address account) external view returns(uint256){
        uint256 totalReceived = address(this).balance + totalReleased();
        return totalReceived * shares(account) / totalShares() - released(account);
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