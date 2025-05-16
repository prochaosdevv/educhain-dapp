"use client"

import { Save, FileText, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function TemplatesSubmenu() {
  const pathname = usePathname()

  return (
    <div className="w-[250px] bg-slate-800 text-white rounded-sm shadow-lg">
      <Link href="/templates/saved">
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start rounded-none ${
            pathname === "/templates/saved" ? "text-green-400" : "text-gray-400"
          } hover:text-white hover:bg-slate-700 px-4 py-3`}
        >
          <Save className={`h-4 w-4 mr-3 ${pathname === "/templates/saved" ? "text-green-400" : "text-gray-400"}`} />
          Saved Templates
        </Button>
      </Link>
      <Link href="/templates/prescription">
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start rounded-none ${
            pathname === "/templates/prescription" ? "text-green-400" : "text-gray-400"
          } hover:text-white hover:bg-slate-700 px-4 py-3`}
        >
          <FileText
            className={`h-4 w-4 mr-3 ${pathname === "/templates/prescription" ? "text-green-400" : "text-gray-400"}`}
          />
          Prescription Templates
        </Button>
      </Link>
      <Link href="/templates/custom">
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start rounded-none ${
            pathname === "/templates/custom" ? "text-green-400" : "text-gray-400"
          } hover:text-white hover:bg-slate-700 px-4 py-3`}
        >
          <Edit className={`h-4 w-4 mr-3 ${pathname === "/templates/custom" ? "text-green-400" : "text-gray-400"}`} />
          Custom Templates
        </Button>
      </Link>
    </div>
  )
}
