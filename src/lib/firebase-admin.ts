
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';

// Check if the project ID is available
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId) {
    throw new Error(
        'The NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set.'
    );
}

let adminDb: admin.firestore.Firestore;
let adminAuth: admin.auth.Auth;
let adminMessaging: admin.messaging.Messaging;

// Check if the app is already initialized to prevent errors in hot-reload environments
if (!admin.apps.length) {
  try {
    // The type assertion is needed because the imported JSON is generic.
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: `https://${projectId}.firebaseio.com`,
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    // Throw a more descriptive error to help with debugging.
    throw new Error(`Failed to initialize Firebase Admin SDK. Please check your serviceAccountKey.json file. Original error: ${error.message}`);
  }
}

// Assign the services after ensuring the app is initialized.
adminDb = admin.firestore();
adminAuth = admin.auth();
adminMessaging = admin.messaging();

export { adminDb, adminAuth, adminMessaging };
