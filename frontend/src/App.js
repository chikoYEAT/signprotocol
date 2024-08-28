import React, { useState } from 'react';
import { createWorkOrder, approveWorkOrder, issueCertificate, connectWallet } from './contractIntegration'; // Ensure imports are updated
import { createAuction, placeBid, finalizeAuction } from './contractIntegration';

function App() {
  const [workOrderDetails, setWorkOrderDetails] = useState('');
  const [workOrderId, setWorkOrderId] = useState('');
  const [certificateURL, setCertificateURL] = useState('');
  const [auctionDetails, setAuctionDetails] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [auctionId, setAuctionId] = useState('');

  const handleCreateWorkOrder = async () => {
    try {
      await createWorkOrder(workOrderDetails);
      alert('Work Order Created');
    } catch (error) {
      alert('Error creating work order:', error.message);
    }
  };

  const handleApproveWorkOrder = async () => {
    try {
      await approveWorkOrder(workOrderId);
      alert('Work Order Approved');
    } catch (error) {
      alert('Error approving work order:', error.message);
    }
  };

  const handleIssueCertificate = async () => {
    try {
      await issueCertificate(workOrderId, certificateURL);
      alert('Certificate Issued');
    } catch (error) {
      alert('Error issuing certificate:', error.message);
    }
  };

  const handleCreateAuction = async () => {
    try {
      await createAuction(auctionDetails);
      alert('Auction Created');
    } catch (error) {
      alert('Error creating auction:', error.message);
    }
  };

  const handlePlaceBid = async () => {
    try {
      await placeBid(auctionId, bidAmount);
      alert('Bid Placed');
    } catch (error) {
      alert('Error placing bid:', error.message);
    }
  };

  const handleFinalizeAuction = async () => {
    try {
      await finalizeAuction(auctionId);
      alert('Auction Finalized');
    } catch (error) {
      alert('Error finalizing auction:', error.message);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      alert('Wallet Connected');
    } catch (error) {
      alert('Error connecting wallet:', error.message);
    }
  };

  return (
    <div className="App">
      <button onClick={handleConnectWallet}>Connect Wallet</button>
      <h1>Work Order Management</h1>

      <div>
        <h2>Create Work Order</h2>
        <input 
          type="text" 
          value={workOrderDetails} 
          onChange={(e) => setWorkOrderDetails(e.target.value)} 
          placeholder="Enter work order details"
        />
        <button onClick={handleCreateWorkOrder}>Create</button>
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

export default App;
