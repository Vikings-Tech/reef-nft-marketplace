import logo from './logo.svg';
import './App.css';
import AppContext from './Components/AppContext';
import { web3Accounts, web3Enable, } from "@polkadot/extension-dapp"
import { Provider, Signer as EvmSigner } from '@reef-defi/evm-provider';
import { WsProvider } from '@polkadot/rpc-provider';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import Home from './Pages/Home';
import Navbar from './Components/Navbar';

function App() {
  const URL = 'wss://rpc-testnet.reefscan.com/ws';

  const [accounts, setAccounts] = useState();
  const [evmProvider, setEvmProvider] = useState();
  const [isApiConnected, setIsApiConnected] = useState();
  const extensionSetup = async () => {
    const extensions = await web3Enable('Wallet-connect-tutorial');
    const newEvmProvider = new Provider({
      provider: new WsProvider(URL)
    });
    setEvmProvider(newEvmProvider);
    newEvmProvider.api.on('connected', () => setIsApiConnected(true));
    newEvmProvider.api.on('disconnected', () => setIsApiConnected(false));
    newEvmProvider.api.on('ready', async () => {
      const accounts = await web3Accounts();
      setAccounts(accounts);

    })
    if (extensions.length === 0) {
      console.log('No extension installed!');
      return;
    }

  };
  useEffect(() => {
    extensionSetup()
  }, []);






  return (
    <>
      <Navbar />
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
