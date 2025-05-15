"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Database, FileText, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getCertificatesByStudentId } from "@/app/actions/mongodb-actions"

type CertificateStatus = "pending" | "processing" | "stored" | "failed"

interface Certificate {
  id: string
  name: string
  university: string
  date: string
  status: CertificateStatus
  txHash?: string
  ipfsCid?: string
}

export default function BlockchainStoragePage() {
  const { toast } = useToast()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Fetch certificates from MongoDB that don't have a blockchain reference
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setIsLoading(true)
        // In a real implementation, you would fetch certificates without blockchain references
        // For now, we'll simulate this with a mix of statuses

        // Fetch some real certificates from MongoDB
        const result = await getCertificatesByStudentId("")

        if (result.success && result.data && result.data.length > 0) {
          const formattedCerts = result.data.map((cert: any) => ({
            id: cert.ipfsCid.substring(0, 10) + "...",
            name: cert.studentName,
            university: "University of Technology",
            date: new Date(cert.issueDate).toLocaleDateString(),
            status: cert.blockchainReference ? "stored" : "pending",
            txHash: cert.blockchainReference,
            ipfsCid: cert.ipfsCid,
          }))

          // Add some mock certificates with different statuses for demonstration
          const mockCerts = [
            {
              id: "CERT-2023-78946",
              name: "Siti Binti Mohamed",
              university: "National University",
              date: "2023-05-15",
              status: "processing" as CertificateStatus,
            },
            {
              id: "CERT-2023-78947",
              name: "John Smith",
              university: "International College",
              date: "2023-05-14",
              status: "failed" as CertificateStatus,
            },
            {
              id: "CERT-2023-78948",
              name: "Lisa Wong",
              university: "University of Technology",
              date: "2023-05-14",
              status: "pending" as CertificateStatus,
            },
          ]

          setCertificates([...formattedCerts, ...mockCerts])
        } else {
          // If no certificates found, use mock data
          setCertificates([
            {
              id: "CERT-2023-78945",
              name: "Ahmad Bin Abdullah",
              university: "University of Technology",
              date: "2023-05-15",
              status: "stored",
              txHash: "0x7f9e8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d",
            },
            {
              id: "CERT-2023-78946",
              name: "Siti Binti Mohamed",
              university: "National University",
              date: "2023-05-15",
              status: "processing",
            },
            {
              id: "CERT-2023-78947",
              name: "John Smith",
              university: "International College",
              date: "2023-05-14",
              status: "failed",
            },
            {
              id: "CERT-2023-78948",
              name: "Lisa Wong",
              university: "University of Technology",
              date: "2023-05-14",
              status: "pending",
            },
            {
              id: "CERT-2023-78949",
              name: "Raj Patel",
              university: "National University",
              date: "2023-05-13",
              status: "stored",
              txHash: "0x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching certificates:", error)
        toast({
          title: "Error",
          description: "Failed to fetch certificates",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertificates()
  }, [toast])

  const processNextCertificate = async () => {
    const pendingCert = certificates.find((cert) => cert.status === "pending")
    if (!pendingCert || !pendingCert.ipfsCid) return

    setIsProcessing(true)
    setProgress(0)

    // Start progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 150)

    try {
      // Call the API to process the certificate
      const response = await fetch("/api/blockchain/process-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ certificateId: pendingCert.ipfsCid }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Update the certificate status
        setCertificates((prev) => {
          const updated = [...prev]
          const index = updated.findIndex((cert) => cert.ipfsCid === pendingCert.ipfsCid)
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              status: "stored",
              txHash: result.data.txHash,
            }
          }
          return updated
        })

        toast({
          title: "Success",
          description: "Certificate processed successfully",
        })
      } else {
        throw new Error(result.message || "Failed to process certificate")
      }
    } catch (error) {
      console.error("Error processing certificate:", error)
      toast({
        title: "Error",
        description: "Failed to process certificate",
        variant: "destructive",
      })

      // Update the certificate status to failed
      setCertificates((prev) => {
        const updated = [...prev]
        const index = updated.findIndex((cert) => cert.ipfsCid === pendingCert.ipfsCid)
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: "failed",
          }
        }
        return updated
      })
    } finally {
      clearInterval(interval)
      setProgress(0)
      setIsProcessing(false)
    }
  }

  const handleRetry = async (cert: Certificate) => {
    if (!cert.ipfsCid) return

    // Update the certificate status to pending
    setCertificates((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((c) => c.ipfsCid === cert.ipfsCid)
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          status: "pending",
        }
      }
      return updated
    })

    toast({
      title: "Certificate Queued",
      description: "Certificate has been queued for processing",
    })
  }

  const getStatusBadge = (status: CertificateStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Pending
          </Badge>
        )
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
      case "stored":
        return <Badge className="bg-green-100 text-green-800">Stored</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Database className="h-8 w-8 text-gray-700" />
        <h1 className="text-3xl font-bold">Store Certificate on Blockchain</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Storage Queue</CardTitle>
              <CardDescription>Certificates waiting to be stored on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-800"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className={`flex flex-wrap items-center justify-between gap-4 rounded-md border p-4 ${
                        cert.status === "processing" ? "border-blue-200 bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <h3 className="font-medium">{cert.name}</h3>
                          <p className="text-sm text-gray-500">
                            {cert.id} • {cert.university}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(cert.status)}
                        {cert.status === "stored" && (
                          <div className="hidden text-xs text-gray-500 sm:block">
                            TX: {cert.txHash?.substring(0, 10)}...
                          </div>
                        )}
                        {cert.status === "failed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs"
                            onClick={() => handleRetry(cert)}
                          >
                            <RefreshCw className="h-3 w-3" /> Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-4">
              <div className="text-sm text-gray-500">
                {certificates.filter((c) => c.status === "pending").length} pending •
                {certificates.filter((c) => c.status === "stored").length} stored
              </div>
              <Button
                onClick={processNextCertificate}
                disabled={isProcessing || !certificates.some((c) => c.status === "pending")}
              >
                Process Next Certificate
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Storage Status</CardTitle>
              <CardDescription>Current blockchain storage operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Processing Certificate</span>
                      <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-gray-500">Hashing and storing certificate data on the blockchain...</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="font-medium">Blockchain Connection Active</h3>
                        <p className="text-sm text-gray-600">Connected to Ethereum Mainnet</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex gap-3">
                      <Database className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Storage Statistics</h3>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Total Certificates:</span>
                            <span className="font-medium">{certificates.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Stored Today:</span>
                            <span className="font-medium">
                              {certificates.filter((c) => c.status === "stored").length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Average Gas Cost:</span>
                            <span className="font-medium">0.0042 ETH</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-amber-50 p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <div>
                        <h3 className="font-medium">Network Status</h3>
                        <p className="text-sm text-gray-600">
                          Gas prices are high. Consider delaying non-urgent transactions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
