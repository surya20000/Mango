// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_apiKey || "mock_key",
  authDomain: import.meta.env.VITE_APP_authDomain || "mock_key",
  projectId: import.meta.env.VITE_APP_projectID || "mock_key",
  storageBucket: import.meta.env.VITE_APP_storageBucket || "mock_key",
  messagingSenderId: import.meta.env.VITE_APP_messagingSenderID || "mock_key",
  appId: import.meta.env.VITE_APP_appID || "mock_key",
  measurementId: import.meta.env.VITE_APP_messagingSenderID || "mock_key",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
