"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import LabsTable from "@/components/labs-table"
import Sidebar from "@/components/sidebar"
import TopNavbar from "@/components/top-navbar"
import AddLabModal from "@/components/add-lab-modal"
import EditLabModal from "@/components/edit-lab-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"
import { Plus } from "lucide-react"

interface Lab {
  id: string
  name: string
  email: string
  mobile: string
  address: string
}

export default function LabsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentLab, setCurrentLab] = useState<Lab | null>(null)
  const [labToDelete, setLabToDelete] = useState<Lab | null>(null)
  const [labs, setLabs] = useState<Lab[]>([])

  const handleAddLab = (lab: { name: string; email: string; mobile: string; address: string }) => {
    const newLab = {
      id: Date.now().toString(),
      ...lab,
    }
    setLabs([...labs, newLab])
  }

  const handleEditLab = (lab: Lab) => {
    setLabs(labs.map((l) => (l.id === lab.id ? lab : l)))
  }

  const handleEditClick = (lab: Lab) => {
    setCurrentLab(lab)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (lab: Lab) => {
    setLabToDelete(lab)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (labToDelete) {
      setLabs(labs.filter((lab) => lab.id !== labToDelete.id))
      setIsDeleteModalOpen(false)
      setLabToDelete(null)
    }
  }

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
                    Lab's <span className="text-slate-500 font-normal">Listing</span>
                  </h1>
                </div>
                <Button
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Location
                </Button>
              </div>
              <LabsTable labs={labs} onEdit={handleEditClick} onDelete={handleDeleteClick} />
            </div>
          </Card>
        </main>
      </div>

      <AddLabModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddLab} />
      <EditLabModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditLab}
        lab={currentLab}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={labToDelete?.name || ""}
      />
    </div>
  )
}
