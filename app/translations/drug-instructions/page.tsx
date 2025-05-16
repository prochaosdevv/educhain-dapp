"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Sidebar from "@/components/sidebar"
import TopNavbar from "@/components/top-navbar"
import { Plus } from "lucide-react"

export default function DrugInstructionsTranslationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <TopNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Card className="shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-medium text-slate-700">
                    Drug Instructions <span className="text-slate-500 font-normal">Translations</span>
                  </h1>
                </div>
                <Button className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">
                  <Plus className="h-4 w-4 mr-2" /> Add Translation
                </Button>
              </div>
              <div className="text-center text-gray-500 py-8">
                This is a placeholder for the Drug Instructions Translations page.
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
