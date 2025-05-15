"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Database, Search, ExternalLink, FileText, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { getCertificatesByStudentId, getEnrollmentsByStudentId } from "@/app/actions/mongodb-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CustomConnectButton } from "@/components/custom-connect-button"

export default function StudentRecordsPage() {
  const { toast } = useToast()
  const [studentId, setStudentId] = useState("")
  const [isPending, startTransition] = useTransition()
  const [certificates, setCertificates] = useState<any[]>([])
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = () => {
    if (!studentId) return

    startTransition(async () => {
      try {
        // Fetch certificates
        const certResult = await getCertificatesByStudentId(studentId)
        if (certResult.success && certResult.data) {
          setCertificates(certResult.data)
        } else {
          setCertificates([])
        }

        // Fetch enrollments
        const enrollResult = await getEnrollmentsByStudentId(studentId)
        if (enrollResult.success && enrollResult.data) {
          setEnrollments(enrollResult.data)
        } else {
          setEnrollments([])
        }

        setHasSearched(true)

        toast({
          title: "Records Retrieved",
          description: `Found ${certResult.data?.length || 0} certificates and ${
            enrollResult.data?.length || 0
          } enrollment records.`,
        })
      } catch (error) {
        console.error("Error fetching student records:", error)
        toast({
          title: "Error",
          description: "Failed to fetch student records. Please try again.",
          variant: "destructive",
        })
        setCertificates([])
        setEnrollments([])
      }
    })
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Student Records</h1>
          </div>
        </div>
        <CustomConnectButton />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Student Records</CardTitle>
          <CardDescription>Enter a student ID to retrieve their certificates and enrollment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="Enter Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
            <Button onClick={handleSearch} disabled={isPending || !studentId}>
              {isPending ? "Searching..." : "Search"}
              {!isPending && <Search className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <Tabs defaultValue="certificates">
          <TabsList className="mb-4">
            <TabsTrigger value="certificates">Certificates ({certificates.length})</TabsTrigger>
            <TabsTrigger value="enrollments">Enrollments ({enrollments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="certificates">
            {certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((cert, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-medium">{cert.certificateType}</h3>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => window.open(cert.ipfsUrl, "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View on IPFS
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Student ID</p>
                          <p className="font-medium">{cert.studentId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Student Name</p>
                          <p className="font-medium">{cert.studentName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Program</p>
                          <p className="font-medium">{cert.program}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Issue Date</p>
                          <p className="font-medium">
                            {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">IPFS CID</p>
                          <p className="font-medium font-mono text-xs">{cert.ipfsCid}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Created At</p>
                          <p className="font-medium">
                            {cert.createdAt ? new Date(cert.createdAt).toLocaleString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No certificates found for this student ID.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="enrollments">
            {enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.map((enroll, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-green-600" />
                          <h3 className="text-lg font-medium">Enrollment Record</h3>
                          <Badge
                            className={enroll.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                          >
                            {enroll.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => window.open(enroll.ipfsUrl, "_blank")}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View on IPFS
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Student ID</p>
                          <p className="font-medium">{enroll.studentId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Student Name</p>
                          <p className="font-medium">{enroll.studentName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Program</p>
                          <p className="font-medium">{enroll.program}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Semester</p>
                          <p className="font-medium">Semester {enroll.semester}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Enrollment Type</p>
                          <p className="font-medium">
                            {enroll.enrollmentType === "fullTime" && "Full-time"}
                            {enroll.enrollmentType === "partTime" && "Part-time"}
                            {enroll.enrollmentType === "distance" && "Distance Learning"}
                            {enroll.enrollmentType === "exchange" && "Exchange Program"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Financial Status</p>
                          <p className="font-medium">
                            {enroll.financialStatus === "paid" && "Fully Paid"}
                            {enroll.financialStatus === "partial" && "Partially Paid"}
                            {enroll.financialStatus === "scholarship" && "Scholarship"}
                            {enroll.financialStatus === "loan" && "Student Loan"}
                            {enroll.financialStatus === "unpaid" && "Unpaid"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">IPFS CID</p>
                          <p className="font-medium font-mono text-xs">{enroll.ipfsCid}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Updated At</p>
                          <p className="font-medium">
                            {enroll.updatedAt ? new Date(enroll.updatedAt).toLocaleString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No enrollment records found for this student ID.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
