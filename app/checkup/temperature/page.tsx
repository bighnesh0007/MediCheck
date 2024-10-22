"use client";

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {  AlertTriangle, Calendar  } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'

const formSchema = z.object({
  temperature: z.number().min(30).max(45),
  unit: z.enum(['celsius', 'fahrenheit']),
  date: z.date(),
})

export default function BodyTemperaturePage() {
  interface TemperatureRecord {
    temperature: number;
    unit: 'celsius' | 'fahrenheit';
    date: Date;
    id: number;
  }
  
  const [temperatureHistory, setTemperatureHistory] = useState<TemperatureRecord[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const { toast } = useToast()

  const form = useForm<{
    temperature: number;
    unit: 'celsius' | 'fahrenheit';
    date: Date;
  }>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temperature: 37,
      unit: 'celsius',
      date: new Date(),
    },
  })

  const onSubmit = (data: { temperature: number; unit: 'celsius' | 'fahrenheit'; date: Date }) => {
    const newTemperature = {
      ...data,
      id: Date.now(),
    }
    setTemperatureHistory([...temperatureHistory, newTemperature])
    toast({
      title: "Temperature Recorded",
      description: `Your temperature of ${data.temperature}°${data.unit === 'celsius' ? 'C' : 'F'} has been saved.`,
    })
  }

  const getTemperatureStatus = (temp: number, unit: 'celsius' | 'fahrenheit') => {
    const celsius = unit === 'fahrenheit' ? (temp - 32) * 5/9 : temp
    if (celsius < 35) return 'hypothermia'
    if (celsius > 38) return 'fever'
    return 'normal'
  }

  const renderTemperatureGauge = (temp: number, unit: 'celsius' | 'fahrenheit') => {
    const status = getTemperatureStatus(temp, unit)
    const percentage = ((temp - 30) / (45 - 30)) * 100

    return (
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
              {status}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-teal-600">
              {temp}°{unit === 'celsius' ? 'C' : 'F'}
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-teal-200">
          <motion.div 
            style={{ width: `${percentage}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              status === 'normal' ? 'bg-green-500' : status === 'fever' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Body Temperature Monitoring</h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </header>

        <Tabs defaultValue="input">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Record Temperature</TabsTrigger>
            <TabsTrigger value="history">Temperature History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input">
            <Card>
              <CardHeader>
                <CardTitle>Record Your Body Temperature</CardTitle>
                <CardDescription>Enter your current body temperature and related details.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                          </FormControl>
                          <FormDescription>Enter your body temperature.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Temperature Unit</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="celsius" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Celsius
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="fahrenheit" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Fahrenheit
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
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-[240px] pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            The date when the temperature was taken.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Record Temperature</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Temperature History</CardTitle>
                <CardDescription>View your recorded body temperatures over time.</CardDescription>
              </CardHeader>
              <CardContent>
                {temperatureHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={temperatureHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'MM/dd')} />
                      <YAxis />
                      <Tooltip labelFormatter={(label) => format(new Date(label), 'PPP')} />
                      <Legend />
                      <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p>No temperature history available. Start recording your temperature to see the chart.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Insights</CardTitle>
                <CardDescription>Analyze your body temperature patterns and receive health insights.</CardDescription>
              </CardHeader>
              <CardContent>
                {temperatureHistory.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {temperatureHistory.slice(-1).map((record) => (
                        <div key={record.id}>
                          <h3 className="text-lg font-semibold mb-2">Latest Temperature Reading</h3>
                          {renderTemperatureGauge(record.temperature, record.unit)}
                          <p className="mt-2">
                            Recorded on: {format(new Date(record.date), 'PPP')}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Health Tip</AlertTitle>
                      <AlertDescription>
                        {getTemperatureStatus(temperatureHistory[temperatureHistory.length - 1].temperature, temperatureHistory[temperatureHistory.length - 1].unit) === 'normal'
                          ? "Your temperature is within the normal range. Keep monitoring and stay healthy!"
                          : getTemperatureStatus(temperatureHistory[temperatureHistory.length - 1].temperature, temperatureHistory[temperatureHistory.length - 1].unit) === 'fever'
                          ? "You may have a fever. Rest, stay hydrated, and consult a doctor if symptoms persist."
                          : "Your temperature is low. Warm up gradually and seek medical advice if it persists."}
                      </AlertDescription>
                    </Alert>
                  </>
                ) : (
                  <p>No insights available yet. Record your temperature to receive personalized insights.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}