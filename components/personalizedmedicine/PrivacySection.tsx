import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, FileCheck } from "lucide-react"

export function PrivacySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy and Data Security</CardTitle>
        <CardDescription>We take your genetic data privacy seriously</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <Shield className="w-12 h-12 mb-2 text-primary" />
            <h3 className="font-semibold">Data Protection</h3>
            <p className="text-sm text-muted-foreground">Your genetic data is encrypted and stored securely</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Lock className="w-12 h-12 mb-2 text-primary" />
            <h3 className="font-semibold">Access Control</h3>
            <p className="text-sm text-muted-foreground">Strict access controls ensure only authorized personnel can view your data</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FileCheck className="w-12 h-12 mb-2 text-primary" />
            <h3 className="font-semibold">Compliance</h3>
            <p className="text-sm text-muted-foreground">We adhere to HIPAA and other relevant data protection regulations</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}