"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Shield, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { CustomConnectButton } from "@/components/custom-connect-button"
import { uploadJSONToPinata } from "@/app/actions/ipfs-actions"
import { storeEnrollmentInMongoDB } from "@/app/actions/mongodb-actions"
import { useAccount } from "wagmi"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SuccessMessage } from "@/components/success-message"

export default function UpdateEnrollmentPage() {
  const { toast } = useToast()
  const { isConnected, address } = useAccount()
  const [isPending, startTransition] = useTransition()
  const [isActive, setIsActive] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null)

  // Form data state
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    program: "",
    semester: "",
    enrollmentDate: "",
    expectedGraduation: "",
    enrollmentType: "",
    financialStatus: "",
  })

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to update enrollment",
        variant: "destructive",
      })
      return
    }

    setError(null)

    try {
      // Prepare enrollment data
      const enrollmentData = {
        ...formData,
        isActive,
        updatedBy: address,
        updatedAt: new Date().toISOString(),
        blockchainReference: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Mock blockchain reference
      }

      // Call the server action to upload the JSON data
      startTransition(async () => {
        const result = await uploadJSONToPinata(enrollmentData, `enrollment-${formData.studentId}-${Date.now()}.json`)

        if (result.success && result.data) {
          // Store the enrollment data in MongoDB
          const mongoData = {
            studentId: formData.studentId,
            studentName: formData.studentName,
            program: formData.program,
            semester: formData.semester,
            enrollmentDate: formData.enrollmentDate,
            expectedGraduation: formData.expectedGraduation,
            isActive,
            enrollmentType: formData.enrollmentType,
            financialStatus: formData.financialStatus,
            ipfsCid: result.data.cid,
            ipfsUrl: result.data.url,
            updatedBy: address || "unknown",
            updatedAt: new Date().toISOString(),
            blockchainReference: enrollmentData.blockchainReference,
            createdAt: new Date(),
          }

          const mongoResult = await storeEnrollmentInMongoDB(mongoData)

          if (mongoResult.success) {
            setSuccess({
              title: "Enrollment Updated Successfully",
              message:
                "The student enrollment status has been successfully updated, stored on IPFS, and recorded in the database.",
            })

            // Log the IPFS URL for reference
            console.log("Enrollment data stored at:", result.data.url)
            console.log("MongoDB ID:", mongoResult.id)

            // Reset form after successful submission
            setFormData({
              studentId: "",
              studentName: "",
              program: "",
              semester: "",
              enrollmentDate: "",
              expectedGraduation: "",
              enrollmentType: "",
              financialStatus: "",
            })
            setIsActive(true)
          } else {
            throw new Error(mongoResult.message)
          }
        } else {
          throw new Error(result.message)
        }
      })
    } catch (error) {
      console.error("Error updating enrollment:", error)
      setError(error instanceof Error ? error.message : "Failed to update enrollment")
      toast({
        title: "Error",
        description: "Failed to update enrollment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-700" />
            <h1 className="text-3xl font-bold">Update Student Enrollment</h1>
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
          <CardTitle>Enrollment Details</CardTitle>
          <CardDescription>Update the enrollment status and details for a student</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="Enter student ID"
                  required
                  value={formData.studentId}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  placeholder="Enter student name"
                  required
                  value={formData.studentName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">Program/Degree</Label>
                <Input
                  id="program"
                  placeholder="e.g. Bachelor of Computer Science"
                  required
                  value={formData.program}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Current Semester</Label>
                <Select value={formData.semester} onValueChange={(value) => handleSelectChange("semester", value)}>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                    <SelectItem value="3">Semester 3</SelectItem>
                    <SelectItem value="4">Semester 4</SelectItem>
                    <SelectItem value="5">Semester 5</SelectItem>
                    <SelectItem value="6">Semester 6</SelectItem>
                    <SelectItem value="7">Semester 7</SelectItem>
                    <SelectItem value="8">Semester 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  required
                  value={formData.enrollmentDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedGraduation">Expected Graduation</Label>
                <Input
                  id="expectedGraduation"
                  type="date"
                  required
                  value={formData.expectedGraduation}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="enrollmentStatus">Enrollment Status</Label>
                <Switch id="enrollmentStatus" checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <p className="text-sm text-gray-500">
                {isActive ? "Student is currently enrolled and active" : "Student is not currently enrolled"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollmentType">Enrollment Type</Label>
              <Select
                value={formData.enrollmentType}
                onValueChange={(value) => handleSelectChange("enrollmentType", value)}
              >
                <SelectTrigger id="enrollmentType">
                  <SelectValue placeholder="Select enrollment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fullTime">Full-time</SelectItem>
                  <SelectItem value="partTime">Part-time</SelectItem>
                  <SelectItem value="distance">Distance Learning</SelectItem>
                  <SelectItem value="exchange">Exchange Program</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="financialStatus">Financial Status</Label>
              <Select
                value={formData.financialStatus}
                onValueChange={(value) => handleSelectChange("financialStatus", value)}
              >
                <SelectTrigger id="financialStatus">
                  <SelectValue placeholder="Select financial status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Fully Paid</SelectItem>
                  <SelectItem value="partial">Partially Paid</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
                  <SelectItem value="loan">Student Loan</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Update Enrollment"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
