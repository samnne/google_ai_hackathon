import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from "./hackathongai-firebase-adminsdk-fbsvc-c23b9c4716.json" with { type: 'json' };

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const db = getFirestore();
export const adminAuth = getAuth();