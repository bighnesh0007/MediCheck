import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Add type definitions for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Define a type for the window object with SpeechRecognition
type WindowWithSpeechRecognition = Window & {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
};

interface VoiceRecorderProps {
  onTextChange: (text: string) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTextChange, isRecording, setIsRecording }) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const windowWithSpeech = window as WindowWithSpeechRecognition;
    if (windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition) {
      const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result: SpeechRecognitionResult) => result[0].transcript)
            .join(' ');
          onTextChange(transcript);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionError) => {
          console.error('Speech recognition error:', event);
          setError(`Speech recognition error: ${event.error}`);
          setIsRecording(false);
        };
      }

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }
  }, [onTextChange, setIsRecording]);

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
      setError(null);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 z-20">
      <div className="flex justify-center space-x-4">
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={startRecording}
            disabled={isRecording}
            className={`bg-green-500 hover:bg-green-600 ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Mic className="mr-2" />
            Start Recording
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`bg-red-500 hover:bg-red-600 ${!isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <MicOff className="mr-2" />
            Stop Recording
          </Button>
        </motion.div>
      </div>
      {isRecording && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-red-500 font-semibold"
        >
          Recording...
        </motion.div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default VoiceRecorder;