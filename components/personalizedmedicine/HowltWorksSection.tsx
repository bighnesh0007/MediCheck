import React from 'react'
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card"
import { Dna, Brain, User } from "lucide-react"

export function HowItWorksSection() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <Dna className="w-10 h-10 mb-2 text-primary" />
          <CardTitle>Genomics & Genetics Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <p>DNA sequencing and genetic testing help understand a patient&apos;s risk for certain diseases and their likely response to treatments.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Brain className="w-10 h-10 mb-2 text-primary" />
          <CardTitle>Data-Driven Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p>AI and machine learning analyze patient data to suggest personalized treatments based on complex patterns and correlations.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <User className="w-10 h-10 mb-2 text-primary" />
          <CardTitle>Patient-Centric Approach</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Moving from one-size-fits-all treatments to customized therapies tailored to each individual&apos;s unique profile.</p>
        </CardContent>
      </Card>
    </div>
  )
}