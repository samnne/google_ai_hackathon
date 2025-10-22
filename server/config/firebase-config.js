import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv"
if (process.env.NODE_ENV !== "production") {
  dotenv.config()
}

if (getApps().length === 0) {
  if (process.env.NODE_ENV !== "production") {
    const serviceAccount = await import(
      "./hackathongai-firebase-adminsdk-fbsvc-c23b9c4716.json",
      {
        with: { type: "json" },
      }
    );

    initializeApp({
      credential: cert({
        projectId: `${process.env.FIREBASE_PROJECT_ID}`,
        clientEmail: `${process.env.FIREBASE_CLIENT_EMAIL}`,
        privateKey: `${process.env.FIREBASE_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        )}`,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } else {
       initializeApp({
      credential: cert({
        projectId: `${process.env.FIREBASE_PROJECT_ID}`,
        clientEmail: `${process.env.FIREBASE_CLIENT_EMAIL}`,
        privateKey: `${process.env.FIREBASE_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        )}`,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }
}

export const db = getFirestore();
export const adminAuth = getAuth();
