import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const nameRegex = /^[a-zA-Z]{2,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!nameRegex.test(form.firstName)) return alert('❗ Enter a valid first name');
    if (!nameRegex.test(form.lastName)) return alert('❗ Enter a valid last name');
    if (!phoneRegex.test(form.phone)) return alert('❗ Enter a valid phone number');
    if (!emailRegex.test(form.email)) return alert('❗ Enter a valid email');
    if (!passwordRegex.test(form.password)) return alert('❗ Password must be at least 6 characters, 1 uppercase letter, and 1 number');

    handleSignup();
  };

  const handleSignup = async () => {
    try {
      const newUser = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        password: form.password,
        photo: ""
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Store backend response (not the raw form)
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        alert("✅ Signup successful!");
        navigate("/login");
      } else if (response.status === 409) {
        alert("⚠️ User already exists!");
      } else {
        alert(`❌ Signup failed: ${data.message || 'Unknown error'}`);
      }

    } catch (error) {
      console.error("Signup error:", error);
      alert("❌ Signup failed: " + error.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>Signup</h2>
      <input name="firstName" placeholder="First Name" onChange={handleChange} value={form.firstName} />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} value={form.lastName} />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} value={form.phone} />
      <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
      <input type="password" name="password" placeholder="New Password" onChange={handleChange} value={form.password} />
      <button onClick={validate}>Signup</button>

      <h3 style={{ marginTop: '20px' }}>Already have an account?</h3>
      <button onClick={() => navigate('/login')}>Login</button>
    </div>
  );
};

export default Signup;
