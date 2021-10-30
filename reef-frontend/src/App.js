import logo from './logo.svg';
import './App.css';
import AppContext from './Components/AppContext';
import { web3Accounts, web3Enable, } from "@polkadot/extension-dapp"
import { Provider, Signer } from '@reef-defi/evm-provider';
import { WsProvider } from '@polkadot/rpc-provider';
import FactoryAbi from './abi/FactoryABI.json';
import NftABI from './abi/NftABI.json';
import { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';

import Home from './Pages/Home';
import Navbar from './Components/Navbar';

function App() {
  const URL = 'wss://rpc-testnet.reefscan.com/ws';

  const [account, setAccounts] = useState();
  const [evmProvider, setEvmProvider] = useState();
  const [isApiConnected, setIsApiConnected] = useState();
  const [signer, setSigner] = useState();


  const extensionSetup = async () => {

    let allInjected = await web3Enable('Reef Marketplace');

    if (allInjected.length === 0) {
      console.log('No extension installed!');
      return;
    }

    console.log(allInjected);

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
      console.log(newEvmProvider)
      console.log(allAccounts[0].address)
      console.log(injected);
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
  useEffect(() => {
    extensionSetup()
  }, []);

  // //contract address : 0x667F2F7A8F634117C2F187f1A2a06c44ADD84acC (test storage contract)
  // async function retrieveStorage() {
  //   const storageContract = new Contract("0x667F2F7A8F634117C2F187f1A2a06c44ADD84acC", abi, signer);
  //   const result = await storageContract.retrieve();
  //   console.log(result);
  //   // console.log(signer.getAddress())
  // }

  // async function setStorage(){
  //   const storageContract = new Contract("0x667F2F7A8F634117C2F187f1A2a06c44ADD84acC", abi, signer);
  //   const result = await storageContract.store(5);
  //   const receipt = await result.wait();
  //   console.log(receipt);
  // }

  // Factory contract 0x8715F6Cb518627180fD751d508cC19f3E11Acee8
  
  async function getCollectionCreationPrice(){
    const factoryContract = new Contract("0x8715F6Cb518627180fD751d508cC19f3E11Acee8",FactoryAbi,signer);
    const result = await factoryContract.getPrice();
    console.log(result);
  }
  async function createCollection(name,symbol,metadata,creationValue){
    const factoryContract = new Contract("0x8715F6Cb518627180fD751d508cC19f3E11Acee8",FactoryAbi,signer);
    const result = await factoryContract.createCollection(name,symbol,metadata,{value:creationValue});
    const receipt = await result.wait();
    console.log(receipt);
  }

  async function getUserCollections(){
    const factoryContract = new Contract("0x8715F6Cb518627180fD751d508cC19f3E11Acee8",FactoryAbi,signer);
    const result = await factoryContract.getUserCollections();
    console.log(result);
  }

  async function editMetaData(index,newMetaData){
    const factoryContract = new Contract("0x8715F6Cb518627180fD751d508cC19f3E11Acee8",FactoryAbi,signer);
    const result = await factoryContract.editMetaData(index,newMetaData);
    const receipt = await result.wait();
    console.log(receipt);
  }

  //NFT functions
  async function mint(metaData,royaltyPercentage){
    //Royalty should be < 20%
    const nftContract = new Contract("contract address",NftABI,signer);
    const result = await nftContract.mint(metaData,royaltyPercentage);
    const receipt = await result.wait();
    console.log(receipt);
  }

  async function tokenURI(tokenID){
    const nftContract = new Contract("contract address",NftABI,signer);
    const result = await nftContract.tokenURI(tokenID);
    console.log(result);
  }

  async function getTokenRoyalty(tokenID){
    const nftContract = new Contract("contract address",NftABI,signer);
    const result = await nftContract.getTokenRoyalty(tokenID);
    console.log(result);
  }

  //NFT contract functions required for marketplace

  //This function needs to be called (successfully) before marketplace listing is called
  async function approve(marketplaceAddress,tokenID){
    const nftContract = new Contract("contract address",NftABI,signer);
    const result = await nftContract.approve(marketplaceAddress,tokenID);
    const receipt = await result.wait();
    console.log(receipt);
  }

  async function getApproved(tokenID){
    const nftContract = new Contract("contract address",NftABI,signer);
    const result = await nftContract.getApproved(tokenID);
    console.log(result);
    //check if approved is the marketplace address, if yes go ahead with creating market listing
  }
  return (
    <>
      <Navbar />
      <button type="button" className="button" onClick={createCollection}>Get Storage</button>
      <Home />
    </>
  );
}

export default App;
