const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const WorkOrderManagement = await ethers.getContractFactory("WorkOrderManagement");
    const workOrderManagement = WorkOrderManagement.attach('0x5FbDB2315678afecb367f032d93F642f64180aa3'); // Your contract address

    // Example role grant
    const departmentRole = await workOrderManagement.DEPARTMENT_ROLE();
    const tx = await workOrderManagement.grantRole(departmentRole, '0xNewAddressHere');
    await tx.wait();
    console.log("Role granted.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
