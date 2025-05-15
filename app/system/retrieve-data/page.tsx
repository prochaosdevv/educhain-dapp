"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Database, Search, Download, ExternalLink, FileText, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  getCertificatesByStudentId,
  getCertificateByIpfsCid,
  getCertificateByTxHash,
} from "@/app/actions/mongodb-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SuccessMessage } from "@/components/success-message"
import { CustomConnectButton } from "@/components/custom-connect-button"

export default function RetrieveDataPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [txHashQuery, setTxHashQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isTxSearching, setIsTxSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null)

  const handleSearch = async () => {
    if (!searchQuery) return

    setIsSearching(true)
    setSearchResults([])
    setSelectedCertificate(null)
    setError(null)
    setSuccess(null)

    try {
      // Check if the input looks like an IPFS hash
      const isIpfsHash = searchQuery.startsWith("Qm") || searchQuery.startsWith("bafy") || searchQuery.length > 30

      if (isIpfsHash) {
        // Try to find certificate by IPFS CID
        const result = await getCertificateByIpfsCid(searchQuery)

        if (result.success && result.data) {
          setSearchResults([result.data])
          setSuccess({
            title: "Certificate Found",
            message: `Found certificate with IPFS hash: ${searchQuery.substring(0, 10)}...`,
          })
        } else {
          setError("No certificate found with this IPFS hash. Please check and try again.")
        }
      } else {
        // Search by student ID
        const result = await getCertificatesByStudentId(searchQuery)

        if (result.success && result.data && result.data.length > 0) {
          setSearchResults(result.data)
          setSuccess({
            title: "Certificates Found",
            message: `Found ${result.data.length} certificate(s) for student ID ${searchQuery}.`,
          })
        } else {
          setError("No certificates found for this student ID. Please check the ID and try again.")
        }
      }
    } catch (err) {
      console.error("Error searching certificates:", err)
      setError("Failed to search certificates. Please try again later.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleTxSearch = async () => {
    if (!txHashQuery) return

    setIsTxSearching(true)
    setSearchResults([])
    setSelectedCertificate(null)
    setError(null)
    setSuccess(null)

    try {
      // Search by transaction hash
      const result = await getCertificateByTxHash(txHashQuery)

      if (result.success && result.data) {
        setSearchResults(Array.isArray(result.data) ? result.data : [result.data])
        setSuccess({
          title: "Certificate Found",
          message: `Found certificate with transaction hash: ${txHashQuery.substring(0, 10)}...`,
        })
      } else {
        setError("No certificate found with this transaction hash. Please check and try again.")
      }
    } catch (err) {
      console.error("Error searching by transaction hash:", err)
      setError("Failed to search by transaction hash. Please try again later.")
    } finally {
      setIsTxSearching(false)
    }
  }

  const handleViewCertificate = (certificate: any) => {
    setSelectedCertificate(certificate)
  }

  const handleViewPDF = (certificate: any) => {
    if (certificate && certificate.fileUrl) {
      window.open(certificate.fileUrl, "_blank")
    }
  }

  const openTxInExplorer = (txHash: string) => {
    if (txHash) {
      window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank")
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Retrieve Certificate Data</h1>
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
          <CardTitle>Certificate Data Retrieval</CardTitle>
          <CardDescription>Search and retrieve certificate data from the blockchain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="search">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="transaction">Transaction Hash</TabsTrigger>
            </TabsList>
            <TabsContent value="search" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="searchQuery">Search by Certificate ID, Student ID, or IPFS Hash</Label>
                <div className="flex gap-2">
                  <Input
                    id="searchQuery"
                    placeholder="Enter search term"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button onClick={handleSearch} disabled={isSearching || !searchQuery}>
                    {isSearching ? "Searching..." : "Search"}
                    {!isSearching && <Search className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="transaction" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="txHash">Blockchain Transaction Hash</Label>
                <div className="flex gap-2">
                  <Input
                    id="txHash"
                    placeholder="Enter transaction hash (0x...)"
                    value={txHashQuery}
                    onChange={(e) => setTxHashQuery(e.target.value)}
                  />
                  <Button onClick={handleTxSearch} disabled={isTxSearching || !txHashQuery}>
                    {isTxSearching ? "Searching..." : "Retrieve"}
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter the exact blockchain transaction hash to retrieve certificate data
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {searchResults.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="font-medium">Search Results</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((result) => (
                    <TableRow key={result.ipfsCid}>
                      <TableCell className="font-medium">{result.ipfsCid.substring(0, 10)}...</TableCell>
                      <TableCell>{result.studentName}</TableCell>
                      <TableCell>University of Technology</TableCell>
                      <TableCell>{new Date(result.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.certificateType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewCertificate(result)}
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                          {result.fileUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewPDF(result)}
                              title="View PDF"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => window.open(result.ipfsUrl, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {selectedCertificate && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Certificate Details</CardTitle>
                    <CardDescription>
                      Viewing details for certificate {selectedCertificate.ipfsCid.substring(0, 10)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Student Name</p>
                        <p>{selectedCertificate.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Student ID</p>
                        <p>{selectedCertificate.studentId}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Program</p>
                        <p>{selectedCertificate.program}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Certificate Type</p>
                        <p>{selectedCertificate.certificateType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Issue Date</p>
                        <p>{new Date(selectedCertificate.issueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Graduation Date</p>
                        <p>{new Date(selectedCertificate.graduationDate).toLocaleDateString()}</p>
                      </div>
                      {selectedCertificate.achievements && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-500">Achievements</p>
                          <p>{selectedCertificate.achievements}</p>
                        </div>
                      )}
                      {selectedCertificate.fileName && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Certificate File</p>
                          <p>{selectedCertificate.fileName}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 rounded-md bg-gray-50 p-4">
                      <h4 className="mb-2 font-medium">Blockchain Data</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">IPFS CID:</span>
                          <code className="rounded bg-gray-100 px-2 py-1 text-xs">{selectedCertificate.ipfsCid}</code>
                        </div>
                        {selectedCertificate.fileCid && (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">File CID:</span>
                            <code className="rounded bg-gray-100 px-2 py-1 text-xs">{selectedCertificate.fileCid}</code>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">Blockchain Reference:</span>
                          {selectedCertificate.blockchainReference ? (
                            <a
                              href={`https://sepolia.etherscan.io/tx/${selectedCertificate.blockchainReference}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                                {selectedCertificate.blockchainReference.substring(0, 10)}...
                              </code>
                            </a>
                          ) : (
                            <code className="rounded bg-gray-100 px-2 py-1 text-xs">Not available</code>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">Timestamp:</span>
                          <span>{new Date(selectedCertificate.issuedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">Issuer:</span>
                          <code className="rounded bg-gray-100 px-2 py-1 text-xs">{selectedCertificate.issuer}</code>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedCertificate.ipfsUrl, "_blank")}
                      >
                        <ExternalLink className="mr-1 h-4 w-4" />
                        View Data on IPFS
                      </Button>
                      {selectedCertificate.fileUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(selectedCertificate.fileUrl, "_blank")}
                        >
                          <FileText className="mr-1 h-4 w-4" />
                          View PDF on IPFS
                        </Button>
                      )}
                      {selectedCertificate.fileUrl && (
                        <Button size="sm" onClick={() => window.open(selectedCertificate.fileUrl, "_blank")}>
                          <Download className="mr-1 h-4 w-4" />
                          Download Certificate
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t bg-gray-50 px-6 py-4">
          <h3 className="mb-2 font-medium">About Certificate Data Retrieval</h3>
          <p className="text-sm text-gray-600">
            This system allows authorized users to retrieve certificate data stored on the blockchain. All certificate
            data is immutable and cryptographically secured, ensuring the integrity and authenticity of academic
            credentials.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
