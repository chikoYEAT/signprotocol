import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
let signer;

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "details",
        "type": "string"
      }
    ],
    "name": "createWorkOrder",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      }
    ],
    "name": "approveWorkOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let contract;

const initializeContract = async () => {
  if (!signer) {
    await connectWallet();
  }
  contract = new ethers.Contract(contractAddress, contractABI, signer);
};

export const createWorkOrder = async (details) => {
  try {
    if (!contract) await initializeContract();
    
    console.log('Submitting work order...');
    const tx = await contract.createWorkOrder(details);
    
    console.log('Transaction submitted. Waiting for confirmation...');
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      console.log('Work order created successfully!');
      console.log('Transaction hash:', receipt.transactionHash);
      
      // Assuming the contract emits an event with the work order ID
      const event = receipt.logs.find(log => log.eventName === 'WorkOrderCreated');
      if (event) {
        const workOrderId = event.args[0]; // Adjust based on your event structure
        console.log('Work Order ID:', workOrderId.toString());
      }
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        workOrderId: event ? event.args[0].toString() : null
      };
    } else {
      console.error('Transaction failed');
      return { success: false, error: 'Transaction failed' };
    }
  } catch (error) {
    console.error('Error creating work order:', error);
    return { success: false, error: error.message };
  }
};

// Function to approve a work order
export const approveWorkOrder = async (orderId) => {
  try {
    if (!contract) await initializeContract();
    
    // Ensure orderId is a number
    const orderIdNumber = parseInt(orderId, 10);
    if (isNaN(orderIdNumber)) {
      throw new Error('Invalid order ID');
    }
    
    const tx = await contract.approveWorkOrder(orderIdNumber);
    console.log('Approving work order. Waiting for confirmation...');
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      console.log('Work order approved successfully!');
      return { success: true, transactionHash: receipt.transactionHash };
    } else {
      console.error('Approval transaction failed');
      return { success: false, error: 'Approval transaction failed' };
    }
  } catch (error) {
    console.error('Error approving work order:', error);
    return { success: false, error: error.message };
  }
};

// Function to connect wallet
export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      console.log("Wallet connected");
      return { success: true };
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return { success: false, error: error.message };
    }
  } else {
    console.error("MetaMask not installed.");
    return { success: false, error: "MetaMask not installed" };
  }
};