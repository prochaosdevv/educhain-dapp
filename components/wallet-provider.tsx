"use client"

import { type ReactNode, useEffect, useState } from "react"
import { RainbowKitProvider, getDefaultWallets, lightTheme, darkTheme } from "@rainbow-me/rainbowkit"
import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useTheme } from "next-themes"

// Create a client
const queryClient = new QueryClient()

// Configure chains & providers
const { connectors } = getDefaultWallets({
  appName: "Blockchain Certificate Management",
  projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
  chains: [mainnet, sepolia],
})

// Create wagmi config
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
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
        <RainbowKitProvider
          theme={
            resolvedTheme === "dark"
              ? darkTheme({
                  accentColor: "hsl(var(--primary))",
                  accentColorForeground: "hsl(var(--primary-foreground))",
                  borderRadius: "medium",
                  fontStack: "system",
                })
              : lightTheme({
                  accentColor: "hsl(var(--primary))",
                  accentColorForeground: "hsl(var(--primary-foreground))",
                  borderRadius: "medium",
                  fontStack: "system",
                })
          }
          modalSize="compact"
        >
          {mounted && children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
