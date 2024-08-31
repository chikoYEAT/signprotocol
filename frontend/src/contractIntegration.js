import WorkOrderManagementABI from './abis/WorkOrderManagement.json';
import AuctionABI from './abis/Auction.json';
import PDFSigningProtocolABI from './abis/PDFSigningProtocol.json';
const ethers = require('ethers');

// Contract Addresses
const WORK_ORDER_CONTRACT_ADDRESS = '0x712516e61C8B383dF4A63CFe83d7701Bce54B03e';
const AUCTION_CONTRACT_ADDRESS = '0xbCF26943C0197d2eE0E5D05c716Be60cc2761508';
const PDF_SIGNING_CONTRACT_ADDRESS = '0x59F2f1fCfE2474fD5F0b9BA1E73ca90b143Eb8d0';

let provider;
let signer;
let workOrderContract;
let auctionContract;
let pdfSigningContract;

// Initialize contracts when connecting the wallet
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is required!');
  }
  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    console.log('Connected to network:', network.name, 'Chain ID:', network.chainId);

    signer = await provider.getSigner();
    console.log('Signer address:', await signer.getAddress());

    // Initialize other contracts
    workOrderContract = new ethers.Contract(WORK_ORDER_CONTRACT_ADDRESS, WorkOrderManagementABI.abi, signer);
    auctionContract = new ethers.Contract(AUCTION_CONTRACT_ADDRESS, AuctionABI.abi, signer);
    pdfSigningContract = new ethers.Contract(PDF_SIGNING_CONTRACT_ADDRESS, PDFSigningProtocolABI.abi, signer);

    console.log('Wallet connected and contracts initialized');
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw new Error('Failed to connect wallet: ' + error.message);
  }
};


// Check if wallet is connected before contract interaction
const ensureWalletConnected = async () => {
  if (!workOrderContract || !signer) {
    await connectWallet(); // Connect the wallet if not already connected
  }
};

// Create Work Order
export const createWorkOrder = async (description) => {
  await ensureWalletConnected();
  try {
    console.log('Creating work order with description:', description);
    console.log('Work Order Contract Address:', WORK_ORDER_CONTRACT_ADDRESS);
    console.log('Signer address:', await signer.getAddress());
    
    const gasEstimate = await workOrderContract.createWorkOrder.estimateGas(description);
    console.log('Estimated gas:', gasEstimate.toString());
    
    const tx = await workOrderContract.createWorkOrder(description, {
      gasLimit: gasEstimate.mul(120).div(100) // Add 20% buffer to gas estimate
    });
    console.log('Transaction hash:', tx.hash);
    await tx.wait();
    console.log('Work order created successfully');
  } catch (error) {
    console.error('Error creating work order:', error);
    if (error.data) {
      console.error('Error data:', error.data);
    }
    throw error;
  }
};

export const PDFaddress = async () => { 
    await ensureWalletConnected();
    return await signer.getAddress() }


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


export const signPDFDocument = async (pdfBuffer) => {
  await ensureWalletConnected();
  try {
    // Create a hash of the PDF
    const hashSum = crypto.createHash('sha256');
    hashSum.update(pdfBuffer);
    const documentHash = '0x' + hashSum.digest('hex');

    console.log('Document hash:', documentHash);

    // Sign the document on the blockchain
    const tx = await pdfSigningContract.signDocument(documentHash);
    await tx.wait();

    console.log('Document signed successfully:', documentHash);
    return documentHash;
  } catch (error) {
    console.error('Error signing document:', error);
    throw error;
  }
};

export const getPDFSignature = async (documentHash) => {
  await ensureWalletConnected();
  try {
    const signature = await pdfSigningContract.getSignature(documentHash);
    console.log('Signature details:', signature);
    return signature;
  } catch (error) {
    console.error('Error retrieving signature:', error);
    throw error;
  }
};
