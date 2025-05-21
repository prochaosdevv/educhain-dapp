"use client"

import type React from "react"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CustomConnectButton } from "./custom-connect-button"

interface HeaderWithWalletProps {
  icon: React.ReactNode
  title: string
  color: string
}

export function HeaderWithWallet({ icon, title, color }: HeaderWithWalletProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2">
        <Link href="/" className={`flex items-center text-${color}-600 hover:text-${color}-800`}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
        <div className="flex items-center gap-3">
          {icon}
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
      </div>
      <CustomConnectButton />
    </div>
  )
}
