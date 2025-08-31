
'use client';
import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { saveFcmToken } from '@/lib/actions';

export function useFCM() {
  const { toast } = useToast();
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const messaging = getMessaging(app);

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received.', payload);
            toast({
                title: payload.notification?.title,
                description: payload.notification?.body,
            });
        });
        return () => unsubscribe();
    }
  }, [toast]);

  const requestPermission = async () => {
    if (typeof window === 'undefined') return;

    try {
      const messaging = getMessaging(app);
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        // Get the token
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (currentToken) {
          console.log('FCM Token:', currentToken);
          setFcmToken(currentToken);
          // Save the token to the server
          await saveFcmToken(currentToken);
          toast({ title: 'Success', description: 'You are now subscribed to notifications.' });
        } else {
          console.log('No registration token available. Request permission to generate one.');
          toast({ title: 'Error', description: 'Could not get notification token. Please try again.', variant: 'destructive'});
        }
      } else {
        console.log('Unable to get permission to notify.');
         toast({ title: 'Info', description: 'Notification permission was denied.' });
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
      toast({ title: 'Error', description: 'An error occurred while enabling notifications.', variant: 'destructive' });
    }
  };

  return { requestPermission, fcmToken };
};
