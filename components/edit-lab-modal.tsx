"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Lab {
  id: string
  name: string
  email: string
  mobile: string
  address: string
}

interface EditLabModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (lab: Lab) => void
  lab: Lab | null
}

export default function EditLabModal({ isOpen, onClose, onSave, lab }: EditLabModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [address, setAddress] = useState("")

  useEffect(() => {
    if (lab) {
      setName(lab.name)
      setEmail(lab.email)
      setMobile(lab.mobile)
      setAddress(lab.address)
    }
  }, [lab])

  if (!isOpen || !lab) return null

  const handleSave = () => {
    onSave({
      id: lab.id,
      name,
      email,
      mobile,
      address,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-sm overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-medium">Edit Lab Location</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Mobile</label>
                <Input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Address</label>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end space-x-2">
          <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Save
          </Button>
          <Button onClick={onClose} variant="outline" className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-0">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
