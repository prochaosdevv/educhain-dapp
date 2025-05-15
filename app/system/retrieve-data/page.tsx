"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Database, Search, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function RetrieveDataPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleSearch = () => {
    if (!searchQuery) return

    setIsSearching(true)
    setSearchResults([])

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)
      setSearchResults([
        {
          id: "CERT-2023-78945",
          name: "Ahmad Bin Abdullah",
          university: "University of Technology",
          date: "2023-05-15",
          type: "Degree",
          txHash: "0x7f9e8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d",
        },
        {
          id: "CERT-2023-65432",
          name: "Ahmad Bin Abdullah",
          university: "University of Technology",
          date: "2022-11-30",
          type: "Transcript",
          txHash: "0x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b",
        },
      ])
    }, 1500)
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
        <h1 className="text-3xl font-bold">Retrieve Certificate Data</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Data Retrieval</CardTitle>
          <CardDescription>Search and retrieve certificate data from the blockchain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="search">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="transaction">Transaction Hash</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Query</TabsTrigger>
            </TabsList>
            <TabsContent value="search" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="searchQuery">Search by Certificate ID, Student Name, or University</Label>
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
                  <Input id="txHash" placeholder="Enter transaction hash (0x...)" />
                  <Button>
                    Retrieve
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter the exact blockchain transaction hash to retrieve certificate data
                </p>
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input id="university" placeholder="Enter university name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateRange">Date Range</Label>
                  <div className="flex items-center gap-2">
                    <Input id="dateFrom" type="date" className="w-full" />
                    <span>to</span>
                    <Input id="dateTo" type="date" className="w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificateType">Certificate Type</Label>
                  <Input id="certificateType" placeholder="Degree, Diploma, etc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="program">Program/Degree</Label>
                  <Input id="program" placeholder="e.g. Computer Science" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  Advanced Search
                  <Search className="ml-2 h-4 w-4" />
                </Button>
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
                    <TableRow key={result.id + result.type}>
                      <TableCell className="font-medium">{result.id}</TableCell>
                      <TableCell>{result.name}</TableCell>
                      <TableCell>{result.university}</TableCell>
                      <TableCell>{result.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="rounded-md bg-gray-50 p-4">
                <h4 className="mb-2 font-medium">Blockchain Data</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">Transaction Hash:</span>
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">{searchResults[0].txHash}</code>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">Certificate Hash:</span>
                    <code className="rounded bg-gray-100 px-2 py-1 text-xs">
                      bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
                    </code>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">Timestamp:</span>
                    <span>2023-05-15 10:23:45 UTC</span>
                  </div>
                </div>
              </div>
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
