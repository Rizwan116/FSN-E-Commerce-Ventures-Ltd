import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import './OrderPages.css';

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId, customerName, totalAmount } = state || {};

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(totalAmount || 0);

  return (
    <div className="order-page-container">
      <div className="order-success-card">
        <div className="success-icon">✓</div>
        <h1>Order Placed Successfully!</h1>
        <h5 className="order-number">Order ID: {orderId || 'N/A'}</h5>
        
        <div className="order-summary">
          <div className="summary-item">
            <h4>Customer Name:</h4>
            <span>{customerName || 'N/A'}</span>
          </div>
          <div className="summary-item">
            <h4>Total Amount:</h4>
            <span>{formattedTotal}</span>
          </div>
        </div>

        <h5 className="confirmation-message">
          Thank you for your purchase! We've sent a confirmation email with your order details.
        </h5>

        <div className="cta-container">
          <button 
            className="primary-button"
            onClick={() => navigate(`/order-details/${orderId}`)}
          >
            View Order Details
          </button>
          <button 
            className="secondary-button"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;