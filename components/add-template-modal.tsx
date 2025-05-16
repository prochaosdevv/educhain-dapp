"use client"

import { useState, useEffect, useRef } from "react"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (template: { name: string; content: string[] }) => void
  categoryId: string
  categoryName: string
}

export default function AddTemplateModal({ isOpen, onClose, onSave, categoryId, categoryName }: AddTemplateModalProps) {
  const [name, setName] = useState("")
  const [contentItems, setContentItems] = useState<string[]>([""])
  const modalRef = useRef<HTMLDivElement>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("")
      setContentItems([""])
    }
  }, [isOpen])

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
    onSave({
      name,
      content: filteredContentItems,
    })
  }

  // Get singular form of category name for the title
  const getSingularCategoryName = (name: string) => {
    if (name.endsWith("s")) {
      // Simple pluralization rule - remove the 's' at the end
      return name.slice(0, -1)
    }
    return name
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white w-full max-w-md rounded-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-medium text-slate-700">Create {categoryName} Template</h2>
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
                placeholder={`Enter ${getSingularCategoryName(categoryName)} template name`}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">{categoryName}</label>
              <div className="space-y-2">
                {contentItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => handleContentItemChange(index, e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      placeholder={`Enter ${getSingularCategoryName(categoryName)} details`}
                    />
                    {contentItems.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveContentItem(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
