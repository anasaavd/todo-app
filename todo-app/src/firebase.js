import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQBnBjB_RCUUHYja3SyEbZ3_RQ3bUs39U",
  authDomain: "todo-app-22d9f.firebaseapp.com",
  projectId: "todo-app-22d9f",
  storageBucket: "todo-app-22d9f.firebasestorage.app",
  messagingSenderId: "198414654636",
  appId: "1:198414654636:web:68adfaa78f90506aa65309"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
