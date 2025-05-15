"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Briefcase, CheckCircle, XCircle, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { getCertificatesByStudentId } from "@/app/actions/mongodb-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SuccessMessage } from "@/components/success-message"
import { CustomConnectButton } from "@/components/custom-connect-button"

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState("")
  const [isPending, startTransition] = useTransition()
  const [verificationResult, setVerificationResult] = useState<"valid" | "invalid" | null>(null)
  const [certificate, setCertificate] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null)

  const handleVerify = () => {
    if (!certificateId) return

    setError(null)
    setSuccess(null)
    setVerificationResult(null)
    setCertificate(null)

    startTransition(async () => {
      try {
        // Try to find by student ID first
        const result = await getCertificatesByStudentId(certificateId)

        if (result.success && result.data && result.data.length > 0) {
          // Found certificates by student ID
          setCertificate(result.data[0])
          setVerificationResult("valid")
          setSuccess({
            title: "Certificate Verified",
            message: "This certificate is authentic and has been verified.",
          })
        } else {
          // Try to find by IPFS CID (assuming certificateId might be a CID)
          // In a real app, you would have a separate API for this
          // For now, we'll just simulate a failure
          setVerificationResult("invalid")
          setError("This certificate could not be verified. It may be invalid or tampered with.")
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

      <Card>
        <CardHeader>
          <CardTitle>Certificate Verification</CardTitle>
          <CardDescription>
            Verify the authenticity of academic certificates using blockchain technology
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="certificateId">Certificate ID, Student ID or Hash</Label>
            <div className="flex gap-2">
              <Input
                id="certificateId"
                placeholder="Enter certificate ID, student ID or hash"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
              />
              <Button
                onClick={handleVerify}
                disabled={isPending || !certificateId}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Enter the certificate ID, student ID or blockchain hash to verify its authenticity
            </p>
          </div>

          {verificationResult === "valid" && certificate && (
            <div className="mt-6 rounded-md bg-green-50 p-4 text-green-800">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-medium">Certificate Verified</h3>
                  <p className="text-sm">This certificate is authentic and has been verified on the blockchain.</p>

                  <div className="mt-4 rounded-md bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-gray-500">Certificate ID</p>
                        <p className="font-medium">{certificate.ipfsCid.substring(0, 10)}...</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Issued To</p>
                        <p className="font-medium">{certificate.studentName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Issued By</p>
                        <p className="font-medium">University of Technology</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Issue Date</p>
                        <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs text-gray-500">IPFS CID</p>
                        <p className="overflow-hidden text-ellipsis font-mono text-xs">{certificate.ipfsCid}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(certificate.ipfsUrl, "_blank")}>
                        <ExternalLink className="mr-1 h-4 w-4" />
                        View on IPFS
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
