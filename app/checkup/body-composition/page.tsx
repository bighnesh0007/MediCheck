"use client";

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Scale, Heart, Activity } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  gender: z.enum(['male', 'female']),
  age: z.number().min(18).max(120),
  height: z.number().min(100).max(250),
  weight: z.number().min(30).max(300),
  neck: z.number().min(20).max(80),
  waist: z.number().min(50).max(200),
  hip: z.number().optional(),
})

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function BodyCompositionPage() {
  interface Result {
    bmi: number;
    bodyFat: number;
    leanMass: number;
    date: string;
  }

  const [results, setResults] = useState<Result | null>(null)
  const [history, setHistory] = useState<Result[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: 'male' as 'male' | 'female',
      age: 30,
      height: 170,
      weight: 70,
      neck: 35,
      waist: 80,
      hip: undefined,
    },
  })

  const calculateBMI = (weight: number, height: number) => {
    return weight / ((height / 100) ** 2)
  }

  const calculateBodyFat = (gender: 'male' | 'female', weight: number, height: number, neck: number, waist: number, hip?: number) => {
    if (gender === 'male') {
      return 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
    } else {
      return 495 / (1.29579 - 0.35004 * Math.log10(waist + (hip ?? 0) - neck) + 0.22100 * Math.log10(height)) - 450
    }
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const bmi = calculateBMI(data.weight, data.height)
    const bodyFat = calculateBodyFat(data.gender, data.weight, data.height, data.neck, data.waist, data.hip)
    const leanMass = data.weight * (1 - bodyFat / 100)

    const newResults = {
      bmi,
      bodyFat,
      leanMass,
      date: new Date().toISOString(),
    }

    setResults(newResults)
    setHistory([...history, newResults])

    toast({
      title: "Analysis Complete",
      description: "Your body composition results are ready.",
    })
  }

  const renderCompositionChart = () => {
    if (!results) {
      return null;
    }

    const data = [
      { name: 'Body Fat', value: results.bodyFat },
      { name: 'Lean Mass', value: 100 - results.bodyFat },
    ]

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  const renderHistoryChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="bmi" stroke="#8884d8" name="BMI" />
          <Line type="monotone" dataKey="bodyFat" stroke="#82ca9d" name="Body Fat %" />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Body Composition Analysis</h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </header>

        <Tabs defaultValue="input">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="input">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Measurements</CardTitle>
                <CardDescription>Provide accurate measurements for the best results.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="male" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Male
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="female" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Female
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
                          </FormControl>
                          <FormDescription>Your age in years.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
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
                            <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="neck"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Neck Circumference (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="waist"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Waist Circumference (cm)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch('gender') === 'female' && (
                      <FormField
                        control={form.control}
                        name="hip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hip Circumference (cm)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(+e.target.value)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <Button type="submit">Calculate</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Your Body Composition Results</CardTitle>
                <CardDescription>Based on your input measurements</CardDescription>
              </CardHeader>
              <CardContent>
                {results ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex flex-col items-center">
                        <Scale className="w-8 h-8 mb-2" />
                        <p className="text-2xl font-bold">{results.bmi.toFixed(1)}</p>
                        <p>BMI</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Heart className="w-8 h-8 mb-2" />
                        <p className="text-2xl font-bold">{results.bodyFat.toFixed(1)}%</p>
                        <p>Body Fat</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Activity className="w-8 h-8 mb-2" />
                        <p className="text-2xl font-bold">{results.leanMass.toFixed(1)} kg</p>
                        <p>Lean Mass</p>
                      </div>
                    </div>
                    {renderCompositionChart()}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Interpretation</h3>
                      <p>
                        Your BMI of {results.bmi.toFixed(1)} indicates you are in the{' '}
                        {results.bmi < 18.5 ? 'underweight' : results.bmi < 25 ? 'normal weight' : results.bmi < 30 ? 'overweight' : 'obese'} range.
                      </p>
                      <p className="mt-2">
                        Your body fat percentage of {results.bodyFat.toFixed(1)}% is considered{' '}
                        {results.bodyFat < 10 ? 'very low' : results.bodyFat < 20 ? 'fit' : results.bodyFat < 25 ? 'average' : 'high'} for your gender and age.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <p>No results available. Please complete the form to see your body composition analysis.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Track your body composition changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <>
                    {renderHistoryChart()}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Achievements</h3>
                      <div className="flex flex-wrap gap-2">
                        {history.length >= 1 && <Badge variant="secondary">First Measurement</Badge>}
                        {history.length >= 5 && <Badge variant="secondary">Consistent Tracker</Badge>}
                        {history.length >= 10 && <Badge variant="secondary">Dedication Master</Badge>}
                      </div>
                    </div>
                  </>
                ) : (
                  <p>No history available. Complete multiple tests to track your progress over time.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}