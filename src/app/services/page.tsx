import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, Dumbbell, UtensilsCrossed, User, ArrowRight, Calculator } from 'lucide-react';
import Link from 'next/link';
import { PurchaseFormDialog } from '@/components/PurchaseFormDialog';

const serviceDetails = [
  {
    id: 'workouts',
    icon: <Dumbbell className="h-12 w-12 text-primary" />,
    title: 'Personalized Workout Plans',
    description: 'Stop guessing in the gym. Get a dynamic workout plan that adapts to your progress, goals, and lifestyle. Whether you\'re at home or in the gym, we have you covered.',
    imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'gym equipment',
    features: [
      'Tailored to your fitness level (Beginner to Advanced)',
      'Video demonstrations for every exercise',
      'Progress tracking and weekly adjustments',
      'Plans for gym, home, or on-the-go',
    ],
    price: 1999,
  },
  {
    id: 'meals',
    icon: <UtensilsCrossed className="h-12 w-12 text-primary" />,
    title: 'Customized Meal Plans',
    description: 'Fuel your body for success. Our nutrition experts create delicious, easy-to-follow meal plans that align with your fitness goals and dietary preferences.',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1153&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'healthy meal',
    features: [
      'Based on your caloric and macro needs',
      'Accommodates allergies and dietary restrictions',
      'Grocery lists and simple recipes included',
      'Swap meals easily to fit your taste',
    ],
    price: 1499,
  },
  {
    id: 'coaching',
    icon: <User className="h-12 w-12 text-primary" />,
    title: '1-on-1 Expert Coaching',
    description: 'The ultimate accountability partner. Get direct access to an elite coach who will guide you, motivate you, and fine-tune your plan for guaranteed results.',
    imageUrl: 'https://images.unsplash.com/photo-1738523686578-f18348c8292b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    dataAiHint: 'personal training',
    features: [
      'Weekly check-ins and form reviews',
      '24/7 messaging support with your coach',
      'Mindset and habit-building strategies',
      'Complete synergy with your workout and meal plans',
    ],
    price: 4999,
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold">Our Services</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            A suite of services meticulously designed to deliver results. Choose your path or combine them for the ultimate transformation.
          </p>
        </div>
      </section>

      <div className="space-y-16 md:space-y-24 py-16 md:py-24 bg-secondary">
        {serviceDetails.map((service, index) => (
          <section key={service.id} id={service.id} className="container px-4 md:px-6 scroll-mt-20">
            <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:grid-flow-row-dense' : ''}`}>
              <div className={`space-y-4 ${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="text-foreground">{service.icon}</div>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold">{service.title}</h2>
                </div>
                <p className="text-lg text-muted-foreground">{service.description}</p>
                <ul className="space-y-3 pt-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 flex items-center justify-start gap-4">
                  <span className="font-headline text-4xl font-bold">Rs. {service.price}</span>
                   <PurchaseFormDialog serviceName={service.title} />
                </div>
              </div>
              <div className={`relative aspect-video ${index % 2 !== 0 ? 'md:col-start-1' : ''}`}>
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="rounded-lg shadow-xl object-cover"
                  data-ai-hint={service.dataAiHint}
                />
              </div>
            </div>
          </section>
        ))}
         <section id="macro-calculator" className="container px-4 md:px-6 scroll-mt-20">
            <div className="text-center max-w-2xl mx-auto">
                <div className="flex items-center gap-4 justify-center">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Calculator className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <h2 className="font-headline text-3xl md:text-4xl font-bold mt-4">Free Macro Calculator</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Estimate your daily macronutrient needs with our free tool. Get a personalized starting point for your nutrition journey.
                </p>
                 <Button asChild size="lg" className="mt-6 group">
                    <Link href="/macro-calculator">
                        Go to Calculator
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>
          </section>
      </div>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <Card className="bg-primary text-primary-foreground p-8 md:p-12 lg:p-16 text-center">
            <CardHeader>
              <CardTitle className="font-headline text-3xl md:text-4xl lg:text-5xl">Ready to Find Your Edge?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg mt-4 max-w-2xl mx-auto">
                Your transformation is just one click away. Let's build a stronger, healthier you, together.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center mt-6">
              <Button size="lg" asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 group">
                <Link href="/contact">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </>
  );
}
