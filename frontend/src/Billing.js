import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from './redux/cartSlice';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement

const Billing = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    nearbyLocation: '',
    paymentMode: 'UPI'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const addressRegex = /.{10,}/;
    const pincodeRegex = /^\d{5,6}$/;

    if (!nameRegex.test(form.firstName)) {
      newErrors.firstName = "Enter a valid first name (min 2 letters)";
    }
    if (!nameRegex.test(form.lastName)) {
      newErrors.lastName = "Enter a valid last name (min 2 letters)";
    }
    if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!addressRegex.test(form.address)) {
      newErrors.address = "Address must be at least 10 characters";
    }
    if (!pincodeRegex.test(form.pincode)) {
      newErrors.pincode = "Enter a valid 5 or 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting || cart.items.length === 0) return;

    setIsSubmitting(true);

    try {
      // Verify backend connectivity first
      try {
        await fetch('http://localhost:5000/api/health');
      } catch (err) {
        throw new Error('Server is unavailable. Please try again later.');
      }

      // Get user ID from JWT token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      let userId;
      try {
        const decoded = jwtDecode(token);
        userId = decoded.userId || decoded.sub; // Try common JWT ID fields
        if (!userId) {
          throw new Error('User ID not found in token');
        }
      } catch (decodeError) {
        console.error('Token decode error:', decodeError);
        throw new Error('Invalid session. Please login again.');
      }

      const fullAddress = `${form.address}, ${form.nearbyLocation}, ${form.pincode}`;
      
      const orderPromises = cart.items.map(item => {
        const orderData = {
          user_id: userId,
          product_id: item.id,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
          address: fullAddress,
          customer_email: form.email,
          customer_phone: form.phone,
          payment_mode: form.paymentMode
        };

        return fetch('http://localhost:5000/api/orders/createOrder', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        }).then(async response => {
          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            const errorMsg = data.message || 
              (response.status === 401 ? 'Session expired' : 
               response.status === 400 ? 'Invalid request data' :
               'Order creation failed');
            throw new Error(`Item ${item.name || item.id}: ${errorMsg}`);
          }
          return data;
        });
      });

      const results = await Promise.all(orderPromises);
      const orderIds = results.map(result => result.id);

      dispatch(clearCart());
      navigate('/order-success', {
        state: {
          orderIds,
          customerName: `${form.firstName} ${form.lastName}`,
          totalAmount: cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        },
      });
    } catch (error) {
      console.error('Order submission failed:', error);
      alert(`❌ ${error.message}`);
      if (error.message.includes('Session') || error.message.includes('Authentication')) {
        // Redirect to login if auth issues
        navigate('/login', { state: { from: '/billing' } });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="billing-form">
      <h2>Fill your Billing Address</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            value={form.firstName}
          />
          {errors.firstName && <p className="error-msg">{errors.firstName}</p>}
        </div>

        <div className="form-group">
          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            value={form.lastName}
          />
          {errors.lastName && <p className="error-msg">{errors.lastName}</p>}
        </div>

        <div className="form-group">
          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            value={form.phone}
          />
          {errors.phone && <p className="error-msg">{errors.phone}</p>}
        </div>

        <div className="form-group">
          <input
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            value={form.email}
          />
          {errors.email && <p className="error-msg">{errors.email}</p>}
        </div>

        <div className="form-group">
          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            value={form.address}
          />
          {errors.address && <p className="error-msg">{errors.address}</p>}
        </div>

        <div className="form-group">
          <input
            name="pincode"
            placeholder="Pincode"
            onChange={handleChange}
            value={form.pincode}
          />
          {errors.pincode && <p className="error-msg">{errors.pincode}</p>}
        </div>

        <div className="form-group">
          <input
            name="nearbyLocation"
            placeholder="Nearby Location"
            onChange={handleChange}
            value={form.nearbyLocation}
          />
        </div>

        <div className="form-group">
          <h3>Mode of Payment</h3>
          <select
            name="paymentMode"
            onChange={handleChange}
            value={form.paymentMode}
          >
            <option value="UPI">UPI</option>
            <option value="COD">Cash On Delivery</option>
            <option value="Voucher">Voucher Code</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={isSubmitting ? 'submitting' : ''}
        >
          {isSubmitting ? 'Processing...' : 'Proceed to Buy'}
        </button>
      </form>
    </div>
  );
};

export default Billing;