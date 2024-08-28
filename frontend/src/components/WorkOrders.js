import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3Context';

const WorkOrders = () => {
  const { contract } = useWeb3();
  const [description, setDescription] = useState('');
  const [workOrders, setWorkOrders] = useState([]);

  const fetchWorkOrders = async () => {
    const orders = await contract.getWorkOrders();
    setWorkOrders(orders);
  };

  const createWorkOrder = async () => {
    await contract.createWorkOrder(description);
    fetchWorkOrders();
  };

  return (
    <div>
      <h1>Work Orders</h1>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={createWorkOrder}>Create Work Order</button>

      <ul>
        {workOrders.map((order, index) => (
          <li key={index}>
            {order.description} - {order.approved ? "Approved" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkOrders;
