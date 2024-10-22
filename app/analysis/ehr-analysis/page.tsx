"use client";

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FaUser, FaHistory, FaPills, FaSyringe, FaFlask, FaHeartbeat, FaNotesMedical, FaCalendarAlt } from 'react-icons/fa'
import { format } from 'date-fns'

type EHRData = {
  patientInfo: {
    name: string;
    dob: Date;
    address: string;
    insurance: string;
    emergencyContact: string;
  };
  medicalHistory: {
    pastDiagnoses: string;
    surgeries: string;
    familyHistory: string;
  };
  medications: {
    current: string;
    allergies: string;
  };
  immunizations: string[];
  labResults: {
    bloodTests: string;
    imagingResults: string;
  };
  vitalSigns: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    weight: string;
  };
  progressNotes: string;
  carePlan: string;
  appointments: { date: Date; description: string }[];
};

const ElectronicHealthRecord = () => {
  const [activeTab, setActiveTab] = useState("patient-info")
  const [ehrData, setEhrData] = useState<EHRData>({
    patientInfo: {
      name: "",
      dob: new Date(),
      address: "",
      insurance: "",
      emergencyContact: ""
    },
    medicalHistory: {
      pastDiagnoses: "",
      surgeries: "",
      familyHistory: ""
    },
    medications: {
      current: "",
      allergies: ""
    },
    immunizations: [],
    labResults: {
      bloodTests: "",
      imagingResults: ""
    },
    vitalSigns: {
      bloodPressure: "",
      temperature: "",
      heartRate: "",
      weight: ""
    },
    progressNotes: "",
    carePlan: "",
    appointments: []
  })
  type ApiResponse = {
    patientSummary: string;
    riskAssessment: string;
    recommendedActions: string[];
  }
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);


  type EHRSection = keyof EHRData;
  
  const handleInputChange = (section: EHRSection, field: string, value: string | Date | boolean) => {
    setEhrData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value
      }
    }));
  }
  

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/analyze-ehr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ehrData),
      })
      const data = await response.json()
      setApiResponse(data)
    } catch (error) {
      console.error('Error submitting EHR data:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const tabContent = [
    { id: "patient-info", icon: FaUser, title: "Patient Info" },
    { id: "medical-history", icon: FaHistory, title: "Medical History" },
    { id: "medications", icon: FaPills, title: "Medications" },
    { id: "immunizations", icon: FaSyringe, title: "Immunizations" },
    { id: "lab-results", icon: FaFlask, title: "Lab Results" },
    { id: "vital-signs", icon: FaHeartbeat, title: "Vital Signs" },
    { id: "progress-notes", icon: FaNotesMedical, title: "Progress Notes" },
    { id: "appointments", icon: FaCalendarAlt, title: "Appointments" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="bg-blue-900 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Electronic Health Record</h1>
          <p className="mt-2">Comprehensive patient data management system</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Patient EHR</CardTitle>
            <CardDescription>Enter and manage patient health information</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 gap-2 mb-4">
                {tabContent.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="patient-info" className="mt-4 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={ehrData.patientInfo.name}
                            onChange={(e) => handleInputChange("patientInfo", "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline">
                                {ehrData.patientInfo.dob ? format(ehrData.patientInfo.dob, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={ehrData.patientInfo.dob}
                                onSelect={(date) => handleInputChange("patientInfo", "dob", date || new Date())}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={ehrData.patientInfo.address}
                          onChange={(e) => handleInputChange("patientInfo", "address", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="insurance">Insurance Details</Label>
                        <Input
                          id="insurance"
                          value={ehrData.patientInfo.insurance}
                          onChange={(e) => handleInputChange("patientInfo", "insurance", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergency-contact">Emergency Contact</Label>
                        <Input
                          id="emergency-contact"
                          value={ehrData.patientInfo.emergencyContact}
                          onChange={(e) => handleInputChange("patientInfo", "emergencyContact", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medical-history" className="mt-4 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Medical History</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="past-diagnoses">Past Diagnoses</Label>
                        <Textarea
                          id="past-diagnoses"
                          value={ehrData.medicalHistory.pastDiagnoses}
                          onChange={(e) => handleInputChange("medicalHistory", "pastDiagnoses", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="surgeries">Surgeries</Label>
                        <Textarea
                          id="surgeries"
                          value={ehrData.medicalHistory.surgeries}
                          onChange={(e) => handleInputChange("medicalHistory", "surgeries", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="family-history">Family Medical History</Label>
                        <Textarea
                          id="family-history"
                          value={ehrData.medicalHistory.familyHistory}
                          onChange={(e) => handleInputChange("medicalHistory", "familyHistory", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="medications" className="mt-4 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Medications</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-medications">Current Medications</Label>
                        <Textarea
                          id="current-medications"
                          value={ehrData.medications.current}
                          onChange={(e) => handleInputChange("medications", "current", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="allergies">Allergies and Adverse Reactions</Label>
                        <Textarea
                          id="allergies"
                          value={ehrData.medications.allergies}
                          onChange={(e) => handleInputChange("medications", "allergies", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="immunizations" className="mt-4 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Immunizations</h3>
                    <div className="space-y-4">
                      {["Influenza", "Tetanus", "Hepatitis B", "MMR"].map((vaccine) => (
                        <div key={vaccine} className="flex items-center space-x-2">
                          <Checkbox
                            id={vaccine}
                            checked={ehrData.immunizations.includes(vaccine)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setEhrData(prev => ({ ...prev, immunizations: [...prev.immunizations, vaccine] }))
                              } else {
                                setEhrData(prev => ({ ...prev, immunizations: prev.immunizations.filter(v => v !== vaccine) }))
                              }
                            }}
                          />
                          <label htmlFor={vaccine}>{vaccine}</label>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="lab-results" className="mt-4 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Lab Results</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="blood-tests">Blood Tests</Label>
                        <Textarea
                          id="blood-tests"
                          value={ehrData.labResults.bloodTests}
                          onChange={(e) => handleInputChange("labResults", "bloodTests", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="imaging-results">Imaging Results</Label>
                        <Textarea
                          id="imaging-results"
                          value={ehrData.labResults.imagingResults}
                          onChange={(e) => handleInputChange("labResults", "imagingResults", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="vital-signs" className="mt-4 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Vital Signs</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="blood-pressure">Blood Pressure</Label>
                        <Input
                          id="blood-pressure"
                          value={ehrData.vitalSigns.bloodPressure}
                          onChange={(e) => handleInputChange("vitalSigns", "bloodPressure", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="temperature">Temperature</Label>
                        <Input
                          id="temperature"
                          value={ehrData.vitalSigns.temperature}
                          onChange={(e) => handleInputChange("vitalSigns", "temperature", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="heart-rate">Heart Rate</Label>
                        <Input
                          id="heart-rate"
                          value={ehrData.vitalSigns.heartRate}
                          onChange={(e) => handleInputChange("vitalSigns", "heartRate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          value={ehrData.vitalSigns.weight}
                          onChange={(e) => handleInputChange("vitalSigns", "weight", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="progress-notes" className="mt-4 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Progress Notes</h3>
                    <div>
                      <Label  htmlFor="progress-notes">Doctor&apos;s Notes</Label>
                      <Textarea
                        id="progress-notes"
                        value={ehrData.progressNotes}
                        onChange={(e) => handleInputChange("progressNotes", "", e.target.value)}
                        className="min-h-[200px]"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="appointments" className="mt-4 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Appointments</h3>
                    <div className="space-y-4">
                      <Button onClick={() => {
                        const newAppointment = { date: new Date(), description: "Follow-up appointment" }
                        setEhrData(prev => ({ ...prev, appointments: [...prev.appointments, newAppointment] }))
                      }}>
                        Add Appointment
                      </Button>
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        {ehrData.appointments.map((appointment, index) => (
                          <div key={index} className="flex justify-between items-center mb-2">
                            <span>{format(appointment.date, "PPP")}</span>
                            <span>{appointment.description}</span>
                            <Button variant="destructive" size="sm" onClick={() => {
                              setEhrData(prev => ({
                                ...prev,
                                appointments: prev.appointments.filter((_, i) => i !== index)
                              }))
                            }}>
                              Cancel
                            </Button>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Submit EHR"}
            </Button>
          </CardFooter>
        </Card>

        {apiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Health Insights</CardTitle>
                <CardDescription>Based on the provided EHR data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Patient Summary</h4>
                    <p>{apiResponse.patientSummary}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Risk Assessment</h4>
                    <p>{apiResponse.riskAssessment}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Recommended Actions</h4>
                    <ul className="list-disc pl-5">
                      {apiResponse.recommendedActions.map((action: string, index: number) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <footer className="bg-blue-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 Electronic Health Record System. All rights reserved.</p>
          <p className="mt-2">
            Powered by advanced AI technology. For healthcare professional use only.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default ElectronicHealthRecord