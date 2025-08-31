
import admin from 'firebase-admin';

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

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for server-side operations.');
  }
  
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${projectId}.firebaseio.com`,
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    // Throw a more descriptive error to help with debugging.
    throw new Error(`Failed to initialize Firebase Admin SDK. Please check your FIREBASE_SERVICE_ACCOUNT_KEY. Original error: ${error.message}`);
  }
}

// Assign the services after ensuring the app is initialized.
adminDb = admin.firestore();
adminAuth = admin.auth();
adminMessaging = admin.messaging();

export { adminDb, adminAuth, adminMessaging };
