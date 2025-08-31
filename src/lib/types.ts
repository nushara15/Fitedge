import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});


export const macroCalculatorSchema = z.object({
  age: z.coerce.number().min(18, { message: "Age must be between 18 and 80." }).max(80, { message: "Age must be between 18 and 80." }),
  gender: z.enum(['male', 'female'], { errorMap: () => ({ message: "Please select a gender." }) }),
  height: z.coerce.number().positive({ message: "Height must be a positive number." }),
  weight: z.coerce.number().positive({ message: "Weight must be a positive number." }),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'extra_active'], { errorMap: () => ({ message: "Please select an activity level." }) }),
  goal: z.enum(['lose', 'maintain', 'build_muscle'], { errorMap: () => ({ message: "Please select a goal." }) }),
});

export const purchaseFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  whatsappNumber: z.string().min(10, { message: "Please enter a valid WhatsApp number." }),
  goal: z.string().min(10, { message: "Please describe your goal in at least 10 characters." }),
  serviceName: z.string(),
});
