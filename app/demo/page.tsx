'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'
import Webcam from 'react-webcam'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CapturedPose {
  pose: posenet.Pose;
  image: string;
}

const CapturedPoseCard: React.FC<{ capturedPose: CapturedPose; index: number; minConfidence: number }> = ({ capturedPose, index, minConfidence }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawKeypoints = (keypoints: posenet.Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D) => {
    keypoints.forEach((keypoint) => {
      if (keypoint.score >= minConfidence) {
        const { y, x } = keypoint.position
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = "aqua"
        ctx.fill()
        
        // Add keypoint name
        ctx.fillStyle = "white"
        ctx.font = "12px Arial"
        ctx.fillText(keypoint.part, x + 5, y - 5)
      }
    })
  }

  const drawSkeleton = (keypoints: posenet.Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D) => {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence)

    adjacentKeyPoints.forEach((keypoints) => {
      drawSegment(
        toTuple(keypoints[0].position),
        toTuple(keypoints[1].position),
        ctx
      )
    })
  }

  const toTuple = ({ y, x }: { y: number; x: number }) => [y, x] as [number, number]

  const drawSegment = (
    [ay, ax]: [number, number],
    [by, bx]: [number, number],
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx, by)
    ctx.lineWidth = 2
    ctx.strokeStyle = "aqua"
    ctx.stroke()
  }

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height)
          drawKeypoints(capturedPose.pose.keypoints, minConfidence, ctx)
          drawSkeleton(capturedPose.pose.keypoints, minConfidence, ctx)
        }
        img.src = capturedPose.image
      }
    }
  }, [capturedPose, minConfidence])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Captured Pose {index + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={300}
          height={225}
          className="w-full h-auto"
        />
        <div className="mt-2">
          <p>Score: {capturedPose.pose.score.toFixed(2)}</p>
          <p>Keypoints: {capturedPose.pose.keypoints.length}</p>
        </div>
      </CardContent>
    </Card>
  )
}

const PoseDetection: React.FC = () => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [isDetecting, setIsDetecting] = useState(false)
  const [model, setModel] = useState<posenet.PoseNet | null>(null)
  const [fps, setFps] = useState(0)
  const [minConfidence, setMinConfidence] = useState(0.5)
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [capturedPoses, setCapturedPoses] = useState<CapturedPose[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { toast } = useToast()

  useEffect(() => {
    const setupTensorFlow = async () => {
      try {
        await tf.ready()
        await tf.setBackend('webgl')
        
        const loadedModel = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 640, height: 480 },
          multiplier: 0.75,
        })
        setModel(loadedModel)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load PoseNet model:', error)
        toast({
          title: "Error",
          description: "Failed to load PoseNet model. Please refresh the page.",
          variant: "destructive",
        })
      }
    }

    setupTensorFlow()
  }, [toast])

  const detectPose = useCallback(async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video
      const videoWidth = video.videoWidth
      const videoHeight = video.videoHeight

      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      if (canvasRef.current) {
        canvasRef.current.width = videoWidth
        canvasRef.current.height = videoHeight
      }

      if (model) {
        const startTime = performance.now()
        const pose = await model.estimateSinglePose(video)
        const endTime = performance.now()

        setFps(Math.round(1000 / (endTime - startTime)))

        drawPose(pose)
      }
    }
  }, [model])

  const drawPose = useCallback((pose: posenet.Pose) => {
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      if (showSkeleton) {
        drawKeypoints(pose.keypoints, minConfidence, ctx)
        drawSkeleton(pose.keypoints, minConfidence, ctx)
      }
    }
  }, [showSkeleton, minConfidence])

  const drawKeypoints = (keypoints: posenet.Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D) => {
    keypoints.forEach((keypoint) => {
      if (keypoint.score >= minConfidence) {
        const { y, x } = keypoint.position
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = "aqua"
        ctx.fill()
        
        // Add keypoint name
        ctx.fillStyle = "white"
        ctx.font = "12px Arial"
        ctx.fillText(keypoint.part, x + 5, y - 5)
      }
    })
  }

  const drawSkeleton = (keypoints: posenet.Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D) => {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence)

    adjacentKeyPoints.forEach((keypoints) => {
      drawSegment(
        toTuple(keypoints[0].position),
        toTuple(keypoints[1].position),
        ctx
      )
    })
  }

  const toTuple = ({ y, x }: { y: number; x: number }) => [y, x] as [number, number]

  const drawSegment = (
    [ay, ax]: [number, number],
    [by, bx]: [number, number],
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx, by)
    ctx.lineWidth = 2
    ctx.strokeStyle = "aqua"
    ctx.stroke()
  }

  const capturePose = useCallback(() => {
    if (model && webcamRef.current?.video) {
      model.estimateSinglePose(webcamRef.current.video).then((pose) => {
        const capturedImage = captureImage()
        setCapturedPoses((prevPoses) => [...prevPoses, { pose, image: capturedImage }])
        toast({
          title: "Pose Captured",
          description: "Your current pose has been saved.",
        })
      })
    }
  }, [model, toast])

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = webcamRef.current.video!.videoWidth
      canvas.height = webcamRef.current.video!.videoHeight
      canvas.getContext('2d')!.drawImage(webcamRef.current.video!, 0, 0)
      return canvas.toDataURL('image/jpeg')
    }
    return ''
  }, [])

  useEffect(() => {
    let animationFrameId: number
    if (isDetecting) {
      const runPoseDetection = async () => {
        await detectPose()
        animationFrameId = requestAnimationFrame(runPoseDetection)
      }
      runPoseDetection()
    }
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isDetecting, detectPose])

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Advanced Body Pose Detection</CardTitle>
          <CardDescription>Detect, analyze, and capture your body posture in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full max-w-[640px]">
              <Webcam
                ref={webcamRef}
                className="w-full h-auto"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={isDetecting}
                  onCheckedChange={setIsDetecting}
                  id="detection-switch"
                  disabled={isLoading}
                />
                <label htmlFor="detection-switch">
                  {isLoading ? "Loading..." : isDetecting ? "Stop Detection" : "Start Detection"}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showSkeleton}
                  onCheckedChange={setShowSkeleton}
                  id="skeleton-switch"
                />
                <label htmlFor="skeleton-switch">Show Skeleton</label>
              </div>
              <div>
                <label htmlFor="confidence-slider" className="block mb-2">
                  Minimum Confidence: {minConfidence.toFixed(2)}
                </label>
                <Slider
                  id="confidence-slider"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[minConfidence]}
                  onValueChange={(value) => setMinConfidence(value[0])}
                />
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={capturePose} disabled={isLoading}>Capture Pose</Button>
              </motion.div>
              <p>FPS: {fps}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Captured Poses</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid" className="w-full">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {capturedPoses.map((capturedPose, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CapturedPoseCard capturedPose={capturedPose} index={index} minConfidence={minConfidence} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="list">
              <div className="space-y-4">
                {capturedPoses.map((capturedPose, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CapturedPoseCard capturedPose={capturedPose} index={index} minConfidence={minConfidence} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default PoseDetection