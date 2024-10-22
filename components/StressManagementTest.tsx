import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent,  CardFooter, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Smile, Meh, Frown } from 'lucide-react'

const questions = [
  "In the last month, how often have you been upset because of something that happened unexpectedly?",
  "In the last month, how often have you felt that you were unable to control the important things in your life?",
  "In the last month, how often have you felt nervous and stressed?",
  "In the last month, how often have you felt confident about your ability to handle your personal problems?",
  "In the last month, how often have you felt that things were going your way?",
  "In the last month, how often have you found that you could not cope with all the things that you had to do?",
  "In the last month, how often have you been able to control irritations in your life?",
  "In the last month, how often have you felt that you were on top of things?",
  "In the last month, how often have you been angered because of things that happened that were outside of your control?",
  "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
]

const options = [
  { value: 0, label: "Never" },
  { value: 1, label: "Almost Never" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Fairly Often" },
  { value: 4, label: "Very Often" }
]

export default function StressManagementTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const [showTips, setShowTips] = useState(false)

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    return answers.reduce((sum, answer) => sum + answer, 0)
  }

  const getStressLevel = (score: number) => {
    if (score <= 13) return "Low Stress"
    if (score <= 26) return "Moderate Stress"
    return "High Stress"
  }

  const getStressIcon = (score: number) => {
    if (score <= 13) return <Smile className="w-8 h-8 text-green-500" />
    if (score <= 26) return <Meh className="w-8 h-8 text-yellow-500" />
    return <Frown className="w-8 h-8 text-red-500" />
  }

  const restartTest = () => {
    setCurrentQuestion(0)
    setAnswers(new Array(questions.length).fill(-1))
    setShowResults(false)
    setShowTips(false)
  }

  const renderQuestion = () => (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
    >
      <CardHeader>
        {/* <Title className="text-2xl font-bold">Question {currentQuestion + 1}</Title> */}
      </CardHeader>
      <CardContent>
        <p className="mb-4">{questions[currentQuestion]}</p>
        <RadioGroup onValueChange={(value) => handleAnswer(Number(value))}>
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value.toString()} id={`q${currentQuestion}-${option.value}`} />
              <Label htmlFor={`q${currentQuestion}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </motion.div>
  )

  const renderResults = () => {
    const score = calculateScore()
    const stressLevel = getStressLevel(score)

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        <CardHeader>
          {/* <Title className="text-2xl font-bold">Your Stress Assessment Results</Title> */}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            {getStressIcon(score)}
            <span className="text-3xl font-bold ml-2">{stressLevel}</span>
          </div>
          <Progress value={(score / 40) * 100} className="w-full mb-4" />
          <p className="text-center mb-4">Your score: {score} out of 40</p>
          <p className="text-center mb-4">
            {stressLevel === "Low Stress" && "Your stress levels appear to be well-managed. Keep up the good work!"}
            {stressLevel === "Moderate Stress" && "You're experiencing some stress. Consider implementing stress-reduction techniques."}
            {stressLevel === "High Stress" && "Your stress levels are high. It's recommended to seek support and implement stress management strategies."}
          </p>
          <Button onClick={() => setShowTips(true)} className="w-full">View Stress Management Tips</Button>
        </CardContent>
        <CardFooter>
          <Button onClick={restartTest} variant="outline" className="w-full">Retake Test</Button>
        </CardFooter>
      </motion.div>
    )
  }

  const renderTips = () => (
    <Dialog open={showTips} onOpenChange={setShowTips}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stress Management Tips</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <ul className="list-disc pl-5 space-y-2">
            <li>Practice deep breathing exercises</li>
            <li>Engage in regular physical activity</li>
            <li>Maintain a healthy sleep schedule</li>
            <li>Practice mindfulness or meditation</li>
            <li>Connect with friends and family</li>
            <li>Limit caffeine and alcohol intake</li>
            <li>Seek professional help if needed</li>
          </ul>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => setShowTips(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <Card className="w-full max-w-lg mx-auto">
      {!showResults ? renderQuestion() : renderResults()}
      {renderTips()}
      <CardFooter>
        <Progress value={(currentQuestion / questions.length) * 100} className="w-full" />
      </CardFooter>
    </Card>
  )
}