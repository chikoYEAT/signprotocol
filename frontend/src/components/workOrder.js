import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const username = localStorage.getItem('username');

        if (!username) {
          setError('Username not found. Please login.');
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `http://localhost:5000/api/work-orders?username=${encodeURIComponent(username)}`
        );

        setWorkOrders(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch work orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, []);

  if (loading) {
    return <div>Loading work orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Work Orders</h2>
      {workOrders.length > 0 ? (
        <ul>
          {workOrders.map((order) => (
            <li key={order._id}>
              <h3>{order.workOrderTitle || 'No Title'}</h3>
              <p>{order.description}</p>
              <p>Created by: {order.createdBy}</p>
              <p>Status: {order.status}</p>
              <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No work orders found for this user.</p>
      )}
    </div>
  );
};

export default WorkOrders;
