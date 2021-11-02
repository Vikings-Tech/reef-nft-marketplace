import React, { useState, createContext } from "react";
import { web3Accounts, web3Enable, } from "@polkadot/extension-dapp"
import { Provider, Signer } from '@reef-defi/evm-provider';
import { WsProvider } from '@polkadot/rpc-provider';
import FactoryAbi from '../abi/FactoryABI.json';
import NftABI from '../abi/NftABI.json';
import { ethers, Contract } from 'ethers';
import { factoryContractAddress } from "../config/contractAddress";
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
            return;
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

    //New address  0x53e507C95cC72F672e29a16e73D575BCB2272538
    functionsToExport.getCollectionCreationPrice = async () => {
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
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.getUserCollections();
        console.log(result);
        return (result);
    }

    functionsToExport.editMetaData = async (contractAddress, newMetaData) => {
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.editMetaData(contractAddress, newMetaData);
        const receipt = await result.wait();
        console.log(receipt);
    }

    functionsToExport.totalCollections = async () => {
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.totalCollections();
        console.log(result);
    }

    functionsToExport.getCollections = async (startIndex, endIndex) => {
        const factoryContract = new Contract(factoryContractAddress, FactoryAbi, signer);
        const result = await factoryContract.getCollectionsPaginated(startIndex, endIndex);
        console.log(result);
    }
    //NFT functions
    functionsToExport.mint = async (metadata, royaltyPercentage, contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.mint(metadata, royaltyPercentage);
        const receipt = await result.wait();
        console.log(receipt);
    }

    // functionsToExport.tokenURI = async (tokenID) => {
    //     const nftContract = new Contract(contractAddress, NftABI, signer);
    //     const result = await nftContract.tokenURI(tokenID);
    //     console.log(result);
    // }

    functionsToExport.getTokenRoyalty = async (tokenID, contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.getTokenRoyalty(tokenID);
        console.log(result);
    }

    functionsToExport.totalSupply = async (contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.totalSupply();
        console.log(result);
    }

    functionsToExport.balanceOf = async (userAddress,contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.balanceOf(userAddress);
        console.log(result);
    }

    functionsToExport.tokenByIndex = async (contractAddress,index) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.tokenByIndex(index);
        console.log(result);
    }

    functionsToExport.tokenOfOwnerByIndex = async (ownerAddress, index, contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.tokenOfOwnerByIndex(ownerAddress, index);
        console.log(result);
    }

    functionsToExport.setApprovalForAll = async (operatorAddress, bool,contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        const result = await nftContract.setApprovalForAll(operatorAddress, bool);
        const receipt = await result.wait();
        console.log(receipt);
    }

    functionsToExport.isApprovedForAll = async (userAddress,operatorAddress,contractAddress) => {
        const nftContract = new Contract(contractAddress, NftABI, signer);
        //operator address is marketplace contract address
        const result = await nftContract.isApprovedForAll(userAddress,operatorAddress);
        console.log(result);
    }

    return (<Web3Context.Provider value={{ account, ...functionsToExport }}>
        {props.children}
    </Web3Context.Provider>)
}
export default Web3Context;