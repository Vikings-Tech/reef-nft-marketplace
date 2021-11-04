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
            showAlert('Alert!', 'No Wallet Extension Installed!', 'error', 2000)
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
        let result, receipt;
        try {
            result = await factoryContract.createCollection(name, symbol, metadata, { value: creationValue });
            console.log(result);
        }
        catch (e) {
            showAlert('Alert!', e.toString(), 'error', 2000)

            return false;
        }
        try {
            receipt = await result.wait();
            showAlert('Success!', 'Collection Created!', 'success', 2000)

            return receipt;
        }
        catch (e) {
            console.log(e);
            return false;
        }

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
        console.log(result);
    }

    functionsToExport.getCollections = async (startIndex, endIndex) => {
        await checkSigner();
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.getCollectionsPaginated(startIndex, endIndex);
        console.log(result);
    }
    //NFT functions
    functionsToExport.mint = async (metadata, royaltyPercentage, contractAddress) => {
        await checkSigner();
        const nftContract = new Contract(contractAddress, NftABI, signer);
        let result, receipt;
        try {
            result = await nftContract.mint(metadata, royaltyPercentage);
            console.log(result);
        } catch (e) {
            console.log(e);
            return false
        }
        try {
            receipt = await result.wait();
            console.log(receipt);
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return receipt
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
        let result, receipt;
        showAlert('Alert!', 'Transaction Initiated!', 'primary', 2000)

        try {
            result = await nftContract.setApprovalForAll(nftMarketplaceAddress, bool);
            showAlert('Alert!', 'Waiting for Transaction', 'primary', 2000)

        }
        catch (e) {
            showAlert('Alert!', e.toString(), 'error', 2000);
            return false;
        }
        try {
            receipt = await result.wait();
        }
        catch (e) {
            showAlert('Alert!', e.toString(), 'error', 2000);
            return false;
        }
        showAlert('Alert!', "Approved Successfully!", 'success', 2000);
        return true;
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
        const marketPlaceContract = new Contract("MarketPlace Contract Add", MarketPlaceABI, signer);
        const result = await marketPlaceContract.createMarketItem(NFTContractAddress, tokenID, etherPrice);
        const receipt = await result.wait();
        console.log(receipt);
    }

    //returns all unsold items as array of structs
    functionsToExport.fetchMarketItems = async () => {
        const marketPlaceContract = new Contract("MarketPlace Contract Add", MarketPlaceABI, signer);
        const result = await marketPlaceContract.fetchMarketItems();
        console.log(result);
    }

    functionsToExport.fetchItemsCreated = async () => {
        const marketPlaceContract = new Contract("MarketPlace Contract Add",MarketPlaceABI,signer);
        const result = await marketPlaceContract.fetchItemsCreated();
        console.log(result);
    }

    functionsToExport.fetchMyNFTs() = async () => {
        const marketPlaceContract = new Contract("MarketPlace Contract Add",MarketPlaceABI,signer);
        const result = await marketPlaceContract.fetchMyNFTs();
        console.log(result);
    }

    functionsToExport.buyNFT() = async (NFTContractAddress,itemId,nftPrice) => {
        const marketPlaceContract = new Contract("MarketPlace Contract Add",MarketPlaceABI,signer);
        const result = await marketPlaceContract.createMarketSale(NFTContractAddress,itemId,{value: nftPrice});
        const receipt = await result.wait();
        console.log(receipt);
    }

    functionsToExport.unlistItem() = async (itemId) => {
        const marketPlaceContract = new Contract("MarketPlace Contract Add",MarketPlaceABI,signer);
        const result = await marketPlaceContract.unlistItem(itemId);
        const receipt = await result.wait();
        console.log(receipt);
    }


    return (<Web3Context.Provider value={{ account, ...functionsToExport }}>
        {props.children}
    </Web3Context.Provider>)
}
export default Web3Context;