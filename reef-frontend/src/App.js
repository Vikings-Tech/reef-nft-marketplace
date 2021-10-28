import logo from './logo.svg';
import './App.css';
import AppContext from './Components/AppContext';
import { web3Accounts, web3Enable, } from "@polkadot/extension-dapp"
import { Provider, Signer} from '@reef-defi/evm-provider';
import { WsProvider } from '@polkadot/rpc-provider';
import { useState, useEffect } from 'react';
import { ethers,Contract } from 'ethers';

import Home from './Pages/Home';
import Navbar from './Components/Navbar';

function App() {
  const URL = 'wss://rpc-testnet.reefscan.com/ws';

  const [account, setAccounts] = useState();
  const [evmProvider, setEvmProvider] = useState();
  const [isApiConnected, setIsApiConnected] = useState();
  const [signer,setSigner] = useState();


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
      newEvmProvider: new WsProvider(URL)
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
      
      const wallet = new Signer(newEvmProvider, account, injected);
      // Claim default account
      if (!(await wallet.isClaimed())) {
        console.log(
          "No claimed EVM account found -> claimed default EVM account: ",
          await wallet.getAddress()
        );
        await wallet.claimDefaultAccount();
      }

      setSigner(signer);
    })
    

  };
  useEffect(() => {
    extensionSetup()
  }, []);

  //contract address : 0x667F2F7A8F634117C2F187f1A2a06c44ADD84acC (test storage contract)
  async function retrieveStorage(){
    // const storageContract = new Contract("0x667F2F7A8F634117C2F187f1A2a06c44ADD84acC",abi,signer);
    // const result = await storageContract.retrieve();
    console.log(signer.getAddress())
  }



  return (
    <>
      <Navbar />
      <button type="button" className="button" onClick={retrieveStorage}>Get Storage</button> 
      <Home />
    </>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //       {JSON.stringify(accounts)}
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
