import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CaseStudies() {
  const caseStudies = [
    {
      title: "Targeted Cancer Treatment",
      description: "A patient with a rare form of lung cancer received a personalized treatment plan based on their genetic profile, resulting in complete remission.",
      outcome: "Complete Remission",
    },
    {
      title: "Preventive Care Success",
      description: "Genetic testing revealed a high risk for type 2 diabetes. Personalized lifestyle interventions prevented the onset of the disease.",
      outcome: "Disease Prevention",
    },
    {
      title: "Pharmacogenomic Victory",
      description: "A patient suffering from depression found the right medication quickly through genetic testing, avoiding months of trial and error.",
      outcome: "Rapid Treatment Success",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Case Studies & Success Stories</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {caseStudies.map((study, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{study.title}</CardTitle>
              <CardDescription>{study.description}</CardDescription>
            </CardHeader>
            <CardContent>
              
              <Badge variant="secondary">{study.outcome}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}