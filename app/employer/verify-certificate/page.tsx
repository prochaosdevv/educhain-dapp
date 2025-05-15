"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Briefcase, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<"valid" | "invalid" | null>(null)

  const handleVerify = () => {
    if (!certificateId) return

    setIsVerifying(true)
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false)
      // For demo purposes, we'll consider certificates with IDs ending in odd numbers as valid
      const isValid = Number.parseInt(certificateId.slice(-1)) % 2 === 1
      setVerificationResult(isValid ? "valid" : "invalid")
    }, 2000)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/" className="flex items-center text-purple-600 hover:text-purple-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Briefcase className="h-8 w-8 text-purple-700" />
        <h1 className="text-3xl font-bold">Verify Certificate</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Verification</CardTitle>
          <CardDescription>
            Verify the authenticity of academic certificates using blockchain technology
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="certificateId">Certificate ID or Hash</Label>
            <div className="flex gap-2">
              <Input
                id="certificateId"
                placeholder="Enter certificate ID or hash"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
              />
              <Button
                onClick={handleVerify}
                disabled={isVerifying || !certificateId}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Enter the certificate ID or blockchain hash to verify its authenticity
            </p>
          </div>

          {verificationResult && (
            <div
              className={`mt-6 rounded-md p-4 ${
                verificationResult === "valid" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              <div className="flex items-start gap-3">
                {verificationResult === "valid" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <div>
                  <h3 className="font-medium">
                    {verificationResult === "valid" ? "Certificate Verified" : "Invalid Certificate"}
                  </h3>
                  <p className="text-sm">
                    {verificationResult === "valid"
                      ? "This certificate is authentic and has been verified on the blockchain."
                      : "This certificate could not be verified. It may be invalid or tampered with."}
                  </p>

                  {verificationResult === "valid" && (
                    <div className="mt-4 rounded-md bg-white p-4 shadow-sm">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-gray-500">Certificate ID</p>
                          <p className="font-medium">CERT-2023-78945</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Issued To</p>
                          <p className="font-medium">Ahmad Bin Abdullah</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Issued By</p>
                          <p className="font-medium">University of Technology</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Issue Date</p>
                          <p className="font-medium">May 15, 2023</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-xs text-gray-500">Blockchain Transaction</p>
                          <p className="overflow-hidden text-ellipsis font-mono text-xs">
                            0x7f9e8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button size="sm" variant="outline">
                          View Full Certificate
                        </Button>
                      </div>
                    </div>
                  )}
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
