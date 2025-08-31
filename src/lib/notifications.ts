
'use server';

import { adminDb, adminMessaging, isFirebaseAdminInitialized } from './firebase-admin';

interface NotificationPayload {
    title: string;
    body: string;
    url?: string;
}

export async function sendNotification({ title, body, url }: NotificationPayload) {
  if (!isFirebaseAdminInitialized()) {
    console.warn("Firebase Admin SDK not initialized. Skipping notification.");
    return;
  }
  try {
    const tokensSnapshot = await adminDb!.collection('fcm_tokens').get();
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    if (tokens.length === 0) {
      console.log('No notification tokens found.');
      return;
    }

    const message = {
      notification: {
        title,
        body,
      },
      webpush: {
        fcm_options: {
          link: url || '/',
        },
        notification: {
            icon: '/icon-192x192.png',
        }
      },
      tokens: tokens,
    };

    const response = await adminMessaging!.sendEachForMulticast(message);
    console.log('Successfully sent message:', response);

    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      console.log('List of tokens that caused failures: ' + failedTokens);
      // Optional: Clean up failed tokens from DB
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
