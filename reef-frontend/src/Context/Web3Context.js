import React, { useState, createContext } from "react";
import { web3Accounts, web3Enable, } from "@polkadot/extension-dapp"
import { Provider, Signer } from '@reef-defi/evm-provider';
import { WsProvider } from '@polkadot/rpc-provider';
import FactoryAbi from '../abi/FactoryABI.json';
import { ethers, Contract } from 'ethers';

const Web3Context = createContext();

export const Web3Provider = (props) => {
    const URL = 'wss://rpc-testnet.reefscan.com/ws';

    const [account, setAccounts] = useState();
    const [evmProvider, setEvmProvider] = useState();
    const [isApiConnected, setIsApiConnected] = useState();
    const [signer, setSigner] = useState();
    const functionsToExport = {};
    functionsToExport.extensionSetup = async () => {

        let allInjected = await web3Enable('Reef Marketplace');

        if (allInjected.length === 0) {
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

    functionsToExport.getCollectionCreationPrice = async () => {
        const factoryContract = new Contract("0x8715F6Cb518627180fD751d508cC19f3E11Acee8", FactoryAbi, signer);
        console.log(factoryContract);
        const result = await factoryContract.getPrice();
        console.log(result);
    }
    //Title,Description and Image
    functionsToExport.createCollection = async (name, symbol, metadata, creationValue) => {
        const factoryContract = new Contract("0x8715F6Cb518627180fD751d508cC19f3E11Acee8", FactoryAbi, signer);
        const result = await factoryContract.createCollection(name, symbol, metadata, { value: creationValue });
        const receipt = await result.wait();
        console.log(receipt);
    }

    functionsToExport.getUserCollections = async () => {
        const factoryContract = new Contract("0x8715F6Cb518627180fD751d508cC19f3E11Acee8", FactoryAbi, signer);
        const result = await factoryContract.getUserCollections();
        const receipt = await result.wait();
        console.log(receipt);
    }

    functionsToExport.editMetaData = async (index, newMetaData) => {
        const factoryContract = new Contract("0x8715F6Cb518627180fD751d508cC19f3E11Acee8", FactoryAbi, signer);
        const result = await factoryContract.editMetaData(index, newMetaData);
        const receipt = await result.wait();
        console.log(receipt);
    }
    return (<Web3Context.Provider value={{ account, ...functionsToExport }}>
        {props.children}
    </Web3Context.Provider>)
}
export default Web3Context;