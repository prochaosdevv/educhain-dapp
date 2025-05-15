"use client"

import type React from "react"

import { useState, useRef, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { Shield, Upload, ArrowLeft, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { CustomConnectButton } from "@/components/custom-connect-button"
import { uploadFileToPinata, uploadJSONToPinata } from "@/app/actions/ipfs-actions"
import { storeCertificateInMongoDB } from "@/app/actions/mongodb-actions"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function IssueCertificatePage() {
  const { toast } = useToast()
  const { isConnected, address } = useAccount()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [issueDate, setIssueDate] = useState<Date>()
  const [certificateType, setCertificateType] = useState("")
  const [uploadingFile, setUploadingFile] = useState(false)
  const [fileCID, setFileCID] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form data
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    program: "",
    achievements: "",
    graduationDate: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    setFileName(file.name)
    setUploadingFile(true)
    setError(null)

    try {
      // Create a FormData object to send the file to the server action
      const formData = new FormData()
      formData.append("file", file)

      // Call the server action to upload the file
      startTransition(async () => {
        const result = await uploadFileToPinata(formData)

        if (result.success && result.data) {
          setFileCID(result.data.cid)
          setFileUrl(result.data.url)

          toast({
            title: "File Uploaded",
            description: `File uploaded to IPFS via Pinata with CID: ${result.data.cid}`,
          })
        } else {
          throw new Error(result.message)
        }
      })
    } catch (error) {
      console.error("File upload error:", error)
      setError(error instanceof Error ? error.message : "Failed to upload file to IPFS")
      toast({
        title: "Upload Failed",
        description: "Failed to upload file to IPFS. Check console for details.",
        variant: "destructive",
      })
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to issue a certificate",
        variant: "destructive",
      })
      return
    }

    setError(null)

    try {
      // Prepare certificate data
      const certificateData = {
        ...formData,
        certificateType,
        issueDate: issueDate?.toISOString(),
        fileCID: fileCID || null,
        fileUrl: fileUrl || null,
        fileName: fileName || null,
        issuer: address,
        issuedAt: new Date().toISOString(),
      }

      // Call the server action to upload the JSON data
      startTransition(async () => {
        const result = await uploadJSONToPinata(certificateData, `certificate-${formData.studentId}.json`)

        if (result.success && result.data) {
          // Store the certificate data in MongoDB
          const mongoData = {
            studentId: formData.studentId,
            studentName: formData.studentName,
            program: formData.program,
            certificateType,
            issueDate: issueDate?.toISOString() || new Date().toISOString(),
            graduationDate: formData.graduationDate,
            achievements: formData.achievements,
            ipfsCid: result.data.cid,
            ipfsUrl: result.data.url,
            fileCid: fileCID || undefined,
            fileUrl: fileUrl || undefined,
            fileName: fileName || undefined,
            issuer: address || "unknown",
            issuedAt: new Date().toISOString(),
            blockchainReference: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Mock blockchain reference
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          const mongoResult = await storeCertificateInMongoDB(mongoData)

          if (mongoResult.success) {
            toast({
              title: "Certificate Issued",
              description:
                "The certificate has been successfully issued, stored on IPFS, and recorded in the database.",
            })

            // Log the IPFS URL for reference
            console.log("Certificate stored at:", result.data.url)
            console.log("MongoDB ID:", mongoResult.id)

            // Reset form after successful submission
            setFormData({
              studentId: "",
              studentName: "",
              program: "",
              achievements: "",
              graduationDate: "",
            })
            setCertificateType("")
            setIssueDate(undefined)
            setFileCID("")
            setFileUrl("")
            setFileName("")
            if (fileInputRef.current) fileInputRef.current.value = ""
          } else {
            throw new Error(mongoResult.message)
          }
        } else {
          throw new Error(result.message)
        }
      })
    } catch (error) {
      console.error("Error issuing certificate:", error)
      setError(error instanceof Error ? error.message : "Failed to issue certificate")
      toast({
        title: "Error",
        description: "Failed to issue certificate. Please try again.",
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
            <h1 className="text-3xl font-bold">Issue Certificate</h1>
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

      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
          <CardDescription>
            Enter the details of the certificate to be issued and stored on IPFS via Pinata
          </CardDescription>
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
                <Label htmlFor="certificateType">Certificate Type</Label>
                <Select value={certificateType} onValueChange={setCertificateType}>
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
                <Input
                  id="graduationDate"
                  type="date"
                  required
                  value={formData.graduationDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements">Achievements/Honors</Label>
              <Textarea
                id="achievements"
                placeholder="Enter any special achievements or honors"
                className="min-h-[100px]"
                value={formData.achievements}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificateFile">Upload Certificate File (PDF)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="certificateFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  disabled={uploadingFile || isPending}
                />
                {uploadingFile || isPending ? (
                  <Button type="button" size="icon" variant="outline" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </Button>
                ) : (
                  <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {fileCID && (
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xs text-green-600">File uploaded to IPFS. CID: {fileCID.substring(0, 10)}...</p>
                  {fileUrl && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 p-0"
                      onClick={() => window.open(fileUrl, "_blank")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      <span className="text-xs">View</span>
                    </Button>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Upload the certificate file that will be stored on IPFS via Pinata
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending || uploadingFile}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Issue Certificate"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
