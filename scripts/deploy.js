async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const WorkOrderManagement = await ethers.getContractFactory("WorkOrderManagement");
  const workOrderManagement = await WorkOrderManagement.deploy();
  console.log("WorkOrderManagement deployed to:", workOrderManagement.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
