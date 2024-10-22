import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ConsultationSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a Consultation</CardTitle>
        <CardDescription>Book an appointment with a genetic counselor or healthcare provider specializing in personalized medicine</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your full name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Your email address" type="email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="consultation-type">Consultation Type</Label>
              <Select>
                <SelectTrigger id="consultation-type">
                  <SelectValue placeholder="Select consultation type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="genetic-counseling">Genetic Counseling</SelectItem>
                  <SelectItem value="personalized-treatment">Personalized Treatment Plan</SelectItem>
                  <SelectItem value="risk-assessment">Genetic Risk Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button>Schedule Consultation</Button>
      </CardFooter>
    </Card>
  )
}