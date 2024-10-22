'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Activity, 
  Stethoscope, 
  Brain, 
  FileText, 
  Image as ImageIcon, 
  TestTube as Flask, 
  Video, 
  Fingerprint, 
  Menu,
  
  Eye,
  Ear,
  Thermometer,
  Scale,
  Zap,
  Microscope,
  Droplet,
} from 'lucide-react'
import { FaBone, FaLungs, FaEye, FaTooth } from 'react-icons/fa'
import { GiMedicines, GiLiver } from 'react-icons/gi'
import { RiMentalHealthLine } from 'react-icons/ri'
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const sidebarOptions = [
  {
    name: 'Medical Checkups',
    icon: Stethoscope,
    items: [
      { name: 'Orthopedic', icon: FaBone, href: '/checkup/orthopedic' },
      { name: 'Vision', icon: Eye, href: '/checkup/vision' },
      { name: 'Hearing', icon: Ear, href: '/checkup/hearing' },
      { name: 'Fitness Assessment', icon: Activity, href: '/checkup/fitness' },
      { name: 'Body Temperature', icon: Thermometer, href: '/checkup/temperature' },
      { name: 'Body Composition', icon: Scale, href: '/checkup/body-composition' },
      { name: 'Stress Test', icon: Zap, href: '/checkup/stress-test' },
    ]
  },
  {
    name: 'AI Diagnostics',
    icon: Microscope,
    items: [
      { name: 'Brain Tumor Detection', icon: Brain, href: '/ai-diagnostics/brain-tumor' },
      { name: 'Lung Cancer Detection', icon: FaLungs, href: '/ai-diagnostics/lung-cancer' },
      { name: 'Liver Disease', icon: GiLiver, href: '/ai-diagnostics/liver-disease' },
      { name: 'Gynecology MRI Analysis', icon: RiMentalHealthLine, href: '/ai-diagnostics/gynecology-mri' },
      { name: 'Eye Conjunctiva Detector', icon: FaEye, href: '/ai-diagnostics/eye-conjunctiva' },
      { name: 'Cavity Detection', icon: FaTooth, href: '/ai-diagnostics/cavity' },
      { name: 'Drugs Detection', icon: GiMedicines, href: '/ai-diagnostics/drugs' },
    ]
  },
  {
    name: 'Health Analysis',
    icon: FileText,
    items: [
      { name: 'Symptom Checker', icon: Stethoscope, href: '/analysis/symptom-checker' },
      { name: 'EHR Analysis', icon: FileText, href: '/analysis/ehr-analysis' },
    ]
  },
  {
    name: 'Imaging Analysis',
    icon: ImageIcon,
    items: [
      { name: 'Fracture Detection', icon: FaBone, href: '/imaging/fracture-detection' },
      { name: 'Osteoporosis Screening', icon: FaBone, href: '/imaging/osteoporosis' },
    ]
  },
  {
    name: 'Pathology',
    icon: Flask,
    items: [
      { name: 'Blood Analysis', icon: Droplet, href: '/pathology/blood-analysis' },
    ]
  },
  {
    name: 'Telemedicine',
    icon: Video,
    items: [
      { name: 'Virtual Health Assistant', icon: Video, href: '/telemedicine/virtual-assistant' },
    ]
  },
  {
    name: 'Personalized Medicine',
    icon: Fingerprint,
    href: '/personalized-medicine'
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        className="fixed top-4 left-4 z-50 md:hidden bg-primary/10 text-primary hover:bg-primary/20 focus:ring-2 focus:ring-primary/50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <aside 
        className={`
          w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
          overflow-y-auto flex-shrink-0 border-r border-border
          transition-all duration-300 ease-in-out
          fixed inset-y-0 left-0 z-40 
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static
        `}
      >
        <nav className="p-4 space-y-4">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            AI Health Services
          </h2>
          <Accordion type="multiple" className="w-full space-y-2">
            {sidebarOptions.map((option, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-none">
                <AccordionTrigger className="hover:no-underline py-2 px-3 rounded-md transition-colors hover:bg-muted">
                  <div className="flex items-center text-foreground">
                    {option.icon && <option.icon className="mr-2 h-5 w-5 text-primary" />}
                    <span className="text-sm font-medium">{option.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {option.items ? (
                    <ul className="ml-6 space-y-1 mt-1">
                      {option.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link 
                            href={item.href}
                            className={`flex items-center py-2 px-3 rounded-md transition-colors text-sm
                              ${pathname === item.href 
                                ? 'bg-primary/10 text-primary font-medium' 
                                : 'text-muted-foreground hover:bg-muted'
                              }`}
                          >
                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Link 
                      href={option.href}
                      className={`flex items-center py-2 px-3 rounded-md transition-colors text-sm ml-6
                        ${pathname === option.href 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-muted-foreground hover:bg-muted'
                        }`}
                    >
                      <span>{option.name}</span>
                    </Link>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
      </aside>
    </>
  )
}