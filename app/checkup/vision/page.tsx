"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {  ArrowUp, ArrowRight, ArrowDown, ArrowLeft, Check, X, AlertTriangle, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

// Vision test components
const SnellenChart = ({ letter, size }: { letter: string; size: number }) => (
  <div style={{ fontSize: `${size}px`, fontFamily: 'sans-serif', fontWeight: 'bold' }}>
    {letter}
  </div>
);

const ColorBlindnessTest = ({ color, number }: { color: string; number: number }) => (
  <div style={{ width: 200, height: 200, backgroundColor: color, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 48, color: 'white' }}>
    {number}
  </div>
);

const AstigmatismTest = () => (
  <div className="relative w-64 h-64">
    <div className="absolute inset-0 border-4 border-black rounded-full"></div>
    <div className="absolute inset-0 border-t-4 border-black transform rotate-45"></div>
    <div className="absolute inset-0 border-t-4 border-black transform -rotate-45"></div>
  </div>
);

const ContrastSensitivityTest = ({ contrast }: { contrast: number }) => (
  <div className="w-64 h-64 flex items-center justify-center" style={{ backgroundColor: `rgba(0,0,0,${contrast})` }}>
    <div className="text-white text-4xl font-bold">E</div>
  </div>
);

const PeripheralVisionTest = ({ direction }: { direction: 'up' | 'right' | 'down' | 'left' }) => {
  const ArrowIcon = {
    up: ArrowUp,
    right: ArrowRight,
    down: ArrowDown,
    left: ArrowLeft
  }[direction];

  return (
    <div className="w-64 h-64 flex items-center justify-center">
      <ArrowIcon size={64} />
    </div>
  );
};

const DepthPerceptionTest = () => (
  <div className="relative w-64 h-64">
    <div className="absolute left-1/4 top-1/4 w-32 h-32 bg-blue-500 rounded-full"></div>
    <div className="absolute right-1/4 bottom-1/4 w-32 h-32 bg-red-500 rounded-full"></div>
  </div>
);

const tests = [
  { 
    name: 'Visual Acuity', 
    component: SnellenChart, 
    props: [
      { letter: 'E', size: 72 },
      { letter: 'F', size: 60 },
      { letter: 'P', size: 48 },
      { letter: 'T', size: 36 },
      { letter: 'O', size: 24 },
    ],
    description: 'Measures how well you can see at various distances.',
    instructions: 'Identify the letter displayed on the screen.',
  },
  { 
    name: 'Color Blindness', 
    component: ColorBlindnessTest, 
    props: [
      { color: 'rgb(255,0,0)', number: 12 },
      { color: 'rgb(0,255,0)', number: 8 },
      { color: 'rgb(0,0,255)', number: 6 },
      { color: 'rgb(255,255,0)', number: 29 },
      { color: 'rgb(255,0,255)', number: 57 },
    ],
    description: 'Checks your ability to distinguish between different colors.',
    instructions: 'Identify the number within the colored circle.',
  },
  { 
    name: 'Astigmatism', 
    component: AstigmatismTest, 
    props: [{}, {}, {}, {}, {}],
    description: 'Detects irregularities in the curvature of your eye.',
    instructions: 'Indicate if all lines appear equally dark and clear.',
  },
  { 
    name: 'Contrast Sensitivity', 
    component: ContrastSensitivityTest, 
    props: [
      { contrast: 0.9 },
      { contrast: 0.7 },
      { contrast: 0.5 },
      { contrast: 0.3 },
      { contrast: 0.1 },
    ],
    description: 'Assesses your ability to distinguish between light and dark.',
    instructions: 'Identify if you can see the letter "E" in varying contrasts.',
  },
  { 
    name: 'Peripheral Vision', 
    component: PeripheralVisionTest, 
    props: [
      { direction: 'up' },
      { direction: 'right' },
      { direction: 'down' },
      { direction: 'left' },
      { direction: 'up' },
    ],
    description: 'Evaluates your side vision while focusing on a central point.',
    instructions: 'Without moving your eyes from the center, identify the direction of the arrow.',
  },
  { 
    name: 'Depth Perception', 
    component: DepthPerceptionTest, 
    props: [{}, {}, {}, {}, {}],
    description: 'Tests your ability to perceive depth and 3D structure.',
    instructions: 'Indicate which circle appears closer to you.',
  },
];

const VisionTestPage = () => {
  const [currentTest, setCurrentTest] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<{ [key: string]: boolean[] }>({});
  const [testStarted, setTestStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (testStarted && currentStep === tests[currentTest].props.length) {
      if (currentTest < tests.length - 1) {
        setCurrentTest(currentTest + 1);
        setCurrentStep(0);
        toast({
          title: `${tests[currentTest].name} Test Completed`,
          description: "Moving to the next test.",
        });
      } else {
        setTestStarted(false);
        setShowResults(true);
        toast({
          title: "All Tests Completed",
          description: "View your results below.",
        });
      }
    }
  }, [currentStep, currentTest, testStarted]);

  const startTest = () => {
    setTestStarted(true);
    setCurrentTest(0);
    setCurrentStep(0);
    setResults({});
    setShowResults(false);
  };

  const handleResponse = (response: boolean) => {
    setResults(prev => ({
      ...prev,
      [tests[currentTest].name]: [...(prev[tests[currentTest].name] || []), response],
    }));
    setCurrentStep(currentStep + 1);
  };

  const progress = ((currentTest * 5 + currentStep) / (tests.length * 5)) * 100;

  const TestComponent = testStarted ? tests[currentTest].component : null;
  const testProps = testStarted ? tests[currentTest].props[currentStep] : {};

  const getTestResult = (testName: string) => {
    const testResults = results[testName];
    if (!testResults) return "Not Taken";
    const passedCount = testResults.filter(Boolean).length;
    const totalCount = testResults.length;
    const percentage = (passedCount / totalCount) * 100;
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Fair";
    return "Poor";
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Comprehensive Vision Test</h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {tests.map((test, index) => (
            <Card key={test.name} className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <CardHeader>
                <CardTitle>{test.name}</CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2"><strong>Instructions:</strong> {test.instructions}</p>
                {showResults && (
                  <Alert className={getTestResult(test.name) === "Excellent" ? "bg-green-100" : getTestResult(test.name) === "Good" ? "bg-blue-100" : getTestResult(test.name) === "Fair" ? "bg-yellow-100" : "bg-red-100"}>
                    <AlertTitle>Result: {getTestResult(test.name)}</AlertTitle>
                    <AlertDescription>
                      {results[test.name]?.filter(Boolean).length || 0} out of {test.props.length} correct
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                {!testStarted && (
                  <Button onClick={() => { setCurrentTest(index); startTest(); }} className="w-full">
                    {results[test.name] ? 'Retake Test' : 'Start Test'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {testStarted && (
          <Card className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle>{tests[currentTest].name} Test</CardTitle>
              <CardDescription>{tests[currentTest].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center items-center h-64">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${currentTest}-${currentStep}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                    >
                      {TestComponent && <TestComponent letter={''} size={0} color={''} number={0} contrast={0} direction={'up'} {...(testProps || {})} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <p className="text-center">{tests[currentTest].instructions}</p>
                <div className="flex justify-center items-center space-x-4">
                  <Button onClick={() => handleResponse(true)}>
                    <Check className="mr-2 h-4 w-4" /> Yes / Visible
                  </Button>
                  <Button onClick={() => handleResponse(false)}>
                    <X className="mr-2 h-4 w-4" /> No / Not Visible
                  </Button>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {showResults && (
          <Card className={`mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Review your performance across all vision tests</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <Tabs defaultValue={tests[0].name} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                    {tests.map((test) => (
                      <TabsTrigger key={test.name} value={test.name}>
                        {test.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {tests.map((test) => (
                    <TabsContent key={test.name} value={test.name}>
                      <h3 className="font-semibold mb-2">{test.name} Results:</h3>
                      <ul>
                        {results[test.name]?.map((result, index) => (
                          <li key={index} className="flex justify-between items-center py-1 border-b last:border-b-0">
                            <span>Step {index + 1}:</span>
                            <span className={result ? "text-green-500" : "text-red-500"}>
                              {result ? (
                                <Check className="inline-block mr-1" />
                              ) : (
                                <X className="inline-block mr-1" />
                              )}
                              {result ? 'Passed' : 'Failed'}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Alert className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Overall Result: {getTestResult(test.name)}</AlertTitle>
                        <AlertDescription>
                          {getTestResult(test.name) === "Excellent" && "Your performance in this test was excellent. Keep up the good work!"}
                          
                          {getTestResult(test.name) === "Good" && "Your performance in this test was good. There might be room for slight improvement."}
                          {getTestResult(test.name) === "Fair" && "Your performance in this test was fair. Consider consulting with an eye care professional."}
                          {getTestResult(test.name) === "Poor" && "Your performance in this test was poor. We strongly recommend consulting with an eye care professional for a comprehensive evaluation."}
                        </AlertDescription>
                      </Alert>
                    </TabsContent>
                  ))}
                </Tabs>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button onClick={startTest} className="w-full">Retake All Tests</Button>
            </CardFooter>
          </Card>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Info className="mr-2 h-4 w-4" />
              Important Information
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disclaimer and Information</DialogTitle>
              <DialogDescription>
                This online vision test is not a substitute for a comprehensive eye examination by a qualified eye care professional. It is designed to give you a general idea about your vision and should not be used for diagnosis or treatment decisions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>If you experience any of the following, please consult an eye care professional immediately:</p>
              <ul className="list-disc pl-5">
                <li>Sudden changes in vision</li>
                <li>Eye pain or discomfort</li>
                <li>Frequent headaches</li>
                <li>Difficulty seeing at night</li>
                <li>Persistent eye strain or fatigue</li>
              </ul>
            </div>
            <DialogFooter>
              <Button onClick={() => toast({ title: "Remember", description: "Regular eye check-ups are important for maintaining good vision health." })}>
                Understood
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default VisionTestPage;