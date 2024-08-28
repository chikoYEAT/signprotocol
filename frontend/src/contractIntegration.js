import { ethers } from 'ethers';
import WorkOrderManagementABI from './abis/WorkOrderManagement.json';
import AuctionABI from './abis/Auction.json';

// Contract Addresses
const WORK_ORDER_CONTRACT_ADDRESS = 'YOUR_WORK_ORDER_CONTRACT_ADDRESS';
const AUCTION_CONTRACT_ADDRESS = 'YOUR_AUCTION_CONTRACT_ADDRESS';

let provider;
let signer;
let workOrderContract;
let auctionContract;

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert('MetaMask is required!');
    return;
  }
  provider = new ethers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  workOrderContract = new ethers.Contract(WORK_ORDER_CONTRACT_ADDRESS, WorkOrderManagementABI.abi, signer);
  auctionContract = new ethers.Contract(AUCTION_CONTRACT_ADDRESS, AuctionABI.abi, signer);
};

export const createWorkOrder = async (description) => {
  const tx = await workOrderContract.createWorkOrder(description);
  await tx.wait();
};

export const approveWorkOrder = async (id) => {
  const tx = await workOrderContract.approveWorkOrder(id);
  await tx.wait();
};

export const issueCertificate = async (id, certificateURL) => {
  const tx = await workOrderContract.issueCertificate(id, certificateURL);
  await tx.wait();
};

export const createAuction = async (details) => {
  const tx = await auctionContract.createAuction(details);
  await tx.wait();
};

export const placeBid = async (auctionId, bidAmount) => {
  const tx = await auctionContract.placeBid(auctionId, { value: ethers.parseEther(bidAmount) });
  await tx.wait();
};

export const finalizeAuction = async (auctionId) => {
  const tx = await auctionContract.finalizeAuction(auctionId);
  await tx.wait();
};
