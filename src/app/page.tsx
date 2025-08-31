
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dumbbell, User, ArrowRight, Calculator, UtensilsCrossed } from 'lucide-react';

const services = [
  {
    icon: <Dumbbell className="h-10 w-10 text-primary" />,
    title: 'Workout Plans',
    description: 'Customized workout routines designed to meet your specific fitness goals, whether it\'s muscle gain, weight loss, or endurance.',
    link: '/services#workouts',
  },
  {
    icon: <UtensilsCrossed className="h-10 w-10 text-primary" />,
    title: 'Meal Plans',
    description: 'Nutritionally balanced meal plans tailored to your dietary needs and preferences, taking the guesswork out of healthy eating.',
    link: '/services#meals',
  },
  {
    icon: <User className="h-10 w-10 text-primary" />,
    title: '1-on-1 Coaching',
    description: 'Get personalized guidance, motivation, and accountability from our expert coaches to fast-track your fitness journey.',
    link: '/services#coaching',
  },
];

const testimonials = [
  {
    name: 'Kasun.',
    title: 'Lost 20 lbs in 3 months!',
    quote: '"The personalized meal and workout plans were a game-changer. I\'ve never felt more energetic and confident. The coaches are so supportive!"',
  },
  {
    name: 'Yasiru.',
    title: 'Gained muscle and strength',
    quote: '"FitEdge helped me break through my plateau. The coaching is top-notch, and the community is incredibly motivating. Highly recommended!"',
  },
  {
    name: 'Shehani.',
    title: 'A complete lifestyle change',
    quote: '"This is more than just a fitness app. It\'s a lifestyle. I\'ve learned so much about nutrition and exercise that I\'ll carry with me forever."',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[80vh] min-h-[500px] md:min-h-[600px] flex items-center justify-center text-center text-primary-foreground">
        <Image
          src="https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=2000&auto=format&fit=crop"
          alt="Woman on exercise equipment"
          fill
          className="object-cover -z-10 brightness-50"
          priority
          data-ai-hint="woman exercise equipment"
        />
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold mb-4">
              Unleash Your Edge
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Transform your body and mind with our elite fitness coaching. Personalized plans, expert guidance, and a community that pushes you forward.
            </p>
            <Button asChild size="lg" className="group">
              <Link href="/services">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section id="services" className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-headline text-4xl md:text-5xl font-bold">Your Path to Peak Performance</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide the tools, you bring the grit. Discover our services designed for results.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="text-center flex flex-col items-center p-6 md:p-8 border-2 border-transparent hover:border-primary hover:shadow-2xl transition-all duration-300 bg-card">
                <CardHeader className="p-0">
                  <div className="text-foreground flex justify-center">{service.icon}</div>
                  <CardTitle className="font-headline mt-4 text-2xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex-grow">
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
                <Button variant="link" asChild className="mt-4 text-primary font-bold group">
                  <Link href={service.link}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="macro-calculator" className="py-16 md:py-24 bg-secondary">
        <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto">
                <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                  <Calculator className="h-12 w-12 text-primary" />
                </div>
                <h2 className="font-headline text-4xl md:text-5xl font-bold">Calculate Your Macros</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Fuel your body for success. Use our free macro calculator to get personalized targets for your fitness goals.
                </p>
                <Button asChild size="lg" className="mt-8 group">
                    <Link href="/macro-calculator">
                        Go to Calculator
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-headline text-4xl md:text-5xl font-bold">Success Stories</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Don&apos;t just take our word for it. Here&apos;s what our members have to say.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
             {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6 flex flex-col bg-card">
                <CardContent className="p-0 flex-grow">
                  <p className="italic text-foreground/80">&quot;{testimonial.quote}&quot;</p>
                </CardContent>
                <CardHeader className="p-0 mt-6">
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.title}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
           <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/share-story">
                Share Your Story
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
    </div>
  );
}
