"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, GraduationCap, Share2, QrCode, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ViewCertificatePage() {
  const [certificateId, setCertificateId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [certificateFound, setCertificateFound] = useState(false)

  const handleSearch = () => {
    if (!certificateId) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setCertificateFound(true)
    }, 1500)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/" className="flex items-center text-green-600 hover:text-green-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <GraduationCap className="h-8 w-8 text-green-700" />
        <h1 className="text-3xl font-bold">View Certificate</h1>
      </div>

      {!certificateFound ? (
        <Card>
          <CardHeader>
            <CardTitle>Find Your Certificate</CardTitle>
            <CardDescription>Enter your certificate ID or student ID to view your certificates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certificateId">Certificate ID or Student ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="certificateId"
                    placeholder="Enter ID"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                  />
                  <Button onClick={handleSearch} disabled={isLoading || !certificateId}>
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="overflow-hidden border-2 border-green-200">
            <div className="bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Verified on Blockchain</span>
                </div>
                <div className="text-sm text-gray-500">Certificate ID: CERT-2023-78945</div>
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
                <p className="my-2 text-3xl font-bold">Ahmad Bin Abdullah</p>
                <p className="text-gray-600">has successfully completed the requirements for the degree of</p>
                <p className="my-2 text-2xl font-semibold">Bachelor of Computer Science</p>
                <p className="text-gray-600">with honors</p>
                <p className="mt-4 text-gray-600">Awarded on May 15, 2023</p>
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
                      <p>Ahmad Bin Abdullah</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Student ID</h4>
                      <p>STU-2019-12345</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Program</h4>
                      <p>Bachelor of Computer Science</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Graduation Date</h4>
                      <p>May 15, 2023</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">CGPA</h4>
                      <p>3.85/4.00</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Honors</h4>
                      <p>Summa Cum Laude</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="blockchain" className="space-y-4 pt-4">
                  <div className="rounded-md bg-gray-50 p-4">
                    <h4 className="mb-2 font-medium">Blockchain Verification</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">Transaction Hash:</span>
                        <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                          0x7f9e8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d
                        </code>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">Block Number:</span>
                        <code className="rounded bg-gray-100 px-2 py-1 text-xs">15784236</code>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">Timestamp:</span>
                        <span>2023-05-15 10:23:45 UTC</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">Certificate Hash:</span>
                        <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                          bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
                        </code>
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
                        <p className="text-sm text-gray-500">May 15, 2023 - 10:23:45 UTC</p>
                        <p className="text-sm">Certificate was issued by University of Technology</p>
                      </div>
                    </div>
                    <div className="flex gap-4 rounded-md border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Stored on Blockchain</h4>
                        <p className="text-sm text-gray-500">May 15, 2023 - 10:25:12 UTC</p>
                        <p className="text-sm">Certificate hash was stored on the blockchain</p>
                      </div>
                    </div>
                    <div className="flex gap-4 rounded-md border p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Viewed by Student</h4>
                        <p className="text-sm text-gray-500">May 16, 2023 - 14:30:22 UTC</p>
                        <p className="text-sm">Certificate was viewed by the student</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
