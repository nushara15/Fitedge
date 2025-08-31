
'use server';
import { z } from 'zod';
import {
  contactFormSchema,
  macroCalculatorSchema,
  purchaseFormSchema,
} from '@/lib/types';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { sendNotification, isFirebaseAdminInitialized } from './notifications';

export async function submitContactForm(
  data: z.infer<typeof contactFormSchema>
) {
  const result = contactFormSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  try {
    const docRef = await addDoc(collection(db, 'contacts'), {
      ...result.data,
      submittedAt: serverTimestamp(),
      status: 'New',
    });
    // Send notification to admins
    if (isFirebaseAdminInitialized()) {
      await sendNotification({
        title: 'New Contact Message',
        body: `You received a new message from ${result.data.name}.`,
        url: `/admin/messages/${docRef.id}`,
      });
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error adding document: ', error);
    return { success: false, error: 'Failed to submit message.' };
  }
}

export async function calculateMacros(
  data: z.infer<typeof macroCalculatorSchema>
) {
  const result = macroCalculatorSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  const { age, gender, height, weight, activityLevel, goal } = result.data;

  // 1. BMR (Mifflin-St Jeor Equation)
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // 2. TDEE (Total Daily Energy Expenditure)
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra_active: 1.9,
  };

  let tdee = bmr * activityMultipliers[activityLevel];

  // 3. Adjust for Goal
  const goalAdjustments = {
    lose: -500,
    maintain: 0,
    build_muscle: 300,
  };

  const dailyCalories = tdee + goalAdjustments[goal];

  // 4. Macro Breakdown
  const proteinGrams = 1.8 * weight;
  const proteinCalories = proteinGrams * 4;

  const fatCalories = dailyCalories * 0.25;
  const fatGrams = fatCalories / 9;

  const carbCalories = dailyCalories - proteinCalories - fatGrams;
  const carbGrams = carbCalories / 4;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (isFirebaseAdminInitialized()) {
    await sendNotification({
        title: 'Macro Calculation',
        body: `A user just calculated their macros for the goal: ${goal}.`,
        url: '/admin/analytics',
      });
  }


  return {
    success: true,
    data: {
      dailyCalories: Math.round(dailyCalories),
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fat: Math.round(fatGrams),
    },
  };
}

export async function submitPurchaseForm(
  data: z.infer<typeof purchaseFormSchema>
) {
  const result = purchaseFormSchema.safeParse(data);

  if (!result.success) {
    console.error("Validation failed:", result.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid data provided. Please check the form and try again.' };
  }

  try {
    const docRef = await addDoc(collection(db, 'purchases'), {
      ...result.data,
      submittedAt: serverTimestamp(),
      status: 'New',
    });
    console.log("Document written with ID: ", docRef.id);
     // Send notification to admins
    if (isFirebaseAdminInitialized()) {
      await sendNotification({
          title: 'New Purchase Inquiry!',
          body: `${result.data.firstName} is interested in the ${result.data.serviceName} plan.`,
          url: `/admin/purchases/${docRef.id}`,
      });
    }
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error adding document to Firestore: ', error);
    return { success: false, error: 'A server error occurred. Failed to submit inquiry.' };
  }
}

export async function deleteDocument(collectionName: string, docId: string) {
  if (!isFirebaseAdminInitialized()) {
    return { success: false, error: 'Admin SDK not initialized.' };
  }
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting document: ', error);
    return { success: false, error: 'Failed to delete the document.' };
  }
}

export async function saveFcmToken(token: string) {
  if (!token) {
    return { success: false, error: 'Invalid token provided.' };
  }
   if (!isFirebaseAdminInitialized()) {
    return { success: false, error: 'Admin SDK not initialized.' };
  }
  try {
    // Check if token already exists to avoid duplicates
    const snapshot = await db.collection('fcm_tokens').where('token', '==', token).get();
    if (snapshot.empty) {
        await addDoc(collection(db, 'fcm_tokens'), {
            token: token,
            createdAt: serverTimestamp(),
        });
    }
    return { success: true };
  } catch (error) {
    console.error('Error saving FCM token: ', error);
    return { success: false, error: 'Failed to save token.' };
  }
}
