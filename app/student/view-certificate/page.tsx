"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, GraduationCap, Share2, QrCode, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCertificatesByStudentId, getCertificateByIpfsCid } from "@/app/actions/mongodb-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SuccessMessage } from "@/components/success-message"
import { CustomConnectButton } from "@/components/custom-connect-button"

export default function ViewCertificatePage() {
  const [studentId, setStudentId] = useState("")
  const [isPending, startTransition] = useTransition()
  const [certificates, setCertificates] = useState<any[]>([])
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null)

  const handleSearch = () => {
    if (!studentId) return

    setError(null)
    setSuccess(null)
    setCertificates([])
    setSelectedCertificate(null)

    startTransition(async () => {
      try {
        // Check if the input looks like an IPFS hash
        const isIpfsHash = studentId.startsWith("Qm") || studentId.startsWith("bafy") || studentId.length > 30

        if (isIpfsHash) {
          // Try to find certificate by IPFS CID
          const result = await getCertificateByIpfsCid(studentId)

          if (result.success && result.data) {
            setCertificates([result.data])
            setSelectedCertificate(result.data)
            setSuccess({
              title: "Certificate Found",
              message: `Found certificate with IPFS hash: ${studentId.substring(0, 10)}...`,
            })
          } else {
            setError("No certificate found with this IPFS hash. Please check and try again.")
          }
        } else {
          // Original functionality - search by student ID
          const result = await getCertificatesByStudentId(studentId)

          if (result.success && result.data && result.data.length > 0) {
            setCertificates(result.data)
            setSelectedCertificate(result.data[0]) // Select the first certificate by default
            setSuccess({
              title: "Certificates Found",
              message: `Found ${result.data.length} certificate(s) for student ID ${studentId}.`,
            })
          } else {
            setError("No certificates found for this student ID. Please check the ID and try again.")
          }
        }
      } catch (err) {
        console.error("Error fetching certificates:", err)
        setError("Failed to fetch certificates. Please try again later.")
      }
    })
  }

  const handleCertificateSelect = (certificate: any) => {
    setSelectedCertificate(certificate)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center text-green-600 hover:text-green-800">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-green-700" />
            <h1 className="text-3xl font-bold">View Certificate</h1>
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

      {!selectedCertificate ? (
        <Card>
          <CardHeader>
            <CardTitle>Find Your Certificate</CardTitle>
            <CardDescription>Enter your student ID or certificate IPFS hash to view your certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="studentId"
                    placeholder="Enter your student ID or certificate IPFS hash"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                  <Button onClick={handleSearch} disabled={isPending || !studentId}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="overflow-hidden border-2 border-green-200">
            <div className="p-4 border-b">
              <div className="text-sm text-gray-500 text-right">
                Certificate ID: {selectedCertificate.ipfsCid.substring(0, 10)}...
              </div>
            </div>
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
                <p className="my-2 text-3xl font-bold">{selectedCertificate.studentName}</p>
                <p className="text-gray-600">has successfully completed the requirements for the degree of</p>
                <p className="my-2 text-2xl font-semibold">{selectedCertificate.program}</p>
                <p className="text-gray-600">
                  {selectedCertificate.achievements && `with ${selectedCertificate.achievements}`}
                </p>
                <p className="mt-4 text-gray-600">
                  Awarded on {new Date(selectedCertificate.issueDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <div className="text-center">
                  <Image
                    src="/qr-code.png"
                    alt="Verification QR Code"
                    width={100}
                    height={100}
                    className="mx-auto mb-2"
                  />
                  <p className="text-xs text-gray-500">Scan to verify</p>
                </div>
                <div className="text-center">
                  <Image
                    src="/handwritten-signature.png"
                    alt="Digital Signature"
                    width={100}
                    height={100}
                    className="mx-auto mb-2"
                  />
                  <p className="text-xs text-gray-500">Digital Signature</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4 border-t bg-gray-50 p-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <QrCode className="h-4 w-4" />
                QR Code
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certificate Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="blockchain">Blockchain Info</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Student Name</h4>
                      <p>{selectedCertificate.studentName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Student ID</h4>
                      <p>{selectedCertificate.studentId}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Program</h4>
                      <p>{selectedCertificate.program}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Graduation Date</h4>
                      <p>{new Date(selectedCertificate.graduationDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Certificate Type</h4>
                      <p>{selectedCertificate.certificateType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Honors</h4>
                      <p>{selectedCertificate.achievements || "None"}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="blockchain" className="space-y-4 pt-4">
                  <div className="rounded-md bg-gray-50 p-4">
                    <h4 className="mb-2 font-medium">Blockchain Verification</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">IPFS CID:</span>
                        <code className="rounded bg-gray-100 px-2 py-1 text-xs">{selectedCertificate.ipfsCid}</code>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">Blockchain Reference:</span>
                        <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                          {selectedCertificate.blockchainReference || "Not available"}
                        </code>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">Timestamp:</span>
                        <span>{new Date(selectedCertificate.issuedAt).toLocaleString()}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">Issuer:</span>
                        <code className="rounded bg-gray-100 px-2 py-1 text-xs">{selectedCertificate.issuer}</code>
                      </div>
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(selectedCertificate.ipfsUrl, "_blank")}
                        >
                          View on IPFS
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="flex gap-4 rounded-md border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Certificate Issued</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(selectedCertificate.issuedAt).toLocaleString()}
                        </p>
                        <p className="text-sm">Certificate was issued by University of Technology</p>
                      </div>
                    </div>
                    <div className="flex gap-4 rounded-md border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Stored on IPFS</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(selectedCertificate.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm">Certificate data was stored on IPFS</p>
                      </div>
                    </div>
                    <div className="flex gap-4 rounded-md border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Viewed by Student</h4>
                        <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
                        <p className="text-sm">Certificate was viewed by the student</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {certificates.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Certificates</CardTitle>
                <CardDescription>You have {certificates.length} certificates available</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {certificates.map((cert, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer hover:border-green-300 transition-colors ${
                        selectedCertificate.ipfsCid === cert.ipfsCid ? "border-green-500 bg-green-50" : ""
                      }`}
                      onClick={() => handleCertificateSelect(cert)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <GraduationCap className="h-5 w-5 text-green-600" />
                          <div>
                            <h3 className="font-medium">{cert.certificateType}</h3>
                            <p className="text-sm text-gray-500">{cert.program}</p>
                            <p className="text-xs text-gray-400">
                              Issued: {new Date(cert.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
