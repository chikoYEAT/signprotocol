import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './workOrderAdmin.css'; // Import the CSS file

const WorkOrderAdmin = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState('');
  const [username, setUsername] = useState('');

  const fetchWorkOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await axios.get(`https://signprotocol.onrender.com/api/work-orders?username=${encodeURIComponent(username)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkOrders(response.data);
    } catch (error) {
      console.error('Error fetching work orders:', error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchWorkOrders();
    }
  }, [username]);

  const handleStatusUpdate = async () => {
    if (!selectedWorkOrderId) {
      alert('Please select a work order');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      await axios.patch(
        `http://localhost:5000/api/work-orders/${selectedWorkOrderId}/status`, 
        { status: 'approved' }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Work order status updated successfully');
      await fetchWorkOrders();
    } catch (error) {
      console.error('Error updating work order status:', error);
    }
  };

  return (
    <div className="workorder-admin" >
      <h2 style={{fontSize:'30px', fontFamily:'poppins'}}>Work Order Administration</h2>
      <form onSubmit={(e) => e.preventDefault()} className="admin-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="workOrder">Select Work Order:</label>
          <select
            id="workOrder"
            value={selectedWorkOrderId}
            onChange={(e) => setSelectedWorkOrderId(e.target.value)}
            required
          >
            <option value="">Select a Work Order</option>
            {workOrders.map(order => (
              <option key={order._id} value={order._id}>
                {order.description} (Current status: {order.status})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <button type="button" className="approve-btn" onClick={handleStatusUpdate}>
            Approve Work Order
          </button>
        </div>
      </form>
      <footer className="border-t border-gray-800 pt-4 mt-8">
                <p className="text-gray-500 text-sm">
                     {new Date().getFullYear()} blockmosaic . A Sign Protocol.
                </p>
            </footer>
    </div>
  );
};

export default WorkOrderAdmin;

