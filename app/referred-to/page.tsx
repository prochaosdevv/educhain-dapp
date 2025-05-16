"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DoctorReferencesTable from "@/components/doctor-references-table"
import Sidebar from "@/components/sidebar"
import TopNavbar from "@/components/top-navbar"
import AddDoctorModal from "@/components/add-doctor-modal"
import EditDoctorModal from "@/components/edit-doctor-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"

interface Doctor {
  id: string
  name: string
  specialization: string
  mobile: string
  email: string
}

export default function ReferredToPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null)
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      name: "Dr Ruchika",
      specialization: "Dermatologist",
      mobile: "9990203777",
      email: "",
    },
  ])

  const handleAddDoctor = (doctor: { name: string; specialization: string; mobile: string; email: string }) => {
    const newDoctor = {
      id: Date.now().toString(),
      ...doctor,
    }
    setDoctors([...doctors, newDoctor])
  }

  const handleEditDoctor = (doctor: Doctor) => {
    setDoctors(doctors.map((d) => (d.id === doctor.id ? doctor : d)))
  }

  const handleEditClick = (doctor: Doctor) => {
    setCurrentDoctor(doctor)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (doctor: Doctor) => {
    setDoctorToDelete(doctor)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (doctorToDelete) {
      setDoctors(doctors.filter((doctor) => doctor.id !== doctorToDelete.id))
      setIsDeleteModalOpen(false)
      setDoctorToDelete(null)
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
                    Referred To <span className="text-slate-500 font-normal">Listing</span>
                  </h1>
                </div>
                <Button
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <span className="mr-2">+</span> Add Referred To
                </Button>
              </div>
              <DoctorReferencesTable doctors={doctors} onEdit={handleEditClick} onDelete={handleDeleteClick} />
            </div>
          </Card>
        </main>
      </div>

      <AddDoctorModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddDoctor} />
      <EditDoctorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditDoctor}
        doctor={currentDoctor}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={doctorToDelete?.name || ""}
      />
    </div>
  )
}
