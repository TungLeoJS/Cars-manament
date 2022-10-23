// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlsEgWcg5teWaxh9g7jrCv9If1VYuoACo",
  authDomain: "fetch-cars-management.firebaseapp.com",
  projectId: "fetch-cars-management",
  storageBucket: "fetch-cars-management.appspot.com",
  messagingSenderId: "96597308595",
  appId: "1:96597308595:web:fba5eb75bac5e20398ecc6",
  measurementId: "G-0ZCJKHHSN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;