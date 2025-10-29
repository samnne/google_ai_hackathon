import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

if (getApps().length === 0) {
  if (process.env.NODE_ENV !== "production") {
    const serviceAccount = await import("./hackathon.json", {
      with: { type: "json" },
    });

    initializeApp({
      credential: cert(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } else {
    initializeApp({
      credential: cert(JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }
}

export const db = getFirestore();
export const adminAuth = getAuth();
