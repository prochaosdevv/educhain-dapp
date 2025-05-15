"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Shield, GraduationCap, Briefcase, FileCheck, Database, Wallet } from "lucide-react"
import { CustomConnectButton } from "@/components/custom-connect-button"
import { useAccount } from "wagmi"

export default function Home() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Blockchain Certificate Management System
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Secure, verifiable, and tamper-proof academic credentials
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <Card className="border-2 border-blue-200 dark:border-blue-900">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Wallet className="h-10 w-10 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
                <CardDescription>
                  Please connect your wallet to access the blockchain certificate management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/30">
                    <h3 className="mb-2 font-medium">Why connect a wallet?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your wallet is used to securely interact with the blockchain, verify certificates, and manage your
                      digital identity.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <CustomConnectButton />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                By connecting your wallet, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Blockchain Certificate Management
            </h1>
            <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">
              Secure, verifiable, and tamper-proof academic credentials
            </p>
          </div>
          <CustomConnectButton />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* University Admin */}
          <Card className="overflow-hidden border-2 border-blue-200 dark:border-blue-900">
            <CardHeader className="bg-blue-100 dark:bg-blue-900">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-700 dark:text-blue-300" />
                <CardTitle>University Admin</CardTitle>
              </div>
              <CardDescription>Manage certificates and student enrollment</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Issue new certificates and manage student enrollment records
                </p>
                <div className="space-y-6">
                  <Link href="/university-admin/issue-certificate">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Issue Certificate</Button>
                  </Link>
                  <Link href="/university-admin/update-enrollment">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Update Student Enrollment</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student */}
          <Card className="overflow-hidden border-2 border-green-200 dark:border-green-900">
            <CardHeader className="bg-green-100 dark:bg-green-900">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-green-700 dark:text-green-300" />
                <CardTitle>Student</CardTitle>
              </div>
              <CardDescription>Access your academic certificates</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View and share your blockchain-verified certificates
                </p>
                <div className="space-y-2">
                  <Link href="/student/view-certificate">
                    <Button className="w-full bg-green-600 hover:bg-green-700">View Certificate</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employer */}
          <Card className="overflow-hidden border-2 border-purple-200 dark:border-purple-900">
            <CardHeader className="bg-purple-100 dark:bg-purple-900">
              <div className="flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-purple-700 dark:text-purple-300" />
                <CardTitle>Employer</CardTitle>
              </div>
              <CardDescription>Verify candidate credentials</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Verify the authenticity of academic certificates
                </p>
                <div className="space-y-2">
                  <Link href="/employer/verify-certificate">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Verify Certificate</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PTPTN Officer */}
          <Card className="overflow-hidden border-2 border-amber-200 dark:border-amber-900">
            <CardHeader className="bg-amber-100 dark:bg-amber-900">
              <div className="flex items-center gap-3">
                <FileCheck className="h-8 w-8 text-amber-700 dark:text-amber-300" />
                <CardTitle>PTPTN Officer</CardTitle>
              </div>
              <CardDescription>Verify enrollment for loans</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Verify student enrollment status for loan disbursement
                </p>
                <div className="space-y-2">
                  <Link href="/ptptn/verify-enrollment">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">Verify Enrollment for Loan</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System */}
          <Card className="overflow-hidden border-2 border-gray-200 dark:border-gray-700 md:col-span-2 lg:col-span-1">
            <CardHeader className="bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                <CardTitle>System</CardTitle>
              </div>
              <CardDescription>Blockchain certificate management</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Automated blockchain operations for certificate management
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Link href="/system/blockchain-storage">
                    <Button className="w-full bg-gray-600 hover:bg-gray-700">Store Certificate on Blockchain</Button>
                  </Link>
                  <Link href="/system/retrieve-data">
                    <Button className="w-full bg-gray-600 hover:bg-gray-700">Retrieve Certificate Data</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
