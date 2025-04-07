// Login.js
import React, { useState, useContext } from 'react'; // ✅ useContext added here
import { useNavigate } from 'react-router-dom';
import { database, ref, get, child } from './firebase';
import { AuthContext } from "./context/AuthContext";

const Login = () => {
  const { isLoggedIn, login } = useContext(AuthContext); // ✅ now works correctly

  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    const userData = { name: "John Doe", email: "john@example.com" };
    login(userData);
  };

  const validate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{6,}$/;

    if (!emailRegex.test(form.email)) return alert('❗ Enter a valid email');
    if (!passwordRegex.test(form.password)) return alert('❗ Password must be at least 6 characters');

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'users'));

      if (snapshot.exists()) {
        const users = snapshot.val();
        const matchedUser = Object.values(users).find(
          (user) => user.email === form.email && user.password === form.password
        );

        if (matchedUser) {
          alert('✅ Login successful!');
          login(matchedUser); // ✅ call the context login function
          localStorage.setItem('user', JSON.stringify(matchedUser));
          navigate('/account');
        } else {
          alert('❌ Incorrect email or password');
        }
      } else {
        alert('❌ No users found in database');
      }
    } catch (error) {
      console.error(error);
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
