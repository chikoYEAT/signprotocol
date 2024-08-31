const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the latest block number
  const latestBlock = await hre.ethers.provider.getBlockNumber();
  console.log("Latest block number:", latestBlock);

  // Get the current nonce
  let nonce = await deployer.getTransactionCount();
  console.log("Current nonce:", nonce);

  // Get the current gas price
  const gasPrice = await hre.ethers.provider.getGasPrice();
  console.log("Current gas price:", gasPrice.toString());

  // Set up the deployment options
  const overrides = {
    gasPrice: gasPrice,
    gasLimit: 3000000, // Adjust this value as needed
    nonce: nonce
  };

  // Deploy WorkOrderManagement contract
  const WorkOrderManagement = await hre.ethers.getContractFactory("WorkOrderManagement");
  console.log("Deploying WorkOrderManagement...");
  const workOrderManagement = await WorkOrderManagement.deploy(overrides);
  console.log("Transaction hash:", workOrderManagement.deployTransaction.hash);
  await workOrderManagement.deployed();
  console.log("WorkOrderManagement deployed to:", workOrderManagement.address);

  // Update nonce for the next transaction
  nonce++;
  overrides.nonce = nonce;

  // Deploy Auction contract
  const Auction = await hre.ethers.getContractFactory("Auction");
  console.log("Deploying Auction...");
  const auction = await Auction.deploy(overrides);
  console.log("Transaction hash:", auction.deployTransaction.hash);
  await auction.deployed();
  console.log("Auction deployed to:", auction.address);

  // Update nonce for the next transaction
  nonce++;
  overrides.nonce = nonce;

  // Deploy PDFSigningProtocol contract
  const PDFSigningProtocol = await hre.ethers.getContractFactory("PDFSigningProtocol");
  console.log("Deploying PDFSigningProtocol...");
  const pdfSigningProtocol = await PDFSigningProtocol.deploy(overrides);
  console.log("Transaction hash:", pdfSigningProtocol.deployTransaction.hash);
  await pdfSigningProtocol.deployed();
  console.log("PDFSigningProtocol deployed to:", pdfSigningProtocol.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
