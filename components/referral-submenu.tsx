"use client"

import { PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function ReferralSubmenu() {
  const pathname = usePathname()

  return (
    <div className="w-[250px] bg-slate-800 text-white rounded-sm shadow-lg">
      <Link href="/">
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start rounded-none ${
            pathname === "/" ? "text-green-400" : "text-gray-400"
          } hover:text-white hover:bg-slate-700 px-4 py-3`}
        >
          <PenLine className={`h-4 w-4 mr-3 ${pathname === "/" ? "text-green-400" : "text-gray-400"}`} />
          Referred By
        </Button>
      </Link>
      <Link href="/referred-to">
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start rounded-none ${
            pathname === "/referred-to" ? "text-green-400" : "text-gray-400"
          } hover:text-white hover:bg-slate-700 px-4 py-3`}
        >
          <PenLine className={`h-4 w-4 mr-3 ${pathname === "/referred-to" ? "text-green-400" : "text-gray-400"}`} />
          Referred To
        </Button>
      </Link>
      <Link href="/test-referrals">
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start rounded-none ${
            pathname === "/test-referrals" ? "text-green-400" : "text-gray-400"
          } hover:text-white hover:bg-slate-700 px-4 py-3`}
        >
          <PenLine className={`h-4 w-4 mr-3 ${pathname === "/test-referrals" ? "text-green-400" : "text-gray-400"}`} />
          Test Referrals
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start rounded-none text-gray-400 hover:text-white hover:bg-slate-700 px-4 py-3"
      >
        <PenLine className="h-4 w-4 mr-3 text-gray-400" />
        Procedure Referrals
      </Button>
    </div>
  )
}
