"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Doctor {
  id: string
  name: string
  specialization: string
  mobile: string
  email: string
}

interface EditDoctorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (doctor: Doctor) => void
  doctor: Doctor | null
}

export default function EditDoctorModal({ isOpen, onClose, onSave, doctor }: EditDoctorModalProps) {
  const [name, setName] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (doctor) {
      setName(doctor.name)
      setSpecialization(doctor.specialization)
      setMobile(doctor.mobile)
      setEmail(doctor.email)
    }
  }, [doctor])

  if (!isOpen || !doctor) return null

  const handleSave = () => {
    onSave({
      id: doctor.id,
      name,
      specialization,
      mobile,
      email,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-sm overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-medium">Edit Doctor Reference</h2>
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

            <div>
              <label className="block text-sm text-gray-500 mb-1">Specialization</label>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                  <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                  <SelectItem value="Neurologist">Neurologist</SelectItem>
                  <SelectItem value="Orthopedic">Orthopedic</SelectItem>
                  <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                  <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                  <SelectItem value="Gynecologist">Gynecologist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Mobile</label>
                <Input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
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
