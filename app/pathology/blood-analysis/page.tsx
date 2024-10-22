'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Loader2, Upload, AlertTriangle,  Download, FileText, Trash2, Save, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ToastProvider } from "@/components/ui/toast"
import { toast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropzoneInputProps } from 'react-dropzone';

interface FileUploadAreaProps {
  image: File | null;
  onDrop: (acceptedFiles: File[]) => void;
  isDragActive: boolean;
  getInputProps: () => DropzoneInputProps;
  getRootProps: () => DropzoneInputProps;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ image,  isDragActive, getInputProps, getRootProps, fileInputRef }) => (
  <div
    {...getRootProps()}
    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
      isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
    }`}
  >
    <input {...getInputProps()} ref={fileInputRef} />
    {image ? (
      <div className="flex flex-col items-center">
        <img src={URL.createObjectURL(image)} alt="Uploaded blood report" className="max-w-full h-auto max-h-48 mb-4" />
        <p className="text-sm font-medium">Image selected: {image.name}</p>
      </div>
    ) : isDragActive ? (
      <p>Drop the blood report image here ...</p>
    ) : (
      <div>
        <Upload className="mx-auto mb-4" size={24} />
        <p>Drag and drop a blood report image here, or click to select a file</p>
      </div>
    )}
  </div>
)

interface PatientInfoFormProps {
  patientName: string;
  setPatientName: (name: string) => void;
  patientAge: string;
  setPatientAge: (age: string) => void;
  reportDate: string;
  setReportDate: (date: string) => void;
  gender: string;
  setGender: (gender: string) => void;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({ 
  patientName, setPatientName, 
  patientAge, setPatientAge, 
  reportDate, setReportDate,
  gender, setGender
}) => (
  <div className="grid gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label htmlFor="patientName">Patient Name</Label>
      <Input
        id="patientName"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        placeholder="Enter patient name"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="patientAge">Patient Age</Label>
      <Input
        id="patientAge"
        value={patientAge}
        onChange={(e) => setPatientAge(e.target.value)}
        placeholder="Enter patient age"
        type="number"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="gender">Gender</Label>
      <Select value={gender} onValueChange={setGender}>
        <SelectTrigger>
          <SelectValue placeholder="Select gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label htmlFor="reportDate">Report Date</Label>
      <Input
        id="reportDate"
        value={reportDate}
        onChange={(e) => setReportDate(e.target.value)}
        type="date"
      />
    </div>
  </div>
)

interface AnalysisSection {
  title: string;
  content: string;
}

interface FormattedAnalysis {
  summary: string;
  sections: AnalysisSection[];
}

const formatAnalysis = (rawAnalysis: string): FormattedAnalysis => {
  const lines = rawAnalysis.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  let summary = '';
  const sections: AnalysisSection[] = [];
  let currentSection: AnalysisSection | null = null;

  lines.forEach(line => {
    if (line.startsWith('Summary:')) {
      summary = line.substring(8).trim();
    } else if (line.endsWith(':')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { title: line.slice(0, -1), content: '' };
    } else if (currentSection) {
      currentSection.content += line + ' ';
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  return { summary, sections };
};

interface AnalysisResultProps {
  analysis: string;
  patientName: string;
  patientAge: string;
  reportDate: string;
  gender: string;
  handleDownload: () => void;
  handleSave: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ 
  analysis, 
  patientName, 
  patientAge, 
  reportDate, 
  gender,
  handleDownload, 
  handleSave 
}) => {
  const formattedAnalysis = formatAnalysis(analysis);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Analysis Result</CardTitle>
        <CardDescription>
          Blood report analysis for {patientName}, Age: {patientAge}, Gender: {gender}, Date: {reportDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Summary</h3>
              <p>{formattedAnalysis.summary}</p>
            </div>
            {formattedAnalysis.sections.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="space-x-2">
          <Button onClick={handleDownload} className="flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Download Analysis
          </Button>
          <Button onClick={handleSave} variant="outline" className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Save to History
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View Full Report</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Full Blood Report Analysis</DialogTitle>
              <DialogDescription>
                Detailed analysis for {patientName}, Age: {patientAge}, Gender: {gender}, Date: {reportDate}
              </DialogDescription>
            </DialogHeader>
            <Separator className="my-4" />
            <ScrollArea className="h-[500px] w-full rounded-md p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Summary</h3>
                  <p>{formattedAnalysis.summary}</p>
                </div>
                {formattedAnalysis.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p>{section.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

interface SavedAnalysis {
  id: string;
  patientName: string;
  patientAge: string;
  gender: string;
  reportDate: string;
  analysis: string;
}

export default function AdvancedBloodReportAnalyzer() {
  const [image, setImage] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [patientName, setPatientName] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [gender, setGender] = useState('')
  const [reportDate, setReportDate] = useState('')
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode))
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImage(acceptedFiles[0])
    setAnalysis(null)
    setError(null)
    setProgress(0)
    toast({
      title: "File uploaded",
      description: "Your blood report image has been successfully uploaded.",
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  })

  const handleSubmit = async () => {
    if (!image) {
      setError('No image selected. Please upload a blood report image first.')
      return
    }

    if (!patientName || !patientAge || !reportDate || !gender) {
      setError('Please fill in all patient information fields.')
      return
    }

    setIsLoading(true)
    setError(null)
    setProgress(0)

    const formData = new FormData()
    formData.append('image', image)
    formData.append('patientName', patientName)
    formData.append('patientAge', patientAge)
    formData.append('gender', gender)
    formData.append('reportDate', reportDate)

    try {
      const response = await fetch('/api/analyze-blood-report', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze blood report')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      console.log('Analysis:', data.analysis)
      setProgress(100)
      toast({
        title: "Analysis complete",
        description: "Your blood report has been successfully analyzed.",
      })
    } catch (err) {
      console.error('Error in handleSubmit:', err)
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`)
      toast({
        title: "Error",
        description: "Failed to analyze blood report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (analysis) {
      const blob = new Blob([analysis], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `blood_report_analysis_${patientName}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({
        title: "Download started",
        description: "Your analysis report is being downloaded.",
      })
    }
  }

  const handleSave = () => {
    if (analysis) {
      const newAnalysis: SavedAnalysis = {
        id: Date.now().toString(),
        patientName,
        patientAge,
        gender,
        reportDate,
        analysis,
      }
      setSavedAnalyses(prev => [...prev, newAnalysis])
      toast({
        title: "Analysis saved",
        description: "Your analysis has been saved to the history.",
      })
    }
  }

  const resetForm = () => {
    setImage(null)
    setAnalysis(null)
    setError(null)
    setProgress(0)
    setPatientName('')
    setPatientAge('')
    setGender('')
    setReportDate('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast({
      title: "Form reset",
      description: "All fields have been cleared. You can now analyze a new report.",
    })
  }

  const deleteSavedAnalysis = (id: string) => {
    setSavedAnalyses(prev => prev.filter(analysis => analysis.id !== id))
    toast({
      title: "Analysis deleted",
      description: "The saved analysis has been removed from history.",
    })
  }

  return (
    <ToastProvider>
      
      <div className={`container mx-auto p-4 max-w-4xl ${darkMode ? 'dark' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Advanced AI Blood Report Analysis</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle dark mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Report</TabsTrigger>
            <TabsTrigger value="results" disabled={!analysis}>Results</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Blood Report Image</CardTitle>
                <CardDescription>Drag and drop or click to select a blood report image for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FileUploadArea
                    image={image}
                    onDrop={onDrop}
                    isDragActive={isDragActive}
                    getInputProps={getInputProps}
                    getRootProps={getRootProps}
                    fileInputRef={fileInputRef}
                  />
                  <PatientInfoForm
                    patientName={patientName}
                    setPatientName={setPatientName}
                    patientAge={patientAge}
                    setPatientAge={setPatientAge}
                    reportDate={reportDate}
                    setReportDate={setReportDate}
                    gender={gender}
                    setGender={setGender}
                  />
                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={!image || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Analyze Blood Report
                      </>
                    )}
                  </Button>
                  {isLoading && (
                    <Progress value={progress} className="w-full" />
                  )}
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="results">
            {analysis && (
              <AnalysisResult
                analysis={analysis}
                patientName={patientName}
                patientAge={patientAge}
                reportDate={reportDate}
                gender={gender}
                handleDownload={handleDownload}
                handleSave={handleSave}
              />
            )}
            <Button onClick={resetForm} className="mt-4">
              Analyze Another Report
            </Button>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Analysis History</CardTitle>
                <CardDescription>View and manage your saved analyses</CardDescription>
              </CardHeader>
              <CardContent>
                {savedAnalyses.length === 0 ? (
                  <p>No saved analyses yet.</p>
                ) : (
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    {savedAnalyses.map((savedAnalysis) => (
                      <div key={savedAnalysis.id} className="mb-4 p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">{savedAnalysis.patientName}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSavedAnalysis(savedAnalysis.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p>Age: {savedAnalysis.patientAge}, Gender: {savedAnalysis.gender}, Date: {savedAnalysis.reportDate}</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Eye className="mr-2 h-4 w-4" />
                              View Analysis
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Saved Analysis for {savedAnalysis.patientName}</DialogTitle>
                              <DialogDescription>
                                Age: {savedAnalysis.patientAge}, Gender: {savedAnalysis.gender}, Date: {savedAnalysis.reportDate}
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[500px] w-full rounded-md p-4">
                              <p className="whitespace-pre-wrap">{savedAnalysis.analysis}</p>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </div>
                    ))}
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ToastProvider>
  )
}