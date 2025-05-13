// Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


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
        alert('✅ Google Login successful!');
        navigate('/');
      } else {
        alert(`❌ Google Login failed: ${data.message}`);
      }
    } catch (err) {
      console.error('Google login error:', err);
      alert('❌ Google login failed');
    }
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
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
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

      <div style={{ marginTop: '1rem' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert('Google Login Failed')}
        />
      </div>
    </div>
  );
};

export default Login;
