import WorkOrderManagementABI from './abis/WorkOrderManagement.json';
import AuctionABI from './abis/Auction.json';
const ethers = require('ethers');

// Contract Addresses
const WORK_ORDER_CONTRACT_ADDRESS = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
const AUCTION_CONTRACT_ADDRESS = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';  // Replace this with your actual auction contract address

let provider;
let signer;
let workOrderContract;
let auctionContract;

// Connect Wallet Function
export const connectWallet = async () => {
    if (!window.ethereum) {
        throw new Error('MetaMask is required!');
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        // Initialize contracts
        workOrderContract = new ethers.Contract(WORK_ORDER_CONTRACT_ADDRESS, WorkOrderManagementABI.abi, signer);
        auctionContract = new ethers.Contract(AUCTION_CONTRACT_ADDRESS, AuctionABI.abi, signer);

        console.log('Wallet connected and contracts initialized');
    } catch (error) {
        console.error('Error connecting wallet:', error);
        throw new Error('Failed to connect wallet');
    }
};

// Check if wallet is connected before contract interaction
const ensureWalletConnected = async () => {
    if (!workOrderContract || !signer) {
        await connectWallet();  // Connect the wallet if not already connected
    }
};

// Create Work Order
export const createWorkOrder = async (description) => {
    await ensureWalletConnected();
    try {
        const tx = await workOrderContract.createWorkOrder(description);
        await tx.wait();
        console.log('Work order created successfully');
    } catch (error) {
        console.error('Error creating work order:', error);
    }
};

// Approve Work Order
export const approveWorkOrder = async (id) => {
    await ensureWalletConnected();
    try {
        const tx = await workOrderContract.approveWorkOrder(id);
        await tx.wait();
        console.log('Work order approved successfully');
    } catch (error) {
        console.error('Error approving work order:', error);
    }
};

// Issue Certificate
export const issueCertificate = async (id, certificateURL) => {
    await ensureWalletConnected();
    try {
        const tx = await workOrderContract.issueCertificate(id, certificateURL);
        await tx.wait();
        console.log('Certificate issued successfully');
    } catch (error) {
        console.error('Error issuing certificate:', error);
    }
};

// Create Auction
export const createAuction = async (details) => {
    await ensureWalletConnected();
    try {
        const tx = await auctionContract.createAuction(details);
        await tx.wait();
        console.log('Auction created successfully');
    } catch (error) {
        console.error('Error creating auction:', error);
    }
};

// Place Bid
export const placeBid = async (auctionId, bidAmount) => {
    await ensureWalletConnected();
    try {
        const tx = await auctionContract.placeBid(auctionId, { value: ethers.parseEther(bidAmount.toString()) });
        await tx.wait();
        console.log('Bid placed successfully');
    } catch (error) {
        console.error('Error placing bid:', error);
    }
};

// Finalize Auction
export const finalizeAuction = async (auctionId) => {
    await ensureWalletConnected();
    try {
        const tx = await auctionContract.finalizeAuction(auctionId);
        await tx.wait();
        console.log('Auction finalized successfully');
    } catch (error) {
        console.error('Error finalizing auction:', error);
    }
};
