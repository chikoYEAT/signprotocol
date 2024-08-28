const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const WorkOrderManagement = await hre.ethers.getContractFactory("WorkOrderManagement");
  const workOrderManagement = await WorkOrderManagement.deploy();

  await workOrderManagement.deployed();

  console.log("WorkOrderManagement deployed to:", workOrderManagement.address);

  // Grant the DEPARTMENT_ROLE to the deployer
  const DEPARTMENT_ROLE = await workOrderManagement.DEPARTMENT_ROLE();
  await workOrderManagement.grantRole(DEPARTMENT_ROLE, deployer.address);
  console.log("DEPARTMENT_ROLE granted to:", deployer.address);

  // If you want to grant the role to a different account, you can do:
  // const otherAccount = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
  // await workOrderManagement.grantRole(DEPARTMENT_ROLE, otherAccount);
  // console.log("DEPARTMENT_ROLE granted to:", otherAccount);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });