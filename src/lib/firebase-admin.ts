
import admin from 'firebase-admin';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Prevent initialization if required variables are not set
if (!projectId) {
  throw new Error('The NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set.');
}

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let adminDb: admin.firestore.Firestore | undefined;
let adminAuth: admin.auth.Auth | undefined;
let adminMessaging: admin.messaging.Messaging | undefined;

// Initialize Firebase Admin SDK only once, and only if the service account key is present.
if (serviceAccountKey) {
  if (!admin.apps.length) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${projectId}.firebaseio.com`,
      });
      console.log("Firebase Admin SDK initialized successfully.");
      
      // Assign the services after ensuring the app is initialized.
      adminDb = admin.firestore();
      adminAuth = admin.auth();
      adminMessaging = admin.messaging();

    } catch (error: any) {
      console.error('Firebase admin initialization error:', error.message);
      // Don't throw here, just log the error. The app can continue running
      // for client-side operations. Server-side operations will fail gracefully.
    }
  } else {
    // If the app is already initialized, just get the services.
    adminDb = admin.firestore();
    adminAuth = admin.auth();
    adminMessaging = admin.messaging();
  }
} else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK is not initialized. Server-side Firebase operations will not work.");
}

// A simple check to see if the admin SDK is initialized.
export function isFirebaseAdminInitialized() {
  return !!adminMessaging;
}

export { adminDb, adminAuth, adminMessaging };
