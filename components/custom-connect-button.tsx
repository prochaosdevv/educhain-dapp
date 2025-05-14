"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

// This is a simplified mock connect button for the preview environment
export function CustomConnectButton() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")

  const handleConnect = () => {
    setIsConnected(true)
    setAddress("0x1234...5678")
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress("")
  }

  if (!isConnected) {
    return (
      <Button onClick={handleConnect} type="button" className="bg-blue-600 hover:bg-blue-700">
        Connect Wallet
      </Button>
    )
  }

  return (
    <div className="flex gap-2">
      <Button type="button" variant="outline" className="flex items-center gap-1">
        Ethereum
      </Button>
      <Button onClick={handleDisconnect} type="button" className="bg-blue-600 hover:bg-blue-700">
        {address}
      </Button>
    </div>
  )
}
