import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9rHdpnktRS1zMU_iJDrCujmndEVOUV1E",
  authDomain: "life-reset-44c77.firebaseapp.com",
  projectId: "life-reset-44c77",
  storageBucket: "life-reset-44c77.firebasestorage.app",
  messagingSenderId: "1063491003275",
  appId: "1:1063491003275:web:ea06049220b3cce51f058e"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
