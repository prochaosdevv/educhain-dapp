"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import Sidebar from "@/components/sidebar"
import TopNavbar from "@/components/top-navbar"
import { Plus, Pencil, Trash2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddTemplateModal from "@/components/add-template-modal"
import EditTemplateModal from "@/components/edit-template-modal"

interface Template {
  id: string
  title: string
  content: string
  createdAt: string
}

// Sample template data for each category
const templateData: Record<string, Template[]> = {
  diagnoses: [
    { id: "1", title: "Common Cold", content: "Patient has symptoms of common cold.", createdAt: "2025-05-01" },
    { id: "2", title: "Hypertension", content: "Patient has high blood pressure.", createdAt: "2025-05-02" },
    { id: "3", title: "PHT", content: "CHRONIC LIVER DISEASE, PHT", createdAt: "2025-05-03" },
  ],
  complaints: [
    { id: "1", title: "Headache", content: "Patient complains of headache.", createdAt: "2025-05-01" },
    { id: "2", title: "Fever", content: "Patient complains of fever.", createdAt: "2025-05-02" },
  ],
  findings: [
    { id: "1", title: "Elevated BP", content: "Blood pressure is elevated.", createdAt: "2025-05-01" },
    { id: "2", title: "Skin Rash", content: "Patient has skin rash on arms.", createdAt: "2025-05-02" },
  ],
  drugs: [
    { id: "1", title: "Paracetamol", content: "500mg, 3 times a day after meals.", createdAt: "2025-05-01" },
    { id: "2", title: "Amoxicillin", content: "250mg, twice a day for 7 days.", createdAt: "2025-05-02" },
  ],
  tests: [
    { id: "1", title: "Blood Test", content: "Complete blood count.", createdAt: "2025-05-01" },
    { id: "2", title: "Urine Test", content: "Routine urine examination.", createdAt: "2025-05-02" },
  ],
  instructions: [
    { id: "1", title: "Rest", content: "Take adequate rest for 3 days.", createdAt: "2025-05-01" },
    { id: "2", title: "Hydration", content: "Drink plenty of fluids.", createdAt: "2025-05-02" },
  ],
  procedures: [
    { id: "1", title: "Wound Dressing", content: "Clean wound and apply dressing daily.", createdAt: "2025-05-01" },
    { id: "2", title: "Suture Removal", content: "Remove sutures after 7 days.", createdAt: "2025-05-02" },
  ],
}

const templateCategories = [
  { id: "diagnoses", name: "Diagnoses" },
  { id: "complaints", name: "Complaints" },
  { id: "findings", name: "Findings" },
  { id: "drugs", name: "Drugs" },
  { id: "tests", name: "Tests" },
  { id: "instructions", name: "Instructions" },
  { id: "procedures", name: "Procedures" },
]

export default function SavedTemplatesPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<{ id: string; name: string } | null>(null)
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)
  const [templates, setTemplates] = useState<Record<string, Template[]>>(templateData)

  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
    } else {
      setExpandedCategory(categoryId)
    }
  }

  const handleAddTemplate = (categoryId: string) => {
    const category = templateCategories.find((cat) => cat.id === categoryId)
    if (category) {
      setCurrentCategory(category)
      setIsAddModalOpen(true)
    }
  }

  const handleEditTemplate = (categoryId: string, template: Template) => {
    const category = templateCategories.find((cat) => cat.id === categoryId)
    if (category) {
      setCurrentCategory(category)
      setCurrentTemplate(template)
      setIsEditModalOpen(true)
    }
  }

  const handleSaveTemplate = (template: { name: string; content: string[] }) => {
    if (!currentCategory) return

    const newTemplate: Template = {
      id: Date.now().toString(),
      title: template.name,
      content: template.content.join(", "),
      createdAt: new Date().toISOString().split("T")[0],
    }

    setTemplates((prev) => ({
      ...prev,
      [currentCategory.id]: [...prev[currentCategory.id], newTemplate],
    }))

    setIsAddModalOpen(false)
  }

  const handleUpdateTemplate = (templateId: string, template: { name: string; content: string[] }) => {
    if (!currentCategory) return

    const updatedTemplate: Template = {
      id: templateId,
      title: template.name,
      content: template.content.join(", "),
      createdAt: new Date().toISOString().split("T")[0], // You might want to keep the original date
    }

    setTemplates((prev) => ({
      ...prev,
      [currentCategory.id]: prev[currentCategory.id].map((t) => (t.id === templateId ? updatedTemplate : t)),
    }))

    setIsEditModalOpen(false)
  }

  const handleDeleteTemplate = (categoryId: string, templateId: string) => {
    setTemplates((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId].filter((t) => t.id !== templateId),
    }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <TopNavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <Card className="shadow-sm">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-medium text-slate-700">
                  Saved Template <span className="text-slate-500 font-normal">Listing</span>
                </h1>
              </div>

              <div className="border rounded-sm overflow-hidden">
                {templateCategories.map((category, index) => (
                  <div key={category.id} className={index !== templateCategories.length - 1 ? "border-b" : ""}>
                    {/* Category Header */}
                    <div
                      className="px-4 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <span className="text-gray-700">{category.name}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                          expandedCategory === category.id ? "transform rotate-180" : ""
                        }`}
                      />
                    </div>

                    {/* Category Content */}
                    {expandedCategory === category.id && (
                      <div className="px-4 pb-4 pt-2">
                        <div className="flex justify-end mb-4">
                          <Button
                            className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddTemplate(category.id)
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Template
                          </Button>
                        </div>

                        {templates[category.id].length === 0 ? (
                          <div className="text-center text-gray-500 py-4">No templates found in this category.</div>
                        ) : (
                          <div className="space-y-4">
                            {templates[category.id].map((template) => (
                              <div key={template.id} className="border-t pt-4 first:border-t-0 first:pt-0">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium text-blue-600">{template.title}</h3>
                                    <p className="text-gray-600 mt-1">{template.content}</p>
                                    <p className="text-gray-400 text-sm mt-2">Created: {template.createdAt}</p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleEditTemplate(category.id, template)
                                      }}
                                    >
                                      <Pencil className="h-4 w-4 text-slate-500" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteTemplate(category.id, template.id)
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-slate-500" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </main>
      </div>

      {currentCategory && (
        <>
          <AddTemplateModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSave={handleSaveTemplate}
            categoryId={currentCategory.id}
            categoryName={currentCategory.name}
          />
          <EditTemplateModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdateTemplate}
            template={currentTemplate}
            categoryId={currentCategory.id}
            categoryName={currentCategory.name}
          />
        </>
      )}
    </div>
  )
}
