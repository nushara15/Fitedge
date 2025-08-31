import { MacroCalculator } from '@/components/MacroCalculator';
import { Calculator } from 'lucide-react';

export default function MacroCalculatorPage() {
  return (
    <>
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 text-center">
            <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                <Calculator className="h-12 w-12 text-primary" />
            </div>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold">Macro Calculator</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Estimate your daily macronutrient needs to fuel your body, achieve your fitness goals, and unlock your full potential.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary" id="calculator">
        <div className="container px-4 md:px-6">
          <div className="max-w-xl mx-auto">
              <MacroCalculator />
          </div>
        </div>
      </section>
    </>
  );
}
