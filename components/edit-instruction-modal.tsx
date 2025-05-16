"use client"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Instruction {
  id: string
  name: string
  translations: Record<string, string>
  createdBy: "admin" | "doctor"
}

interface EditInstructionModalProps {
  isOpen: boolean
  onClose: () => void
  instruction: Instruction
  languages: string[]
  onSave: (instructionId: string, translations: Record<string, string>) => void
}

export default function EditInstructionModal({
  isOpen,
  onClose,
  instruction,
  languages,
  onSave,
}: EditInstructionModalProps) {
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const modalRef = useRef<HTMLDivElement>(null)

  // Initialize translations when modal opens
  useEffect(() => {
    if (isOpen && instruction) {
      setTranslations({ ...instruction.translations })
    }
  }, [isOpen, instruction])

  // Handle click outside to close modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleTranslationChange = (language: string, value: string) => {
    setTranslations({
      ...translations,
      [language]: value,
    })
  }

  const handleSave = () => {
    onSave(instruction.id, translations)
  }

  // Split languages into two columns
  const midpoint = Math.ceil(languages.length / 2)
  const leftColumnLanguages = languages.slice(0, midpoint)
  const rightColumnLanguages = languages.slice(midpoint)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white w-full max-w-3xl rounded-sm overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-medium">Edit Instruction Translations</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Instruction Name */}
        <div className="px-6 py-4 text-center">
          <h3 className="text-xl font-medium text-gray-700">{instruction.name}</h3>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* English field (always first) */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">English</label>
              <Input value={instruction.name} readOnly className="border-gray-300 bg-gray-50" />
            </div>

            {/* First language in right column */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">{rightColumnLanguages[0]}</label>
              <Input
                value={translations[rightColumnLanguages[0]] || ""}
                onChange={(e) => handleTranslationChange(rightColumnLanguages[0], e.target.value)}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                placeholder={`Enter ${rightColumnLanguages[0]} translation`}
              />
            </div>

            {/* Rest of left column languages */}
            {leftColumnLanguages.slice(1).map((language) => (
              <div key={language}>
                <label className="block text-sm text-gray-500 mb-1">{language}</label>
                <Input
                  value={translations[language] || ""}
                  onChange={(e) => handleTranslationChange(language, e.target.value)}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder={`Enter ${language} translation`}
                />
              </div>
            ))}

            {/* Rest of right column languages */}
            {rightColumnLanguages.slice(1).map((language) => (
              <div key={language}>
                <label className="block text-sm text-gray-500 mb-1">{language}</label>
                <Input
                  value={translations[language] || ""}
                  onChange={(e) => handleTranslationChange(language, e.target.value)}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder={`Enter ${language} translation`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-center space-x-2">
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
