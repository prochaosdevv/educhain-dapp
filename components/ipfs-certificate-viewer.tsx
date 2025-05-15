"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink, Download } from "lucide-react"
import { getIPFSUrl } from "@/lib/ipfs-service"

interface IPFSCertificateViewerProps {
  cid: string
  filename?: string
}

export function IPFSCertificateViewer({ cid, filename }: IPFSCertificateViewerProps) {
  const [certificateData, setCertificateData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        setLoading(true)
        const url = getIPFSUrl(cid, filename)
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch certificate: ${response.statusText}`)
        }

        const data = await response.json()
        setCertificateData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching certificate:", err)
        setError("Failed to load certificate data from IPFS")
      } finally {
        setLoading(false)
      }
    }

    if (cid) {
      fetchCertificateData()
    }
  }, [cid, filename])

  if (loading) {
    return (
      <Card className="p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2">Loading certificate data from IPFS...</p>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8">
        <p className="text-red-500">{error}</p>
      </Card>
    )
  }

  if (!certificateData) {
    return (
      <Card className="p-8">
        <p>No certificate data found</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Certificate Details</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open(getIPFSUrl(cid, filename), "_blank")}>
              <ExternalLink className="h-4 w-4 mr-1" />
              View on IPFS
            </Button>
            {certificateData.fileUrl && (
              <Button variant="outline" size="sm" onClick={() => window.open(certificateData.fileUrl, "_blank")}>
                <Download className="h-4 w-4 mr-1" />
                Download File
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Student ID</p>
            <p className="font-medium">{certificateData.studentId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Student Name</p>
            <p className="font-medium">{certificateData.studentName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Program/Degree</p>
            <p className="font-medium">{certificateData.program}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Certificate Type</p>
            <p className="font-medium">{certificateData.certificateType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Issue Date</p>
            <p className="font-medium">
              {certificateData.issueDate ? new Date(certificateData.issueDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Graduation Date</p>
            <p className="font-medium">
              {certificateData.graduationDate ? new Date(certificateData.graduationDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Achievements/Honors</p>
            <p className="font-medium">{certificateData.achievements || "None"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Issuer</p>
            <p className="font-medium font-mono text-xs">{certificateData.issuer}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Issued At</p>
            <p className="font-medium">
              {certificateData.issuedAt ? new Date(certificateData.issuedAt).toLocaleString() : "N/A"}
            </p>
          </div>
          {certificateData.fileCID && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">File CID</p>
              <p className="font-medium font-mono text-xs">{certificateData.fileCID}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
