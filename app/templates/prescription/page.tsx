"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import Sidebar from "@/components/sidebar"
import TopNavbar from "@/components/top-navbar"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AddPrescriptionTemplateModal from "@/components/add-prescription-template-modal"
import EditPrescriptionTemplateModal from "@/components/edit-prescription-template-modal"

interface PrescriptionTemplate {
  id: string
  name: string
  diagnosis: string
  weight: string
  createdAt: string
  startWeight?: string
  endWeight?: string
  drugs?: string[]
  complaints?: string[]
  findings?: string[]
  instructions?: string[]
  handouts?: string[]
  tests?: string[]
  procedures?: string[]
  referralDoctors?: string[]
  followUpValue?: string
  followUpUnit?: string
}

// Sample prescription template data
const prescriptionTemplateData: PrescriptionTemplate[] = [
  {
    id: "1",
    name: "Adult Amoxicillin",
    diagnosis: "Respiratory Infection",
    weight: "60-80kg",
    createdAt: "2025-05-01",
  },
  {
    id: "2",
    name: "Pediatric Amoxicillin",
    diagnosis: "Ear Infection",
    weight: "10-20kg",
    createdAt: "2025-05-02",
  },
  {
    id: "3",
    name: "Adult Ibuprofen",
    diagnosis: "Pain Relief",
    weight: "60-80kg",
    createdAt: "2025-05-03",
  },
]

export default function PrescriptionTemplatesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<PrescriptionTemplate | null>(null)
  const [templates, setTemplates] = useState<PrescriptionTemplate[]>(prescriptionTemplateData)
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddTemplate = () => {
    setIsAddModalOpen(true)
  }

  const handleEditTemplate = (template: PrescriptionTemplate) => {
    setCurrentTemplate(template)
    setIsEditModalOpen(true)
  }

  const handleSaveTemplate = (template: {
    name: string
    diagnosis: string
    startWeight: string
    endWeight: string
    drugs: string[]
    complaints: string[]
    findings: string[]
    instructions: string[]
    handouts: string[]
    tests: string[]
    procedures: string[]
    referralDoctors: string[]
    followUpValue: string
    followUpUnit: string
  }) => {
    // Format weight range for display
    const weightDisplay =
      template.startWeight && template.endWeight
        ? `${template.startWeight}-${template.endWeight}kg`
        : template.startWeight
          ? `${template.startWeight}kg+`
          : template.endWeight
            ? `0-${template.endWeight}kg`
            : ""

    const newTemplate: PrescriptionTemplate = {
      id: Date.now().toString(),
      name: template.name,
      diagnosis: template.diagnosis,
      weight: weightDisplay,
      createdAt: new Date().toISOString().split("T")[0],
      startWeight: template.startWeight,
      endWeight: template.endWeight,
      drugs: template.drugs,
      complaints: template.complaints,
      findings: template.findings,
      instructions: template.instructions,
      handouts: template.handouts,
      tests: template.tests,
      procedures: template.procedures,
      referralDoctors: template.referralDoctors,
      followUpValue: template.followUpValue,
      followUpUnit: template.followUpUnit,
    }

    setTemplates([...templates, newTemplate])
    setIsAddModalOpen(false)
  }

  const handleUpdateTemplate = (
    templateId: string,
    template: {
      name: string
      diagnosis: string
      startWeight: string
      endWeight: string
      drugs: string[]
      complaints: string[]
      findings: string[]
      instructions: string[]
      handouts: string[]
      tests: string[]
      procedures: string[]
      referralDoctors: string[]
      followUpValue: string
      followUpUnit: string
    },
  ) => {
    // Format weight range for display
    const weightDisplay =
      template.startWeight && template.endWeight
        ? `${template.startWeight}-${template.endWeight}kg`
        : template.startWeight
          ? `${template.startWeight}kg+`
          : template.endWeight
            ? `0-${template.endWeight}kg`
            : ""

    const updatedTemplate: PrescriptionTemplate = {
      id: templateId,
      name: template.name,
      diagnosis: template.diagnosis,
      weight: weightDisplay,
      createdAt: new Date().toISOString().split("T")[0],
      startWeight: template.startWeight,
      endWeight: template.endWeight,
      drugs: template.drugs,
      complaints: template.complaints,
      findings: template.findings,
      instructions: template.instructions,
      handouts: template.handouts,
      tests: template.tests,
      procedures: template.procedures,
      referralDoctors: template.referralDoctors,
      followUpValue: template.followUpValue,
      followUpUnit: template.followUpUnit,
    }

    setTemplates(templates.map((t) => (t.id === templateId ? updatedTemplate : t)))
    setIsEditModalOpen(false)
  }

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId))
  }

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.weight.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <TopNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Card className="shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-medium text-slate-700">
                  Template <span className="text-slate-500 font-normal">Listing</span>
                </h1>
                <Button
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  onClick={handleAddTemplate}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add New
                </Button>
              </div>

              <div className="rounded-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Name</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                          No templates found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">{template.name}</TableCell>
                          <TableCell>{template.diagnosis}</TableCell>
                          <TableCell>{template.weight}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)}>
                                <Pencil className="h-4 w-4 text-slate-500" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                                <Trash2 className="h-4 w-4 text-slate-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </main>
      </div>

      <AddPrescriptionTemplateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveTemplate}
      />
      {currentTemplate && (
        <EditPrescriptionTemplateModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateTemplate}
          template={currentTemplate}
        />
      )}
    </div>
  )
}
