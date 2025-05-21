"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, FileCheck, CheckCircle, XCircle, AlertCircle, Loader2, Code, Download } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CustomConnectButton } from "@/components/custom-connect-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SuccessMessage } from "@/components/success-message"

interface StudentData {
  studentId: string
  studentName: string
  institution: string
  program: string
  currentSemester: string
  enrollmentStatus: string
  financialStatus: string
  lastVerified: string
  ipfsCid?: string
  blockchainReference?: string | null
}

export default function VerifyEnrollmentPage() {
  const [studentId, setStudentId] = useState("")
  const [icNumber, setIcNumber] = useState("")
  const [loanAmount, setLoanAmount] = useState("10000")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isProcessingLoan, setIsProcessingLoan] = useState(false)
  const [verificationResult, setVerificationResult] = useState<"active" | "inactive" | "partial" | null>(null)
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null)
  const [loanProcessed, setLoanProcessed] = useState(false)

  const handleVerify = async () => {
    if (!studentId) return

    setIsVerifying(true)
    setError(null)
    setSuccess(null)
    setLoanProcessed(false)

    try {
      const response = await fetch("/api/ptptn/verify-loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, icNumber }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setVerificationResult(data.verificationResult)
        setStudentData(data.studentData)
        setSuccess({
          title: "Verification Complete",
          message: "Student enrollment status has been verified successfully.",
        })
      } else {
        setError(data.message || "Failed to verify enrollment status")
        setVerificationResult(data.verificationResult || null)
        setStudentData(null)
      }
    } catch (err) {
      console.error("Error verifying enrollment:", err)
      setError("An error occurred while verifying enrollment status. Please try again.")
      setVerificationResult(null)
      setStudentData(null)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleProcessLoan = async () => {
    if (!studentId || !icNumber) {
      setError("Student ID and IC Number are required to process the loan")
      return
    }

    setIsProcessingLoan(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/ptptn/process-loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          icNumber,
          loanAmount: Number.parseFloat(loanAmount),
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess({
          title: "Loan Processed Successfully",
          message: "The loan has been approved and the IC number has been recorded against the student.",
        })
        setLoanProcessed(true)
      } else {
        setError(data.message || "Failed to process loan")
      }
    } catch (err) {
      console.error("Error processing loan:", err)
      setError("An error occurred while processing the loan. Please try again.")
    } finally {
      setIsProcessingLoan(false)
    }
  }

  const handleDownloadReport = () => {
    if (!studentData) return

    // Create a report text
    const reportText = `
PTPTN Loan Verification Report
------------------------------
Student ID: ${studentData.studentId}
Student Name: ${studentData.studentName}
IC Number: ${icNumber || "Not provided"}
Institution: ${studentData.institution}
Program: ${studentData.program}
Current Semester: ${studentData.currentSemester}
Enrollment Status: ${studentData.enrollmentStatus}
Financial Status: ${studentData.financialStatus}
Verification Result: ${verificationResult?.toUpperCase()}
Verification Date: ${new Date().toLocaleString()}
${loanProcessed ? "Loan Status: APPROVED" : ""}
${loanProcessed ? `Loan Amount: RM ${loanAmount}` : ""}
    `.trim()

    // Create a blob and download it
    const blob = new Blob([reportText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `loan-verification-${studentData.studentId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center text-amber-600 hover:text-amber-800">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <FileCheck className="h-8 w-8 text-amber-700" />
            <h1 className="text-3xl font-bold">Verify Enrollment for Loan Disbursement</h1>
          </div>
        </div>
        <CustomConnectButton />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && <SuccessMessage title={success.title} message={success.message} />}

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
                <Input
                  id="icNumber"
                  placeholder="Enter IC number"
                  value={icNumber}
                  onChange={(e) => setIcNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleVerify}
                disabled={isVerifying || !studentId}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Enrollment"
                )}
              </Button>
            </div>
          </div>

          {verificationResult && studentData && (
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
                        <p className="font-medium">{studentData.studentName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Student ID</p>
                        <p className="font-medium">{studentData.studentId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">IC Number</p>
                        <p className="font-medium">{icNumber || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Institution</p>
                        <p className="font-medium">{studentData.institution}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Program</p>
                        <p className="font-medium">{studentData.program}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Current Semester</p>
                        <p className="font-medium">Semester {studentData.currentSemester}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Enrollment Status</p>
                        <p className="font-medium">{studentData.enrollmentStatus}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Financial Status</p>
                        <p className="font-medium">{studentData.financialStatus}</p>
                      </div>
                    </div>

                    {!loanProcessed && verificationResult !== "inactive" && (
                      <div className="mt-4 border-t pt-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="loanAmount">Loan Amount (RM)</Label>
                            <Input
                              id="loanAmount"
                              type="number"
                              value={loanAmount}
                              onChange={(e) => setLoanAmount(e.target.value)}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={handleDownloadReport}>
                              <Download className="mr-1 h-4 w-4" />
                              Download Report
                            </Button>
                            <Button
                              size="sm"
                              className="bg-amber-600 hover:bg-amber-700"
                              disabled={verificationResult === "inactive" || isProcessingLoan || !icNumber}
                              onClick={handleProcessLoan}
                            >
                              {isProcessingLoan ? (
                                <>
                                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Process Loan"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {loanProcessed && (
                      <div className="mt-4 rounded-md bg-green-50 p-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <p className="text-sm text-green-800">
                            Loan processed successfully. IC number has been recorded.
                          </p>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <Button size="sm" variant="outline" onClick={handleDownloadReport}>
                            <Download className="mr-1 h-4 w-4" />
                            Download Report
                          </Button>
                        </div>
                      </div>
                    )}
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
            <li>IC number must be recorded for all loan disbursements</li>
          </ul>
          <div className="mt-4 flex items-center">
            <Code className="mr-2 h-4 w-4 text-amber-600" />
            <Link href="/api/docs/ptptn" className="text-sm text-amber-600 hover:underline">
              API Documentation for Developers
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
