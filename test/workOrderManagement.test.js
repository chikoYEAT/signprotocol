const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WorkOrderManagement", function () {
  it("Should create and approve a work order", async function () {
    const [owner, dept] = await ethers.getSigners();
    const WorkOrderManagement = await ethers.getContractFactory("WorkOrderManagement");
    const workOrderManagement = await WorkOrderManagement.deploy();
    await workOrderManagement.deployed();

    await workOrderManagement.grantRole(await workOrderManagement.DEPARTMENT_ROLE(), dept.address);

    const tx = await workOrderManagement.connect(dept).createWorkOrder("Fix electrical issues");
    await tx.wait();

    const workOrder = await workOrderManagement.workOrders(0);
    expect(workOrder.description).to.equal("Fix electrical issues");


    await workOrderManagement.connect(owner).approveWorkOrder(0);

    // Verify the work order was approved
    const approvedWorkOrder = await workOrderManagement.workOrders(0);
    expect(approvedWorkOrder.approved).to.be.true;
  });
});
