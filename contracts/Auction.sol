// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Auction is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct AuctionItem {
        uint256 id;
        string itemDetails;
        address highestBidder;
        uint256 highestBid;
        bool finalized;
    }

    uint256 public nextAuctionId;
    mapping(uint256 => AuctionItem) public auctions;

    event AuctionCreated(uint256 id, string itemDetails);
    event NewBid(uint256 auctionId, address bidder, uint256 bid);
    event AuctionFinalized(uint256 auctionId, address winner, uint256 winningBid);

    constructor() {
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    function createAuction(string calldata itemDetails) external onlyRole(ADMIN_ROLE) {
        auctions[nextAuctionId] = AuctionItem(nextAuctionId, itemDetails, address(0), 0, false);
        emit AuctionCreated(nextAuctionId, itemDetails);
        nextAuctionId++;
    }

    function placeBid(uint256 auctionId) external payable {
        AuctionItem storage auction = auctions[auctionId];
        require(msg.value > auction.highestBid, "Bid too low");
        auction.highestBidder = msg.sender;
        auction.highestBid = msg.value;
        emit NewBid(auctionId, msg.sender, msg.value);
    }

    function finalizeAuction(uint256 auctionId) external onlyRole(ADMIN_ROLE) {
        AuctionItem storage auction = auctions[auctionId];
        require(!auction.finalized, "Already finalized");
        auction.finalized = true;
        payable(auction.highestBidder).transfer(auction.highestBid);
        emit AuctionFinalized(auctionId, auction.highestBidder, auction.highestBid);
    }
}
