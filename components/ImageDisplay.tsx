import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageDisplayProps {
  previewUrl: string | null
  processedImageUrl: string | null
}

export function ImageDisplay({ previewUrl, processedImageUrl }: ImageDisplayProps) {
  return (
    <>
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 w-full"
          >
            <h2 className="text-xl font-semibold mb-2">Uploaded Image:</h2>
            <img src={previewUrl} alt="Uploaded image" className="max-w-full h-auto rounded-lg shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {processedImageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 w-full"
          >
            <h2 className="text-xl font-semibold mb-2">Processed Image with Detections:</h2>
            <img src={processedImageUrl} alt="Processed image" className="max-w-full h-auto rounded-lg shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}