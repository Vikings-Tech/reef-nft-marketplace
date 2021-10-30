import logo from './logo.svg';
import './App.css';
import AppContext from './Components/AppContext';
import { web3Accounts, web3Enable, } from "@polkadot/extension-dapp"
import { Provider, Signer } from '@reef-defi/evm-provider';
import { WsProvider } from '@polkadot/rpc-provider';
import abi from './ABI.json';
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

  //contract address : 0x667F2F7A8F634117C2F187f1A2a06c44ADD84acC (test storage contract)
  async function retrieveStorage() {
    const storageContract = new Contract("0x667F2F7A8F634117C2F187f1A2a06c44ADD84acC", abi, signer);
    const result = await storageContract.retrieve();
    console.log(result);
    // console.log(signer.getAddress())
  }

  async function setStorage(){
    const storageContract = new Contract("0x667F2F7A8F634117C2F187f1A2a06c44ADD84acC", abi, signer);
    const result = await storageContract.store(5);
    const receipt = await result.wait();
    console.log(receipt);
  }


  return (
    <>
      <Navbar />
      <button type="button" className="button" onClick={setStorage}>Get Storage</button>
      <Home />
    </>
  );
}

export default App;
