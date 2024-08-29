const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy WorkOrderManagement contract
  const WorkOrderManagement = await ethers.getContractFactory("WorkOrderManagement");
  const workOrderManagement = await WorkOrderManagement.deploy();
  await workOrderManagement.deployed();
  console.log("WorkOrderManagement deployed to:", workOrderManagement.address);

  // Deploy Auction contract
  const Auction = await ethers.getContractFactory("Auction");
  const auction = await Auction.deploy();
  await auction.deployed();
  console.log("Auction deployed to:", auction.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
