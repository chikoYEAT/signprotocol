// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract WorkOrderManagement is AccessControl {
    bytes32 public constant DEPARTMENT_ROLE = keccak256("DEPARTMENT_ROLE");

    struct WorkOrder {
        string description;
        address issuer;
        bool approved;
    }

    WorkOrder[] public workOrders;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createWorkOrder(string memory _description) public onlyRole(DEPARTMENT_ROLE) {
        workOrders.push(WorkOrder(_description, msg.sender, false));
    }

    function approveWorkOrder(uint256 _index) public onlyRole(DEFAULT_ADMIN_ROLE) {
        workOrders[_index].approved = true;
    }
}
