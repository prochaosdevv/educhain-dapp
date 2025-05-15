"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, FileCheck, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function VerifyEnrollmentPage() {
  const [studentId, setStudentId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<"active" | "inactive" | "partial" | null>(null)

  const handleVerify = () => {
    if (!studentId) return

    setIsVerifying(true)
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false)
      // For demo purposes, we'll randomly select a status
      const statuses = ["active", "inactive", "partial"] as const
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      setVerificationResult(randomStatus)
    }, 2000)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/" className="flex items-center text-amber-600 hover:text-amber-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <FileCheck className="h-8 w-8 text-amber-700" />
        <h1 className="text-3xl font-bold">Verify Enrollment for Loan Disbursement</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Enrollment Verification</CardTitle>
          <CardDescription>Verify student enrollment status for loan disbursement purposes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="Enter student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icNumber">IC Number</Label>
                <Input id="icNumber" placeholder="Enter IC number" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleVerify}
                disabled={isVerifying || !studentId}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isVerifying ? "Verifying..." : "Verify Enrollment"}
              </Button>
            </div>
          </div>

          {verificationResult && (
            <div
              className={`mt-6 rounded-md p-4 ${
                verificationResult === "active"
                  ? "bg-green-50"
                  : verificationResult === "inactive"
                    ? "bg-red-50"
                    : "bg-amber-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {verificationResult === "active" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : verificationResult === "inactive" ? (
                  <XCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {verificationResult === "active"
                        ? "Active Enrollment"
                        : verificationResult === "inactive"
                          ? "Not Currently Enrolled"
                          : "Partially Enrolled"}
                    </h3>
                    <Badge
                      className={
                        verificationResult === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : verificationResult === "inactive"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      }
                    >
                      {verificationResult === "active"
                        ? "Eligible for Loan"
                        : verificationResult === "inactive"
                          ? "Not Eligible"
                          : "Review Required"}
                    </Badge>
                  </div>
                  <p className="text-sm">
                    {verificationResult === "active"
                      ? "This student is currently enrolled full-time and is eligible for loan disbursement."
                      : verificationResult === "inactive"
                        ? "This student is not currently enrolled. Loan disbursement is not recommended."
                        : "This student is partially enrolled. Manual review is required for loan disbursement."}
                  </p>

                  <div className="mt-4 rounded-md bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-gray-500">Student Name</p>
                        <p className="font-medium">Ahmad Bin Abdullah</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Student ID</p>
                        <p className="font-medium">STU-2019-12345</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Institution</p>
                        <p className="font-medium">University of Technology</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Program</p>
                        <p className="font-medium">Bachelor of Computer Science</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Current Semester</p>
                        <p className="font-medium">Semester 5</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Enrollment Status</p>
                        <p className="font-medium">
                          {verificationResult === "active"
                            ? "Full-time"
                            : verificationResult === "inactive"
                              ? "Not Enrolled"
                              : "Part-time"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Financial Status</p>
                        <p className="font-medium">
                          {verificationResult === "active"
                            ? "Fees Paid"
                            : verificationResult === "inactive"
                              ? "N/A"
                              : "Partially Paid"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Verified</p>
                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        Download Report
                      </Button>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        Process Loan
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t bg-gray-50 px-6 py-4">
          <h3 className="mb-2 font-medium">Loan Disbursement Guidelines</h3>
          <ul className="ml-5 list-disc space-y-1 text-sm text-gray-600">
            <li>Student must be actively enrolled in a recognized institution</li>
            <li>Minimum of 12 credit hours per semester for full-time status</li>
            <li>Satisfactory academic progress must be maintained</li>
            <li>Verification must be completed within 30 days of disbursement</li>
          </ul>
        </CardFooter>
      </Card>
    </div>
  )
}
