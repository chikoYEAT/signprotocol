import { useState, useEffect, createContext, useContext } from "react";
import { ethers } from "ethers";
import WorkOrderManagement from '../../../../../artifacts/contracts/WorkOrderManagement.sol/WorkOrderManagement.json';


const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const connectToBlockchain = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = "YOUR_CONTRACT_ADDRESS";
      const contract = new ethers.Contract(contractAddress, WorkOrderManagement.abi, signer);

      setProvider(provider);
      setContract(contract);
    };
    connectToBlockchain();
  }, []);

  return (
    <Web3Context.Provider value={{ provider, contract }}>
      {children}
    </Web3Context.Provider>
  );
};
