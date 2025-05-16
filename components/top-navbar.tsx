import { Bell, HelpCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TopNavbar() {
  return (
    <header className="bg-blue-800 text-white p-3 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold mr-8">
          docterz
        </Link>
        <span className="text-xs text-blue-200">Drug</span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white border-none">
          Admin Account
        </Button>
        <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white border-none">
          Business Analytics
        </Button>
        <Button variant="outline" className="bg-green-500 hover:bg-green-600 text-white border-none">
          <span className="mr-1">✆</span> Support
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <span>Amit Miglani</span>
            <span className="text-xs text-blue-200 ml-1">▼</span>
          </div>
        </div>
      </div>
    </header>
  )
}
