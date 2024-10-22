'use client'

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Upload, Camera,  Zap, RotateCcw, Info, Save, Share2, Download, Maximize2, ChevronLeft, ChevronRight } from "lucide-react"

interface Model {
  id: string
  name: string
  endpoint: string
  description: string
}
interface Prediction {
  class: string
  confidence: number
  x: number
  y: number
  width: number
  height: number
}

const models: Model[] = [
  { 
    id: 'Liver_Disease_1', 
    name: 'Liver Disease 1', 
    endpoint: 'https://detect.roboflow.com/liver-disease/1',
    description: 'Detects Liver Disease in MRI scans'
  },
  { 
    id: 'Liver_Disease_2', 
    name: 'Liver Disease 2', 
    endpoint: 'https://detect.roboflow.com/liver-disease-7phpx/2',
    description: 'Detects Liver Disease in MRI scans'
  },
  { 
    id: 'Liver_Disease_3', 
    name: 'Liver Disease 3', 
    endpoint: 'https://detect.roboflow.com/my_liver_dieases/4',
    description: 'Detects Liver Disease in MRI scans'
  }
 
]

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 50%)`
}

export function LiverDiseaseAdvancedDetectionForm() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [selectedModel, setSelectedModel] = useState<string>(models[0].id)
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5)
  const [detectionResults, setDetectionResults] = useState<Prediction[]>([])
  const [showComparison, setShowComparison] = useState<boolean>(false)
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'overlay'>('side-by-side')
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.5)
  const [imageHistory, setImageHistory] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [annotations, setAnnotations] = useState<string>('')
  const [showGrid, setShowGrid] = useState<boolean>(false)
  const [gridSize, setGridSize] = useState<number>(50)
  const [autoDetect, setAutoDetect] = useState<boolean>(false)
  const fullscreenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(darkModePreference)
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
      console.log('fullscreen change'+isFullscreen);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const onDrop = (acceptedFiles: File[]) => {
    handleFileSelection(acceptedFiles[0])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile)
    const imageUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(imageUrl)
    setProcessedImageUrl(null)
    setError(null)
    setDetectionResults([])
    setImageHistory(prev => [...prev, imageUrl])
    setCurrentImageIndex(prev => prev + 1)
    if (autoDetect) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)
    setError(null)
    setProgress(0)
    setDetectionResults([])

    try {
      const base64Image = await fileToBase64(file)
      const selectedModelEndpoint = models.find(m => m.id === selectedModel)?.endpoint

      if (!selectedModelEndpoint) {
        throw new Error('Invalid model selected')
      }

      const response = await axios({
        method: 'POST',
        url: selectedModelEndpoint,
        params: {
          api_key: process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY
        },
        data: base64Image,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1))
          setProgress(percentCompleted)
        },
      })

      const predictions = response.data.predictions.filter((pred: Prediction) => pred.confidence >= confidenceThreshold)
      setDetectionResults(predictions)

      const processedImageDataUrl = await processImage(file, predictions)
      setProcessedImageUrl(processedImageDataUrl)
      setImageHistory(prev => [...prev, processedImageDataUrl])
      setCurrentImageIndex(prev => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the image')
      setProcessedImageUrl(null)
    } finally {
      setIsLoading(false)
    }
  }

  const processImage = async (file: File, predictions: Prediction[]): Promise<string> => {
    const img = await createImageBitmap(file)
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Could not get canvas context')

    ctx.drawImage(img, 0, 0, img.width, img.height)

    const colorMap = new Map<string, string>()

    ctx.lineWidth = 2
    ctx.font = '14px Arial'

    predictions.forEach(pred => {
      if (!colorMap.has(pred.class)) {
        colorMap.set(pred.class, getRandomColor())
      }
      const color = colorMap.get(pred.class) || 'white'

      ctx.strokeStyle = color
      ctx.fillStyle = color

      ctx.beginPath()
      ctx.rect(pred.x - pred.width / 2, pred.y - pred.height / 2, pred.width, pred.height)
      ctx.stroke()

      const label = `${pred.class} ${(pred.confidence * 100).toFixed(1)}%`
      const labelWidth = ctx.measureText(label).width

      ctx.fillStyle = color
      ctx.globalAlpha = 0.7
      ctx.fillRect(
        pred.x - pred.width / 2, 
        pred.y - pred.height / 2 - 20, 
        labelWidth + 10, 
        20
      )

      ctx.globalAlpha = 1
      ctx.fillStyle = 'white'
      ctx.fillText(
        label, 
        pred.x - pred.width / 2 + 5, 
        pred.y - pred.height / 2 - 5
      )
    })

    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    return canvas.toDataURL('image/png')
  }

  const handleReset = () => {
    setFile(null)
    setPreviewUrl(null)
    setProcessedImageUrl(null)
    setError(null)
    setProgress(0)
    setDetectionResults([])
    setAnnotations('')
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const video = document.createElement('video')
      video.srcObject = stream
      await video.play()

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d')?.drawImage(video, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera_capture.jpg', { type: 'image/jpeg' })
          handleFileSelection(file)
        }
      }, 'image/jpeg')

      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      console.error(err)
      setError('Unable to access camera')
    }
  }

  const handleSaveImage = () => {
    if (processedImageUrl) {
      const link = document.createElement('a')
      link.href = processedImageUrl
      link.download = 'processed_image.png'
      link.click()
    }
  }

  const handleShareImage = () => {
    if (processedImageUrl && navigator.share) {
      navigator.share({
        title: 'Processed Medical Image',
        text: 'Check out this processed medical image!',
        url: processedImageUrl
      }).catch((error) => console.log('Error sharing', error))
    } else {
      alert('Sharing is not supported on this device')
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  const handleNextImage = () => {
    if (currentImageIndex < imageHistory.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? '' : ''}`}>
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                Advanced Medical Image Analysis
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch
                      id="dark-mode"
                      checked={isDarkMode}
                      onCheckedChange={setIsDarkMode}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle {isDarkMode ? 'Light' : 'Dark'} Mode</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      
                      <Info className="text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{models.find(m => m.id === selectedModel)?.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confidence-threshold">Confidence Threshold: {confidenceThreshold.toFixed(2)}</Label>
                <Slider
                  id="confidence-threshold"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[confidenceThreshold]}
                  onValueChange={([value]) => setConfidenceThreshold(value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-detect"
                  checked={autoDetect}
                  onCheckedChange={(checked) => setAutoDetect(checked as boolean)}
                />
                <Label htmlFor="auto-detect">Auto-detect on image upload</Label>
              </div>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="camera">Camera</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-primary' : 'border-gray-300'
                      }`}
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p className="text-lg">Drop the image here ...</p>
                      ) : (
                        <div>
                          <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                          <p className="text-lg">Drag & drop an image here, or click to select one</p>
                          <p className="text-sm text-gray-500 mt-2">Supported formats: JPEG, PNG, DICOM</p>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={!file || isLoading} className="flex-1">
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" /> Analyze Image
                          </>
                        )}
                      </Button>
                      <Button type="button" onClick={handleReset} variant="outline" className="flex-1">
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="camera">
                  <div className="space-y-4">
                    <Button onClick={handleCameraCapture} className="w-full">
                      <Camera className="mr-2 h-4 w-4" /> Capture Image
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full"
                >
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            {isLoading && (
              <div className="w-full mb-4">
                <Progress value={progress} className="w-full" />
              </div>
            )}
            <AnimatePresence>
              {(previewUrl || processedImageUrl) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-full space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Image Analysis</h2>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)}>
                        {showComparison ? 'Hide' : 'Show'} Comparison
                      </Button>
                      <Select value={comparisonMode} onValueChange={(value: 'side-by-side' | 'overlay') => setComparisonMode(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Comparison Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="side-by-side">Side by Side</SelectItem>
                          <SelectItem value="overlay">Overlay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div ref={fullscreenRef} className="relative">
                    {comparisonMode === 'side-by-side' && (
                      <div className="grid grid-cols-2 gap-4">
                        {previewUrl && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Original Image:</h3>
                            <img src={previewUrl} alt="Original" className="w-full h-auto rounded-lg shadow-lg" />
                          </div>
                        )}
                        {processedImageUrl && (
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Analyzed Image:</h3>
                            <img src={processedImageUrl} alt="Analyzed" className="w-full h-auto rounded-lg shadow-lg" />
                          </div>
                        )}
                      </div>
                    )}
                    {comparisonMode === 'overlay' && (
                      <div className="relative">
                        {previewUrl && (
                          <img src={previewUrl} alt="Original" className="w-full h-auto rounded-lg shadow-lg" />
                        )}
                        {processedImageUrl && (
                          <img 
                            src={processedImageUrl} 
                            alt="Analyzed" 
                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                            style={{ opacity: overlayOpacity }}
                          />
                        )}
                        <Slider
                          min={0}
                          max={1}
                          step={0.01}
                          value={[overlayOpacity]}
                          onValueChange={([value]) => setOverlayOpacity(value)}
                          className="absolute bottom-4 left-4 right-4"
                        />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handlePreviousImage} disabled={currentImageIndex === 0}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleNextImage} disabled={currentImageIndex === imageHistory.length - 1}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleSaveImage} disabled={!processedImageUrl}>
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button variant="outline" onClick={handleShareImage} disabled={!processedImageUrl}>
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" /> Export Results
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Export Analysis Results</DialogTitle>
                          <DialogDescription>
                            Choose the format to export your analysis results.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col space-y-2">
                          <Button onClick={() => alert('Exporting as PDF...')}>Export as PDF</Button>
                          <Button onClick={() => alert('Exporting as CSV...')}>Export as CSV</Button>
                          <Button onClick={() => alert('Exporting as DICOM...')}>Export as DICOM</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {detectionResults.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Detection Results:</h2>
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        {detectionResults.map((result, index) => (
                          <div key={index} className="mb-2 p-2 bg-secondary rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{result.class}</span>
                              <Badge variant="outline">{(result.confidence * 100).toFixed(2)}%</Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Position: (x: {result.x.toFixed(2)}, y: {result.y.toFixed(2)})
                            </p>
                            <p className="text-sm text-gray-500">
                              Size: {result.width.toFixed(2)} x {result.height.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="annotations">
                      <AccordionTrigger>Annotations</AccordionTrigger>
                      <AccordionContent>
                        <textarea
                          className="w-full h-32 p-2 border rounded-md"
                          value={annotations}
                          onChange={(e) => setAnnotations(e.target.value)}
                          placeholder="Add your annotations here..."
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="settings">
                      <AccordionTrigger>Advanced Settings</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="show-grid"
                              checked={showGrid}
                              onCheckedChange={(checked) => setShowGrid(checked as boolean)}
                            />
                            <Label htmlFor="show-grid">Show Grid</Label>
                          </div>
                          {showGrid && (
                            <div className="space-y-2">
                              <Label htmlFor="grid-size">Grid Size</Label>
                              <Slider
                                id="grid-size"
                                min={10}
                                max={100}
                                step={10}
                                value={[gridSize]}
                                onValueChange={([value]) => setGridSize(value)}
                              />
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              )}
            </AnimatePresence>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}