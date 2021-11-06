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
import { TRAlert } from 'tr-alerts';
import UserCollections from './Pages/UserCollections';
import CollectionDetail from './Pages/CollectionDetail';
import CreateNFT from './Pages/NFTs/CreateNFT';
import ExploreCollections from './Pages/ExploreCollections';
import BuyNFTPage from './Pages/NFTs/BuyNFTPage';
import { ExplorePageProvider } from './Context/ExplorePageContext';


function App() {
  return (
    <>
      <TRAlert />
      <Web3Provider>
        <ExplorePageProvider>

          <Router>
            <Navbar />

            <Switch>
              <Route path="/createCollection">
                <CreateCollection />
              </Route>
              <Route path="/myCollections">
                <UserCollections />
              </Route>
              <Route path="/:contractAddress/:metaDataHash/:ownerAddress/mint">
                <CreateNFT />
              </Route>
              <Route path="/:contractAddress/:metaDataHash/:ownerAddress">
                <CollectionDetail />
              </Route>
              <Route path="/explore/detail">
                <BuyNFTPage />
              </Route>
              <Route path="/explore">
                <ExploreCollections />
              </Route>


              <Route path="/">
                <Home />
              </Route>
            </Switch>


          </Router>
        </ExplorePageProvider>
      </Web3Provider>
    </>
  );
}

export default App;
