"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CustomTemplate {
  id: string
  title: string
  shortContent: string
  flags: string[]
  createdAt: string
}

interface EditCustomTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (templateId: string, template: { title: string; content: string; flags: string[] }) => void
  template: CustomTemplate
}

export default function EditCustomTemplateModal({ isOpen, onClose, onSave, template }: EditCustomTemplateModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [flagInput, setFlagInput] = useState("")
  const [flags, setFlags] = useState<string[]>([])
  const modalRef = useRef<HTMLDivElement>(null)

  // Initialize form with template data when modal opens
  useEffect(() => {
    if (isOpen && template) {
      setTitle(template.title)
      setContent(template.shortContent)
      setFlags(template.flags || [])
    }
  }, [isOpen, template])

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

  const handleAddFlag = () => {
    if (flagInput.trim() !== "" && !flags.includes(flagInput.trim())) {
      setFlags([...flags, flagInput.trim()])
      setFlagInput("")
    }
  }

  const handleRemoveFlag = (flagToRemove: string) => {
    setFlags(flags.filter((flag) => flag !== flagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddFlag()
    }
  }

  const handleSave = () => {
    onSave(template.id, {
      title,
      content,
      flags,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white w-full max-w-2xl rounded-sm overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-500 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-medium">Edit Custom Template</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Title<span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Content<span className="text-red-500">*</span>
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                rows={5}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-1">Flags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Add a flag and press Enter"
                />
                <Button
                  onClick={handleAddFlag}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  type="button"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {flags.map((flag, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full flex items-center"
                  >
                    {flag}
                    <button onClick={() => handleRemoveFlag(flag)} className="ml-2 text-gray-500 hover:text-gray-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end space-x-2 border-t">
          <Button onClick={onClose} variant="outline" className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-0">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            disabled={!title.trim() || !content.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
