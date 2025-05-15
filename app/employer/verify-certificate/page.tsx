"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ExternalLink,
  FileText,
  Search,
} from "lucide-react"
import Link from "next/link"
import {
  getCertificatesByStudentId,
  getCertificateByIpfsCid,
  getEnrollmentsByStudentId,
  getEnrollmentByIpfsCid,
} from "@/app/actions/mongodb-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SuccessMessage } from "@/components/success-message"
import { CustomConnectButton } from "@/components/custom-connect-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function VerifyCertificatePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()
  const [verificationResult, setVerificationResult] = useState<"valid" | "invalid" | null>(null)
  const [certificate, setCertificate] = useState<any>(null)
  const [enrollment, setEnrollment] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null)
  const [activeTab, setActiveTab] = useState<"certificate" | "enrollment">("certificate")

  const handleVerify = () => {
    if (!searchQuery) return

    setError(null)
    setSuccess(null)
    setVerificationResult(null)
    setCertificate(null)
    setEnrollment(null)

    startTransition(async () => {
      try {
        // Check if the input looks like an IPFS hash
        const isIpfsHash = searchQuery.startsWith("Qm") || searchQuery.startsWith("bafy") || searchQuery.length > 30

        if (isIpfsHash) {
          // Try to find certificate by IPFS CID
          const certResult = await getCertificateByIpfsCid(searchQuery)

          // Try to find enrollment by IPFS CID
          const enrollResult = await getEnrollmentByIpfsCid(searchQuery)

          if (certResult.success && certResult.data) {
            setCertificate(certResult.data)
            setActiveTab("certificate")
            setVerificationResult("valid")
            setSuccess({
              title: "Certificate Verified",
              message: `This certificate is authentic and has been verified on the blockchain.`,
            })
          } else if (enrollResult.success && enrollResult.data) {
            setEnrollment(enrollResult.data)
            setActiveTab("enrollment")
            setVerificationResult("valid")
            setSuccess({
              title: "Enrollment Verified",
              message: `This enrollment record is authentic and has been verified on the blockchain.`,
            })
          } else {
            setVerificationResult("invalid")
            setError("This certificate or enrollment record could not be verified. It may be invalid or tampered with.")
          }
        } else {
          // Try to find by student ID
          const certResults = await getCertificatesByStudentId(searchQuery)
          const enrollResults = await getEnrollmentsByStudentId(searchQuery)

          if (certResults.success && certResults.data && certResults.data.length > 0) {
            setCertificate(certResults.data[0]) // Use the most recent certificate
            setActiveTab("certificate")
            setVerificationResult("valid")
            setSuccess({
              title: "Certificate Verified",
              message: `Found ${certResults.data.length} certificate(s) for student ID ${searchQuery}.`,
            })
          } else if (enrollResults.success && enrollResults.data && enrollResults.data.length > 0) {
            setEnrollment(enrollResults.data[0]) // Use the most recent enrollment
            setActiveTab("enrollment")
            setVerificationResult("valid")
            setSuccess({
              title: "Enrollment Verified",
              message: `Found ${enrollResults.data.length} enrollment record(s) for student ID ${searchQuery}.`,
            })
          } else {
            setVerificationResult("invalid")
            setError("No records found for this ID. The certificate or enrollment record may be invalid.")
          }
        }
      } catch (err) {
        console.error("Error verifying certificate:", err)
        setVerificationResult("invalid")
        setError("Failed to verify certificate. Please try again later.")
      }
    })
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center text-purple-600 hover:text-purple-800">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-purple-700" />
            <h1 className="text-3xl font-bold">Verify Certificate</h1>
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Certificate Verification</CardTitle>
          <CardDescription>
            Verify the authenticity of academic certificates and enrollment records using blockchain technology
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="searchQuery">Certificate ID, Student ID or IPFS Hash</Label>
            <div className="flex gap-2">
              <Input
                id="searchQuery"
                placeholder="Enter certificate ID, student ID or IPFS hash"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                onClick={handleVerify}
                disabled={isPending || !searchQuery}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Verify
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Enter the certificate ID, student ID or blockchain hash to verify its authenticity
            </p>
          </div>

          {verificationResult === "valid" && (certificate || enrollment) && (
            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "certificate" | "enrollment")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="certificate"
                    disabled={!certificate}
                    className={!certificate ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    Certificate
                  </TabsTrigger>
                  <TabsTrigger
                    value="enrollment"
                    disabled={!enrollment}
                    className={!enrollment ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    Enrollment
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="certificate">
                  {certificate && (
                    <div className="space-y-6">
                      <div className="mt-6 rounded-md bg-green-50 p-4 text-green-800">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <h3 className="font-medium">Certificate Verified</h3>
                            <p className="text-sm">
                              This certificate is authentic and has been verified on the blockchain.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Card className="overflow-hidden border-2 border-purple-200">
                        <CardContent className="p-6">
                          <div className="mb-6 flex flex-col items-center justify-center">
                            <div className="mb-4 h-24 w-24">
                              <Image
                                src="/generic-university-logo.png"
                                alt="University Logo"
                                width={96}
                                height={96}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <h2 className="text-center text-2xl font-bold">University of Technology</h2>
                            <p className="text-center text-gray-500">Certificate of Completion</p>
                          </div>

                          <div className="mb-8 text-center">
                            <h3 className="text-xl font-medium">This certifies that</h3>
                            <p className="my-2 text-3xl font-bold">{certificate.studentName}</p>
                            <p className="text-gray-600">
                              has successfully completed the requirements for the degree of
                            </p>
                            <p className="my-2 text-2xl font-semibold">{certificate.program}</p>
                            <p className="text-gray-600">
                              {certificate.achievements && `with ${certificate.achievements}`}
                            </p>
                            <p className="mt-4 text-gray-600">
                              Awarded on {new Date(certificate.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Certificate Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <p className="text-xs text-gray-500">Certificate ID</p>
                              <p className="font-medium">{certificate.ipfsCid.substring(0, 10)}...</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Issued To</p>
                              <p className="font-medium">{certificate.studentName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Student ID</p>
                              <p className="font-medium">{certificate.studentId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Issue Date</p>
                              <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Program/Degree</p>
                              <p className="font-medium">{certificate.program}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Certificate Type</p>
                              <p className="font-medium">{certificate.certificateType}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs text-gray-500">IPFS CID</p>
                              <p className="overflow-hidden text-ellipsis font-mono text-xs">{certificate.ipfsCid}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs text-gray-500">Blockchain Reference</p>
                              <p className="overflow-hidden text-ellipsis font-mono text-xs">
                                {certificate.blockchainReference || "Not available"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(certificate.ipfsUrl, "_blank")}
                            >
                              <ExternalLink className="mr-1 h-4 w-4" />
                              View on IPFS
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="enrollment">
                  {enrollment && (
                    <div className="space-y-6">
                      <div className="mt-6 rounded-md bg-green-50 p-4 text-green-800">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <h3 className="font-medium">Enrollment Record Verified</h3>
                            <p className="text-sm">
                              This enrollment record is authentic and has been verified on the blockchain.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-green-600" />
                              <h3 className="text-lg font-medium">Enrollment Record</h3>
                              <Badge
                                className={
                                  enrollment.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }
                              >
                                {enrollment.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Student ID</p>
                              <p className="font-medium">{enrollment.studentId}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Student Name</p>
                              <p className="font-medium">{enrollment.studentName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Program</p>
                              <p className="font-medium">{enrollment.program}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Semester</p>
                              <p className="font-medium">Semester {enrollment.semester}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Enrollment Type</p>
                              <p className="font-medium">
                                {enrollment.enrollmentType === "fullTime" && "Full-time"}
                                {enrollment.enrollmentType === "partTime" && "Part-time"}
                                {enrollment.enrollmentType === "distance" && "Distance Learning"}
                                {enrollment.enrollmentType === "exchange" && "Exchange Program"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Financial Status</p>
                              <p className="font-medium">
                                {enrollment.financialStatus === "paid" && "Fully Paid"}
                                {enrollment.financialStatus === "partial" && "Partially Paid"}
                                {enrollment.financialStatus === "scholarship" && "Scholarship"}
                                {enrollment.financialStatus === "loan" && "Student Loan"}
                                {enrollment.financialStatus === "unpaid" && "Unpaid"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Enrollment Date</p>
                              <p className="font-medium">
                                {enrollment.enrollmentDate
                                  ? new Date(enrollment.enrollmentDate).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Expected Graduation</p>
                              <p className="font-medium">
                                {enrollment.expectedGraduation
                                  ? new Date(enrollment.expectedGraduation).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-500">IPFS CID</p>
                              <p className="font-medium font-mono text-xs">{enrollment.ipfsCid}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-500">Updated At</p>
                              <p className="font-medium">
                                {enrollment.updatedAt ? new Date(enrollment.updatedAt).toLocaleString() : "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(enrollment.ipfsUrl, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View on IPFS
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {verificationResult === "invalid" && (
            <div className="mt-6 rounded-md bg-red-50 p-4 text-red-800">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-medium">Invalid Certificate</h3>
                  <p className="text-sm">This certificate could not be verified. It may be invalid or tampered with.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t bg-gray-50 px-6 py-4">
          <h3 className="mb-2 font-medium">Why Verify Certificates?</h3>
          <p className="text-sm text-gray-600">
            Blockchain verification ensures that academic certificates are authentic and tamper-proof. This helps
            employers verify candidate credentials with confidence and protects against fraudulent certificates.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
