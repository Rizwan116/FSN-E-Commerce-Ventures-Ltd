// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref, set, get, child, push, remove } from "firebase/database";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCE44q7DGqWtag2N1QLwsrqj26dEMXJ8zE",
  authDomain: "myecomapp-1.firebaseapp.com",
  databaseURL: "https://myecomapp-1-default-rtdb.firebaseio.com",
  projectId: "myecomapp-1",
  storageBucket: "myecomapp-1.appspot.com",
  messagingSenderId: "377732758419",
  appId: "1:377732758419:web:8e41509e8a94bd78814666"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);
const db = getFirestore(app);

export {
  auth,
  storage,
  database,
  db,
  ref,
  set,
  get,
  child,
  push,
  remove,
  storageRef,
  uploadBytes,
  getDownloadURL
};
