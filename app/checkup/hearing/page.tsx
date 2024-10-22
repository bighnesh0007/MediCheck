"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Volume2, VolumeX, Info, AlertTriangle, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const frequencies = [250, 500, 1000, 2000, 4000, 8000];

interface TestResult {
  date: string;
  results: { [key: number]: boolean };
}

const HearingTestPage = () => {
  const [currentFrequency, setCurrentFrequency] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: number]: boolean }>({});
  const [testStarted, setTestStarted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [toneDuration, setToneDuration] = useState(2000);
  const [activeTab, setActiveTab] = useState("test");
  const audioContextRef = useRef<AudioContext | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
   
    const savedHistory = localStorage.getItem('hearingTestHistory');
    if (savedHistory) {
      setTestHistory(JSON.parse(savedHistory));
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    // Save test history to localStorage whenever it changes
    localStorage.setItem('hearingTestHistory', JSON.stringify(testHistory));
  }, [testHistory]);

  const playTone = (frequency: number) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);

    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start();
    setIsPlaying(true);

    // Provide visual feedback
    document.body.style.backgroundColor = darkMode ? '#2C2C2C' : '#E5E5E5';

    setTimeout(() => {
      gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current!.currentTime + 0.1);
      setTimeout(() => {
        oscillator.stop();
        setIsPlaying(false);
        document.body.style.backgroundColor = '';
      }, 100);
    }, toneDuration - 100);
  };

  const handleResponse = (heard: boolean) => {
    setTestResults(prev => ({ ...prev, [frequencies[currentFrequency]]: heard }));
    if (currentFrequency < frequencies.length - 1) {
      setCurrentFrequency(prev => prev + 1);
    } else {
      setTestStarted(false);
      saveTestResults();
    }
  };

  const startTest = () => {
    setTestStarted(true);
    setCurrentFrequency(0);
    setTestResults({});
    playTone(frequencies[0]);
    toast({
      title: "Test Started",
      description: "Listen carefully and respond if you hear the tone.",
    });
  };

  const saveTestResults = () => {
    const newResult: TestResult = {
      date: new Date().toISOString(),
      results: testResults,
    };
    setTestHistory(prev => [...prev, newResult]);
    toast({
      title: "Test Completed",
      description: "Your results have been saved. View detailed analysis in the Results & History tab.",
    });
  };

  useEffect(() => {
    if (testStarted && !isPlaying && currentFrequency < frequencies.length) {
      playTone(frequencies[currentFrequency]);
    }
  }, [currentFrequency, isPlaying, testStarted]);

  const progress = (currentFrequency / frequencies.length) * 100;

  const getHearingStatus = (results: { [key: number]: boolean }) => {
    const heardCount = Object.values(results).filter(Boolean).length;
    if (heardCount === frequencies.length) return "Excellent";
    if (heardCount >= frequencies.length * 0.8) return "Good";
    if (heardCount >= frequencies.length * 0.6) return "Fair";
    return "Poor";
  };

  const renderTestHistory = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={testHistory.map(result => ({
        date: new Date(result.date).toLocaleDateString(),
        ...frequencies.reduce((acc, freq) => ({ ...acc, [freq]: result.results[freq] ? 1 : 0 }), {}),
      }))}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {frequencies.map((freq, index) => (
          <Line 
            key={freq} 
            type="monotone" 
            dataKey={freq.toString()} 
            name={`${freq} Hz`} 
            stroke={`hsl(${index * 60}, 70%, 50%)`}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBriefResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h3 className="font-semibold text-lg">Test Results Summary:</h3>
      <Alert className={getHearingStatus(testResults) === "Excellent" ? "bg-green-100" : getHearingStatus(testResults) === "Good" ? "bg-blue-100" : getHearingStatus(testResults) === "Fair" ? "bg-yellow-100" : "bg-red-100"}>
        <Info className="h-4 w-4" />
        <AlertTitle>Hearing Status: {getHearingStatus(testResults)}</AlertTitle>
        <AlertDescription>
          {getHearingStatus(testResults) === "Excellent" && "Your hearing appears to be in excellent condition across all tested frequencies."}
          {getHearingStatus(testResults) === "Good" && "Your hearing is good, but there might be slight difficulties in some frequency ranges."}
          {getHearingStatus(testResults) === "Fair" && "Your hearing shows some deficiencies. Consider consulting with an audiologist."}
          {getHearingStatus(testResults) === "Poor" && "Your hearing test results indicate significant hearing loss. We strongly recommend consulting with an audiologist for a professional evaluation."}
        </AlertDescription>
      </Alert>
      <Button onClick={() => setActiveTab("results")} className="w-full">View Detailed Results</Button>
      <Button onClick={startTest} variant="outline" className="w-full">Retake Test</Button>
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="container mx-auto p-4">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Comprehensive Hearing Test</h1>
          <div className="flex items-center space-x-2">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="test">Hearing Test</TabsTrigger>
            <TabsTrigger value="results">Results & History</TabsTrigger>
            <TabsTrigger value="info">Hearing Health</TabsTrigger>
          </TabsList>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Online Hearing Test</CardTitle>
                <CardDescription>Test your hearing across different frequencies</CardDescription>
              </CardHeader>
              <CardContent>
                {!testStarted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <p className="mb-4">Click the button below to start the hearing test. Make sure you&apos;re in a quiet environment and wearing headphones.</p>
                    <Button onClick={startTest}>Start Test</Button>
                  </motion.div>
                ) : Object.keys(testResults).length === frequencies.length ? (
                  renderBriefResults()
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    <p className="text-center">Do you hear the tone?</p>
                    <div className="flex justify-center items-center space-x-4">
                      <Button onClick={() => handleResponse(true)} disabled={!isPlaying}>
                        <Volume2 className="mr-2 h-4 w-4" /> Yes
                      </Button>
                      <Button onClick={() => handleResponse(false)} disabled={!isPlaying}>
                        <VolumeX className="mr-2 h-4 w-4" /> No
                      </Button>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-center text-sm text-gray-500">
                      Testing frequency: {frequencies[currentFrequency]} Hz
                    </p>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volume">Volume</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        id="volume"
                        min={0}
                        max={1}
                        step={0.01}
                        value={[volume]}
                        onValueChange={([value]) => setVolume(value)}
                        className="w-[200px]"
                      />
                      <Input
                        type="number"
                        value={Math.round(volume * 100)}
                        onChange={(e) => setVolume(Number(e.target.value) / 100)}
                        className="w-16"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="duration">Tone Duration (ms)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={toneDuration}
                      onChange={(e) => setToneDuration(Number(e.target.value))}
                      className="w-24"
                      min="500"
                      max="5000"
                    />
                  </div>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      Prolonged exposure to loud sounds can damage your hearing. Always start with a lower volume and increase gradually if needed.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Your Hearing Test Results</CardTitle>
                <CardDescription>View your current and historical test results</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(testResults).length === frequencies.length ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Latest Test Results:</h3>
                    <ul className="space-y-2">
                      {frequencies.map(freq => (
                        <li key={freq} className="flex justify-between items-center">
                          <span>{freq} Hz:</span>
                          <span className={testResults[freq] ? "text-green-500" : "text-red-500"}>
                            {testResults[freq] ? (
                              <CheckCircle className="inline-block mr-1" />
                            ) : (
                              <XCircle className="inline-block mr-1" />
                            )}
                            {testResults[freq] ? 'Heard' : 'Not Heard'}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Alert className={getHearingStatus(testResults) === "Excellent" ? "bg-green-100" : getHearingStatus(testResults) === 
                    "Good" 
                    ? "bg-blue-100" : getHearingStatus(testResults) === "Fair" ? "bg-yellow-100" : "bg-red-100"}>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Hearing Status: {getHearingStatus(testResults)}</AlertTitle>
                      <AlertDescription>
                        {getHearingStatus(testResults) === "Excellent" && "Your hearing appears to be in excellent condition across all tested frequencies."}
                        {getHearingStatus(testResults) === "Good" && "Your hearing is good, but there might be slight difficulties in some frequency ranges."}
                        {getHearingStatus(testResults) === "Fair" && "Your hearing shows some deficiencies. Consider consulting with an audiologist."}
                        {getHearingStatus(testResults) === "Poor" && "Your hearing test results indicate significant hearing loss. We strongly recommend consulting with an audiologist for a professional evaluation."}
                      </AlertDescription>
                    </Alert>
                    <Button onClick={() => {setActiveTab("test"); startTest();}} className="w-full">Retake Test</Button>
                  </div>
                ) : (
                  <p>No recent test results available. Take a test to see your results here.</p>
                )}
                {testHistory.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-semibold mb-4">Test History</h3>
                    {renderTestHistory()}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Hearing Health Information</CardTitle>
                <CardDescription>Learn about hearing health and protection</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Understanding Hearing Loss</AccordionTrigger>
                    <AccordionContent>
                      Hearing loss can occur due to various factors, including age, exposure to loud noises, genetic predisposition, and certain medical conditions. It&apos;s important to be aware of the signs of hearing loss and seek professional help if you notice any changes in your hearing ability.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Protecting Your Hearing</AccordionTrigger>
                    <AccordionContent>
                      To protect your hearing:
                      <ul className="list-disc pl-5 mt-2">
                        <li>Limit exposure to loud noises</li>
                        <li>Use hearing protection in noisy environments</li>
                        <li>Keep the volume down when using headphones</li>
                        <li>Give your ears time to recover after exposure to loud sounds</li>
                        <li>Get regular hearing check-ups</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>When to See an Audiologist</AccordionTrigger>
                    <AccordionContent>
                      Consider seeing an audiologist if:
                      <ul className="list-disc pl-5 mt-2">
                        <li>You have difficulty hearing conversations, especially in noisy environments</li>
                        <li>You often ask people to repeat themselves</li>
                        <li>You experience ringing in your ears (tinnitus)</li>
                        <li>You have a family history of hearing loss</li>
                        <li>You&apos;re exposed to loud noises regularly at work or during leisure activities</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-4">
              <HelpCircle className="mr-2 h-4 w-4" />
              How to Interpret Your Results
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Interpreting Your Hearing Test Results</DialogTitle>
              <DialogDescription>
                Understanding what your test results mean can help you make informed decisions about your hearing health.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p>Your results show which frequencies you were able to hear during the test. Here&apos;s what they mean:</p>
              <ul className="list-disc pl-5">
                <li><strong>Excellent (All frequencies heard):</strong> Your hearing is functioning well across all tested frequencies.</li>
                <li><strong>Good (Most frequencies heard):</strong> You have good hearing, but may have slight difficulty with some high or low frequencies.</li>
                <li><strong>Fair (Some frequencies not heard):</strong> You may have mild hearing loss. Consider a professional evaluation.</li>
                <li><strong>Poor (Many frequencies not heard):</strong> This could indicate significant hearing loss. A professional evaluation is strongly recommended.</li>
              </ul>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => toast({ title: "Remember", description: "This online test is not a substitute for a professional hearing evaluation." })}>
                Understood
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HearingTestPage;