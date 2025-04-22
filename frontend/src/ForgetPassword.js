import React, { useState } from 'react';
import { database, ref, get, child, set } from './firebase'; // ✅ Firebase functions

const ForgetPassword = () => {
  const [form, setForm] = useState({ email: '', newPassword: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateAndUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!emailRegex.test(form.email)) return alert('Enter a valid email');
    if (!passwordRegex.test(form.newPassword))
      return alert('Password must be 6+ characters, include 1 uppercase letter and 1 number');

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'users'));

      if (snapshot.exists()) {
        const users = snapshot.val();
        const userKey = Object.keys(users).find(
          (key) => users[key].email === form.email
        );

        if (userKey) {
          const updatedUser = {
            ...users[userKey],
            password: form.newPassword,
          };

          await set(ref(database, `users/${userKey}`), updatedUser);
          alert('✅ Password reset successfully!');
        } else {
          alert('❌ User not found!');
        }
      } else {
        alert('❌ No users found in the database!');
      }
    } catch (error) {
      console.error(error);
      alert('⚠️ Error resetting password. Try again later.');
    }
  };

  return (
    <div className="auth-form">
      <h2>Reset Password</h2>
      <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
      <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} value={form.newPassword} />
      <button onClick={validateAndUpdate}>Reset</button>
    </div>
  );
};

export default ForgetPassword;
