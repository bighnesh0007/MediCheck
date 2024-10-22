import React from 'react'
import { GynecologyMRIAdvancedDetectionForm } from '@/components/GynecologyMRIAdvancedDetectionForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {  AlertTriangle, ChevronRight } from 'lucide-react';


export default function GynecologyMRIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Gynecology MRI Detection</h1>
          <p className="text-xl text-muted-foreground">Advanced AI-powered analysis for gynecological conditions</p>
        </header>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            This tool is for informational purposes only and should not replace professional medical advice.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Image Analysis</CardTitle>
              <CardDescription>Upload and analyze MRI scans for potential abnormalities</CardDescription>
            </CardHeader>
            <CardContent>
              <GynecologyMRIAdvancedDetectionForm />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Gynecological Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <p className="text-sm text-muted-foreground">
                    MRI imaging plays a crucial role in diagnosing a variety of gynecological conditions, such as
                    uterine fibroids, ovarian cysts, and endometriosis. Early detection and precise diagnosis
                    are essential for effective treatment planning. This AI tool assists in identifying potential
                    abnormalities in MRI scans, aiding healthcare professionals in diagnosis.
                  </p>
                  <Separator className="my-4" />
                  <h4 className="font-semibold mb-2">Common Symptoms</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Pelvic pain</li>
                    <li>Abnormal bleeding</li>
                    <li>Pain during intercourse</li>
                    <li>Unexplained weight loss</li>
                    <li>Changes in menstruation</li>
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detection Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Accuracy</span>
                    <Badge variant="secondary">93%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Sensitivity</span>
                    <Badge variant="secondary">90%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Specificity</span>
                    <Badge variant="secondary">94%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="help">Help</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>How It Works</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Our AI model analyzes MRI scans using advanced deep learning techniques to detect potential
                      abnormalities such as ovarian cysts, fibroids, or signs of endometriosis.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle>Helpful Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                          Understanding Gynecological Conditions
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                          Prevention Tips
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                          Treatment Options
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="help">
                <Card>
                  <CardHeader>
                    <CardTitle>Need Assistance?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you need help using this tool or have questions about your results, please don`&apos;`t hesitate to
                      reach out.
                    </p>
                    <Button variant="outline">
                      Contact Support
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <footer className="text-center text-sm text-muted-foreground">
          <p>© 2023 Gynecology MRI Detection Tool. All rights reserved.</p>
          <p>Disclaimer: This tool is for educational purposes only and should not be used for medical diagnosis.</p>
        </footer>
      </div>
    </div>
  )
}
