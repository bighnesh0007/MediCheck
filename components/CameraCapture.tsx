import React, { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Camera, Image as ImageIcon } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (file: File) => void
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      console.error('Unable to access camera', err)
    }
  }

  const handleCameraSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera_snapshot.jpg', { type: 'image/jpeg' })
          onCapture(file)
        }
      }, 'image/jpeg')
    }
  }

  return (
    <div className="space-y-4">
      <video ref={videoRef} className="w-full rounded-lg" />
      <div className="flex space-x-2">
        <Button onClick={handleCameraCapture} disabled={isStreaming}>
          <Camera className="mr-2 h-4 w-4" /> Start Camera
        </Button>
        <Button onClick={handleCameraSnapshot} disabled={!isStreaming}>
          <ImageIcon className="mr-2 h-4 w-4" /> Take Snapshot
        </Button>
      </div>
    </div>
  )
}