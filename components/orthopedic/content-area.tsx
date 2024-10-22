import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { CalendarIcon, ChevronUp, AlertCircle } from 'lucide-react'

interface ContentAreaProps {
  activeTab: string;
  showAppointmentDialog: boolean;
  setShowAppointmentDialog: (show: boolean) => void;
  showSymptomChecker: boolean;
  setShowSymptomChecker: (show: boolean) => void;
  userProfile: {
    name: string;
    email: string;
    dob: string;
    phone: string;
    address: string;
    emergencyContact: string;
  };
  setUserProfile: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    dob: string;
    phone: string;
    address: string;
    emergencyContact: string;
  }>>;
}

export default function ContentArea({
  activeTab,
  showAppointmentDialog,
  setShowAppointmentDialog,
  showSymptomChecker,
  setShowSymptomChecker,
  userProfile,
  setUserProfile
}: ContentAreaProps) {
  const [painLevel, setPainLevel] = useState(0)
  const [appointments, setAppointments] = useState([
    { date: '2023-06-15', time: '14:00', doctor: 'Dr. Sarah Johnson' }
  ])
  const [treatments] = useState([
    { medication: 'Ibuprofen', dosage: '400mg', frequency: 'twice daily' },
    { medication: 'Calcium supplement', dosage: '500mg', frequency: 'once daily' }
  ])

  const handleAppointmentBooking = (date: string, time: string, doctor: string) => {
    setAppointments([...appointments, { date, time, doctor }])
    setShowAppointmentDialog(false)
    toast({
      title: "Appointment Booked",
      description: `Your appointment with ${doctor} on ${date} at ${time} has been scheduled.`,
    })
  }

  const handleSymptomCheck = (location: string, duration: string, level: number, swelling: string) => {
    setShowSymptomChecker(false)
    toast({
      title: "Symptom Check Complete",
      description: `Based on your symptoms (${location}, ${duration}, pain level ${level}/10, ${swelling} swelling), we recommend consulting with an orthopedic specialist.`,
    })
  }

  const renderDashboard = () => (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {userProfile.name}</CardTitle>
        <CardDescription>Here&apos;s an overview of your orthopedic health</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments[0]?.date || 'No upcoming appointments'}</div>
              <p className="text-xs text-muted-foreground">{appointments[0]?.doctor} - {appointments[0]?.time}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treatment Progress</CardTitle>
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <Progress value={75} className="w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pain Level</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3/10</div>
              <p className="text-xs text-muted-foreground">Decreased from last week</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setShowSymptomChecker(true)}>Start Symptom Check</Button>
      </CardFooter>
    </Card>
  )

  const renderAppointments = () => (
    <Card>
      <CardHeader>
        <CardTitle>Manage Your Appointments</CardTitle>
        <CardDescription>Schedule, view, or cancel your appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={new Date(appointments[0]?.date)}
          className="rounded-md border"
        />
        <div className="mt-4">
          <h3 className="font-semibold">Upcoming Appointments</h3>
          {appointments.map((apt, index) => (
            <div key={index} className="mt-2 p-2 bg-gray-100 rounded">
              <p>{apt.date} - {apt.time}</p>
              <p>{apt.doctor}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setShowAppointmentDialog(true)}>Book New Appointment</Button>
      </CardFooter>
    </Card>
  )

  const renderTreatments = () => (
    <Card>
      <CardHeader>
        <CardTitle>Your Treatment Plan</CardTitle>
        <CardDescription>View and track your personalized treatment plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {treatments.map((treatment, index) => (
                <li key={index}>
                  {treatment.medication} - {treatment.dosage}, {treatment.frequency}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Exercise Routine</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Knee strengthening exercises - 15 minutes, twice daily</li>
              <li>Low-impact cardio - 30 minutes, 3 times a week</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter>
        <Button>Update Progress</Button>
      </CardFooter>
    </Card>
  )

  const renderEducation = () => (
    <Card>
      <CardHeader>
        <CardTitle>Educational Resources</CardTitle>
        <CardDescription>Learn more about orthopedic conditions and treatments</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Understanding Osteoarthritis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Osteoarthritis is a degenerative joint disease that occurs when the cartilage that cushions the ends of bones in your joints gradually deteriorates...</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Read More</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Preventing Sports Injuries</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sports injuries can happen to anyone, but there are steps you can take to reduce your risk. Proper warm-up, using correct techniques, and...</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Read More</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>The Importance of Posture</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Good posture is about more than standing up straight. It can help prevent pain, injuries, and other health problems. Here&apos;s what you need to know...</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Read More</Button>
              </CardFooter>
            </Card>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )

  const renderTelemedicine = () => (
    <Card>
      <CardHeader>
        <CardTitle>Telemedicine Services</CardTitle>
        <CardDescription>Connect with your orthopedic specialist virtually</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Virtual Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You have no upcoming virtual consultations scheduled.</p>
          </CardContent>
          <CardFooter>
            <Button>Schedule Consultation</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Secure Messaging</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea className="w-full h-24 p-2 border rounded" placeholder="Type your message here..." />
          </CardContent>
          <CardFooter>
            <Button>Send Message</Button>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  )

  const renderProfile = () => (
    <Card>
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Manage your personal and medical information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/avatar.png" alt="Profile Picture" />
            <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{userProfile.name}</h3>
            <p className="text-sm text-gray-500">{userProfile.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" value={userProfile.dob} onChange={(e) => setUserProfile({...userProfile, dob: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={userProfile.phone} onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={userProfile.address} onChange={(e) => setUserProfile({...userProfile, address: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency-contact">Emergency Contact</Label>
            <Input id="emergency-contact" value={userProfile.emergencyContact} onChange={(e) => setUserProfile({...userProfile, emergencyContact: e.target.value})} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => toast({ title: "Profile Updated", description: "Your profile has been successfully updated." })}>Save Changes</Button>
      </CardFooter>
    </Card>
  )

  const renderAppointmentDialog = () => (
    <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Choose a date, time, and specialist for your appointment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointment-date" className="text-right">
              Date
            </Label>
            <Input id="appointment-date" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointment-time" className="text-right">
              Time
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialist" className="text-right">
              Specialist
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a specialist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                <SelectItem value="dr-patel">Dr. Raj Patel</SelectItem>
                <SelectItem value="dr-garcia">Dr. Maria Garcia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => handleAppointmentBooking('2023-06-20', '14:00', 'Dr. Sarah Johnson')}>Book Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const renderSymptomCheckerDialog = () => (
    <Dialog open={showSymptomChecker} onOpenChange={setShowSymptomChecker}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Symptom Checker</DialogTitle>
          <DialogDescription>
            Answer a few questions to help us understand your symptoms.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pain-location" className="text-right">
              Pain Location
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="knee">Knee</SelectItem>
                <SelectItem value="back">Back</SelectItem>
                <SelectItem value="shoulder">Shoulder</SelectItem>
                <SelectItem value="hip">Hip</SelectItem>
                <SelectItem value="ankle">Ankle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pain-duration" className="text-right">
              Pain Duration
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acute">Less than a week</SelectItem>
                <SelectItem value="subacute">1-4 weeks</SelectItem>
                <SelectItem value="chronic">More than 4 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pain-level" className="text-right">
              Pain Level
            </Label>
            <Slider
              id="pain-level"
              max={10}
              step={1}
              value={[painLevel]}
              onValueChange={(value) => setPainLevel(value[0])}
              className="col-span-3"
            />
          </div>
          <RadioGroup defaultValue="no">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="swelling" />
              <Label htmlFor="swelling">Is there any swelling?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-swelling" />
              <Label htmlFor="no-swelling">No swelling</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button onClick={() => handleSymptomCheck('Knee', 'Acute', painLevel, 'No')}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "appointments" && renderAppointments()}
      {activeTab === "treatments" && renderTreatments()}
      {activeTab === "education" && renderEducation()}
      {activeTab === "telemedicine" && renderTelemedicine()}
      {activeTab === "profile" && renderProfile()}
      {renderAppointmentDialog()}
      {renderSymptomCheckerDialog()}
    </>
  )
}