"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  FaHeadSideCough,
  FaTemperatureHigh,
  FaHeadSideVirus,
  FaLungs,
  FaArchway,
} from "react-icons/fa";

interface Condition {
  name: string;
  urgency: string;
  description: string;
}

interface ApiResponse {
  possibleConditions: Condition[];
  advice: string;
}

// Simulated Gemini API response with error handling
const simulateGeminiAPIResponse = async (symptoms: string[]): Promise<ApiResponse> => {
  if (symptoms.length === 0) throw new Error("No symptoms provided");
  
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    possibleConditions: [
      {
        name: "Common Cold",
        urgency: "Mild",
        description: "A viral infection causing a runny nose, sore throat, and mild fatigue.",
      },
      {
        name: "Influenza",
        urgency: "Moderate",
        description: "A viral infection causing fever, body aches, and severe fatigue.",
      },
      {
        name: "COVID-19",
        urgency: "Urgent",
        description: "A highly contagious respiratory illness caused by the SARS-CoV-2 virus.",
      },
    ],
    advice: "Monitor your symptoms. If they worsen or you develop difficulty breathing, seek immediate medical attention.",
  };
};

const SymptomChecker = () => {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState("");
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await simulateGeminiAPIResponse(selectedSymptoms);
      setResults(response);
      setStep(4); // Move to results step
    } catch (err) {
      console.error(err);
      setError("Failed to get data from API. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-blue-900 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Symptom Checker</h1>
          <p className="mt-2">
            Understand your symptoms and get guidance on potential conditions
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Check Your Symptoms</CardTitle>
            <CardDescription>
              Please provide information about your symptoms to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={`step-${step}`}
              onValueChange={(value) => setStep(parseInt(value.split("-")[1]))}
            >
              {/* Tabs List */}
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="step-1">Symptoms</TabsTrigger>
                <TabsTrigger value="step-2">Details</TabsTrigger>
                <TabsTrigger value="step-3">History</TabsTrigger>
                <TabsTrigger value="step-4">Results</TabsTrigger>
              </TabsList>

              {/* Step 1: Symptoms */}
              <TabsContent value="step-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Select Your Symptoms
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {["Headache", "Fever", "Cough", "Fatigue", "Nausea", "Sore Throat"].map(
                      (symptom) => (
                        <Button
                          key={symptom}
                          variant={
                            selectedSymptoms.includes(symptom)
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handleSymptomSelect(symptom)}
                          className="h-20 flex flex-col items-center justify-center"
                        >
                          {symptom === "Headache" && (
                            <FaHeadSideVirus className="h-6 w-6 mb-2" />
                          )}
                          {symptom === "Fever" && (
                            <FaTemperatureHigh className="h-6 w-6 mb-2" />
                          )}
                          {symptom === "Cough" && (
                            <FaHeadSideCough className="h-6 w-6 mb-2" />
                          )}
                          {symptom === "Fatigue" && (
                            <FaLungs className="h-6 w-6 mb-2" />
                          )}
                          {symptom === "Nausea" && (
                            <FaArchway className="h-6 w-6 mb-2" />
                          )}
                          {symptom === "Sore Throat" && (
                            <FaHeadSideCough className="h-6 w-6 mb-2" />
                          )}
                          {symptom}
                        </Button>
                      )
                    )}
                  </div>
                  <Button className="mt-6" onClick={() => setStep(2)}>
                    Next
                  </Button>
                </motion.div>
              </TabsContent>

              {/* Step 2: Details */}
              <TabsContent value="step-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Symptom Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="severity">Severity (1-10)</Label>
                      <Slider
                        id="severity"
                        min={1}
                        max={10}
                        step={1}
                        value={[severity]}
                        onValueChange={(value) => setSeverity(value[0])}
                        className="mt-2"
                      />
                      <span className="text-sm text-muted-foreground">
                        Selected: {severity}
                      </span>
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger id="duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="less-than-day">
                            Less than a day
                          </SelectItem>
                          <SelectItem value="1-3-days">1-3 days</SelectItem>
                          <SelectItem value="3-7-days">3-7 days</SelectItem>
                          <SelectItem value="more-than-week">
                            More than a week
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)}>Next</Button>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Step 3: History */}
              <TabsContent value="step-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-4">
                    Medical History
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="history">Select Medical History</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                        {["Diabetes", "Heart Disease", "Asthma"].map(
                          (condition) => (
                            <div key={condition} className="flex items-center">
                              <Checkbox
                                id={condition}
                                checked={medicalHistory.includes(condition)}
                                onCheckedChange={() =>
                                  setMedicalHistory((prev) =>
                                    prev.includes(condition)
                                      ? prev.filter((c) => c !== condition)
                                      : [...prev, condition]
                                  )
                                }
                              />
                              <Label
                                htmlFor={condition}
                                className="ml-2 cursor-pointer"
                              >
                                {condition}
                              </Label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? "Loading..." : "Submit"}
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Step 4: Results */}
              <TabsContent value="step-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Results</h3>
                  {isLoading && <Progress />}
                  {error && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {!isLoading && results && (
                    <Accordion type="single" collapsible>
                      {results.possibleConditions.map((condition, index) => (
                        <AccordionItem key={index} value={`condition-${index}`}>
                          <AccordionTrigger>
                            {condition.name} - {condition.urgency}
                          </AccordionTrigger>
                          <AccordionContent>
                            {condition.description}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SymptomChecker;
