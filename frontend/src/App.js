import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './hooks/useWeb3Context';
import Navbar from './components/Navbar';
import WorkOrders from './components/WorkOrders';
import Auction from './components/Auctions';

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<WorkOrders />} />
            {/* Work Orders Page */}
            <Route path="/work-orders" element={<WorkOrders />} />
            {/* Auction Page */}
            <Route path="/auctions" element={<Auction />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;
