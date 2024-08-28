import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3Context';
import { ethers } from 'ethers';

const Auction = () => {
  const { contract } = useWeb3();
  const [itemDetails, setItemDetails] = useState('');
  const [auctions, setAuctions] = useState([]);
  const [currentAuctionId, setCurrentAuctionId] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const nextAuctionId = await contract.nextAuctionId();
        const auctionList = [];
        for (let i = 0; i < nextAuctionId; i++) {
          const auction = await contract.auctions(i);
          auctionList.push(auction);
        }
        setAuctions(auctionList);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, [contract]);

  const createAuction = async () => {
    try {
      await contract.createAuction(itemDetails);
      setItemDetails('');
      alert('Auction created successfully');
      fetchAuctions();
    } catch (error) {
      console.error("Error creating auction:", error);
    }
  };

  const placeBid = async () => {
    try {
      const bidValue = ethers.utils.parseEther(bidAmount);
      await contract.placeBid(currentAuctionId, { value: bidValue });
      setBidAmount('');
      alert('Bid placed successfully');
      fetchAuctions();
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  const finalizeAuction = async (auctionId) => {
    try {
      await contract.finalizeAuction(auctionId);
      alert('Auction finalized successfully');
      fetchAuctions();
    } catch (error) {
      console.error("Error finalizing auction:", error);
    }
  };

  return (
    <div>
      <h1>Auction Management</h1>
      
      <div>
        <h2>Create Auction</h2>
        <input
          type="text"
          value={itemDetails}
          onChange={(e) => setItemDetails(e.target.value)}
          placeholder="Item details"
        />
        <button onClick={createAuction}>Create Auction</button>
      </div>

      <div>
        <h2>Place Bid</h2>
        <select onChange={(e) => setCurrentAuctionId(e.target.value)}>
          <option value="">Select Auction</option>
          {auctions.map((auction) => (
            <option key={auction.id} value={auction.id}>
              {auction.itemDetails}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Bid amount (ETH)"
        />
        <button onClick={placeBid}>Place Bid</button>
      </div>

      <div>
        <h2>Finalize Auction</h2>
        {auctions.map((auction) => (
          <div key={auction.id}>
            <span>{auction.itemDetails} - {auction.finalized ? "Finalized" : "Active"}</span>
            {!auction.finalized && (
              <button onClick={() => finalizeAuction(auction.id)}>Finalize</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Auction;
