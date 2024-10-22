"use client";

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FaBone, FaWalking, FaHeartbeat } from 'react-icons/fa'
import { GiMedicines, GiFruitBowl, GiWeightLiftingUp } from 'react-icons/gi'
import { RiMentalHealthLine } from 'react-icons/ri'
import { MdOutlineElderly } from 'react-icons/md'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0)

  React.useEffect(() => {
    let start = 0
    const end = parseInt(value)
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      setCount(Math.floor(start))
      if (start >= end) {
        clearInterval(timer)
        setCount(end)
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{count}</span>
}

export default function OsteoporosisPage() {
  const [riskScore, setRiskScore] = useState(50)
  const [showRiskDialog, setShowRiskDialog] = useState(false)

  const boneDensityData = [
    { age: 20, density: 100 },
    { age: 30, density: 98 },
    { age: 40, density: 95 },
    { age: 50, density: 90 },
    { age: 60, density: 85 },
    { age: 70, density: 78 },
    { age: 80, density: 70 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-blue-900 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Osteoporosis Awareness</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <motion.h2 
            className="text-4xl font-bold mb-4 text-blue-800 dark:text-blue-200"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Understanding Osteoporosis
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            The Silent Bone Thief
          </motion.p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">Key Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>People Affected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">
                  <AnimatedCounter value="50" />M+
                </div>
                <CardDescription>in the U.S. have osteoporosis or low bone mass</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Women at Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-pink-600">1 in 2</div>
                <CardDescription>women over 50 will experience an osteoporosis-related fracture</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Men at Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">1 in 4</div>
                <CardDescription>men over 50 are at risk of an osteoporosis-related fracture</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Low Bone Density</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-600">1 in 3</div>
                <CardDescription>adults over 50 have low bone density (osteopenia)</CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">What is Osteoporosis?</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Osteoporosis is a condition characterized by a reduction in bone density, making bones thinner, weaker, and more susceptible to fractures. It&apos;s common in the hips, spine, and wrists.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                As we age, bone remodeling (the body&apos;s ability to regrow bones) slows, causing bones to lose density faster than they can regenerate.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">Symptoms and Risk Factors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaBone className="mr-2 text-blue-600" /> Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Reduction in height by more than 1 inch</li>
                  <li>Noticeable stooping or a hunched posture</li>
                  <li>Lower back pain or unexpected bone pain</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RiMentalHealthLine className="mr-2 text-red-600" /> Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Age: Natural aging process weakens bones</li>
                  <li>Gender: Women, especially postmenopausal, are at higher risk</li>
                  <li>Family history: Osteoporosis can run in families</li>
                  <li>Smaller body frames: Less bone mass to lose</li>
                  <li>Lifestyle factors: Smoking, excessive alcohol, lack of calcium or vitamin D</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">Diagnosis and Tests</h2>
          <Card>
            <CardHeader>
              <CardTitle>Bone Density Test (DEXA Scan)</CardTitle>
              <CardDescription>The gold standard for diagnosing osteoporosis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This test measures bone mineral density and compares it to that of a healthy young adult.</p>
              <div className="space-y-4">
                <div>
                  <Label>T-score ≤ -2.5: Osteoporosis</Label>
                  <Progress value={25} className="mt-2" />
                </div>
                <div>
                  <Label>{'-2.5 < T-score < -1: Osteopenia'}</Label>
                  <Progress value={50} className="mt-2" />
                </div>
                <div>
                  <Label>T-score ≥ -1: Normal</Label>
                  <Progress value={100} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">Management and Treatment</h2>
          <Tabs defaultValue="medications">
            <TabsList className="mb-4">
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle Adjustments</TabsTrigger>
            </TabsList>
            <TabsContent value="medications">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GiMedicines className="mr-2 text-blue-600" /> Bisphosphonates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>The most common medications for preventing bone loss.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaHeartbeat className="mr-2 text-pink-600" /> Hormone Therapy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Estrogen or testosterone replacement can be effective for postmenopausal individuals.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GiMedicines className="mr-2 text-green-600" /> Denosumab
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>A biannual injection that helps reduce bone resorption.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GiMedicines className="mr-2 text-purple-600" /> PTH Analogs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Medications like teriparatide stimulate bone growth.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="lifestyle">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FaWalking className="mr-2 text-blue-600" /> Weight-bearing Exercises
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Walking and running improve bone density.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GiWeightLiftingUp className="mr-2 text-red-600" /> Strength Training
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Helps maintain muscle mass and improve balance, reducing the risk of falls.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <GiFruitBowl className="mr-2 text-green-600" /> Healthy Diet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Ensure sufficient calcium and vitamin D intake.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">Prevention Tips</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <GiFruitBowl className="text-4xl text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Balanced Diet</h3>
                  <p>Ensure sufficient calcium (1,200 mg daily for adults over 50) and vitamin D (800-1,000 IU daily) intake.</p>
                </div>
                <div>
                  <FaWalking className="text-4xl text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Regular Exercise</h3>
                  <p>Engage in weight-bearing exercises to strengthen bones and improve balance.</p>
                </div>
                <div>
                  <MdOutlineElderly className="text-4xl text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Regular Testing</h3>
                  <p>For those over  65, regular bone density tests are critical.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">Bone Density Over Time</h2>
          <Card>
            <CardHeader>
              <CardTitle>Bone Density Loss with Age</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={boneDensityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Bone Density (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="density" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">Osteoporosis Risk Assessment</h2>
          <Card>
            <CardHeader>
              <CardTitle>Estimate Your Risk</CardTitle>
              <CardDescription>This is a simplified risk assessment and should not replace professional medical advice.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" type="number" placeholder="Enter your age" />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="family-history" />
                  <Label htmlFor="family-history">Family history of osteoporosis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="smoking" />
                  <Label htmlFor="smoking">Current smoker</Label>
                </div>
                <Button onClick={() => setShowRiskDialog(true)}>Calculate Risk</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <Dialog open={showRiskDialog} onOpenChange={setShowRiskDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Osteoporosis Risk Assessment</DialogTitle>
              <DialogDescription>
                Based on the information provided, here&apos;s an estimate of your risk:
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label>Risk Score</Label>
              <Slider
                value={[riskScore]}
                max={100}
                step={1}
                className="mt-2"
                onValueChange={(value) => setRiskScore(value[0])}
              />
              <p className="mt-2 text-center font-semibold">
                {riskScore < 33 ? "Low Risk" : riskScore < 66 ? "Moderate Risk" : "High Risk"}
              </p>
            </div>
            <Alert>
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                This assessment is not a diagnosis. Please consult with a healthcare professional for a thorough evaluation.
              </AlertDescription>
            </Alert>
          </DialogContent>
        </Dialog>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">Living with Osteoporosis</h2>
          <Card>
            <CardHeader>
              <CardTitle>Daily Management Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="diet">
                  <AccordionTrigger>Diet and Nutrition</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Consume calcium-rich foods (dairy, leafy greens, fortified foods)</li>
                      <li>Ensure adequate vitamin D intake through sunlight exposure or supplements</li>
                      <li>Limit caffeine and alcohol consumption</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="exercise">
                  <AccordionTrigger>Exercise Routine</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Engage in weight-bearing exercises like walking or dancing</li>
                      <li>Incorporate strength training to build muscle and improve balance</li>
                      <li>Practice yoga or tai chi for flexibility and balance</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="safety">
                  <AccordionTrigger>Home Safety</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Remove tripping hazards like loose rugs or clutter</li>
                      <li>Install grab bars in the bathroom and handrails on stairs</li>
                      <li>Ensure good lighting throughout your home</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible>
                <AccordionItem value="faq-1">
                  <AccordionTrigger>Can osteoporosis be reversed?</AccordionTrigger>
                  <AccordionContent>
                    While osteoporosis cannot be fully reversed, with proper treatment and lifestyle changes, bone density can be improved and further bone loss can be prevented.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>Are there any natural remedies for osteoporosis?</AccordionTrigger>
                  <AccordionContent>
                    While not a substitute for medical treatment, some natural approaches can support bone health. These include getting adequate sunlight for vitamin D, consuming calcium-rich foods, and engaging in weight-bearing exercises.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>How often should I get a bone density test?</AccordionTrigger>
                  <AccordionContent>
                    The frequency of bone density tests depends on various factors. Generally, women 65 and older and men 70 and older should get a bone density test every two years. Those with risk factors may need more frequent testing.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800 dark:text-blue-200">Contact Us</h2>
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>Have questions about osteoporosis? Reach out to us.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message" />
                </div>
                <Button type="submit">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 Osteoporosis Awareness. All rights reserved.</p>
          <p className="mt-2">
            Disclaimer: This information is for educational purposes only and should not be used as a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  )
}