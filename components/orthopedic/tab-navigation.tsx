import { TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabNavigation() {
  return (
    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
      <TabsTrigger value="appointments">Appointments</TabsTrigger>
      <TabsTrigger value="treatments">Treatments</TabsTrigger>
      <TabsTrigger value="education">Education</TabsTrigger>
      <TabsTrigger value="telemedicine">Telemedicine</TabsTrigger>
      <TabsTrigger value="profile">Profile</TabsTrigger>
    </TabsList>
  )
}