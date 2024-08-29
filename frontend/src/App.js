import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes, Switch, Link } from 'react-router-dom';
import WorkOrderManagementABI from './abis/WorkOrderManagement.json';
import { 
  createWorkOrder, 
  approveWorkOrder, 
  issueCertificate, 
  connectWallet,
  createAuction,
  placeBid,
  finalizeAuction
} from './contractIntegration';
import Login from './components/Login';

function Dashboard({ walletConnected, handleConnectWallet, contract, account }) {
  const [workOrderDetails, setWorkOrderDetails] = useState('');
  const [workOrderId, setWorkOrderId] = useState('');
  const [certificateURL, setCertificateURL] = useState('');
  const [auctionDetails, setAuctionDetails] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [auctionId, setAuctionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleGrantRoleAndCreateWorkOrder = async () => {
    if (!walletConnected) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }
    try {
      // Grant the DEPARTMENT_ROLE to the current account
      const tx1 = await contract.grantDepartmentRole(account);
      await tx1.wait();
      console.log('DEPARTMENT_ROLE granted to', account);

      // Now create a work order
      const tx2 = await contract.createWorkOrder(workOrderDetails);
      await tx2.wait();
      console.log('Work order created successfully');
      alert('Role granted and Work Order created successfully!');
    } catch (error) {
      setErrorMessage('Error: ' + error.message);
    }
  };

  const handleCreateWorkOrder = async () => {
    if (!walletConnected) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }
    try {
      const tx = await contract.createWorkOrder(workOrderDetails);
      await tx.wait();
      alert('Work Order Created');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error creating work order: ' + error.message);
    }
  };

  const handleApproveWorkOrder = async () => {
    if (!walletConnected) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }
    try {
      await approveWorkOrder(workOrderId);
      alert('Work Order Approved');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error approving work order: ' + error.message);
    }
  };

  const handleIssueCertificate = async () => {
    if (!walletConnected) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }
    try {
      await issueCertificate(workOrderId, certificateURL);
      alert('Certificate Issued');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error issuing certificate: ' + error.message);
    }
  };

  const handleCreateAuction = async () => {
    if (!walletConnected) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }
    try {
      await createAuction(auctionDetails);
      alert('Auction Created');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error creating auction: ' + error.message);
    }
  };

  const handlePlaceBid = async () => {
    if (!walletConnected) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }
    try {
      await placeBid(auctionId, bidAmount);
      alert('Bid Placed');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error placing bid: ' + error.message);
    }
  };

  const handleFinalizeAuction = async () => {
    if (!walletConnected) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }
    try {
      await finalizeAuction(auctionId);
      alert('Auction Finalized');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error finalizing auction: ' + error.message);
    }
  };
  return (
    <div className="p-4">
      <button 
        onClick={handleConnectWallet} 
        disabled={walletConnected}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <h1 className="text-2xl font-bold mb-4">Work Order Management</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Create Work Order</h2>
        <input 
          type="text" 
          value={workOrderDetails} 
          onChange={(e) => setWorkOrderDetails(e.target.value)} 
          placeholder="Enter work order details"
          className="border p-2 mr-2"
        />
        <button onClick={handleCreateWorkOrder} className="px-4 py-2 bg-green-500 text-white rounded">Create</button>
        <button onClick={handleGrantRoleAndCreateWorkOrder} className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded">Grant Role & Create</button>
      </div>
      <div>
        <h2>Approve Work Order</h2>
        <input 
          type="text" 
          value={workOrderId} 
          onChange={(e) => setWorkOrderId(e.target.value)} 
          placeholder="Enter work order ID"
        />
        <button onClick={handleApproveWorkOrder}>Approve</button>
      </div>

      <div>
        <h2>Issue Certificate</h2>
        <input 
          type="text" 
          value={workOrderId} 
          onChange={(e) => setWorkOrderId(e.target.value)} 
          placeholder="Enter work order ID"
        />
        <input 
          type="text" 
          value={certificateURL} 
          onChange={(e) => setCertificateURL(e.target.value)} 
          placeholder="Enter certificate URL"
        />
        <button onClick={handleIssueCertificate}>Issue Certificate</button>
      </div>

      <div>
        <h2>Create Auction</h2>
        <input 
          type="text" 
          value={auctionDetails} 
          onChange={(e) => setAuctionDetails(e.target.value)} 
          placeholder="Enter auction details"
        />
        <button onClick={handleCreateAuction}>Create Auction</button>
      </div>

      <div>
        <h2>Place Bid</h2>
        <input 
          type="text" 
          value={auctionId} 
          onChange={(e) => setAuctionId(e.target.value)} 
          placeholder="Enter auction ID"
        />
        <input 
          type="number" 
          value={bidAmount} 
          onChange={(e) => setBidAmount(e.target.value)} 
          placeholder="Enter bid amount"
        />
        <button onClick={handlePlaceBid}>Place Bid</button>
      </div>

      <div>
        <h2>Finalize Auction</h2>
        <input 
          type="text" 
          value={auctionId} 
          onChange={(e) => setAuctionId(e.target.value)} 
          placeholder="Enter auction ID"
        />
        <button onClick={handleFinalizeAuction}>Finalize Auction</button>
      </div>
    </div>
  );
}


function Home() {
  return (
    <div>
      <h1>Welcome to Work Order Management</h1>
      <p>Please login or connect your wallet to continue.</p>
    </div>
  );
}

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await handleConnectWallet();
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  const handleConnectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const workOrderContract = new ethers.Contract('0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9', WorkOrderManagementABI.abi, signer);
        setContract(workOrderContract);

        setWalletConnected(true);
        setErrorMessage('');
      } else {
        setErrorMessage('Please install MetaMask!');
      }
    } catch (error) {
      setErrorMessage('Error connecting wallet: ' + error.message);
    }
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <Dashboard 
              walletConnected={walletConnected}
              handleConnectWallet={handleConnectWallet}
              contract={contract}
              account={account}
            />
          } />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;