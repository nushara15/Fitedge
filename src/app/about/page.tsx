import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const values = [
  'Personalized Approach',
  'Science-Backed Methods',
  'Holistic Well-being',
  'Empowering Community',
  'Unwavering Support',
  'Continuous Innovation'
]

export default function AboutPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <p className="font-headline text-primary font-semibold">Our Mission</p>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold mt-2">
                To Empower Your Fitness Journey
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                At FitEdge, we believe that everyone deserves to feel strong, healthy, and confident. Our mission is to provide you with the tools, knowledge, and support to unlock your full potential and achieve your fitness goals, no matter how ambitious. We combine cutting-edge technology with expert human coaching to create a truly personalized and effective fitness experience.
              </p>
            </div>
            <div className="order-first md:order-last">
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="FitEdge team collaborating"
                width={800}
                height={600}
                className="rounded-lg shadow-xl"
                data-ai-hint="team collaboration"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-headline text-4xl md:text-5xl font-bold">Our Core Values</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              These principles guide every decision we make and every program we create.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {values.map(value => (
              <div key={value} className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </>
  );
}
