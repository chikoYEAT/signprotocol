import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, Navigate  } from 'react-router-dom';
import WorkOrderManagementABI from './abis/WorkOrderManagement.json';
import WorkOrder from './components/workOrder';
import WorkOrderAdmin from './components/workOrderAdmin';
import Navbar from './components/Navbar'
import { 
  approveWorkOrder, 
  issueCertificate,
  createAuction,
  placeBid,
  finalizeAuction
} from './contractIntegration';
import Login from './components/Login';
import Documentation from './components/documentation';

function Dashboard({ walletConnected, handleConnectWallet, contract, account,username }) {
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
      const tx1 = await contract.grantDepartmentRole(account);
      await tx1.wait();
      console.log('DEPARTMENT_ROLE granted to', account);

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
    try {
      await finalizeAuction(auctionId);
      const username = localStorage.getItem('username');
      if (!username) {
        throw new Error('Username not found in localStorage.');
      }
      const response = await axios.post('http://localhost:5000/api/work-orders', {
        workOrderTitle: workOrderDetails,
        description: `Details of the work order created after finalizing auction ${auctionId}`,
        createdBy: account,
        username: `${username}`  // Ensure username is correctly added here
      });
      alert('Auction Finalized and Work Order Created');
    } catch (error) {
      console.error('Error finalizing auction:', error.message);
      setErrorMessage('Error finalizing auction: ' + error.message);
    }
  };

 return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 font-sans" style={{paddingTop:'80px'}}>
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={handleConnectWallet} 
          disabled={walletConnected}
          className={`w-full sm:w-auto mb-6 px-6 py-3 rounded-full text-sm font-medium ${walletConnected ? 'bg-gray-800 text-gray-400' : 'bg-purple-600 hover:bg-purple-700'} transition-colors duration-300`}
        >
          {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
        </button>

        {errorMessage && <div className="text-red-500 mb-6 text-center text-sm">{errorMessage}</div>}

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Work Order Management</h1>

        {walletConnected ? (
          <>
            <Section title="Create Work Order">
              <Input 
                value={workOrderDetails} 
                onChange={(e) => setWorkOrderDetails(e.target.value)} 
                placeholder="Enter work order details"
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleCreateWorkOrder}>Create</Button>
                <Button onClick={handleGrantRoleAndCreateWorkOrder} className="bg-yellow-600 hover:bg-yellow-700">Grant Role & Create</Button>
              </div>
            </Section>

            <Section title="Approve Work Order">
              <Input 
                value={workOrderId} 
                onChange={(e) => setWorkOrderId(e.target.value)} 
                placeholder="Enter work order ID"
              />
              <Button onClick={handleApproveWorkOrder} className="bg-blue-600 hover:bg-blue-700">Approve</Button>
            </Section>

            <Section title="Issue Certificate">
              <Input 
                value={workOrderId} 
                onChange={(e) => setWorkOrderId(e.target.value)} 
                placeholder="Enter work order ID"
              />
              <Input 
                value={certificateURL} 
                onChange={(e) => setCertificateURL(e.target.value)} 
                placeholder="Enter certificate URL"
              />
              <Button onClick={handleIssueCertificate}>Issue Certificate</Button>
            </Section>

            <Section title="Create Auction">
              <Input 
                value={auctionDetails} 
                onChange={(e) => setAuctionDetails(e.target.value)} 
                placeholder="Enter auction details"
              />
              <Button onClick={handleCreateAuction} className="bg-teal-600 hover:bg-teal-700">Create Auction</Button>
            </Section>

            <Section title="Place Bid">
              <Input 
                value={auctionId} 
                onChange={(e) => setAuctionId(e.target.value)} 
                placeholder="Enter auction ID"
              />
              <Input 
                type="number" 
                value={bidAmount} 
                onChange={(e) => setBidAmount(e.target.value)} 
                placeholder="Enter bid amount"
              />
              <Button onClick={handlePlaceBid} className="bg-indigo-600 hover:bg-indigo-700">Place Bid</Button>
            </Section>

            <Section title="Finalize Auction">
              <Input 
                value={auctionId} 
                onChange={(e) => setAuctionId(e.target.value)} 
                placeholder="Enter auction ID"
              />
              <Button onClick={handleFinalizeAuction} className="bg-red-600 hover:bg-red-700">Finalize Auction</Button>
            </Section>
          </>
        ) : (
          <div className="text-gray-500 text-center">Connect your wallet to perform actions.</div>
        )}
      </div>
      <footer className="border-t border-gray-800 pt-4 mt-8">
                <p className="text-gray-500 text-sm">
                     {new Date().getFullYear()} blockmosaic . A Sign Protocol.
                </p>
            </footer>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-purple-400">{title}</h2>
    {children}
  </div>
);

const Input = ({ ...props }) => (
  <input 
    {...props}
    className="border border-gray-700 bg-gray-800 text-white p-3 rounded-md mb-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
  />
);

const Button = ({ children, className = '', ...props }) => (
  <button 
    {...props}
    className={`px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors duration-300 text-sm font-medium ${className}`}
  >
    {children}
  </button>
);

function Home() {
  return (
    <div style={{paddingTop:'80px'}}>
      <h1>Welcome to Work Order Management</h1>
      <p>Please login or connect your wallet to continue.</p>
    </div>
  );
}

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
      if (token) {
        setIsLoggedIn(true);
        setRole(storedRole || ''); // Set role from localStorage
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setWalletConnected(true);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const workOrderContract = new ethers.Contract('0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9', WorkOrderManagementABI.abi, signer);
            setContract(workOrderContract);
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

  const handleLogin = () => {
    setIsLoggedIn(true); // Update login state after successful login
    const storedRole = localStorage.getItem('role');
    setRole(storedRole || ''); // Set role from localStorage
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    localStorage.removeItem('role'); // Clear the role from local storage
    setIsLoggedIn(false); // Update login state
    setRole(''); // Clear role state
  };

  return (
    <Router>
      <div>
        <Navbar
          isLoggedIn={isLoggedIn}
          role={role}
          handleLogout={handleLogout}
          walletConnected={walletConnected}
          handleConnectWallet={handleConnectWallet}
        />
        <Routes style={{paddingTop:'80px'}}>
          <Route path='/docs' element={<Documentation />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={isLoggedIn ? (
            <Dashboard 
              walletConnected={walletConnected}
              handleConnectWallet={handleConnectWallet}
              contract={contract}
              account={account}
            />
          ) : <Navigate to="/login" />} />
          <Route path="/workorder" element={isLoggedIn ? (
            <WorkOrder />
          ) : <Navigate to="/login" />} />
          <Route path="/workorder-admin" element={isLoggedIn && role === 'admin' ? (
            <WorkOrderAdmin />
          ) : <Navigate to="/login" />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
