// Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Save user and token securely
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        // Use AuthContext to set logged-in user globally
        login(data.user);

        alert('✅ Login successful!');
        navigate('/');
      } else if (response.status === 401) {
        alert('❌ Incorrect email or password');
      } else {
        alert(`⚠️ Login failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('❌ Login failed: ' + error.message);
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
      <h6
        className="for-pass"
        onClick={() => navigate('/forget-password')}
        style={{ cursor: 'pointer' }}
      >
        Forgot Password?
      </h6>
    </div>
  );
};

export default Login;
