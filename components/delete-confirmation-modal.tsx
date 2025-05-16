"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemName: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-sm overflow-hidden">
        {/* Header */}
        <div className="bg-red-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-medium">Confirm Delete</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to delete <span className="font-semibold">{itemName}</span>? This action cannot be
            undone.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end space-x-2">
          <Button onClick={onConfirm} className="bg-red-500 hover:bg-red-600 text-white">
            Delete
          </Button>
          <Button onClick={onClose} variant="outline" className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-0">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
