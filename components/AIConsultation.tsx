"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Voice from "./Chat"

interface Note {
  id: number;
  text: string;
  timestamp: string;
}

export default function AIConsultation() {
  const [messages] = useState<{ text: string; isUser: boolean }[]>([])
  const [noteInput, setNoteInput] = useState("")
  const [notes, setNotes] = useState<Note[]>([])
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const botVideoRef = useRef<HTMLVideoElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream
          }
        })
        .catch(err => console.error("Error accessing camera:", err))
    }

    // Simulating bot video feed
    const botVideoElement = botVideoRef.current
    if (botVideoElement) {
      botVideoElement.src = "/placeholder.svg?height=300&width=400"
      botVideoElement.loop = true
      botVideoElement.muted = true
      botVideoElement.play()
    }
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  

  const handleAddNote = () => {
    if (noteInput.trim()) {
      const newNote: Note = {
        id: Date.now(),
        text: noteInput,
        timestamp: new Date().toLocaleString()
      }
      setNotes(prev => [...prev, newNote])
      setNoteInput("")
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Interactive AI Medical Consultation</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="w-full overflow-hidden">
            <CardHeader>
              <CardTitle>My Video</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-muted">
                <video 
                  ref={userVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
          <Card className="w-full overflow-hidden">
            <CardHeader>
              <CardTitle>Model Video</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-muted">
                <video 
                  ref={botVideoRef} 
                  autoPlay 
                  playsInline 
                  loop 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Chat with AI</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <ScrollArea className="h-[200px] w-full pr-4 mb-4">
                <div ref={chatContainerRef}>
                  {messages.map((msg, index) => (
                    <div key={index} className={`mb-4 ${msg.isUser ? "text-right" : "text-left"}`}>
                      <span 
                        className={`inline-block p-3 rounded-lg ${
                          msg.isUser 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        }`}
                      >
                        {msg.text}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-grow"
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div> */}
              <Voice />
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Type your note here..."
                className="min-h-[100px] mb-4"
              />
              <Button onClick={handleAddNote} className="mb-4">Add Note</Button>
              <ScrollArea className="h-[200px] w-full border rounded-md p-4">
                {notes.map((note) => (
                  <div key={note.id} className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">{note.timestamp}</p>
                    <p>{note.text}</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}