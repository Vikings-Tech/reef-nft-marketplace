//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/draft-EIP712.sol";

contract ReefRoyalty is ERC721URIStorage,Ownable,ReentrancyGuard,EIP712{
    
    address creator;
     
    string private constant SIGNING_DOMAIN = "ReefNFT-Voucher";
    string private constant SIGNATURE_VERSION = "1";
     
     /// @notice Represents an un-minted NFT, which has not yet been recorded into the blockchain. A signed voucher can be redeemed for a real NFT using the redeem function.
    struct NFTVoucher {
    uint256 tokenId;
    uint256 minPrice;
    string uri;
    bytes signature;
    }  
  
     modifier onlyCreator() {
         require(msg.sender == creator,"Royalty Contract : Caller is not creator");
         _;
     }
     
     constructor(string memory name_,string memory symbol_,address creator_) ERC721(name_,symbol_) EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
        creator = creator_;
     }
     
    function lazyMint(NFTVoucher calldata voucher) public payable returns (uint256) {
    // make sure signature is valid and get the address of the signer
    address signer = _verify(voucher);

    // make sure that the signer is authorized to mint NFTs
    require(signer == creator, "Signature invalid or unauthorized");

    // make sure that the redeemer is paying enough to cover the buyer's cost
    require(msg.value >= voucher.minPrice, "Insufficient funds to redeem");

    // first assign the token to the signer, to establish provenance on-chain
    _mint(msg.sender, voucher.tokenId);
    _setTokenURI(voucher.tokenId, voucher.uri);
    
    // // record payment to signer's withdrawal balance
    // pendingWithdrawals[signer] += msg.value;

    return voucher.tokenId;
  } 
  
  function _verify(NFTVoucher calldata voucher) internal view returns (address) {
    bytes32 digest = _hash(voucher);
    return ECDSA.recover(digest, voucher.signature);
  }
  
  function _hash(NFTVoucher calldata voucher) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(
      keccak256("NFTVoucher(uint256 tokenId,uint256 minPrice,string uri)"),
      voucher.tokenId,
      voucher.minPrice,
      keccak256(bytes(voucher.uri))
    )));
  }
    
}