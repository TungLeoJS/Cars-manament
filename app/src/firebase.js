// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAgRafx2BZuIcZMZ-rg6G5aBUzh-oOaYCc',
  authDomain: 'cars-management-2.firebaseapp.com',
  projectId: 'cars-management-2',
  storageBucket: 'cars-management-2.appspot.com',
  messagingSenderId: '542931262886',
  appId: '1:542931262886:web:b0f6daab237f7c46364367',
  measurementId: 'G-C3MGJ1P5B7',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
