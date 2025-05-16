"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import Sidebar from "@/components/sidebar"
import TopNavbar from "@/components/top-navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil } from "lucide-react"
import EditInstructionModal from "@/components/edit-instruction-modal"

// Define the languages available for translation
const languages = [
  "English",
  "Assamese",
  "Bengali",
  "Gujarati",
  "Hindi",
  "Malayalam",
  "Marathi",
  "Kannada",
  "Oriya",
  "Punjabi",
  "Tamil",
  "Telugu",
]

// Define the instruction interface
interface Instruction {
  id: string
  name: string
  translations: Record<string, string>
  createdBy: "admin" | "doctor"
}

export default function InstructionsTranslationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentInstruction, setCurrentInstruction] = useState<Instruction | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Sample data
  const [instructions, setInstructions] = useState<Instruction[]>([
    {
      id: "1",
      name: "Salt Restricted and High protein Diet",
      translations: {
        English: "Salt Restricted and High protein Diet",
      },
      createdBy: "admin",
    },
    {
      id: "2",
      name: "Take medicine after food",
      translations: {
        English: "Take medicine after food",
        Hindi: "भोजन के बाद दवा लें",
        Tamil: "உணவுக்குப் பிறகு மருந்து எடுத்துக் கொள்ளுங்கள்",
      },
      createdBy: "doctor",
    },
    {
      id: "3",
      name: "Drink plenty of water",
      translations: {
        English: "Drink plenty of water",
        Hindi: "खूब पानी पियें",
        Bengali: "প্রচুর জল পান করুন",
      },
      createdBy: "admin",
    },
  ])

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  const handleResetSearch = () => {
    setSearchQuery("")
  }

  const handleEditInstruction = (instruction: Instruction) => {
    setCurrentInstruction(instruction)
    setIsEditModalOpen(true)
  }

  const handleSaveTranslations = (instructionId: string, translations: Record<string, string>) => {
    setInstructions(
      instructions.map((instruction) => {
        if (instruction.id === instructionId) {
          return {
            ...instruction,
            translations,
          }
        }
        return instruction
      }),
    )
    setIsEditModalOpen(false)
  }

  // Filter instructions based on search query
  const filteredInstructions = instructions.filter((instruction) =>
    instruction.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <TopNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Card className="shadow-sm">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-medium text-slate-700">Instructions</h1>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Search
                    </Button>
                    <Button onClick={handleResetSearch} variant="outline" className="border-gray-300 hover:bg-gray-100">
                      Reset Search
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm text-gray-600">Admin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-400 rounded"></div>
                    <span className="text-sm text-gray-600">Doctor</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto border rounded-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px] bg-gray-50">Instruction</TableHead>
                      {languages.map((language) => (
                        <TableHead key={language} className="min-w-[120px] bg-gray-50">
                          {language}
                        </TableHead>
                      ))}
                      <TableHead className="w-[80px] bg-gray-50">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstructions.map((instruction) => (
                      <TableRow key={instruction.id}>
                        <TableCell
                          className={`font-medium ${instruction.createdBy === "admin" ? "text-red-500" : "text-orange-400"}`}
                        >
                          {instruction.name}
                        </TableCell>
                        {languages.map((language) => (
                          <TableCell key={language}>{instruction.translations[language] || "-"}</TableCell>
                        ))}
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditInstruction(instruction)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                {[10, 25, 50, 100].map((value) => (
                  <Button
                    key={value}
                    variant={itemsPerPage === value ? "default" : "outline"}
                    className={`px-3 py-1 h-8 ${
                      itemsPerPage === value ? "bg-gray-200 text-gray-800" : "bg-white text-gray-600 border-gray-300"
                    }`}
                    onClick={() => setItemsPerPage(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </main>
      </div>

      {currentInstruction && (
        <EditInstructionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          instruction={currentInstruction}
          languages={languages}
          onSave={handleSaveTranslations}
        />
      )}
    </div>
  )
}
