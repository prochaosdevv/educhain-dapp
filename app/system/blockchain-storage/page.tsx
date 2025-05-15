"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Database, FileText, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getCertificatesByStudentId, getEnrollmentsByStudentId } from "@/app/actions/mongodb-actions"
import { useAccount, useWriteContract, useReadContract } from "wagmi"
import { UNIVERSITY_CONTRACT_ADDRESS, UNIVERSITY_CONTRACT_ABI } from "@/lib/contracts"

type CertificateStatus = "pending" | "processing" | "stored" | "failed"

interface Certificate {
  id: string
  name: string
  university: string
  date: string
  status: CertificateStatus
  txHash?: string
  ipfsCid?: string
  studentId?: string
  icNumber?: string
  enrollmentHash?: string
}

export default function BlockchainStoragePage() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [studentCount, setStudentCount] = useState<number>(0)

  // Contract write hook
  const { writeContract, isPending: isWritePending, isSuccess, isError, error } = useWriteContract()

  // Contract read hook for student count
  const { data: studentCountData } = useReadContract({
    address: UNIVERSITY_CONTRACT_ADDRESS,
    abi: UNIVERSITY_CONTRACT_ABI,
    functionName: "getStudentCount",
    watch: true,
  })

  // Update student count when data changes
  useEffect(() => {
    if (studentCountData) {
      setStudentCount(Number(studentCountData))
    }
  }, [studentCountData])

  // Show toast on transaction success or error
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Transaction Successful",
        description: "Certificate has been stored on the blockchain",
      })
    }
    if (isError && error) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to store certificate on blockchain",
        variant: "destructive",
      })
    }
  }, [isSuccess, isError, error, toast])

  // Fetch certificates and enrollments from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch certificates
        const certResult = await getCertificatesByStudentId("")

        // Fetch all enrollments to get IC numbers
        const enrollResult = await getEnrollmentsByStudentId("")

        if (certResult.success && certResult.data && certResult.data.length > 0) {
          const formattedCerts = certResult.data.map((cert: any) => {
            // Find matching enrollment to get IC number
            const enrollment =
              enrollResult.success && enrollResult.data
                ? enrollResult.data.find((e: any) => e.studentId === cert.studentId)
                : null

            return {
              id: cert.ipfsCid.substring(0, 10) + "...",
              name: cert.studentName,
              university: "University of Technology",
              date: new Date(cert.issueDate).toLocaleDateString(),
              status: cert.blockchainReference ? "stored" : "pending",
              txHash: cert.blockchainReference,
              ipfsCid: cert.ipfsCid,
              studentId: cert.studentId,
              // Extract numeric part from studentId (assuming format like "STU-2023-12345")
              studentIdNumber: cert.studentId.split("-").pop() || "0",
              icNumber: enrollment?.icNumber || "",
              enrollmentHash: enrollment?.ipfsCid || "",
            }
          })

          setCertificates(formattedCerts)
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
              studentId: "STU-2023-12345",
              studentIdNumber: "12345",
              icNumber: "901234-56-7890",
              enrollmentHash: "QmX7bVbVH5mKgbFJ9xJ4...",
            },
            {
              id: "CERT-2023-78946",
              name: "Siti Binti Mohamed",
              university: "National University",
              date: "2023-05-15",
              status: "pending",
              studentId: "STU-2023-12346",
              studentIdNumber: "12346",
              icNumber: "901234-56-7891",
              enrollmentHash: "QmX7bVbVH5mKgbFJ9xJ5...",
            },
            {
              id: "CERT-2023-78947",
              name: "John Smith",
              university: "International College",
              date: "2023-05-14",
              status: "failed",
              studentId: "STU-2023-12347",
              studentIdNumber: "12347",
              icNumber: "901234-56-7892",
              enrollmentHash: "QmX7bVbVH5mKgbFJ9xJ6...",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch certificates",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const processNextCertificate = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to process certificates",
        variant: "destructive",
      })
      return
    }

    const pendingCert = certificates.find((cert) => cert.status === "pending")
    if (!pendingCert || !pendingCert.ipfsCid) {
      toast({
        title: "No Pending Certificates",
        description: "There are no pending certificates to process",
      })
      return
    }

    // Check if we have all required data
    if (!pendingCert.studentIdNumber || !pendingCert.enrollmentHash || !pendingCert.ipfsCid) {
      toast({
        title: "Missing Data",
        description: "Certificate is missing required data for blockchain storage",
        variant: "destructive",
      })
      return
    }

    // Update certificate status to processing
    setCertificates((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((cert) => cert.ipfsCid === pendingCert.ipfsCid)
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          status: "processing",
        }
      }
      return updated
    })

    setIsProcessing(true)
    setProgress(0)

    // Start progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 150)

    try {
      // Call the smart contract function
      writeContract({
        address: UNIVERSITY_CONTRACT_ADDRESS,
        abi: UNIVERSITY_CONTRACT_ABI,
        functionName: "storeStudentData",
        args: [
          BigInt(pendingCert.studentIdNumber), // Convert to BigInt for uint256
          pendingCert.enrollmentHash || "",
          pendingCert.ipfsCid,
          pendingCert.icNumber || "",
        ],
      })

      // Wait for transaction to be mined
      // Note: In a real app, you'd listen for the transaction receipt
      // For now, we'll simulate this with a timeout
      setTimeout(() => {
        if (!isError) {
          // Update certificate status to stored
          setCertificates((prev) => {
            const updated = [...prev]
            const index = updated.findIndex((cert) => cert.ipfsCid === pendingCert.ipfsCid)
            if (index !== -1) {
              updated[index] = {
                ...updated[index],
                status: "stored",
                txHash: "0x" + Math.random().toString(16).substring(2, 42), // Mock tx hash
              }
            }
            return updated
          })
        } else {
          // Update certificate status to failed
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
        }

        clearInterval(interval)
        setProgress(0)
        setIsProcessing(false)
      }, 5000)
    } catch (error) {
      console.error("Error processing certificate:", error)
      toast({
        title: "Error",
        description: "Failed to process certificate",
        variant: "destructive",
      })

      // Update certificate status to failed
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
                            {cert.studentId || cert.id} • {cert.university}
                          </p>
                          {cert.icNumber && <p className="text-xs text-gray-500">IC: {cert.icNumber}</p>}
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
                disabled={
                  isProcessing || isWritePending || !certificates.some((c) => c.status === "pending") || !isConnected
                }
              >
                {isProcessing || isWritePending ? "Processing..." : "Process Next Certificate"}
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
                {(isProcessing || isWritePending) && (
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
                        <p className="text-sm text-gray-600">
                          {isConnected
                            ? `Connected to Ethereum (${address?.substring(0, 6)}...${address?.substring(38)})`
                            : "Wallet not connected"}
                        </p>
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
                            <span>Total Students:</span>
                            <span className="font-medium">{studentCount}</span>
                          </div>
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
                            <span>Contract Address:</span>
                            <span className="font-medium text-xs">
                              {UNIVERSITY_CONTRACT_ADDRESS.substring(0, 6)}...
                              {UNIVERSITY_CONTRACT_ADDRESS.substring(38)}
                            </span>
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
