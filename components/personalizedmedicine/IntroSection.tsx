import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function IntroSection() {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold">Personalized Medicine</CardTitle>
        <CardDescription className="text-xl">Tailoring treatment to you</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-4">
          <p className="text-lg">
            Personalized medicine is an innovative approach that tailors medical treatment to the individual characteristics of each patient. It takes into account genetic makeup, lifestyle, and environmental factors to create targeted and effective healthcare strategies.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Genetics</Badge>
            <Badge variant="secondary">AI-Driven</Badge>
            <Badge variant="secondary">Patient-Centric</Badge>
            <Badge variant="secondary">Precision Healthcare</Badge>
          </div>
        </div>
        <div className="md:w-1/2 mt-4 md:mt-0 rounded-full">
          <img src="https://www.shutterstock.com/image-vector/personalized-precision-medicine-optimal-therapy-260nw-2422271431.jpg" alt="Personalized Medicine Illustration" className="rounded-3xl shadow-lg" />
        </div>
      </CardContent>
    </Card>
  )
}