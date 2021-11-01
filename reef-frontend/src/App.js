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
      <Navbar />
      <Home />
    </>
  );
}

export default App;
