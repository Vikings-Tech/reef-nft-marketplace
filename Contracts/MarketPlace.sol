// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/introspection/ERC165Checker.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
import "./IRRoyalty.sol";

contract MarketPlace is ReentrancyGuard{
    
    
    bytes4 public constant ERC721INTERFACE = type(IERC721).interfaceId;
    bytes4 public constant ERC2981INTERFACE = type(IERC2981).interfaceId;

    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;


    struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable creator;
    address payable seller;
    address payable owner;
    uint256 price;
    uint256 royalty;
    bool sold;
  }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price
    );

    event MarketItemSold(
        uint256 itemId,
        address indexed nftContract,
        address indexed seller,
        address indexed newOwner
        );
    
    event MarketItemUnlisted(
        uint256 itemId
        );

    /* Places an item for sale on the marketplace */
    function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
    ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(ERC165Checker.supportsInterface(nftContract,ERC721INTERFACE),"Contract needs to be ERC721");
    require(IERC721(nftContract).ownerOf(tokenId) == msg.sender,"Only owner can create listing");
    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    
    if (ERC165Checker.supportsInterface(nftContract,ERC2981INTERFACE)){
        (address creator,uint256 royaltyAmount) = IERC2981(nftContract).royaltyInfo(tokenId,price);
        idToMarketItem[itemId] =  MarketItem(
                                      itemId,
                                      nftContract,
                                      tokenId,
                                      payable(creator),
                                      payable(msg.sender),
                                      payable(address(0)),
                                      price,
                                      royaltyAmount,
                                      false
                                    );
    }
    else{
        address creator = msg.sender;
        uint royaltyAmount = 0;
        idToMarketItem[itemId] =  MarketItem(
                                      itemId,
                                      nftContract,
                                      tokenId,
                                      payable(creator),
                                      payable(msg.sender),
                                      payable(address(0)),
                                      price,
                                      royaltyAmount,
                                      false
                                    );
    }
    
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    
    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price
    );
    }

  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {
    MarketItem storage currentItem = idToMarketItem[itemId];
    require(msg.value == currentItem.price, "Please submit the asking price in order to complete the purchase");
    if(currentItem.creator == currentItem.seller ){
        payable(currentItem.nftContract).transfer(msg.value);
    }
    else{
        payable(currentItem.seller).transfer(currentItem.royalty);
        currentItem.seller.transfer(msg.value-currentItem.royalty);
    }
    IERC721(nftContract).transferFrom(address(this), msg.sender, currentItem.tokenId);
    currentItem.owner = payable(msg.sender);
    currentItem.sold = true;
    _itemsSold.increment();
    emit MarketItemSold(itemId,nftContract,currentItem.seller,currentItem.owner);
  }

  /* Returns all unsold market items */
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (!idToMarketItem[i + 1].sold) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items that a user has purchased */
  function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
    }

    function unlistItem(uint itemId) external{
        require(idToMarketItem[itemId].seller == msg.sender,"Sender is not lister");
        delete idToMarketItem[itemId];
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        emit MarketItemUnlisted(
        itemId
        );
    }
}