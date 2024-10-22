import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function InteractiveElements() {
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [weight, setWeight] = useState('')
  const [bloodPressure, setBloodPressure] = useState('')

  const handleQuizSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // In a real application, you would calculate the score based on the answers
    const calculatedScore = Math.floor(Math.random() * 100)
    setQuizScore(calculatedScore)
  }

  const handleHealthTrackerSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // In a real application, you would process this data and provide insights
    alert(`Data recorded: Weight: ${weight}, Blood Pressure: ${bloodPressure}`)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Is Personalized Medicine Right for You?</CardTitle>
          <CardDescription>Take this quick quiz to find out</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuizSubmit}>
            <div className="space-y-4">
              <div>
                <Label>Do you have a family history of genetic disorders?</Label>
                <RadioGroup defaultValue="no">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="family-history-yes" />
                    <Label htmlFor="family-history-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="family-history-no" />
                    <Label htmlFor="family-history-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>Are you interested in preventive healthcare?</Label>
                <RadioGroup defaultValue="yes">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="preventive-yes" />
                    <Label htmlFor="preventive-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="preventive-no" />
                    <Label htmlFor="preventive-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <Button type="submit" className="mt-4">Submit Quiz</Button>
          </form>
        </CardContent>
        {quizScore !== null && (
          <CardFooter>
            <p>Your personalized medicine suitability score: {quizScore}%</p>
          </CardFooter>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Tracker</CardTitle>
          <CardDescription>Log your health metrics for personalized insights</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleHealthTrackerSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blood-pressure">Blood Pressure (systolic/diastolic)</Label>
                <Input 
                  id="blood-pressure" 
                  placeholder="e.g., 120/80" 
                  value={bloodPressure} 
                  onChange={(e) => setBloodPressure(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="mt-4">Log Data</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}