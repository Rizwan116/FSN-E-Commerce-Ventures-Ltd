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
    photo: "",
    password: ""
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || (!storedUser.phone && !storedUser.email)) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Try to fetch user by phone first
        if (storedUser.phone) {
          const userRef = dbRef(database, `users/${storedUser.phone}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              phone: data.phone || storedUser.phone,
              email: data.email || storedUser.email || "",
              photo: data.photo || "",
              password: data.password || ""
            });
            return;
          }
        }

        // Fallback: Try to find user by email
        const allUsersRef = dbRef(database, "users");
        const snapshot = await get(allUsersRef);
        if (snapshot.exists()) {
          const allUsers = snapshot.val();
          const foundUser = Object.values(allUsers).find(
            (user) =>
              user.email?.toLowerCase() === storedUser.email?.toLowerCase()
          );

          if (foundUser) {
            setUserData({
              firstName: foundUser.firstName || "",
              lastName: foundUser.lastName || "",
              phone: foundUser.phone || "",
              email: foundUser.email || storedUser.email || "",
              photo: foundUser.photo || "",
              password: foundUser.password || ""
            });
            return;
          }
        }

        console.warn("User not found in DB.");
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.phone && !storedUser?.email) {
      alert("User not found in localStorage");
      return;
    }
  
    const userKey = storedUser.phone || storedUser.email;
    const updates = { ...userData };
    console.log("User Key:", userKey);
  
    try {
      // Step 1: Upload photo if selected
      if (photoFile) {
        const storagePath = `profile_photos/${userKey.replace(/[@.]/g, "_")}_${Date.now()}`;
        const imageRef = storageRef(storage, storagePath);
  
        console.log("Uploading file to:", storagePath);
        const uploadResult = await uploadBytes(imageRef, photoFile);
        console.log("Upload successful:", uploadResult);
  
        // Step 2: Get download URL
        const downloadURL = await getDownloadURL(imageRef);
        console.log("Download URL:", downloadURL);
  
        updates.photo = downloadURL;
      } else {
        console.log("No photo selected for upload.");
      }
  
      // Step 3: Ensure password is preserved if blank
      if (!updates.password) {
        const snapshot = await get(dbRef(database, `users/${userKey}`));
        if (snapshot.exists()) {
          updates.password = snapshot.val().password;
        }
      }
  
      // Step 4: Save user data
      await set(dbRef(database, `users/${userKey}`), updates);
      console.log("User data updated in Firebase DB");
  
      // Step 5: Save to localStorage
      localStorage.setItem("user", JSON.stringify(updates));
      setUserData(updates);
      setPhotoFile(null);
  
      alert("✅ Profile updated!");
    } catch (error) {
      console.error("❌ Error in handleSave:", error);
      alert("Something went wrong. Check console for details.");
    }
  };
  
  
  

  const handlePasswordChange = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.phone && !storedUser?.email) return;
    if (!newPassword) return;

    const updatedUser = { ...userData, password: newPassword };
    const userKey = storedUser.phone || updatedUser.phone;

    await set(dbRef(database, `users/${userKey}`), updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setNewPassword("");
    alert("🔐 Password updated!");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
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
          
        />
        {/* readOnly */}
        <input
          name="email"
          placeholder="Email"
          value={userData.email}
          
        />
        {/* readOnly */}

        <div className="photo-section">
          <label>Profile Photo:</label>
          {userData.photo && (
            <img
              src={userData.photo}
              alt="Profile"
              className="profile-pic"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "50%"
              }}
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
