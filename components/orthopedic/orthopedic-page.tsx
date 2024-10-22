'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import Header from './header'
import TabNavigation from './tab-navigation'
import ContentArea from './content-area'
import { XrayDetectionForm } from './xray-upload'

export default function OrthopedicPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false)
  const [showSymptomChecker, setShowSymptomChecker] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    dob: "1980-01-01",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, Anytown, USA",
    emergencyContact: "Jane Doe - +1 (555) 987-6543"
  })

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header userName={userProfile.name} />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabNavigation />
        <TabsContent value={activeTab}>
          <ContentArea 
            activeTab={activeTab}
            showAppointmentDialog={showAppointmentDialog}
            setShowAppointmentDialog={setShowAppointmentDialog}
            showSymptomChecker={showSymptomChecker}
            setShowSymptomChecker={setShowSymptomChecker}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        </TabsContent>
      </Tabs>
      <XrayDetectionForm />
      <Toaster />
    </div>
  )
}