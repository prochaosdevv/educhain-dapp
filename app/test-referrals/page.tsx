"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import TestReferralsTable from "@/components/test-referrals-table"
import Sidebar from "@/components/sidebar"
import TopNavbar from "@/components/top-navbar"
import AddTestReferralModal from "@/components/add-test-referral-modal"
import EditTestReferralModal from "@/components/edit-test-referral-modal"
import DeleteConfirmationModal from "@/components/delete-confirmation-modal"

interface TestReferral {
  id: string
  testName: string
  doctorName: string
  patientName: string
  date: string
  status: string
}

export default function TestReferralsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentReferral, setCurrentReferral] = useState<TestReferral | null>(null)
  const [referralToDelete, setReferralToDelete] = useState<TestReferral | null>(null)
  const [referrals, setReferrals] = useState<TestReferral[]>([
    {
      id: "1",
      testName: "Blood Test",
      doctorName: "Dr Ruchika",
      patientName: "John Doe",
      date: "2025-05-10",
      status: "Pending",
    },
  ])

  const handleAddReferral = (referral: {
    testName: string
    doctorName: string
    patientName: string
    date: string
    status: string
  }) => {
    const newReferral = {
      id: Date.now().toString(),
      ...referral,
    }
    setReferrals([...referrals, newReferral])
  }

  const handleEditReferral = (referral: TestReferral) => {
    setReferrals(referrals.map((r) => (r.id === referral.id ? referral : r)))
  }

  const handleEditClick = (referral: TestReferral) => {
    setCurrentReferral(referral)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (referral: TestReferral) => {
    setReferralToDelete(referral)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (referralToDelete) {
      setReferrals(referrals.filter((referral) => referral.id !== referralToDelete.id))
      setIsDeleteModalOpen(false)
      setReferralToDelete(null)
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
                    Test Referrals <span className="text-slate-500 font-normal">Listing</span>
                  </h1>
                </div>
                <Button
                  className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <span className="mr-2">+</span> Add Test Referral
                </Button>
              </div>
              <TestReferralsTable referrals={referrals} onEdit={handleEditClick} onDelete={handleDeleteClick} />
            </div>
          </Card>
        </main>
      </div>

      <AddTestReferralModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddReferral}
      />
      <EditTestReferralModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditReferral}
        referral={currentReferral}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={referralToDelete?.testName || ""}
      />
    </div>
  )
}
