import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDyJzpQxpLq7kgDJiiS82yjlN5GGIQT1Sw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "tripshot-world.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "tripshot-world",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "tripshot-world.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "109421618594",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:109421618594:web:5e3a0a5bacb7af2925befb",
};

// Initialize Firebase Client App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Connect to Emulators if configured or in development with emulator flag
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  // Prevent duplicate emulator connections
  if (!(globalThis as any)._firebaseEmulatorsConnected) {
    (globalThis as any)._firebaseEmulatorsConnected = true;
    try {
      connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
      connectFirestoreEmulator(db, "localhost", 8080);
      console.log("[Firebase Emulator] Connected to Auth (9099) & Firestore (8080)");
    } catch (e) {
      console.warn("[Firebase Emulator] Connection warning:", e);
    }
  }
}

export default app;
