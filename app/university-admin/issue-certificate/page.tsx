"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { Shield, Upload, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { CustomConnectButton } from "@/components/custom-connect-button"

export default function IssueCertificatePage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [issueDate, setIssueDate] = useState<Date>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Certificate Issued",
        description: "The certificate has been successfully issued and stored on the blockchain.",
      })
    }, 2000)
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
            <h1 className="text-3xl font-bold">Issue Certificate</h1>
          </div>
        </div>
        <CustomConnectButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
          <CardDescription>
            Enter the details of the certificate to be issued and stored on the blockchain
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" placeholder="Enter student ID" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input id="studentName" placeholder="Enter student name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">Program/Degree</Label>
                <Input id="program" placeholder="e.g. Bachelor of Computer Science" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificateType">Certificate Type</Label>
                <Select>
                  <SelectTrigger id="certificateType">
                    <SelectValue placeholder="Select certificate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="degree">Degree</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="transcript">Transcript</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <DatePicker date={issueDate} setDate={setIssueDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationDate">Graduation Date</Label>
                <Input id="graduationDate" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements">Achievements/Honors</Label>
              <Textarea
                id="achievements"
                placeholder="Enter any special achievements or honors"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificateFile">Upload Certificate File (PDF)</Label>
              <div className="flex items-center gap-2">
                <Input id="certificateFile" type="file" accept=".pdf" />
                <Button type="button" size="icon" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Upload the certificate PDF that will be hashed and stored on the blockchain
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Issue Certificate"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
