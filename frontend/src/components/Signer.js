import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import contractABI1 from './utils/abi_contract_1';
import contractAddress from './utils/contract1';

function Signer({onHashChange}) {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");

  useEffect(() => {
    async function connectToWallet() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          console.log('Web3 successfully connected to wallet.');
        } catch (error) {
          console.error('Failed to connect to wallet:', error);
        }
      } else {
        console.error('Please install MetaMask or use a web3-enabled browser.');
      }
    }
    connectToWallet();
  }, []);

  function handleFileUpload(event) {
    setFile(event.target.files[0]);
  }

    const updateHash = (newHash) => {
    setHash(newHash);
    if (onHashChange) {
      onHashChange(newHash); // Notify parent component
    }
  };

    const handleFileHashing = () => {
    const calculatedHash = "someGeneratedHash"; // Replace with actual logic to generate hash
    updateHash(calculatedHash);
  };

  async function handleHashConversion() {
    if (!file) {
      console.log("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const fileData = new Uint8Array(reader.result);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', fileData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      const hashBytes32 = "0x" + hashHex;
      setHash(hashBytes32);
      console.log("File Hash:", hashBytes32);
    }
    reader.readAsArrayBuffer(file);
  }

  async function handleContractInteraction(contractABI, contractAddr, method, params = []) {
    if (!web3 || !account) {
      console.error('Web3 or account not initialized');
      return;
    }

    const contract = new web3.eth.Contract(contractABI, contractAddr);
    try {
      const result = await contract.methods[method](...params).send({ from: account });
      console.log(`${method} result:`, result);
      return result;
    } catch (error) {
      console.error(`Error in ${method}:`, error);
    }
  }

  async function handleAddDocument() {
    if (!hash) {
      console.error('No hash available');
      return;
    }
    await handleContractInteraction(contractABI1, contractAddress, 'addDocument', [hash]);
  }
  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleHashConversion}>Convert to Hash</button>
      {hash && <p>Hash: {hash}</p>}
      <button onClick={handleAddDocument}>Sign Document</button>
    </div>
  );
}


export default Signer;