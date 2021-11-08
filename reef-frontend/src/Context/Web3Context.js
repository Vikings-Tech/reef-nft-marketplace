import React, { useState, createContext } from "react";
import { web3Accounts, web3Enable, } from "@polkadot/extension-dapp"
import { Provider, Signer } from '@reef-defi/evm-provider';
import { WsProvider } from '@polkadot/rpc-provider';
import FactoryAbi from '../abi/FactoryABI.json';
import NftABI from '../abi/NftABI.json';
import MarketPlaceABI from '../abi/MarketPlaceABI.json';
import { ethers, Contract, utils } from 'ethers';
import { factoryContractAddress, nftMarketplaceAddress } from "../config/contractAddress";
import { useAlert } from 'tr-alerts';


const Web3Context = createContext();

export const Web3Provider = (props) => {
    const URL = 'wss://rpc-testnet.reefscan.com/ws';
    const showAlert = useAlert();

    const [account, setAccounts] = useState();
    const [evmProvider, setEvmProvider] = useState();
    const [isApiConnected, setIsApiConnected] = useState();
    const [signer, setSigner] = useState();
    const functionsToExport = {};
    functionsToExport.extensionSetup = async () => {

        let allInjected = await web3Enable('Reef Marketplace');

        if (allInjected.length === 0) {
            showAlert('Alert!', 'No Wallet Extension Installed!', 'danger', 2000)
            console.log('No extension installed!');
            return false;
        }
        let injected;
        if (allInjected[0] && allInjected[0].signer) {
            injected = allInjected[0].signer;
        }

        const newEvmProvider = new Provider({
            provider: new WsProvider(URL)
        });
        setEvmProvider(newEvmProvider);
        newEvmProvider.api.on('connected', () => setIsApiConnected(true));
        newEvmProvider.api.on('disconnected', () => setIsApiConnected(false));
        newEvmProvider.api.on('ready', async () => {
            const allAccounts = await web3Accounts();

            if (allAccounts[0] && allAccounts[0].address) {
                showAlert('Success!', 'Wallet Connected!', 'success', 2000)

                console.log(allAccounts);
                setAccounts(allAccounts[0].address);
            }

            const wallet = new Signer(newEvmProvider, allAccounts[0].address, injected);
            // Claim default account
            if (!(await wallet.isClaimed())) {
                console.log(
                    "No claimed EVM account found -> claimed default EVM account: ",
                    await wallet.getAddress()
                );
                await wallet.claimDefaultAccount();
            }

            setSigner(wallet);
        })


    };
    const checkSigner = async () => {
        if (!signer) {
            await functionsToExport.extensionSetup();
        }
        return true;
    }
    const showTransactionProgress = async (result) => {
        showAlert('Alert!', 'Transaction Initiated!', 'primary', 2000)
        let completeResult, receipt;
        try {
            completeResult = await Promise.resolve(result);
        }
        catch (e) {
            showAlert("Alert", `Transaction Failed! ${e.toString()}`, "danger", 2000);
            return false;
        }
        showAlert("Alert", `Transaction Sent! your hash is: ${completeResult.hash}`, "success", 6000);
        try {
            receipt = await completeResult.wait();
        }
        catch (e) {
            showAlert("Alert", `Transaction Failed! ${e.toString()}`, "danger", 2000);
            return false;
        }

        if (receipt.status === 1) {
            showAlert("Alert", `Transaction Success!`, "success", 2000);

        }
        else {
            showAlert("Alert", `Transaction Failed!`, "danger", 2000);
        }
        return receipt;

    }

    //New address  0x53e507C95cC72F672e29a16e73D575BCB2272538
    functionsToExport.getCollectionCreationPrice = async () => {
        await checkSigner();
        console.log(FactoryAbi)
        console.log(signer);
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        console.log(factoryContract);
        const result = await factoryContract.getPrice();
        console.log(result);
        return result
    }
    //Title,Description and Image
    functionsToExport.createCollection = async (name, symbol, metadata, creationValue) => {
        await checkSigner();
        console.log(name, metadata, symbol, creationValue);
        console.log(metadata);
        console.log(symbol);
        console.log(creationValue);
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        return (await showTransactionProgress(factoryContract.createCollection(name, symbol, metadata, { value: creationValue })));

    }

    functionsToExport.getUserCollections = async () => {
        await checkSigner();
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.getUserCollections();
        console.log(result);
        return (result);
    }

    functionsToExport.editMetaData = async (contractAddress, newMetaData) => {
        await checkSigner();
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.editMetaData(contractAddress, newMetaData);
        const receipt = await result.wait();
        console.log(receipt);
    }

    functionsToExport.totalCollections = async () => {
        await checkSigner();
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.totalCollections();
        return result;
        console.log(result);
    }

    functionsToExport.getCollections = async (startIndex, endIndex) => {
        await checkSigner();
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.getCollectionsPaginated(startIndex, endIndex);
        return result;
        console.log(result);
    }
    //NFT functions
    functionsToExport.mint = async (metadata, royaltyPercentage, contractAddress) => {
        await checkSigner();
        const nftContract = new Contract(contractAddress, NftABI, signer);
        return (await showTransactionProgress(nftContract.mint(metadata, royaltyPercentage)));
    }

    functionsToExport.tokenURI = async (tokenID, contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.tokenURI(tokenID);
        console.log(result);
        return result;
    }

    functionsToExport.getTokenRoyalty = async (tokenID, contractAddress) => {
        await checkSigner();
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.getTokenRoyalty(tokenID);
        console.log(result);
    }

    functionsToExport.totalSupply = async (contractAddress) => {
        await checkSigner();
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.totalSupply();

        console.log(result);
        return result;
    }

    functionsToExport.balanceOf = async (userAddress, contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.balanceOf(userAddress);
        return result;
        console.log(result);
    }

    functionsToExport.tokenByIndex = async (contractAddress, index) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.tokenByIndex(index);
        console.log(result);
    }

    functionsToExport.tokenOfOwnerByIndex = async (ownerAddress, index, contractAddress) => {
        await checkSigner();
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.tokenOfOwnerByIndex(ownerAddress, index);
        console.log(result);
        return result;
    }

    functionsToExport.setApprovalForAll = async (bool, contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        return (await showTransactionProgress(nftContract.setApprovalForAll(nftMarketplaceAddress, bool)));
    }

    functionsToExport.isApprovedForAll = async (userAddress, contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        //operator address is marketplace contract address
        const result = await nftContract.isApprovedForAll(userAddress, nftMarketplaceAddress);
        console.log(result);
        return result;
    }

    functionsToExport.createMarketItem = async (NFTContractAddress, tokenID, price) => {
        const etherPrice = utils.parseEther(price);
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.createMarketItem(NFTContractAddress, tokenID, etherPrice)));
    }

    //returns all unsold items as array of structs
    functionsToExport.fetchMarketItems = async () => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        const result = await marketPlaceContract.fetchMarketItems();
        console.log(result);
        return result;
    }

    functionsToExport.fetchItemsCreated = async () => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        const result = await marketPlaceContract.fetchItemsCreated();
        return result;
    }

    functionsToExport.fetchMyNFTs = async () => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        const result = await marketPlaceContract.fetchMyNFTs();
        return result;

    }

    functionsToExport.buyNFT = async (NFTContractAddress, itemId, nftPrice) => {

        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.createMarketSale(NFTContractAddress, itemId, { value: nftPrice })));
    }

    functionsToExport.unlistItem = async (itemId) => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.unlistItem(itemId)));
    }

    functionsToExport.createMarketAuction = async (NFTContractAddress, tokenId, floorPrice, auctionDays) => {
        const etherPrice = utils.parseEther(floorPrice);

        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.createMarketAuction(NFTContractAddress, tokenId, etherPrice, auctionDays)));
    }

    functionsToExport.createAuctionBid = async (itemId, bidAmount) => {
        const etherPrice = utils.parseEther(bidAmount);
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.createAuctionBid(itemId, { value: etherPrice })));
    }

    functionsToExport.createAuctionSale = async (NFTContractAddress, itemId) => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        return (await showTransactionProgress(marketPlaceContract.createAuctionSale(NFTContractAddress, itemId)));
    }
    //Only bids where user is highest bidder are visible through this
    functionsToExport.fetchUserBids = async () => {
        const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        const result = await marketPlaceContract.fetchUserBids();
        console.log(result);
    }
    functionsToExport.startBidListening = async (onBidUpdate) => {
        // const marketPlaceContract = new Contract(nftMarketplaceAddress, MarketPlaceABI, signer);
        // marketPlaceContract.on("MarketItemBid", (a, b, c) => {
        //     console.log(a);
        //     console.log(b);
        //     console.log(c);
        // })


    }

    return (<Web3Context.Provider value={{ account, ...functionsToExport }}>
        {props.children}
    </Web3Context.Provider>)
}
export default Web3Context;