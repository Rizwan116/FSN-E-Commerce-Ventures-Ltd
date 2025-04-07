// Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { database, ref, get, child } from './firebase';
import { AuthContext } from './context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/;

    if (!emailRegex.test(form.email)) {
      alert('❗ Enter a valid email');
      return;
    }

    if (!passwordRegex.test(form.password)) {
      alert('❗ Password must be at least 6 characters');
      return;
    }

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'users'));

      if (snapshot.exists()) {
        const users = snapshot.val();

        // Find matching user with email and password
        const userKey = Object.keys(users).find((key) => {
          const user = users[key];
          return user.email === form.email && user.password === form.password;
        });

        if (userKey) {
          const matchedUser = users[userKey];

          // Save full user object including phone to localStorage
          localStorage.setItem('user', JSON.stringify(matchedUser));

          // Optionally call context login method if you're using AuthContext
          login(matchedUser);

          alert('✅ Login successful!');
          navigate('/');
        } else {
          alert('❌ Incorrect email or password');
        }
      } else {
        alert('❌ No users found in database');
      }
    } catch (error) {
      console.error("Login error:", error);
      alert('⚠️ Login failed. Please try again later.');
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        value={form.email}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        value={form.password}
      />
      <button onClick={validate}>Login</button>
      <p
        onClick={() => navigate('/forget-password')}
        style={{ color: 'blue', cursor: 'pointer' }}
      >
        Forgot Password?
      </p>
    </div>
  );
};

export default Login;
