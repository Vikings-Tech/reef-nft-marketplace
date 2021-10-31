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
