"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Database, FileText, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { UNIVERSITY_CONTRACT_ADDRESS, UNIVERSITY_CONTRACT_ABI } from "@/lib/contracts"

type CertificateStatus = "pending" | "processing" | "stored" | "failed"

interface EnrollmentItem {
  id: string
  studentId: string
  studentName: string
  program: string
  university: string
  date: string
  status: CertificateStatus
  txHash?: string
  ipfsCid: string
  icNumber?: string
  enrollmentType: string
  semester: string
  isActive: boolean
}

export default function BlockchainStoragePage() {
  const { toast } = useToast()
  const { address, isConnected } = useAccount()
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [studentCount, setStudentCount] = useState<number>(0)
  const [currentProcessingEnrollment, setCurrentProcessingEnrollment] = useState<string | null>(null)

  // Contract write hook
  const {
    writeContract,
    isPending: isWritePending,
    data: hash,
    isSuccess: isWriteSuccess,
    isError,
    error,
  } = useWriteContract()

  // Wait for transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Update student count
  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await fetch(`/api/blockchain/student-count`)
        const data = await response.json()
        if (data.success) {
          setStudentCount(data.count)
        }
      } catch (error) {
        console.error("Error fetching student count:", error)
      }
    }

    fetchStudentCount()
    // Set up an interval to refresh the count
    const interval = setInterval(fetchStudentCount, 30000) // every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Show toast on transaction success or error
  useEffect(() => {
    if (isConfirmed && hash) {
      toast({
        title: "Transaction Confirmed",
        description: "Enrollment data has been stored on the blockchain",
      })

      // Update the enrollment in the database with the actual transaction hash
      if (currentProcessingEnrollment) {
        updateEnrollmentWithHash(currentProcessingEnrollment, hash)
      }
    }
    if (isError && error) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to store enrollment data on blockchain",
        variant: "destructive",
      })

      // Update enrollment status to failed
      if (currentProcessingEnrollment) {
        setEnrollments((prev) => {
          const updated = [...prev]
          const index = updated.findIndex((enroll) => enroll.ipfsCid === currentProcessingEnrollment)
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              status: "failed",
            }
          }
          return updated
        })
        setCurrentProcessingEnrollment(null)
        setIsProcessing(false)
      }
    }
  }, [isConfirmed, isError, error, hash, toast, currentProcessingEnrollment])

  // Update enrollment with transaction hash
  const updateEnrollmentWithHash = async (enrollmentId: string, txHash: `0x${string}`) => {
    try {
      const response = await fetch("/api/blockchain/process-enrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enrollmentId,
          txHash,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Update enrollment status to stored with the actual transaction hash
        setEnrollments((prev) => {
          const updated = [...prev]
          const index = updated.findIndex((enroll) => enroll.ipfsCid === enrollmentId)
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              status: "stored",
              txHash: txHash,
            }
          }
          return updated
        })
      } else {
        console.error("Failed to update enrollment with hash:", result.message)
      }
    } catch (error) {
      console.error("Error updating enrollment with hash:", error)
    } finally {
      setCurrentProcessingEnrollment(null)
      setIsProcessing(false)
    }
  }

  // Fetch enrollments from MongoDB
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch all enrollments
        const response = await fetch("/api/enrollments")
        const result = await response.json()

        if (response.ok && result.success && result.data && result.data.length > 0) {
          const formattedEnrollments = result.data.map((enrollment: any) => ({
            id: enrollment._id || enrollment.ipfsCid,
            studentId: enrollment.studentId,
            studentName: enrollment.studentName,
            program: enrollment.program,
            university: "University of Technology",
            date: new Date(enrollment.updatedAt).toLocaleDateString(),
            status: enrollment.blockchainStatus || "pending",
            txHash: enrollment.blockchainReference,
            ipfsCid: enrollment.ipfsCid,
            icNumber: enrollment.icNumber || "",
            enrollmentType: enrollment.enrollmentType,
            semester: enrollment.semester,
            isActive: enrollment.isActive,
          }))

          setEnrollments(formattedEnrollments)
        } else {
          // If no enrollments found, use mock data
          setEnrollments([
            {
              id: "enroll-1",
              studentId: "STU-2023-12345",
              studentName: "Ahmad Bin Abdullah",
              program: "Bachelor of Computer Science",
              university: "University of Technology",
              date: "2023-05-15",
              status: "stored",
              txHash: "0x7f9e8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d",
              ipfsCid: "QmX7bVbVH5mKgbFJ9xJ4...",
              icNumber: "901234-56-7890",
              enrollmentType: "fullTime",
              semester: "3",
              isActive: true,
            },
            {
              id: "enroll-2",
              studentId: "STU-2023-12346",
              studentName: "Siti Binti Mohamed",
              program: "Bachelor of Business Administration",
              university: "University of Technology",
              date: "2023-05-15",
              status: "pending",
              ipfsCid: "QmX7bVbVH5mKgbFJ9xJ5...",
              icNumber: "901234-56-7891",
              enrollmentType: "partTime",
              semester: "2",
              isActive: true,
            },
            {
              id: "enroll-3",
              studentId: "STU-2023-12347",
              studentName: "John Smith",
              program: "Bachelor of Engineering",
              university: "University of Technology",
              date: "2023-05-14",
              status: "failed",
              ipfsCid: "QmX7bVbVH5mKgbFJ9xJ6...",
              icNumber: "901234-56-7892",
              enrollmentType: "fullTime",
              semester: "4",
              isActive: false,
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error)
        toast({
          title: "Error",
          description: "Failed to fetch enrollments",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const processNextEnrollment = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to process enrollments",
        variant: "destructive",
      })
      return
    }

    const pendingEnrollment = enrollments.find((enroll) => enroll.status === "pending")
    if (!pendingEnrollment || !pendingEnrollment.ipfsCid) {
      toast({
        title: "No Pending Enrollments",
        description: "There are no pending enrollments to process",
      })
      return
    }

    // Check if we have all required data
    if (!pendingEnrollment.studentId || !pendingEnrollment.ipfsCid) {
      toast({
        title: "Missing Data",
        description: "Enrollment is missing required data for blockchain storage",
        variant: "destructive",
      })
      return
    }

    // Update enrollment status to processing
    setEnrollments((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((enroll) => enroll.ipfsCid === pendingEnrollment.ipfsCid)
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          status: "processing",
        }
      }
      return updated
    })

    setIsProcessing(true)
    setCurrentProcessingEnrollment(pendingEnrollment.ipfsCid)

    try {
      // Extract numeric part from studentId (assuming format like "STU-2023-12345")
      const studentIdNumber = pendingEnrollment.studentId.split("-").pop() || "0"

      // Call the smart contract function
      writeContract({
        address: UNIVERSITY_CONTRACT_ADDRESS,
        abi: UNIVERSITY_CONTRACT_ABI,
        functionName: "storeStudentData",
        args: [
          BigInt(studentIdNumber), // Convert to BigInt for uint256
          pendingEnrollment.ipfsCid, // Use enrollment IPFS hash
          "", // No certificate hash for now
          pendingEnrollment.icNumber || "",
        ],
      })
    } catch (error) {
      console.error("Error processing enrollment:", error)
      toast({
        title: "Error",
        description: "Failed to process enrollment",
        variant: "destructive",
      })

      // Update enrollment status to failed
      setEnrollments((prev) => {
        const updated = [...prev]
        const index = updated.findIndex((enroll) => enroll.ipfsCid === pendingEnrollment.ipfsCid)
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            status: "failed",
          }
        }
        return updated
      })

      setCurrentProcessingEnrollment(null)
      setIsProcessing(false)
    }
  }

  const handleRetry = async (enrollment: EnrollmentItem) => {
    if (!enrollment.ipfsCid) return

    // Update the enrollment status to pending
    setEnrollments((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((e) => e.ipfsCid === enrollment.ipfsCid)
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          status: "pending",
        }
      }
      return updated
    })

    toast({
      title: "Enrollment Queued",
      description: "Enrollment has been queued for processing",
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

  const getEnrollmentTypeBadge = (type: string, isActive: boolean) => {
    if (!isActive) {
      return <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    }

    switch (type) {
      case "fullTime":
        return <Badge className="bg-green-100 text-green-800">Full-time</Badge>
      case "partTime":
        return <Badge className="bg-amber-100 text-amber-800">Part-time</Badge>
      case "distance":
        return <Badge className="bg-blue-100 text-blue-800">Distance</Badge>
      case "exchange":
        return <Badge className="bg-purple-100 text-purple-800">Exchange</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>
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
        <h1 className="text-3xl font-bold">Store Enrollment Data on Blockchain</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Storage Queue</CardTitle>
              <CardDescription>Enrollment records waiting to be stored on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-800"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className={`flex flex-wrap items-center justify-between gap-4 rounded-md border p-4 ${
                        enrollment.status === "processing" ? "border-blue-200 bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <h3 className="font-medium">{enrollment.studentName}</h3>
                          <div className="flex flex-wrap gap-2 items-center">
                            <p className="text-sm text-gray-500">
                              {enrollment.studentId} • Semester {enrollment.semester}
                            </p>
                            {getEnrollmentTypeBadge(enrollment.enrollmentType, enrollment.isActive)}
                          </div>
                          {enrollment.icNumber && <p className="text-xs text-gray-500">IC: {enrollment.icNumber}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(enrollment.status)}
                        {enrollment.status === "stored" && (
                          <div className="hidden text-xs text-gray-500 sm:block">
                            TX: {enrollment.txHash?.substring(0, 10)}...
                          </div>
                        )}
                        {enrollment.status === "failed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs"
                            onClick={() => handleRetry(enrollment)}
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
                {enrollments.filter((e) => e.status === "pending").length} pending •
                {enrollments.filter((e) => e.status === "stored").length} stored
              </div>
              <Button
                onClick={processNextEnrollment}
                disabled={
                  isProcessing ||
                  isWritePending ||
                  isConfirming ||
                  !enrollments.some((e) => e.status === "pending") ||
                  !isConnected
                }
              >
                {isProcessing || isWritePending || isConfirming ? "Processing..." : "Process Next Enrollment"}
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
                {(isProcessing || isWritePending || isConfirming) && (
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex gap-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-600"></div>
                      <div>
                        <h3 className="font-medium">
                          {isConfirming ? "Confirming Transaction" : "Processing Transaction"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {isConfirming
                            ? "Waiting for blockchain confirmation..."
                            : "Storing enrollment data on the blockchain..."}
                        </p>
                        {hash && (
                          <p className="mt-1 text-xs text-gray-500">
                            TX: {hash.substring(0, 10)}...{hash.substring(hash.length - 8)}
                          </p>
                        )}
                      </div>
                    </div>
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
                            <span>Total Enrollments:</span>
                            <span className="font-medium">{enrollments.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Stored Today:</span>
                            <span className="font-medium">
                              {enrollments.filter((e) => e.status === "stored").length}
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
