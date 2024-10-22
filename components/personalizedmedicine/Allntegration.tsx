import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AIIntegration() {
  const [healthData, setHealthData] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleHealthDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulating AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    setAiResponse("Based on the provided health data, you have a 15% risk of developing cardiovascular disease in the next 10 years. It's recommended to maintain a healthy diet, exercise regularly, and consult with your healthcare provider for personalized advice.")
    setIsLoading(false)
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulating AI response
    await new Promise(resolve => setTimeout(resolve, 1500))
    setAiResponse(`Here's some information about ${chatMessage}: Personalized medicine takes into account individual variability in genes, environment, and lifestyle for each person. This approach allows doctors and researchers to predict more accurately which treatment and prevention strategies for a particular disease will work in which groups of people.`)
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>AI-Powered Health Insights</CardTitle>
        <CardDescription>Get personalized health analysis and answers to your questions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="health-analysis">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="health-analysis">Predictive Health Analysis</TabsTrigger>
            <TabsTrigger value="chatbot">Ask AI Assistant</TabsTrigger>
          </TabsList>
          <TabsContent value="health-analysis">
            <form onSubmit={handleHealthDataSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="health-data">Enter your health data</Label>
                <Textarea
                  id="health-data"
                  placeholder="Age: 35, Gender: Female, BMI: 24, Blood Pressure: 120/80, Cholesterol: 180..."
                  value={healthData}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setHealthData(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Analyze Health Data"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="chatbot">
            <form onSubmit={handleChatSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chat-message">Ask a question about personalized medicine</Label>
                <Input
                  id="chat-message"
                  placeholder="e.g., What is pharmacogenomics?"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Send Question"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        {aiResponse && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>AI Response</AlertTitle>
            <AlertDescription>{aiResponse}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  )
}