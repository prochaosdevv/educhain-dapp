"use client"

import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function TranslationsSubmenu() {
  const pathname = usePathname()

  return (
    <div className="w-[250px] bg-slate-800 text-white rounded-sm shadow-lg">
      <Link href="/translations/instructions">
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start rounded-none ${
            pathname === "/translations/instructions" ? "text-green-400" : "text-gray-400"
          } hover:text-white hover:bg-slate-700 px-4 py-3`}
        >
          <FileText
            className={`h-4 w-4 mr-3 ${pathname === "/translations/instructions" ? "text-green-400" : "text-gray-400"}`}
          />
          Instructions
        </Button>
      </Link>
      <Link href="/translations/drug-instructions">
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start rounded-none ${
            pathname === "/translations/drug-instructions" ? "text-green-400" : "text-gray-400"
          } hover:text-white hover:bg-slate-700 px-4 py-3`}
        >
          <FileText
            className={`h-4 w-4 mr-3 ${pathname === "/translations/drug-instructions" ? "text-green-400" : "text-gray-400"}`}
          />
          Drug Instructions
        </Button>
      </Link>
    </div>
  )
}
