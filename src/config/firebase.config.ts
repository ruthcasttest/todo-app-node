import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

// Load .env for local development
dotenv.config();

if (!admin.apps.length) {
    // In Cloud Functions, use default credentials (automatically available)
    // In local development, use credentials from .env with LOCAL_FB_ prefix
    if (process.env.LOCAL_FB_PROJECT_ID && process.env.LOCAL_FB_CLIENT_EMAIL && process.env.LOCAL_FB_PRIVATE_KEY) {
        const serviceAccount = {
            projectId: process.env.LOCAL_FB_PROJECT_ID,
            clientEmail: process.env.LOCAL_FB_CLIENT_EMAIL,
            privateKey: process.env.LOCAL_FB_PRIVATE_KEY.replace(/\\n/g, "\n")
        };

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
        });
    } else {
        // Use default credentials (for Cloud Functions)
        admin.initializeApp();
    }
}

export const db = admin.firestore();
export const firebaseAdmin = admin;
