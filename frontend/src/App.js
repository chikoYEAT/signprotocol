import React, { useState } from 'react';
import { createWorkOrder, approveWorkOrder, connectWallet } from './contractIntegration'; // Ensure connectWallet is imported

function App() {
  const [details, setDetails] = useState('');
  const [orderId, setOrderId] = useState('');

  const handleCreateWorkOrder = async () => {
    try {
      await createWorkOrder(details);
      alert('Work Order Created');
    } catch (error) {
      alert('Error creating work order:', error.message);
    }
  };

  const handleApproveWorkOrder = async () => {
    try {
      await approveWorkOrder(orderId);
      alert('Work Order Approved');
    } catch (error) {
      alert('Error approving work order:', error.message);
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
      <button onClick={handleConnectWallet}>Connect Wallet</button> {/* Updated to use handleConnectWallet */}
      <h1>Work Order Management</h1>

      <div>
        <h2>Create Work Order</h2>
        <input 
          type="text" 
          value={details} 
          onChange={(e) => setDetails(e.target.value)} 
          placeholder="Enter work order details"
        />
        <button onClick={handleCreateWorkOrder}>Create</button>
      </div>

      <div>
        <h2>Approve Work Order</h2>
        <input 
          type="text" 
          value={orderId} 
          onChange={(e) => setOrderId(e.target.value)} 
          placeholder="Enter work order ID"
        />
        <button onClick={handleApproveWorkOrder}>Approve</button>
      </div>
    </div>
  );
}

export default App;
