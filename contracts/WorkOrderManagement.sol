// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract WorkOrderManagement is AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _workOrderIdCounter;

    bytes32 public constant DEPARTMENT_ROLE = keccak256("DEPARTMENT_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct WorkOrder {
        uint256 id;
        string description;
        address issuer;
        bool approved;
        string certificateURL; // URL to the certificate
    }

    mapping(uint256 => WorkOrder) public workOrders;

    event WorkOrderCreated(uint256 id, string description, address issuer);
    event WorkOrderApproved(uint256 id, address approver);
    event CertificateIssued(uint256 id, string certificateURL);

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DEPARTMENT_ROLE, msg.sender); // Grant initial role to deployer
    }

    function createWorkOrder(string memory _description) public onlyRole(DEPARTMENT_ROLE) {
        uint256 workOrderId = _workOrderIdCounter.current();
        _workOrderIdCounter.increment();
        workOrders[workOrderId] = WorkOrder(workOrderId, _description, msg.sender, false, "");
        emit WorkOrderCreated(workOrderId, _description, msg.sender);
    }

    function approveWorkOrder(uint256 _id) public onlyRole(ADMIN_ROLE) {
        WorkOrder storage workOrder = workOrders[_id];
        require(!workOrder.approved, "Work order already approved");
        workOrder.approved = true;
        emit WorkOrderApproved(_id, msg.sender);
    }

    function issueCertificate(uint256 _id, string memory _certificateURL) public onlyRole(ADMIN_ROLE) {
        WorkOrder storage workOrder = workOrders[_id];
        require(workOrder.approved, "Work order not approved");
        workOrder.certificateURL = _certificateURL;
        emit CertificateIssued(_id, _certificateURL);
    }

    function getDepartmentRole() public pure returns (bytes32) {
        return DEPARTMENT_ROLE;
    }

    function getAdminRole() public pure returns (bytes32) {
        return ADMIN_ROLE;
    }
}
