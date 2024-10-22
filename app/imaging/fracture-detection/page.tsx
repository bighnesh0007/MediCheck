"use client";

import React, { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { NewFractureDetectionForm } from '@/components/NewFractureDetectionForm'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { FaBone, FaXRay, FaChartLine } from 'react-icons/fa'

const fractureData = [
  { year: 2010, incidence: 150 },
  { year: 2012, incidence: 180 },
  { year: 2014, incidence: 210 },
  { year: 2016, incidence: 240 },
  { year: 2018, incidence: 270 },
  { year: 2020, incidence: 300 },
]

function FractureDetectionPage() {
  const [isLoading] = useState(false)
  const [showResults] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

 

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-blue-900 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Fracture Detection System</h1>
          <p className="mt-2">Advanced AI-powered fracture analysis</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Upload X-ray Image for Analysis</h2>
          <Card>
            <CardContent className="p-6">
              <NewFractureDetectionForm />
              {isLoading && (
                <div className="mt-4">
                  <Skeleton className="w-full h-8 mb-2" />
                  <Skeleton className="w-3/4 h-8" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {showResults && (
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
            <Card >
              <CardHeader>
                <CardTitle>Fracture Detection Report</CardTitle>
                <CardDescription>AI-generated analysis of the uploaded X-ray image</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Fracture Probability:</span>
                    <Badge variant="destructive">High (85%)</Badge>
                  </div>
                  <Progress value={85} className="w-full" />
                  <Alert>
                    <AlertTitle>Potential Fracture Detected</AlertTitle>
                    <AlertDescription>
                      The AI system has detected a high probability of a fracture in the uploaded X-ray image. 
                      Please consult with a medical professional for a definitive diagnosis.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Download Full Report</Button>
              </CardFooter>
            </Card>
          </motion.section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Fracture Incidence Trends</h2>
          <Card>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fractureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="incidence" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <motion.section style={{ opacity }} className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Fracture Types</h2>
          <Tabs defaultValue="simple">
            <TabsList className="mb-4">
              <TabsTrigger value="simple">Simple Fractures</TabsTrigger>
              <TabsTrigger value="compound">Compound Fractures</TabsTrigger>
              <TabsTrigger value="stress">Stress Fractures</TabsTrigger>
            </TabsList>
            <TabsContent value="simple">
              <Card>
                <CardHeader>
                  <CardTitle>Simple Fractures</CardTitle>
                  <CardDescription>Also known as closed fractures</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Simple fractures occur when a bone breaks but does not puncture the skin. They are the most common type of fracture.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="compound">
              <Card>
                <CardHeader>
                  <CardTitle>Compound Fractures</CardTitle>
                  <CardDescription>Also known as open fractures</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Compound fractures occur when a broken bone penetrates the skin. These fractures are more severe and have a higher risk of infection.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stress">
              <Card>
                <CardHeader>
                  <CardTitle>Stress Fractures</CardTitle>
                  <CardDescription>Tiny cracks in a bone</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Stress fractures are tiny cracks in a bone caused by repetitive force or overuse. They&apos;re common in athletes and military recruits.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Fracture Prevention Tips</h2>
          <Card>
            <CardContent className="p-6">
              <ScrollArea className="h-[200px]">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FaBone className="mr-2 text-blue-600" />
                    Maintain a healthy diet rich in calcium and vitamin D
                  </li>
                  <li className="flex items-center">
                    <FaChartLine className="mr-2 text-green-600" />
                    Engage in regular weight-bearing exercises
                  </li>
                  <li className="flex items-center">
                    <FaXRay className="mr-2 text-purple-600" />
                    Get regular bone density scans if you&apos;re at risk
                  </li>
                  <Separator className="my-2" />
                  <li className="flex items-center">
                    <FaBone className="mr-2 text-blue-600" />
                    Avoid smoking and excessive alcohol consumption
                  </li>
                  <li className="flex items-center">
                    <FaChartLine className="mr-2 text-green-600" />
                    Practice balance exercises to prevent falls
                  </li>
                  <li className="flex items-center">
                    <FaXRay className="mr-2 text-purple-600" />
                    Ensure your home is free of tripping hazards
                  </li>
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How accurate is AI in detecting fractures?</AccordionTrigger>
              <AccordionContent>
                AI-powered fracture detection systems have shown high accuracy rates, often exceeding 90% in clinical studies. However, they are designed to assist, not replace, medical professionals in making diagnoses.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can all types of fractures be detected by AI?</AccordionTrigger>
              <AccordionContent>
                While AI systems are highly capable, they may not detect all types of fractures with equal accuracy. Hairline fractures or those in complex anatomical areas may be more challenging to detect. Always consult with a medical professional for a definitive diagnosis.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How long does it take to get results from the AI analysis?</AccordionTrigger>
              <AccordionContent>
                Typically, AI-powered fracture detection systems can provide results within minutes of uploading an X-ray image. However, the exact time may vary depending on the system&apos;s workload and the complexity of the image.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <Card>
            <CardContent className="p-6">
              <p className="mb-4">Have questions about our fracture detection system? Get in touch with our team.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Contact Support</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Support</DialogTitle>
                    <DialogDescription>
                      Fill out this form to get in touch with our support team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right">
                        Name
                      </label>
                      <input id="name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="email" className="text-right">
                        Email
                      </label>
                      <input id="email" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Send message</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-blue-900 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 Fracture Detection System. All rights reserved.</p>
          <p className="mt-2">
            Disclaimer: This system is designed to assist medical professionals and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default FractureDetectionPage