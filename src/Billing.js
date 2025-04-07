import React, { useState } from 'react';
import { database } from './firebase';
import { ref as dbRef, push, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from './redux/cartSlice';

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
      newErrors.firstName = "Enter a valid first name (only letters, min 2 characters)";
    }
    if (!nameRegex.test(form.lastName)) {
      newErrors.lastName = "Enter a valid last name (only letters, min 2 characters)";
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

  // ✅ Improved submit logic with Firebase + navigation fix
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const cartCopy = JSON.parse(JSON.stringify(cart)); // deep clone

      const orderData = {
        ...form,
        cart: cartCopy,
        timestamp: new Date().toISOString()
      };

      const orderRef = dbRef(database, 'orders');
      const newOrderRef = push(orderRef);
      await set(newOrderRef, orderData);

      dispatch(clearCart());

      alert('✅ Order placed successfully!');
      // ✅ Corrected route — use route path not file path
      navigate('/order-details', { state: { orderId: newOrderRef.key } });
    } catch (error) {
      console.error('❌ Failed to place order:', error);
      alert('❌ Something went wrong while placing the order!');
    }
  };

  return (
    <div className="billing-form">
      <h2>Fill your Billing Address</h2>

      <input name="firstName" placeholder="First Name" onChange={handleChange} value={form.firstName} />
      {errors.firstName && <p className="error-msg">{errors.firstName}</p>}

      <input name="lastName" placeholder="Last Name" onChange={handleChange} value={form.lastName} />
      {errors.lastName && <p className="error-msg">{errors.lastName}</p>}

      <input name="phone" placeholder="Phone Number" onChange={handleChange} value={form.phone} />
      {errors.phone && <p className="error-msg">{errors.phone}</p>}

      <input name="email" placeholder="Email Address" onChange={handleChange} value={form.email} />
      {errors.email && <p className="error-msg">{errors.email}</p>}

      <input name="address" placeholder="Address" onChange={handleChange} value={form.address} />
      {errors.address && <p className="error-msg">{errors.address}</p>}

      <input name="pincode" placeholder="Pincode" onChange={handleChange} value={form.pincode} />
      {errors.pincode && <p className="error-msg">{errors.pincode}</p>}

      <input name="nearbyLocation" placeholder="Nearby Location" onChange={handleChange} value={form.nearbyLocation} />

      <h3>Mode of Payment</h3>
      <select name="paymentMode" onChange={handleChange} value={form.paymentMode}>
        <option value="UPI">UPI</option>
        <option value="COD">Cash On Delivery</option>
        <option value="Voucher">Voucher Code</option>
      </select>

      <button onClick={handleSubmit}>Proceed to Buy</button>
    </div>
  );
};

export default Billing;
