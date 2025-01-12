import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const uploadFile = async (file: File, path: string) => {
  const storage = getStorage();
  const fileRef = storageRef(storage, path);
  
  // Tambahkan metadata untuk mempertahankan format PNG
  const metadata = {
    contentType: file.type,
    // Pastikan tidak ada kompresi untuk PNG
    cacheControl: 'no-transform'
  };

  await uploadBytes(fileRef, file, metadata);
  return await getDownloadURL(fileRef);
};

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);