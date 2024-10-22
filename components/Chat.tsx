"use client";
import { useState } from 'react';
import Head from 'next/head';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import VoiceRecorder from '@/components/VoiceRecorder';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export default function Voice() {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTextChange = (newText: string) => {
    setInputText(newText);
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const userMessage: Message = { role: 'user', content: inputText };
      setChatHistory(prev => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputText }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage: Message = { role: 'assistant', content: data.result };
        setChatHistory(prev => [...prev, assistantMessage]);

      } catch (error) {
        const errorMessage: Message = {
          role: 'error',
          content: error instanceof Error ? error.message : 'An unexpected error occurred.'
        };
        setChatHistory(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setInputText('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>Voice to Text Chat App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-center">Voice to Text Chat</h1>

        <div className="flex-grow bg-white rounded-lg shadow-md p-4 mb-4 overflow-y-auto" style={{ minHeight: '60vh', maxHeight: '60vh' }}>
          {chatHistory.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`mb-2 p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100 ml-auto' :
                message.role === 'assistant' ? 'bg-gray-100' : 'bg-red-100'
                } max-w-[80%]`}
            >
              {message.content}
            </motion.div>
          ))}
        </div>

        <div className="mt-4 z-10">
          <VoiceRecorder onTextChange={handleTextChange} isRecording={isRecording} setIsRecording={setIsRecording} />
        </div>

        <div className="flex space-x-2 mt-4 z-10">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isRecording ? "Speaking..." : "Type your message or click 'Start Recording'"}
            className="flex-grow"
            disabled={isRecording || isLoading}
            aria-label="Chat Input"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isRecording || isLoading || !inputText.trim()}
            aria-label="Send Message"
          >
            <Send size={20} />
          </Button>
        </div>
      </main>
    </div>
  );
}
