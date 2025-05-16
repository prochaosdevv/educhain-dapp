"use client"

import { useState, useEffect, useRef } from "react"
import { Trash2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Template {
  id: string
  title: string
  content: string
  createdAt: string
}

interface EditTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (templateId: string, template: { name: string; content: string[] }) => void
  template: Template | null
  categoryId: string
  categoryName: string
}

export default function EditTemplateModal({
  isOpen,
  onClose,
  onSave,
  template,
  categoryId,
  categoryName,
}: EditTemplateModalProps) {
  const [name, setName] = useState("")
  const [contentItems, setContentItems] = useState<string[]>([])
  const modalRef = useRef<HTMLDivElement>(null)

  // Initialize form with template data when modal opens
  useEffect(() => {
    if (isOpen && template) {
      setName(template.title)
      // Split content by comma and trim each item
      const items = template.content.split(",").map((item) => item.trim())
      setContentItems(items.length > 0 ? items : [""])
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

  if (!isOpen || !template) return null

  const handleAddContentItem = () => {
    setContentItems([...contentItems, ""])
  }

  const handleContentItemChange = (index: number, value: string) => {
    const newContentItems = [...contentItems]
    newContentItems[index] = value
    setContentItems(newContentItems)
  }

  const handleRemoveContentItem = (index: number) => {
    if (contentItems.length > 1) {
      const newContentItems = [...contentItems]
      newContentItems.splice(index, 1)
      setContentItems(newContentItems)
    }
  }

  const handleSave = () => {
    // Filter out empty content items
    const filteredContentItems = contentItems.filter((item) => item.trim() !== "")
    onSave(template.id, {
      name,
      content: filteredContentItems,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white w-full max-w-md rounded-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-medium text-slate-700">Edit {categoryName} Template</h2>
        </div>

        {/* Form */}
        <div className="p-6 bg-yellow-50">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-1">
                Name<span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">{categoryName}</label>
              <div className="space-y-2">
                {contentItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        value={item}
                        onChange={(e) => handleContentItemChange(index, e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white pr-8"
                      />
                      {item && (
                        <button
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => handleContentItemChange(index, "")}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveContentItem(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="mt-2 text-green-600 hover:text-green-700 hover:bg-transparent p-0"
                onClick={handleAddContentItem}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-yellow-50 border-t border-yellow-100">
          <Button
            onClick={handleSave}
            className="w-full bg-white hover:bg-gray-50 text-blue-500 border border-gray-300"
            disabled={!name.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
