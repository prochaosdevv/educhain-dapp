"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import Sidebar from "@/components/sidebar"
import TopNavbar from "@/components/top-navbar"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AddCustomTemplateModal from "@/components/add-custom-template-modal"
import EditCustomTemplateModal from "@/components/edit-custom-template-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"

interface CustomTemplate {
  id: string
  title: string
  shortContent: string
  flags: string[]
  createdAt: string
}

export default function CustomTemplatesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<CustomTemplate | null>(null)
  const [templateToDelete, setTemplateToDelete] = useState<CustomTemplate | null>(null)
  const [templates, setTemplates] = useState<CustomTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddTemplate = () => {
    setIsAddModalOpen(true)
  }

  const handleEditTemplate = (template: CustomTemplate) => {
    setCurrentTemplate(template)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (template: CustomTemplate) => {
    setTemplateToDelete(template)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      setTemplates(templates.filter((t) => t.id !== templateToDelete.id))
      setIsDeleteModalOpen(false)
      setTemplateToDelete(null)
    }
  }

  const handleSaveTemplate = (template: { title: string; content: string; flags: string[] }) => {
    const newTemplate: CustomTemplate = {
      id: Date.now().toString(),
      title: template.title,
      shortContent: template.content,
      flags: template.flags,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setTemplates([...templates, newTemplate])
    setIsAddModalOpen(false)
  }

  const handleUpdateTemplate = (templateId: string, template: { title: string; content: string; flags: string[] }) => {
    const updatedTemplate: CustomTemplate = {
      id: templateId,
      title: template.title,
      shortContent: template.content,
      flags: template.flags,
      createdAt: currentTemplate?.createdAt || new Date().toISOString().split("T")[0],
    }

    setTemplates(templates.map((t) => (t.id === templateId ? updatedTemplate : t)))
    setIsEditModalOpen(false)
  }

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.shortContent.toLowerCase().includes(searchQuery.toLowerCase()),
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
                  Custom Template <span className="text-slate-500 font-normal">Listing</span>
                </h1>
                <Button
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  onClick={handleAddTemplate}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add New
                </Button>
              </div>

              <div className="rounded-sm overflow-hidden border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Title</TableHead>
                      <TableHead>Short Content</TableHead>
                      <TableHead>Flags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                          No templates found. Click "Add New" to create a custom template.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">{template.title}</TableCell>
                          <TableCell>{template.shortContent}</TableCell>
                          <TableCell>
                            {template.flags.map((flag, index) => (
                              <span
                                key={index}
                                className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                              >
                                {flag}
                              </span>
                            ))}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)}>
                                <Pencil className="h-4 w-4 text-slate-500" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(template)}>
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

      <AddCustomTemplateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveTemplate}
      />
      {currentTemplate && (
        <EditCustomTemplateModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateTemplate}
          template={currentTemplate}
        />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={templateToDelete?.title || ""}
      />
    </div>
  )
}
