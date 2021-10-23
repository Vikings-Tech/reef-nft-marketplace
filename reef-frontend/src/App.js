import logo from './logo.svg';
import './App.css';
import AppContext from './Components/AppContext';
import { web3Accounts, web3Enable, } from "@polkadot/extension-dapp"
import { useState, useEffect } from 'react';
import Home from './Pages/Home';
import Navbar from './Components/Navbar';

function App() {
  const [accounts, setAccounts] = useState();
  const extensionSetup = async () => {
    const extensions = await web3Enable('Wallet-connect-tutorial');
    if (extensions.length === 0) {
      console.log('No extension installed!');
      return;
    }
    const accounts = await web3Accounts();
    setAccounts(accounts);
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
