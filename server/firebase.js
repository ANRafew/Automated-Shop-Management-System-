import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQWwZpcplb0StJTIsm2_6vYnpJDyCraaM",
  authDomain: "autoshop-management---rafew.firebaseapp.com",
  projectId: "autoshop-management---rafew",
  storageBucket: "autoshop-management---rafew.firebasestorage.app",
  messagingSenderId: "872742148700",
  appId: "1:872742148700:web:544df87fad24e64cc2e499"
  // measurementId: "G-BFC9147YP7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);