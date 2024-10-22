import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export function PersonalizedHealthReport() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (file) {
      setIsLoading(true)
      // Simulating file upload and processing
      let uploadProgress = 0
      const interval = setInterval(() => {
        uploadProgress += 10
        setProgress(uploadProgress)
        if (uploadProgress >= 100) {
          clearInterval(interval)
          setIsLoading(false)
          alert("Your health report is ready!")
        }
      }, 500)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Health Report</CardTitle>
        <CardDescription>Upload your genetic data to get a preliminary health risk report</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="genetic-data">Genetic Data File</Label>
            <Input id="genetic-data" type="file" onChange={handleFileChange} />
          </div>
          {isLoading && <Progress value={progress} className="w-full mt-4" />}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={!file || isLoading}>
          {isLoading ? "Processing..." : "Generate Report"}
        </Button>
      </CardFooter>
    </Card>
  )
}