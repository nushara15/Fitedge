
import admin from 'firebase-admin';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Prevent initialization if required variables are not set
if (!projectId) {
  throw new Error('The NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set.');
}

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for server-side operations.');
}

let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;
let adminMessaging: admin.messaging.Messaging;

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${projectId}.firebaseio.com`,
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string. Original error: ${error.message}`);
  }
}

// Assign the services after ensuring the app is initialized.
adminDb = admin.firestore();
adminAuth = admin.auth();
adminMessaging = admin.messaging();

export { adminDb, adminAuth, adminMessaging };
