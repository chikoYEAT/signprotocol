import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? ''  // Leave it empty in production for relative paths
  : 'http://localhost:5001';  // Use localhost in development
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
          `${API_BASE_URL}/api/work-orders?username=${encodeURIComponent(username)}`
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
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p className="text-lg">Loading work orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-red-500">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12" style={{ paddingTop: '80px' }}>
      <h2 className="text-3xl font-bold mb-8 text-center text-purple-500">Work Orders</h2>
      {workOrders.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {workOrders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold text-purple-400 mb-3">
                {order.workOrderTitle || 'No Title'}
              </h3>
              <p className="text-gray-300 mb-3">{order.description}</p>
              <p className="text-sm text-gray-400">Created by: {order.createdBy}</p>
              <p className="text-sm text-gray-400">Status: {order.status}</p>
              <p className="text-sm text-gray-400 break-words">
                Signed Value: {order.signed}
              </p>
              <p className="text-sm text-gray-400">
                Created At: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No work orders found for this user.</p>
      )}
      <footer className="border-t border-gray-800 pt-4 mt-8">
        <p className="text-gray-500 text-sm">
          {new Date().getFullYear()} blockmosaic . A Sign Protocol.
        </p>
      </footer>
    </div>
  );
};

export default WorkOrders;
