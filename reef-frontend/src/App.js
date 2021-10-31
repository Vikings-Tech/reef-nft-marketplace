import logo from './logo.svg';
import './App.css';
import Web3Context, { Web3Provider } from './Context/Web3Context';
import Home from './Pages/Home';
import Navbar from './Components/Navbar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import CreateCollection from './Pages/CreateCollection';

function App() {


  // //NFT functions
  

  



  // //NFT contract functions required for marketplace

  // //This function needs to be called (successfully) before marketplace listing is called
  // async function approve(marketplaceAddress,tokenID){
  //   const nftContract = new Contract("contract address",NftABI,signer);
  //   const result = await nftContract.approve(marketplaceAddress,tokenID);
  //   const receipt = await result.wait();
  //   console.log(receipt);
  // }

  // async function getApproved(tokenID){
  //   const nftContract = new Contract("contract address",NftABI,signer);
  //   const result = await nftContract.getApproved(tokenID);
  //   console.log(result);
  //   //check if approved is the marketplace address, if yes go ahead with creating market listing
  // }
  return (
    <>
      <Navbar />
      <button type="button" className="button" onClick={getCollectionCreationPrice}>Get Storage</button>
      <Home />
    </>
  );
}

export default App;
