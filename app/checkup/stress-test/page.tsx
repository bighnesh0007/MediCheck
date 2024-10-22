"use client";

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {  Heart,  Video, Database, AlertTriangle, Activity } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StressManagementTest from '@/components/StressManagementTest'

// Types
interface TestConfig {
    patientDataRequests: number;
    telemedicineTraffic: number;
    medicalDeviceStreams: number;
    emergencyResponses: number;
}

interface TestResult {
    ehrResponseTime: number;
    telemedicineQuality: number;
    deviceDataProcessingRate: number;
    emergencyResponseTime: number;
    systemStability: number;
}

interface LeaderboardEntry {
    username: string;
    score: number;
    tests: number;
}

// Mock data generators
const generateMockMetrics = () => ({
    ehrLoad: Math.random() * 100,
    telemedicineQuality: Math.random() * 100,
    deviceDataRate: Math.random() * 1000,
    emergencyAlerts: Math.floor(Math.random() * 10),
    systemHealth: Math.random() * 100,
});

const generateMockLeaderboard = (): LeaderboardEntry[] => [
    { username: "DrDataMaster", score: 9500, tests: 50 },
    { username: "NurseAnalyzer", score: 8200, tests: 42 },
    { username: "TeleMedExpert", score: 7800, tests: 38 },
    { username: "EmergencyTester", score: 7200, tests: 35 },
    { username: "HealthTechGuru", score: 6500, tests: 30 },
];

const HealthcareStressTestPage: React.FC = () => {
    const { toast } = useToast();
    const [darkMode, setDarkMode] = useState(false);
    const [testConfig, setTestConfig] = useState<TestConfig>({
        patientDataRequests: 100,
        telemedicineTraffic: 50,
        medicalDeviceStreams: 200,
        emergencyResponses: 10,
    });
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [testResult, setTestResult] = useState<TestResult | null>(null);
    const [leaderboard] = useState<LeaderboardEntry[]>(generateMockLeaderboard());
    const [score, setScore] = useState(0);
    const [achievements, setAchievements] = useState<string[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(interval);
                        setIsRunning(false);
                        completeTest();
                        return 100;
                    }
                    return prevProgress + 1;
                });
            }, 200);

            return () => clearInterval(interval);
        }
    }, [isRunning]);

    const startTest = () => {
        setShowConfirmDialog(true);
    };

    const confirmStartTest = () => {
        setShowConfirmDialog(false);
        setIsRunning(true);
        setProgress(0);
        setTestResult(null);
        toast({
            title: "Test Started",
            description: "Healthcare system stress test is now running.",
        });
    };

    const stopTest = () => {
        setIsRunning(false);
        toast({
            title: "Test Stopped",
            description: "Healthcare system stress test has been stopped.",
            variant: "destructive",
        });
    };

    const completeTest = () => {
        const result: TestResult = {
            ehrResponseTime: Math.random() * 1000,
            telemedicineQuality: Math.random() * 100,
            deviceDataProcessingRate: Math.random() * 10000,
            emergencyResponseTime: Math.random() * 60,
            systemStability: Math.random() * 100,
        };
        setTestResult(result);
        updateScore();
        checkAchievements();
        toast({
            title: "Test Completed",
            description: "Healthcare system stress test results are ready.",
        });
    };

    const updateScore = () => {
        const newScore = Math.floor(
            (testConfig.patientDataRequests + testConfig.telemedicineTraffic * 2 +
                testConfig.medicalDeviceStreams + testConfig.emergencyResponses * 5) / 10
        );
        setScore((prevScore) => prevScore + newScore);
    };

    const checkAchievements = () => {
        const newAchievements = [...achievements];
        if (!achievements.includes("First Test")) {
            newAchievements.push("First Test");
        }
        if (testConfig.patientDataRequests >= 1000 && !achievements.includes("Data Surgeon")) {
            newAchievements.push("Data Surgeon");
        }
        if (testConfig.telemedicineTraffic >= 200 && !achievements.includes("Telemedicine Master")) {
            newAchievements.push("Telemedicine Master");
        }
        if (score > 10000 && !achievements.includes("Healthcare Tech Guru")) {
            newAchievements.push("Healthcare Tech Guru");
        }
        setAchievements(newAchievements);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className={`min-h-screen p-8 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Healthcare System Stress Test</h1>
                    <div className="flex items-center space-x-4">
                        <span>Dark Mode</span>
                        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                    </div>
                </header>

                <Tabs defaultValue="config" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="config">Configuration</TabsTrigger>
                        <TabsTrigger value="results">Results</TabsTrigger>
                        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                        <TabsTrigger value="stress-test">Stress Management Test</TabsTrigger>
                    </TabsList>

                    <TabsContent value="config">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Test Configuration</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block mb-2">Patient Data Requests</label>
                                            <Slider
                                                value={[testConfig.patientDataRequests]}
                                                onValueChange={(value) => setTestConfig({ ...testConfig, patientDataRequests: value[0] })}
                                                max={2000}
                                                step={10}
                                            />
                                            <span>{testConfig.patientDataRequests} requests/min</span>
                                        </div>
                                        <div>
                                            <label className="block mb-2">Telemedicine Traffic</label>
                                            <Slider
                                                value={[testConfig.telemedicineTraffic]}
                                                onValueChange={(value) => setTestConfig({ ...testConfig, telemedicineTraffic: value[0] })}
                                                max={500}
                                                step={5}
                                            />
                                            <span>{testConfig.telemedicineTraffic} concurrent sessions</span>
                                        </div>
                                        <div>
                                            <label className="block mb-2">Medical Device Streams</label>
                                            <Slider
                                                value={[testConfig.medicalDeviceStreams]}
                                                onValueChange={(value) => setTestConfig({ ...testConfig, medicalDeviceStreams: value[0] })}
                                                max={1000}
                                                step={10}
                                            />
                                            <span>{testConfig.medicalDeviceStreams} active streams</span>
                                        </div>
                                        <div>
                                            <label className="block mb-2">Emergency Responses</label>
                                            <Slider
                                                value={[testConfig.emergencyResponses]}
                                                onValueChange={(value) => setTestConfig({ ...testConfig, emergencyResponses: value[0] })}
                                                max={50}
                                                step={1}
                                            />
                                            <span>{testConfig.emergencyResponses} simultaneous alerts</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Test Control</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <Button onClick={startTest} disabled={isRunning}>
                                                <Activity className="mr-2 h-4 w-4" /> Start Test
                                            </Button>
                                            <Button onClick={stopTest} disabled={!isRunning} variant="destructive">
                                                <AlertTriangle className="mr-2 h-4 w-4" /> Stop Test
                                            </Button>
                                        </div>
                                        <Progress value={progress} className="w-full" />
                                        <p>Progress: {Math.round(progress)}%</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Real-Time Metrics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={[...Array(10)].map((_, i) => ({ name: i, ...generateMockMetrics() }))}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="ehrLoad" stroke="#8884d8" name="EHR Load" />
                                            <Line type="monotone" dataKey="telemedicineQuality" stroke="#82ca9d" name="Telemedicine Quality" />
                                            <Line type="monotone" dataKey="deviceDataRate" stroke="#ffc658" name="Device Data Rate" />
                                            <Line type="monotone" dataKey="emergencyAlerts" stroke="#ff8042" name="Emergency Alerts" />
                                            <Line type="monotone" dataKey="systemHealth" stroke="#0088FE" name="System Health" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="results">
                        <Card>
                            <CardHeader>
                                <CardTitle>Test Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {testResult ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        <div className="text-center">
                                            <Database className="mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{testResult.ehrResponseTime.toFixed(2)}ms</p>
                                            <p>EHR Response Time</p>
                                        </div>
                                        <div className="text-center">
                                            <Video className="mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{testResult.telemedicineQuality.toFixed(2)}%</p>
                                            <p>Telemedicine Quality</p>
                                        </div>
                                        <div className="text-center">
                                            <Activity className="mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{testResult.deviceDataProcessingRate.toFixed(2)}/s</p>
                                            <p>Device Data Processing</p>
                                        </div>
                                        <div className="text-center">
                                            <AlertTriangle className="mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{testResult.emergencyResponseTime.toFixed(2)}s</p>
                                            <p>Emergency Response Time</p>
                                        </div>
                                        <div className="text-center">
                                            <Heart className="mx-auto mb-2" />
                                            <p className="text-2xl font-bold">{testResult.systemStability.toFixed(2)}%</p>
                                            <p>System Stability</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p>No test results available yet. Run a test to see results here.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="leaderboard">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Leaderboard</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Rank</TableHead>
                                                <TableHead>Username</TableHead>
                                                <TableHead>Score</TableHead>
                                                <TableHead>Tests</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {leaderboard.map((entry, index) => (
                                                <TableRow key={entry.username}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{entry.username}</TableCell>
                                                    <TableCell>{entry.score}</TableCell>
                                                    <TableCell>{entry.tests}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Performance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-2xl font-bold">{score}</p>
                                            <p>Total Score</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Achievements</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {achievements.map((achievement) => (
                                                    <Badge key={achievement} variant="secondary">
                                                        {achievement}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="stress-test">
                        <Card>
                            <CardHeader>
                                <CardTitle>Stress Management Test</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <StressManagementTest />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Test Start</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to start the Healthcare System Stress Test with the current configuration?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
                            <Button onClick={confirmStartTest}>Start Test</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div >
    );
};

export default HealthcareStressTestPage;