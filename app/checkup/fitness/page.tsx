"use client";

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import {  Award, Dumbbell, Flame ,Star, Trophy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

const mockUserData = {
  name: "John Doe",
  points: 1250,
  level: "Silver",
  streakDays: 7,
  activities: [
    { date: '2023-06-01', steps: 8000, calories: 300, points: 80 },
    { date: '2023-06-02', steps: 10000, calories: 400, points: 100 },
    { date: '2023-06-03', steps: 7500, calories: 280, points: 75 },
    { date: '2023-06-04', steps: 12000, calories: 450, points: 120 },
    { date: '2023-06-05', steps: 9000, calories: 350, points: 90 },
  ],
  achievements: [
    { id: 1, name: "First Workout", icon: <Dumbbell className="h-6 w-6" /> },
    { id: 2, name: "7-Day Streak", icon: <Flame className="h-6 w-6" /> },
    { id: 3, name: "1000 Points", icon: <Star className="h-6 w-6" /> },
  ],
  bodyComposition: {
    weight: 70,
    bodyFat: 20,
    muscle: 40,
    water: 35,
    bone: 5,
  }
}

const leaderboard = [
  { rank: 1, name: "Sarah Johnson", points: 2500, avatar: "/avatar1.png" },
  { rank: 2, name: "Mike Thompson", points: 2300, avatar: "/avatar2.png" },
  { rank: 3, name: "Emily Davis", points: 2100, avatar: "/avatar3.png" },
  { rank: 4, name: "Chris Wilson", points: 1900, avatar: "/avatar4.png" },
  { rank: 5, name: "John Doe", points: 1250, avatar: "/avatar5.png" },
]

export default function FitnessPage() {
  const [userData, setUserData] = useState(mockUserData)
  const [showRewardDialog, setShowRewardDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulating points increase over time
    const interval = setInterval(() => {
      setUserData(prevData => ({
        ...prevData,
        points: prevData.points + 1
      }))
    }, 10000) // Increase points every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const activity = form.activity.value
    const duration = parseInt(form.duration.value)

    let pointsEarned = 0
    switch (activity) {
      case 'running':
        pointsEarned = duration * 2
        break
      case 'cycling':
        pointsEarned = duration * 1.5
        break
      case 'swimming':
        pointsEarned = duration * 3
        break
      default:
        pointsEarned = duration
    }

    setUserData(prevData => ({
      ...prevData,
      points: prevData.points + pointsEarned
    }))

    toast({
      title: "Activity Logged",
      description: `You earned ${pointsEarned} points for your ${activity} session!`,
    })

    form.reset()
  }

  const renderPointsAnimation = () => (
    <AnimatePresence>
      <motion.div
        key={userData.points}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-0 right-0 text-2xl font-bold text-green-500"
      >
        +1
      </motion.div>
    </AnimatePresence>
  )

  const renderActivityChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={userData.activities}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="steps" stroke="#8884d8" name="Steps" />
        <Line yAxisId="right" type="monotone" dataKey="calories" stroke="#82ca9d" name="Calories" />
      </LineChart>
    </ResponsiveContainer>
  )

  const renderBodyCompositionChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={Object.entries(userData.bodyComposition).map(([key, value]) => ({ name: key, value }))}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {Object.entries(userData.bodyComposition).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Fitness Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/avatar5.png" alt={userData.name} />
              <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{userData.name}</p>
              <p className="text-sm text-gray-500">{userData.level} Level</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold relative">
                {userData.points}
                {renderPointsAnimation()}
              </div>
              <Progress value={(userData.points % 1000) / 10} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {1000 - (userData.points % 1000)} points to next level
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.streakDays} days</div>
              <p className="text-xs text-muted-foreground mt-2">
                Keep it up for bonus points!
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Milestone</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gold Level</div>
              <p className="text-xs text-muted-foreground mt-2">
                750 points away
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderActivityChart()}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Body Composition</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderBodyCompositionChart()}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="activities">
            <Card>
              <CardHeader>
                <CardTitle>Log Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleActivitySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="activity">Activity Type</Label>
                      <Select name="activity" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="running">Running</SelectItem>
                          <SelectItem value="cycling">Cycling</SelectItem>
                          <SelectItem value="swimming">Swimming</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input type="number" name="duration" required min="1" />
                    </div>
                  </div>
                  <Button type="submit">Log Activity</Button>
                </form>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Steps</TableHead>
                      <TableHead>Calories</TableHead>
                      <TableHead>Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.activities.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell>{activity.date}</TableCell>
                        <TableCell>{activity.steps}</TableCell>
                        <TableCell>{activity.calories}</TableCell>
                        <TableCell>{activity.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {userData.achievements.map((achievement) => (
                    <Card key={achievement.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{achievement.name}</CardTitle>
                        {achievement.icon}
                      </CardHeader>
                      <CardContent>
                        <Badge>Unlocked</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle>Global Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.map((user) => (
                        <TableRow key={user.rank} className={user.name === userData.name ? "bg-muted" : ""}>
                          <TableCell className="font-medium">{user.rank}</TableCell>
                          <TableCell>
                            
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Congratulations!</DialogTitle>
              <DialogDescription>
                You&apos;ve earned a reward for your consistent efforts!
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <p className="text-center">You&apos;ve unlocked a personalized workout plan!</p>
            <DialogFooter>
              <Button onClick={() => setShowRewardDialog(false)}>Claim Reward</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}