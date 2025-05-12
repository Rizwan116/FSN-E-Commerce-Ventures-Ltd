import React, { useState } from 'react';

const ForgetPassword = () => {
  const [form, setForm] = useState({ email: '', newPassword: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateAndUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!emailRegex.test(form.email)) {
      alert('❗ Enter a valid email');
      return;
    }

    if (!passwordRegex.test(form.newPassword)) {
      alert('❗ Password must be at least 6 characters, contain 1 uppercase letter, and 1 number');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          newPassword: form.newPassword,
        }),
      });

      const result = await response.json();

      if (response.status === 200) {
        alert('✅ Password reset successfully!');
      } else {
        alert(`❌ ${result.message || 'Password reset failed'}`);
      }
    } catch (error) {
      console.error(error);
      alert('⚠️ Error resetting password. Try again later.');
    }
  };

  return (
    <div className="auth-form">
      <h2>Reset Password</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        value={form.email}
      />
      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        onChange={handleChange}
        value={form.newPassword}
      />
      <button onClick={validateAndUpdate}>Reset</button>
    </div>
  );
};

export default ForgetPassword;
