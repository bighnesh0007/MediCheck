import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Input } from "@/components/ui/input"
import { Upload } from "lucide-react"

interface ImageUploaderProps {
  onFileSelect: (file: File) => void
}

export function ImageUploader({ onFileSelect }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag & drop an image here, or click to select one</p>
        )}
        <Upload className="mx-auto mt-2" />
      </div>
      <Input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0])
          }
        }}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}