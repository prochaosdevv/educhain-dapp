"use client"

import { type ReactNode, useEffect, useState } from "react"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useTheme } from "next-themes"

// Create a client
const queryClient = new QueryClient()

// Create a simple config for the preview environment
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider modalSize="compact">{mounted && children}</RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
