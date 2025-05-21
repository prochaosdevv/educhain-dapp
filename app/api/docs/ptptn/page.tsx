"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Send } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function PTPTNApiDocsPage() {
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(
      {
        studentId: "STU-2019-12345",
        icNumber: "901234-56-7890",
      },
      null,
      2,
    ),
  )

  const [responseBody, setResponseBody] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTestApi = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ptptn/verify-loan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      })

      const data = await response.json()
      setResponseBody(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponseBody(JSON.stringify({ error: "Failed to connect to API" }, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/" className="flex items-center text-amber-600 hover:text-amber-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <FileText className="h-8 w-8 text-amber-700" />
        <h1 className="text-3xl font-bold">PTPTN API Documentation</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Loan Verification API</CardTitle>
          <CardDescription>API for verifying student enrollment status for loan disbursement purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="test">Test API</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Introduction</h3>
                  <p className="text-gray-600">
                    The PTPTN Loan Verification API allows authorized systems to verify student enrollment status for
                    loan disbursement purposes. This API connects to the blockchain-based certificate and enrollment
                    verification system to provide secure and tamper-proof verification.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Authentication</h3>
                  <p className="text-gray-600">
                    API requests require authentication using an API key. Contact the system administrator to obtain an
                    API key for your application.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Rate Limits</h3>
                  <p className="text-gray-600">
                    The API is rate-limited to 100 requests per minute per API key. Exceeding this limit will result in
                    HTTP 429 (Too Many Requests) responses.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="endpoints">
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">POST</span>
                    <code className="text-sm font-mono">/api/ptptn/verify-loan</code>
                  </div>
                  <p className="mb-4 text-gray-600">Verify student enrollment status for loan disbursement</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium">Request Body</h4>
                    <pre className="mt-2 rounded-md bg-gray-100 p-4 text-sm overflow-auto">
                      {`{
  "studentId": "STU-2019-12345",  // Required
  "icNumber": "901234-56-7890"    // Optional
}`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Response</h4>
                    <pre className="mt-2 rounded-md bg-gray-100 p-4 text-sm overflow-auto">
                      {`{
  "success": true,
  "message": "Student enrollment verification completed",
  "verificationResult": "active", // "active", "inactive", or "partial"
  "studentData": {
    "studentId": "STU-2019-12345",
    "studentName": "Ahmad Bin Abdullah",
    "institution": "University of Technology",
    "program": "Bachelor of Computer Science",
    "currentSemester": "5",
    "enrollmentStatus": "Full-time",
    "financialStatus": "Fees Paid",
    "lastVerified": "2023-05-15T08:30:00.000Z",
    "ipfsCid": "QmX7bVbVH5mKgbFJ9xJ4...",
    "blockchainReference": "0x7f9e8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d"
  }
}`}
                    </pre>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">GET</span>
                    <code className="text-sm font-mono">/api/ptptn/verify-loan</code>
                  </div>
                  <p className="mb-4 text-gray-600">Check API status</p>

                  <div>
                    <h4 className="text-sm font-medium">Response</h4>
                    <pre className="mt-2 rounded-md bg-gray-100 p-4 text-sm overflow-auto">
                      {`{
  "success": true,
  "message": "PTPTN Loan Verification API is operational",
  "version": "1.0.0"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="test">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <Label htmlFor="request-body">Request Body</Label>
                    <Textarea
                      id="request-body"
                      className="font-mono h-64"
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleTestApi} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700">
                    {isLoading ? "Sending..." : "Send Request"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor="response-body">Response</Label>
                  <Textarea id="response-body" className="font-mono h-64" readOnly value={responseBody} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
          <CardDescription>Code examples for integrating with the PTPTN API</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript">
            <TabsList className="mb-4">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="php">PHP</TabsTrigger>
            </TabsList>

            <TabsContent value="javascript">
              <pre className="rounded-md bg-gray-100 p-4 text-sm overflow-auto">
                {`// Using fetch API
async function verifyEnrollment(studentId, icNumber) {
  const response = await fetch('https://your-domain.com/api/ptptn/verify-loan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      studentId,
      icNumber
    })
  });
  
  const data = await response.json();
  return data;
}

// Example usage
verifyEnrollment('STU-2019-12345', '901234-56-7890')
  .then(result => {
    console.log('Verification result:', result.verificationResult);
    console.log('Student data:', result.studentData);
  })
  .catch(error => {
    console.error('Error:', error);
  });`}
              </pre>
            </TabsContent>

            <TabsContent value="python">
              <pre className="rounded-md bg-gray-100 p-4 text-sm overflow-auto">
                {`import requests
import json

def verify_enrollment(student_id, ic_number):
    url = 'https://your-domain.com/api/ptptn/verify-loan'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    }
    payload = {
        'studentId': student_id,
        'icNumber': ic_number
    }
    
    response = requests.post(url, headers=headers, json=payload)
    return response.json()

# Example usage
try:
    result = verify_enrollment('STU-2019-12345', '901234-56-7890')
    print('Verification result:', result['verificationResult'])
    print('Student data:', result['studentData'])
except Exception as e:
    print('Error:', str(e))`}
              </pre>
            </TabsContent>

            <TabsContent value="php">
              <pre className="rounded-md bg-gray-100 p-4 text-sm overflow-auto">
                {`<?php
function verifyEnrollment($studentId, $icNumber) {
    $url = 'https://your-domain.com/api/ptptn/verify-loan';
    $data = array(
        'studentId' => $studentId,
        'icNumber' => $icNumber
    );
    
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/json\r\nAuthorization: Bearer YOUR_API_KEY\r\n",
            'method'  => 'POST',
            'content' => json_encode($data)
        )
    );
    
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    return json_decode($result, true);
}

// Example usage
try {
    $result = verifyEnrollment('STU-2019-12345', '901234-56-7890');
    echo 'Verification result: ' . $result['verificationResult'] . PHP_EOL;
    echo 'Student data: ' . print_r($result['studentData'], true) . PHP_EOL;
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
}
?>`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
