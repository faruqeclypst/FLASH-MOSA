import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  // Add your Firebase configuration here
  apiKey: "AIzaSyBOoM3_PWxJuI8DdjmVSKcc2ds1Q4xkc3w",
  authDomain: "flash-mosa.firebaseapp.com",
  databaseURL: "https://flash-mosa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "flash-mosa",
  storageBucket: "flash-mosa.appspot.com",
  messagingSenderId: "952545531680",
  appId: "1:952545531680:web:b86790929f46affdb36945"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);