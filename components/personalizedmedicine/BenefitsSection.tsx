import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react"

export function BenefitsSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Benefits of Personalized Medicine</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CheckCircle className="w-10 h-10 mb-2 text-green-500" />
            <CardTitle>Precision in Treatment</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Avoid unnecessary treatments and reduce adverse drug reactions by tailoring therapies to individual genetic profiles.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <AlertTriangle className="w-10 h-10 mb-2 text-yellow-500" />
            <CardTitle>Predictive Power</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Genetic testing can predict disease susceptibility, allowing for proactive and preventative care strategies.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <TrendingUp className="w-10 h-10 mb-2 text-blue-500" />
            <CardTitle>Improved Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Studies show personalized medicine can improve patient outcomes by up to 30% compared to traditional methods.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}