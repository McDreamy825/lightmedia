import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

// Admin credentials
export const ADMIN_USERNAME = "Benjilo";
export const ADMIN_PASSWORD = "0543447789";

// Create admin account if it doesn't exist
createUserWithEmailAndPassword(auth, `${ADMIN_USERNAME.toLowerCase()}@admin.com`, ADMIN_PASSWORD)
  .catch((error) => {
    // Ignore error if user already exists
    if (error.code !== 'auth/email-already-in-use') {
      console.error('Error creating admin account:', error);
    }
  });