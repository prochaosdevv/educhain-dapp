"use client"

import type React from "react"

import { useState } from "react"
import { FileText, Mail, Beaker, FileSpreadsheet, Globe, PenTool } from "lucide-react"
import Link from "next/link"
import ReferralSubmenu from "./referral-submenu"
import TemplatesSubmenu from "./templates-submenu"
import TranslationsSubmenu from "./translations-submenu"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const [showReferralMenu, setShowReferralMenu] = useState(false)
  const [showTemplatesMenu, setShowTemplatesMenu] = useState(false)
  const [showTranslationsMenu, setShowTranslationsMenu] = useState(false)
  const pathname = usePathname()

  const isReferralActive = pathname === "/" || pathname === "/referred-to" || pathname === "/test-referrals"
  const isTemplateActive = pathname?.startsWith("/templates")
  const isTranslationActive = pathname?.startsWith("/translations")

  return (
    <aside className="relative flex">
      <div className="w-[70px] bg-blue-900 text-white flex flex-col items-center py-4">
        <SidebarItem icon={<FileText className="h-5 w-5" />} label="Handouts & Images" active={false} href="#" />
        <SidebarItem
          icon={<FileSpreadsheet className="h-5 w-5" />}
          label="Vendor Management System"
          active={false}
          href="#"
        />
        <SidebarItem icon={<Mail className="h-5 w-5" />} label="Message Setting" active={false} href="#" />
        <div
          className="w-full relative"
          onMouseEnter={() => setShowReferralMenu(true)}
          onMouseLeave={() => setShowReferralMenu(false)}
        >
          <Link
            href="/"
            className={`w-full flex flex-col items-center justify-center py-4 px-2 text-center ${
              isReferralActive ? "bg-blue-800" : "hover:bg-blue-800"
            }`}
          >
            <div className="mb-1">
              <PenTool className="h-5 w-5" />
            </div>
            <span className="text-xs text-center leading-tight">Referrals</span>
          </Link>
          {showReferralMenu && (
            <div className="absolute left-[70px] top-0 z-50">
              <ReferralSubmenu />
            </div>
          )}
        </div>
        <div
          className="w-full relative"
          onMouseEnter={() => setShowTemplatesMenu(true)}
          onMouseLeave={() => setShowTemplatesMenu(false)}
        >
          <Link
            href="/templates/saved"
            className={`w-full flex flex-col items-center justify-center py-4 px-2 text-center ${
              isTemplateActive ? "bg-blue-800" : "hover:bg-blue-800"
            }`}
          >
            <div className="mb-1">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xs text-center leading-tight">Templates</span>
          </Link>
          {showTemplatesMenu && (
            <div className="absolute left-[70px] top-0 z-50">
              <TemplatesSubmenu />
            </div>
          )}
        </div>
        <div
          className="w-full relative"
          onMouseEnter={() => setShowTranslationsMenu(true)}
          onMouseLeave={() => setShowTranslationsMenu(false)}
        >
          <Link
            href="/translations/instructions"
            className={`w-full flex flex-col items-center justify-center py-4 px-2 text-center ${
              isTranslationActive ? "bg-blue-800" : "hover:bg-blue-800"
            }`}
          >
            <div className="mb-1">
              <Globe className="h-5 w-5" />
            </div>
            <span className="text-xs text-center leading-tight">Translations</span>
          </Link>
          {showTranslationsMenu && (
            <div className="absolute left-[70px] top-0 z-50">
              <TranslationsSubmenu />
            </div>
          )}
        </div>
        <SidebarItem
          icon={<Beaker className="h-5 w-5" />}
          label="Lab Trends"
          active={pathname === "/labs"}
          href="/labs"
        />
      </div>
    </aside>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active: boolean
  href: string
}

function SidebarItem({ icon, label, active, href }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`w-full flex flex-col items-center justify-center py-4 px-2 text-center ${
        active ? "bg-blue-800" : "hover:bg-blue-800"
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs text-center leading-tight">{label}</span>
    </Link>
  )
}
