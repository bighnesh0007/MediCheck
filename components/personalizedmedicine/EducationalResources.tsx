import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { BookOpen, Video, FileText } from "lucide-react"

export function EducationalResources() {
  const faqs = [
    {
      question: "What is pharmacogenomics?",
      answer: "Pharmacogenomics is the study of how genes affect a person's response to drugs. This relatively new field combines pharmacology (the science of drugs) and genomics (the study of genes and their functions) to develop effective, safe medications and doses that will be tailored to a person's genetic makeup."
    },
    {
      question: "How does CRISPR work in personalized medicine?",
      answer: "CRISPR (Clustered Regularly Interspaced Short Palindromic Repeats) is a gene-editing tool. In personalized medicine, CRISPR can potentially be used to correct disease-causing genetic mutations, offering new treatment possibilities for genetic disorders."
    },
    {
      question: "What is the future of precision health?",
      answer: "The future of precision health involves more comprehensive genetic testing, integration of wearable device data, AI-driven health predictions, and personalized treatment plans that consider an individual's genetics, lifestyle, and environment."
    }
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Educational Resources</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Introduction to Personalized Medicine
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0">
                  <BookOpen className="w-4 h-4 mr-2" />
                  The Role of Genetics in Healthcare
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0">
                  <Video className="w-4 h-4 mr-2" />
                  Personalized Medicine Explained
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0">
                  <Video className="w-4 h-4 mr-2" />
                  The Future of Healthcare
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Downloadable Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0">
                  <FileText className="w-4 h-4 mr-2" />
                  Personalized Medicine Guide (PDF)
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0">
                  <FileText className="w-4 h-4 mr-2" />
                  Genetic Testing FAQ (PDF)
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}