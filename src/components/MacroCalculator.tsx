
"use client"

import { useState, useTransition, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Download, Share2 } from "lucide-react"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { macroCalculatorSchema } from "@/lib/types"
import { calculateMacros } from "@/lib/actions"

type MacroResult = {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroCalculator() {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<MacroResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);


  const form = useForm<z.infer<typeof macroCalculatorSchema>>({
    resolver: zodResolver(macroCalculatorSchema),
    defaultValues: {
      age: 25,
      gender: "male",
      height: 180,
      weight: 65,
      activityLevel: "moderate",
      goal: "maintain",
    },
  })

  function onSubmit(values: z.infer<typeof macroCalculatorSchema>) {
    setResult(null);
    setError(null);
    startTransition(async () => {
      const res = await calculateMacros(values);
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.error || "An unexpected error occurred.");
      }
    })
  }

  function handleClear() {
    form.reset();
    setResult(null);
    setError(null);
  }

  const handleDownloadPdf = () => {
    if (!result) return;
    const doc = new jsPDF();
    const name = form.getValues('age') + " yr old " + form.getValues('gender');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Your FitEdge Macro Plan", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Based on your inputs for a ${name}.`, 105, 30, { align: "center" });

    autoTable(doc, {
        startY: 40,
        head: [['Metric', 'Value']],
        body: [
            ['Goal', form.getValues('goal').replace('_', ' ')],
            ['Daily Calories', `${result.dailyCalories} kcal`],
            ['Protein', `${result.protein}g`],
            ['Carbohydrates', `${result.carbs}g`],
            ['Fat', `${result.fat}g`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [255, 36, 0] },
    });
    
    doc.save("fitedge-macro-plan.pdf");
  };

  const handleShareEmail = () => {
    if (!result) return;
    const subject = "My FitEdge Macro Plan";
    const body = `Here are my personalized daily macro goals from FitEdge:\n\n- Daily Calories: ${result.dailyCalories} kcal\n- Protein: ${result.protein}g\n- Carbs: ${result.carbs}g\n- Fat: ${result.fat}g\n\nCalculated at fitedge.com`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };


  return (
    <div className="bg-background p-8 rounded-2xl shadow-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4 pt-2"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="180" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="65" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="activityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="light">Lightly Active (exercise 1-3 times/week)</SelectItem>
                    <SelectItem value="moderate">Moderately Active (exercise 4-5 times/week)</SelectItem>
                    <SelectItem value="active">Very Active (daily exercise or intense exercise 3-4 times/week)</SelectItem>
                    <SelectItem value="extra_active">Extra Active (intense exercise 6-7 times/week)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Goal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lose">Lose Weight</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                    <SelectItem value="build_muscle">Build Muscle</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 pt-2">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Calculate
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} disabled={isPending} className="w-full">
                Clear
            </Button>
          </div>
        </form>
      </Form>

      {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}

      {result && (
        <div className="mt-6 animate-fade-in" ref={resultsRef}>
            <Card>
            <CardHeader>
                <CardTitle className="text-center text-2xl font-headline">Your Daily Goal</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-4xl font-bold text-primary">{result.dailyCalories} <span className="text-lg font-normal text-muted-foreground">calories</span></p>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-lg font-semibold">Protein</p>
                        <p className="text-2xl font-bold text-primary">{result.protein}g</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Carbs</p>
                        <p className="text-2xl font-bold text-primary">{result.carbs}g</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Fat</p>
                        <p className="text-2xl font-bold text-primary">{result.fat}g</p>
                    </div>
                </div>
            </CardContent>
            </Card>
            <div className="mt-8 text-center">
                <h3 className="font-headline text-2xl font-bold">Share Your Results</h3>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                    Download your personalized macro plan or share it with a friend or coach to stay accountable.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <Button variant="outline" size="lg" onClick={handleDownloadPdf}>
                    <Download className="mr-2 h-5 w-5" />
                    Download as PDF
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleShareEmail}>
                    <Share2 className="mr-2 h-5 w-5" />
                    Share via Email
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
