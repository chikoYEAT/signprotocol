// scripts/verifyRoles.js

const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const WorkOrderManagement = await ethers.getContractFactory("WorkOrderManagement");
    const workOrderManagement = WorkOrderManagement.attach('0x5FbDB2315678afecb367f032d93F642f64180aa3'); // Replace with your address

    const departmentRole = await workOrderManagement.DEPARTMENT_ROLE();
    const hasRole = await workOrderManagement.hasRole(departmentRole, deployer.address);
    console.log("Has DEPARTMENT_ROLE:", hasRole);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
