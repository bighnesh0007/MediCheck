import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function TreatmentCustomizationTools() {
  return (
    <Tabs defaultValue="medication" className="w-full">
      <TabsList>
        <TabsTrigger value="medication">Medication Compatibility</TabsTrigger>
        <TabsTrigger value="lifestyle">Nutrition & Lifestyle</TabsTrigger>
      </TabsList>
      <TabsContent value="medication">
        <Card>
          <CardHeader>
            <CardTitle>Medication Compatibility Checker</CardTitle>
            <CardDescription>Check how you may respond to certain medications based on your genetic profile</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medication">Medication Name</Label>
                <Input id="medication" placeholder="Enter medication name" />
              </div>
              <Button type="submit">Check Compatibility</Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="lifestyle">
        <Card>
          <CardHeader>
            <CardTitle>Nutrition & Lifestyle Planner</CardTitle>
            <CardDescription>Get personalized dietary plans and lifestyle adjustments based on your genetic data</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Health Goal</Label>
                <Input id="goal" placeholder="e.g., Weight loss, Muscle gain, etc." />
              </div>
              <Button type="submit">Generate Plan</Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}