import React, { useState } from 'react';
import { database } from './firebase';
import { ref, push, set, update, get } from 'firebase/database'; // Added 'get' here
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

  const updateProductStock = async (productId, quantity) => {
    const productRef = ref(database, `products/${productId}`);
    try {
      // Get current stock
      const snapshot = await get(productRef);
      if (snapshot.exists()) {
        const productData = snapshot.val();
        const currentStock = productData.stock || 0;
        const newStock = Math.max(currentStock - quantity, 0);
        
        // Update stock in Firebase
        await update(productRef, { stock: newStock });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating product stock:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // Create order data
      const orderData = {
        ...form,
        cart: JSON.parse(JSON.stringify(cart)),
        totalAmount: cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString(),
        status: 'processing'
      };

      // Save order to Firebase
      const orderRef = ref(database, 'orders');
      const newOrderRef = push(orderRef);
      await set(newOrderRef, orderData);
      const orderId = newOrderRef.key;

      // Update stock for each product in the cart
      const stockUpdates = [];
      for (const item of cart.items) {
        stockUpdates.push(updateProductStock(item.id, item.quantity));
      }

      // Wait for all stock updates to complete
      const stockUpdateResults = await Promise.all(stockUpdates);
      const allUpdatesSuccessful = stockUpdateResults.every(result => result);

      if (!allUpdatesSuccessful) {
        throw new Error("Some stock updates failed");
      }

      // Clear cart and redirect on success
      dispatch(clearCart());
      navigate('/order-success', { 
        state: { 
          orderId,
          customerName: `${form.firstName} ${form.lastName}`,
          totalAmount: orderData.totalAmount
        } 
      });

    } catch (error) {
      console.error('Order submission failed:', error);
      alert('❌ Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="billing-form">
      <h2>Fill your Billing Address</h2>

      <div className="form-group">
        <input name="firstName" placeholder="First Name" onChange={handleChange} value={form.firstName} />
        {errors.firstName && <p className="error-msg">{errors.firstName}</p>}
      </div>

      <div className="form-group">
        <input name="lastName" placeholder="Last Name" onChange={handleChange} value={form.lastName} />
        {errors.lastName && <p className="error-msg">{errors.lastName}</p>}
      </div>

      <div className="form-group">
        <input name="phone" placeholder="Phone Number" onChange={handleChange} value={form.phone} />
        {errors.phone && <p className="error-msg">{errors.phone}</p>}
      </div>

      <div className="form-group">
        <input name="email" placeholder="Email Address" onChange={handleChange} value={form.email} />
        {errors.email && <p className="error-msg">{errors.email}</p>}
      </div>

      <div className="form-group">
        <input name="address" placeholder="Address" onChange={handleChange} value={form.address} />
        {errors.address && <p className="error-msg">{errors.address}</p>}
      </div>

      <div className="form-group">
        <input name="pincode" placeholder="Pincode" onChange={handleChange} value={form.pincode} />
        {errors.pincode && <p className="error-msg">{errors.pincode}</p>}
      </div>

      <div className="form-group">
        <input name="nearbyLocation" placeholder="Nearby Location" onChange={handleChange} value={form.nearbyLocation} />
      </div>

      <div className="form-group">
        <h3>Mode of Payment</h3>
        <select name="paymentMode" onChange={handleChange} value={form.paymentMode}>
          <option value="UPI">UPI</option>
          <option value="COD">Cash On Delivery</option>
          <option value="Voucher">Voucher Code</option>
        </select>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        className={isSubmitting ? 'submitting' : ''}
      >
        {isSubmitting ? 'Processing...' : 'Proceed to Buy'}
      </button>
    </div>
  );
};

export default Billing;