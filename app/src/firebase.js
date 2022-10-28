// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDBFmuM_c7drAofspJsPYG5KpUzCKTFIvQ',
  authDomain: 'test-performance-2.firebaseapp.com',
  projectId: 'test-performance-2',
  storageBucket: 'test-performance-2.appspot.com',
  messagingSenderId: '782278607091',
  appId: '1:782278607091:web:d963a3b97e5ad2c12cb786',
  measurementId: 'G-3H8C75T7TH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
