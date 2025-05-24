// Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const response = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: decoded.email,
          firstName: decoded.given_name,
          lastName: decoded.family_name,
          profileImage: decoded.picture,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        login(data.user);
        toast.success('Google Login successful!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(`❌ Google Login failed: ${data.message}`);
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      console.error('Google login error:', err);
      toast.error('❌ Google login failed');
      setTimeout(() => navigate('/'), 2000);
    }
  };

  const validate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/;

    if (!emailRegex.test(form.email)) {
      toast.warning('❗ Enter a valid email');
      return;
    }

    if (!passwordRegex.test(form.password)) {
      toast.warning('❗ Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        login(data.user);
        toast.success('✅ Login successful!');
        setTimeout(() => navigate('/'), 2000);
      } else if (response.status === 401) {
        toast.error('❌ Incorrect email or password');
      } else {
        toast.error(`⚠️ Login failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('❌ Login failed: ' + error.message);
    }
  };

  return (
    <div className="auth-form">
      <ToastContainer />
      <h2>Login</h2>
      {/* <input
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
      </h6> */}

      <div style={{ marginTop: '1rem', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error('Google Login Failed')}
        />
      </div>
    </div>
  );
};

export default Login;
