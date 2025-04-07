// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// // ✅ Correct Firebase import path
// import { auth, database, storage } from "../firebase";
// import { ref as dbRef, get, set } from "firebase/database";
// import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
// import { updatePassword, signOut } from "firebase/auth";

// function Account() {
//   const user = auth.currentUser;
//   const navigate = useNavigate();

//   const [userData, setUserData] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//     photo: "",
//   });
//   const [newPassword, setNewPassword] = useState("");
//   const [photoFile, setPhotoFile] = useState(null);

//   const handleLogout = () => {
//     signOut(auth)
//       .then(() => {
//         console.log("User signed out.");
//         navigate("/login");
//       })
//       .catch((error) => {
//         console.error("Logout error:", error);
//       });
//   };

//   useEffect(() => {
//     if (user) {
//       const userRef = dbRef(database, `users/${user.uid}`);
//       get(userRef).then((snapshot) => {
//         if (snapshot.exists()) {
//           setUserData((prev) => ({ ...prev, ...snapshot.val() }));
//         }
//       });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setUserData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSave = async () => {
//     if (!user) return;

//     const updates = { ...userData };

//     if (photoFile) {
//       const photoRef = storageRef(storage, `profile_photos/${user.uid}`);
//       await uploadBytes(photoRef, photoFile);
//       const downloadURL = await getDownloadURL(photoRef);
//       updates.photo = downloadURL;
//     }

//     await set(dbRef(database, `users/${user.uid}`), updates);
//     alert("Profile updated!");
//   };

//   const handlePasswordChange = () => {
//     if (newPassword && user) {
//       updatePassword(user, newPassword)
//         .then(() => {
//           alert("Password updated successfully!");
//           setNewPassword("");
//         })
//         .catch((error) => {
//           alert("Error updating password: " + error.message);
//         });
//     }
//   };

//   return (
//     <div className="account-page">
//       <h2>My Account</h2>
//       <div className="form">
//         <input
//           name="firstName"
//           placeholder="First Name"
//           value={userData.firstName}
//           onChange={handleChange}
//         />
//         <input
//           name="lastName"
//           placeholder="Last Name"
//           value={userData.lastName}
//           onChange={handleChange}
//         />
//         <input
//           name="phone"
//           placeholder="Phone Number"
//           value={userData.phone}
//           onChange={handleChange}
//         />
//         <input
//           name="email"
//           placeholder="Email ID"
//           value={userData.email}
//           readOnly
//         />

//         <div className="photo-section">
//           <label>Profile Photo:</label>
//           {userData.photo && (
//             <img src={userData.photo} alt="Profile" className="profile-pic" />
//           )}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setPhotoFile(e.target.files[0])}
//           />
//         </div>

//         <button onClick={handleSave}>Save Profile</button>

//         <div className="password-change">
//           <input
//             type="password"
//             placeholder="New Password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//           />
//           <button onClick={handlePasswordChange}>Change Password</button>
//         </div>

//         <button onClick={handleLogout} className="logout-btn">
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Account;

// Account.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database, storage } from "../firebase";
import {
  ref as dbRef,
  get,
  set
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";

function Account() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    photo: ""
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.phone) {
      navigate("/login");
      return;
    }

    // ✅ Use phone as the DB key
    const userRef = dbRef(database, "users/" + storedUser.phone);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
    });
  }, [navigate]);

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.phone) return;

    const updates = { ...userData };

    if (photoFile) {
      const photoRef = storageRef(storage, `profile_photos/${storedUser.phone}`);
      await uploadBytes(photoRef, photoFile);
      const downloadURL = await getDownloadURL(photoRef);
      updates.photo = downloadURL;
    }

    // ✅ Save updated data
    await set(dbRef(database, `users/${storedUser.phone}`), updates);
    localStorage.setItem("user", JSON.stringify(updates)); // Update localStorage
    alert("✅ Profile updated!");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handlePasswordChange = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.phone || !newPassword) return;

    const updatedUser = { ...userData, password: newPassword };
    await set(dbRef(database, `users/${storedUser.phone}`), updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setNewPassword("");
    alert("🔐 Password updated!");
  };

  return (
    <div className="account-page">
      <h2>My Account</h2>
      <div className="form">
        <input
          name="firstName"
          placeholder="First Name"
          value={userData.firstName}
          onChange={handleChange}
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={userData.lastName}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={userData.phone}
          readOnly
        />
        <input
          name="email"
          placeholder="Email"
          value={userData.email}
          readOnly
        />

        <div className="photo-section">
          <label>Profile Photo:</label>
          {userData.photo && (
            <img
              src={userData.photo}
              alt="Profile"
              className="profile-pic"
              style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />
        </div>

        <button onClick={handleSave}>💾 Save Profile</button>

        <div className="password-change">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handlePasswordChange}>Change Password</button>
        </div>

        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Account;

