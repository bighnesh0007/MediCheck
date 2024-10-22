"use client";

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IntroSection } from './IntroSection'
import { HowItWorksSection } from './HowltWorksSection'
import { BenefitsSection } from './BenefitsSection'
import { PersonalizedHealthReport } from './PersonalizedHealthReport'
import { TreatmentCustomizationTools } from './TreatmentCustomizationTools'
import { CaseStudies } from './CaseStudies'
import { EducationalResources } from './EducationalResources'
import { ConsultationSection } from './ConsultationSection'
import { BlogSection } from './BlogSection'
import { InteractiveElements } from './InteractiveElements'
import { PrivacySection } from './PrivacySection'
import { AIIntegration } from './Allntegration'

export default function PersonalizedMedicinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <ScrollArea className="h-screen">
        <div className="container mx-auto p-4 space-y-8">
          <IntroSection />
          
          <Tabs defaultValue="how-it-works" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
              <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="health-report">Health Report</TabsTrigger>
              <TabsTrigger value="treatment">Treatment</TabsTrigger>
              <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="how-it-works">
              <HowItWorksSection />
            </TabsContent>
            <TabsContent value="benefits">
              <BenefitsSection />
            </TabsContent>
            <TabsContent value="health-report">
              <PersonalizedHealthReport />
            </TabsContent>
            <TabsContent value="treatment">
              <TreatmentCustomizationTools />
            </TabsContent>
            <TabsContent value="case-studies">
              <CaseStudies />
            </TabsContent>
            <TabsContent value="resources">
              <EducationalResources />
            </TabsContent>
          </Tabs>

          <ConsultationSection />
          <BlogSection />
          <InteractiveElements />
          <PrivacySection />
          <AIIntegration />

          <footer className="text-center text-sm text-muted-foreground mt-8">
            <p>© 2023 Personalized Medicine Platform. All rights reserved.</p>
            <p>Disclaimer: This platform is for educational purposes only and should not be used for medical diagnosis.</p>
          </footer>
        </div>
      </ScrollArea>
    </div>
  )
}