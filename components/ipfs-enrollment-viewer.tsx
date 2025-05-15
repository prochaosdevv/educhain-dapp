"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink } from "lucide-react"
import { getIPFSUrl } from "@/lib/ipfs-service"
import { Badge } from "@/components/ui/badge"

interface IPFSEnrollmentViewerProps {
  cid: string
  filename?: string
}

export function IPFSEnrollmentViewer({ cid, filename }: IPFSEnrollmentViewerProps) {
  const [enrollmentData, setEnrollmentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnrollmentData = async () => {
      try {
        setLoading(true)
        const url = getIPFSUrl(cid, filename)
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch enrollment data: ${response.statusText}`)
        }

        const data = await response.json()
        setEnrollmentData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching enrollment data:", err)
        setError("Failed to load enrollment data from IPFS")
      } finally {
        setLoading(false)
      }
    }

    if (cid) {
      fetchEnrollmentData()
    }
  }, [cid, filename])

  if (loading) {
    return (
      <Card className="p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2">Loading enrollment data from IPFS...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8">
        <p className="text-red-500">{error}</p>
      </Card>
    )
  }

  if (!enrollmentData) {
    return (
      <Card className="p-8">
        <p>No enrollment data found</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Enrollment Details</h3>
          <Button variant="outline" size="sm" onClick={() => window.open(getIPFSUrl(cid, filename), "_blank")}>
            <ExternalLink className="h-4 w-4 mr-1" />
            View on IPFS
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="font-medium">{enrollmentData.studentId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Student Name</p>
            <p className="font-medium">{enrollmentData.studentName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Program/Degree</p>
            <p className="font-medium">{enrollmentData.program}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Semester</p>
            <p className="font-medium">Semester {enrollmentData.semester}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Enrollment Date</p>
            <p className="font-medium">
              {enrollmentData.enrollmentDate ? new Date(enrollmentData.enrollmentDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expected Graduation</p>
            <p className="font-medium">
              {enrollmentData.expectedGraduation
                ? new Date(enrollmentData.expectedGraduation).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Enrollment Status</p>
            <Badge className={enrollmentData.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {enrollmentData.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Enrollment Type</p>
            <p className="font-medium">
              {enrollmentData.enrollmentType === "fullTime" && "Full-time"}
              {enrollmentData.enrollmentType === "partTime" && "Part-time"}
              {enrollmentData.enrollmentType === "distance" && "Distance Learning"}
              {enrollmentData.enrollmentType === "exchange" && "Exchange Program"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Financial Status</p>
            <p className="font-medium">
              {enrollmentData.financialStatus === "paid" && "Fully Paid"}
              {enrollmentData.financialStatus === "partial" && "Partially Paid"}
              {enrollmentData.financialStatus === "scholarship" && "Scholarship"}
              {enrollmentData.financialStatus === "loan" && "Student Loan"}
              {enrollmentData.financialStatus === "unpaid" && "Unpaid"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Updated By</p>
            <p className="font-medium font-mono text-xs">{enrollmentData.updatedBy}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Updated At</p>
            <p className="font-medium">
              {enrollmentData.updatedAt ? new Date(enrollmentData.updatedAt).toLocaleString() : "N/A"}
            </p>
          </div>
          {enrollmentData.blockchainReference && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Blockchain Reference</p>
              <p className="font-medium font-mono text-xs">{enrollmentData.blockchainReference}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
