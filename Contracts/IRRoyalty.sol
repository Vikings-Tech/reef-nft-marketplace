// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IRRoyalty{
    function royaltyInfo(uint256 _salePrice) external view returns (
        uint256 royaltyAmount
    );
    
    function getCreator() external view returns(address);
}