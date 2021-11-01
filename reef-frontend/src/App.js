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
  // async function mint(metaData, royaltyPercentage) {
  //   //Royalty should be < 20%
  //   const nftContract = new Contract("contract address", NftABI, signer);
  //   const result = await nftContract.mint(metaData, royaltyPercentage);
  //   const receipt = await result.wait();
  //   console.log(receipt);
  // }

  // async function tokenURI(tokenID) {
  //   const nftContract = new Contract("contract address", NftABI, signer);
  //   const result = await nftContract.tokenURI(tokenID);
  //   console.log(result);
  // }

  // async function getTokenRoyalty(tokenID) {
  //   const nftContract = new Contract("contract address", NftABI, signer);
  //   const result = await nftContract.getTokenRoyalty(tokenID);
  //   console.log(result);
  // }

  // //NFT contract functions required for marketplace

  // //This function needs to be called (successfully) before marketplace listing is called
  // async function approve(marketplaceAddress, tokenID) {
  //   const nftContract = new Contract("contract address", NftABI, signer);
  //   const result = await nftContract.approve(marketplaceAddress, tokenID);
  //   const receipt = await result.wait();
  //   console.log(receipt);
  // }

  // async function getApproved(tokenID) {
  //   const nftContract = new Contract("contract address", NftABI, signer);
  //   const result = await nftContract.getApproved(tokenID);
  //   console.log(result);
  //   //check if approved is the marketplace address, if yes go ahead with creating market listing
  // }
  return (
    <>
      <Web3Provider>
        <Navbar />
        <Router>
          <Switch>
            <Route path="/createCollection">
              <CreateCollection />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>


        </Router>
      </Web3Provider>

    </>
  );
}

export default App;
