import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function BlogSection() {
  const blogPosts = [
    {
      title: "The Future of CRISPR in Personalized Medicine",
      description: "Exploring the potential applications of gene editing in tailored treatments.",
      date: "2023-06-15",
      category: "Technology",
    },
    {
      title: "AI's Role in Advancing Precision Healthcare",
      description: "How machine learning is revolutionizing patient care and treatment plans.",
      date: "2023-06-10",
      category: "AI & Healthcare",
    },
    {
      title: "Ethical Considerations in Genetic Testing",
      description: "Navigating the complex landscape of privacy and consent in the genomic era.",
      date: "2023-06-05",
      category: "Ethics",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Latest from Our Blog</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {blogPosts.map((post, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{post.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge>{post.category}</Badge>
              <p className="text-sm text-muted-foreground mt-2">{post.date}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Read More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}