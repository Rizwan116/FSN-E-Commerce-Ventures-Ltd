// import React, { useState } from 'react';
// import { database, ref, set } from './firebase';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from './firebase'; // Make sure firebase.js exports auth

// const Signup = () => {
//   const [form, setForm] = useState({
//     firstName: '',
//     lastName: '',
//     phone: '',
//     email: '',
//     password: '',
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const validate = () => {
//     const nameRegex = /^[a-zA-Z]{2,}$/;
//     const phoneRegex = /^[6-9]\d{9}$/;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

//     if (!nameRegex.test(form.firstName)) return alert('Enter valid first name');
//     if (!nameRegex.test(form.lastName)) return alert('Enter valid last name');
//     if (!phoneRegex.test(form.phone)) return alert('Enter valid phone number');
//     if (!emailRegex.test(form.email)) return alert('Enter valid email');
//     if (!passwordRegex.test(form.password)) return alert('Password must be 6+ chars, 1 uppercase, 1 number');

//     // ✅ Create Firebase Auth User
//     createUserWithEmailAndPassword(auth, form.email, form.password)
//       .then((userCredential) => {
//         const user = userCredential.user;

//         // ✅ Save extra user info to Realtime DB using UID
//         set(ref(database, 'users/' + user.uid), {
//           firstName: form.firstName,
//           lastName: form.lastName,
//           phone: form.phone,
//           email: form.email,
//           photo: '', // for profile photo later
//         }).then(() => {
//           alert('Signup successful! ✅');
//           setForm({ firstName: '', lastName: '', phone: '', email: '', password: '' });
//         });
//       })
//       .catch((error) => {
//         alert('Signup error: ' + error.message);
//       });
//   };

//   return (
//     <div className="auth-form">
//       <h2>Signup</h2>
//       <input name="firstName" placeholder="First Name" onChange={handleChange} value={form.firstName} />
//       <input name="lastName" placeholder="Last Name" onChange={handleChange} value={form.lastName} />
//       <input name="phone" placeholder="Phone Number" onChange={handleChange} value={form.phone} />
//       <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
//       <input type="password" name="password" placeholder="New Password" onChange={handleChange} value={form.password} />
//       <button onClick={validate}>Signup</button>
//     </div>
//   );
// };

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref as dbRef, set, get } from 'firebase/database';
// import express from 'express';
// import cors from 'cors';

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(cors());

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
      // const userRef = dbRef(database, "users/" + form.phone);
      // const snapshot = await get(userRef);

      // if (snapshot.exists()) {
      //   alert("⚠️ User already exists!");
      //   return;
      // }

      // // Create user in Firebase Auth (optional)
      // await createUserWithEmailAndPassword(auth, form.email, form.password);

      const newUser = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        password: form.password, // ⚠️ Note: storing plain text passwords is not recommended
        photo: ""
      };

      // post to your backend API to save the user at localhost:5000/api/auth/register
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // if (response.status === 409) {
      //   alert("⚠️ User already exists!");
      //   return;
      // }
      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(newUser));
        alert("✅ Signup successful!");
        navigate("/login");
      }

    } catch (error) {
      console.error("Signup error:", error);
      alert("❌ Signup failed: " + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      // const userRef = dbRef(database, "users/" + form.phone);
      // const snapshot = await get(userRef);

      // if (snapshot.exists()) {
      //   const user = snapshot.val();
        // if (user.password === form.password) {
        //   localStorage.setItem("user", JSON.stringify(user));
        //   navigate("/account");
        // } else {
        //   alert("❌ Incorrect password");
        // }
      // } else {
      //   alert("❌ User not found");
      // }
    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Login failed: " + error.message);
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Signup;

