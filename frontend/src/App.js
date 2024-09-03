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
  finalizeAuction,
  signPDFDocument, getPDFSignature,
  PDFaddress
} from './contractIntegration';
import Login from './components/Login';
import Documentation from './components/documentation';
import Web3 from 'web3';
import contractABI1 from './components/utils/abi_contract_1';
import contractAddress from './components/utils/contract1';


const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? ''  // Leave it empty in production for relative paths
  : 'http://localhost:5001';  // Use localhost in development

function Dashboard({ walletConnected, handleConnectWallet, contract,onHashChange }) {
  const [workOrderDetails, setWorkOrderDetails] = useState('');
  const [workOrderId, setWorkOrderId] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [auctionId, setAuctionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
    const [exportedHash, setExportedHash] = useState("");
      const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function connectToWallet() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          console.log('Web3 successfully connected to wallet.');
        } catch (error) {
          console.error('Failed to connect to wallet:', error);
        }
      } else {
        console.error('Please install MetaMask or use a web3-enabled browser.');
      }
    }
    connectToWallet();
  }, []);

  function handleFileUpload(event) {
    setFile(event.target.files[0]);
  }

    const updateHash = (newHash) => {
    setHash(newHash);
    if (onHashChange) {
      onHashChange(newHash); // Notify parent component
    }
  };

    const handleFileHashing = () => {
    const calculatedHash = "someGeneratedHash"; // Replace with actual logic to generate hash
    updateHash(calculatedHash);
  };

  async function handleHashConversion() {
    if (!file) {
      console.log("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const fileData = new Uint8Array(reader.result);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', fileData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const hashBytes32 = "0x" + hashHex;
      setHash(hashBytes32);
      console.log("File Hash:", hashBytes32);
    }
    reader.readAsArrayBuffer(file);
  }

  async function handleContractInteraction(contractABI, contractAddr, method, params = []) {
    if (!web3 || !account) {
      console.error('Web3 or account not initialized');
      return;
    }

    const contract = new web3.eth.Contract(contractABI, contractAddr);
    try {
      const result = await contract.methods[method](...params).send({ from: account });
      console.log(`${method} result:`, result);
      return result;
    } catch (error) {
      console.error(`Error in ${method}:`, error);
    }
  }

  async function handleAddDocument() {
    if (!hash) {
      console.error('No hash available');
      return;
    }
    await handleContractInteraction(contractABI1, contractAddress, 'addDocument', [hash]);
  }

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

    // Debug the values before sending the request
    console.log('Work Order Details:', workOrderDetails);
    console.log('Username:', username);
    console.log('Signed Hash:', hash);
    console.log(exportedHash)
    console.log('Account:', account);

    const response = await axios.post(`${API_BASE_URL}/api/work-orders`, {
      workOrderTitle: workOrderDetails,
      description: `Details of the work order created after finalizing auction ${auctionId}`,
      createdBy: account,
      username: `${username}`,
      signed: `${hash}`,
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

    <Section title="Issue Certificate" className="p-6 bg-gray-800 rounded-lg shadow-md">
      <div className="mb-4">
        <Input
          value={workOrderId}
          onChange={(e) => setWorkOrderId(e.target.value)}
          placeholder="Enter work order ID"
          className="w-full p-2 border border-gray-600 rounded-lg"
        />
      </div>
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileUpload}
          className="w-full text-gray-700 border border-gray-600 rounded-lg"
        />
      </div>
      <div className="flex gap-4 mb-4">
        <Button
          onClick={handleHashConversion}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Convert to Hash
        </Button>
        <Button
          onClick={handleAddDocument}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Sign Document
        </Button>
      </div>
      {hash && (
        <p className="text-gray-300 mt-4">
          <strong>Hash:</strong> {hash}
        </p>
      )}
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
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link href="#" className="flex items-center justify-center">
          <MountainIcon className="h-6 w-6 text-[#9370DB]" />
          <span className="sr-only">Acme Inc</span>
        </Link>
        <nav className="hidden lg:flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4 text-[#9370DB]">Features</Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4 text-[#9370DB]">Pricing</Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4 text-[#9370DB]">About</Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4 text-[#9370DB]">Contact</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Elevate Your Digital Presence</h1>
          <p className="text-gray-400">Unlock the power of our cutting-edge solutions to transform your online experience.</p>
          <a href="/login" className="inline-flex h-10 items-center justify-center rounded-md bg-[#9370DB] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#8257c8]">
            Get Started
          </a>
        </div>
      </main>

      <section className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-12 md:py-24 lg:py-32 bg-[#2a2a2a]">
        <div className="container px-4 md:px-6 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Features That Matter</h2>
            <p className="text-gray-400">Discover the tools and features that will elevate your digital presence.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={<ZapIcon />} title="Blazing Fast" description="Our platform delivers lightning-fast performance, ensuring seamless user experiences." />
            <FeatureCard icon={<ShieldIcon />} title="Secure by Design" description="Robust security measures keep your data safe and your applications protected." />
            <FeatureCard icon={<CpuIcon />} title="Scalable Solutions" description="Our platform scales seamlessly to meet your growing needs, ensuring your success." />
          </div>
        </div>
      </section>

      <section className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get in Touch</h2>
            <p className="text-gray-400">Have a question or want to learn more? Contact us today.</p>
          </div>
          <form className="mx-auto max-w-md space-y-4">
            <input type="text" placeholder="Name" className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#9370DB]" />
            <input type="email" placeholder="Email" className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#9370DB]" />
            <textarea placeholder="Message" rows={4} className="w-full px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-md text-white focus:outline-none focus:border-[#9370DB]" />
            <button type="submit" className="w-full px-4 py-2 bg-[#9370DB] text-white rounded-md hover:bg-[#8257c8] focus:outline-none">
              Submit
            </button>
          </form>
        </div>
        
      </section>
            <footer className="border-t border-gray-800 pt-4 mt-8 p-8">
                <p className="text-gray-500 text-sm">
                     {new Date().getFullYear()} blockmosaic . A Sign Protocol.
                </p>
            </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 space-y-2">
      <div className="h-8 w-8 text-[#9370DB]">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

function TestimonialCard({ name, title, message }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">{name.charAt(0)}</div>
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-gray-400">{title}</p>
        </div>
      </div>
      <p className="text-gray-400">{message}</p>
    </div>
  )
}


function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}

function ShieldIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V5.21a2 2 0 0 1 1.35-1.89l6-2a2 2 0 0 1 1.3 0l6 2A2 2 0 0 1 20 5.21V13z" />
    </svg>
  )
}

function ZapIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function CpuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v2" />
      <path d="M15 1v2" />
      <path d="M9 21v2" />
      <path d="M15 21v2" />
      <path d="M20 9h2" />
      <path d="M20 15h2" />
      <path d="M2 9h2" />
      <path d="M2 15h2" />
    </svg>
  )
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
