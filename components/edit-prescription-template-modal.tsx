"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PrescriptionTemplate {
  id: string
  name: string
  diagnosis: string
  weight: string
  createdAt: string
  startWeight?: string
  endWeight?: string
  drugs?: string[]
  complaints?: string[]
  findings?: string[]
  instructions?: string[]
  handouts?: string[]
  tests?: string[]
  procedures?: string[]
  referralDoctors?: string[]
  followUpValue?: string
  followUpUnit?: string
}

interface EditPrescriptionTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (
    templateId: string,
    template: {
      name: string
      diagnosis: string
      startWeight: string
      endWeight: string
      drugs: string[]
      complaints: string[]
      findings: string[]
      instructions: string[]
      handouts: string[]
      tests: string[]
      procedures: string[]
      referralDoctors: string[]
      followUpValue: string
      followUpUnit: string
    },
  ) => void
  template: PrescriptionTemplate
}

export default function EditPrescriptionTemplateModal({
  isOpen,
  onClose,
  onSave,
  template,
}: EditPrescriptionTemplateModalProps) {
  const [name, setName] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [startWeight, setStartWeight] = useState("")
  const [endWeight, setEndWeight] = useState("")
  const [drugs, setDrugs] = useState<string[]>([])
  const [complaints, setComplaints] = useState<string[]>([])
  const [findings, setFindings] = useState<string[]>([])
  const [instructions, setInstructions] = useState<string[]>([])
  const [handouts, setHandouts] = useState<string[]>([])
  const [tests, setTests] = useState<string[]>([])
  const [procedures, setProcedures] = useState<string[]>([])
  const [referralDoctors, setReferralDoctors] = useState<string[]>([])
  const [followUpValue, setFollowUpValue] = useState("")
  const [followUpUnit, setFollowUpUnit] = useState("days")
  const modalRef = useRef<HTMLDivElement>(null)

  // Initialize form with template data when modal opens
  useEffect(() => {
    if (isOpen && template) {
      setName(template.name)
      setDiagnosis(template.diagnosis)

      // Handle weight parsing
      if (template.weight && template.weight.includes("-")) {
        const [start, end] = template.weight.split("-")
        setStartWeight(start.replace(/[^0-9.]/g, ""))
        setEndWeight(end.replace(/[^0-9.]/g, ""))
      } else {
        setStartWeight(template.startWeight || "")
        setEndWeight(template.endWeight || "")
      }

      setDrugs(template.drugs || [])
      setComplaints(template.complaints || [])
      setFindings(template.findings || [])
      setInstructions(template.instructions || [])
      setHandouts(template.handouts || [])
      setTests(template.tests || [])
      setProcedures(template.procedures || [])
      setReferralDoctors(template.referralDoctors || [])
      setFollowUpValue(template.followUpValue || "")
      setFollowUpUnit(template.followUpUnit || "days")
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

  const handleAddDrug = () => {
    setDrugs([...drugs, ""])
  }

  const handleDrugChange = (index: number, value: string) => {
    const newDrugs = [...drugs]
    newDrugs[index] = value
    setDrugs(newDrugs)
  }

  const handleRemoveDrug = (index: number) => {
    const newDrugs = [...drugs]
    newDrugs.splice(index, 1)
    setDrugs(newDrugs)
  }

  const handleAddComplaint = () => {
    setComplaints([...complaints, ""])
  }

  const handleComplaintChange = (index: number, value: string) => {
    const newComplaints = [...complaints]
    newComplaints[index] = value
    setComplaints(newComplaints)
  }

  const handleRemoveComplaint = (index: number) => {
    const newComplaints = [...complaints]
    newComplaints.splice(index, 1)
    setComplaints(newComplaints)
  }

  const handleAddFinding = () => {
    setFindings([...findings, ""])
  }

  const handleFindingChange = (index: number, value: string) => {
    const newFindings = [...findings]
    newFindings[index] = value
    setFindings(newFindings)
  }

  const handleRemoveFinding = (index: number) => {
    const newFindings = [...findings]
    newFindings.splice(index, 1)
    setFindings(newFindings)
  }

  const handleAddInstruction = () => {
    setInstructions([...instructions, ""])
  }

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions]
    newInstructions[index] = value
    setInstructions(newInstructions)
  }

  const handleRemoveInstruction = (index: number) => {
    const newInstructions = [...instructions]
    newInstructions.splice(index, 1)
    setInstructions(newInstructions)
  }

  const handleAddHandout = () => {
    setHandouts([...handouts, ""])
  }

  const handleHandoutChange = (index: number, value: string) => {
    const newHandouts = [...handouts]
    newHandouts[index] = value
    setHandouts(newHandouts)
  }

  const handleRemoveHandout = (index: number) => {
    const newHandouts = [...handouts]
    newHandouts.splice(index, 1)
    setHandouts(newHandouts)
  }

  const handleAddTest = () => {
    setTests([...tests, ""])
  }

  const handleTestChange = (index: number, value: string) => {
    const newTests = [...tests]
    newTests[index] = value
    setTests(newTests)
  }

  const handleRemoveTest = (index: number) => {
    const newTests = [...tests]
    newTests.splice(index, 1)
    setTests(newTests)
  }

  const handleAddProcedure = () => {
    setProcedures([...procedures, ""])
  }

  const handleProcedureChange = (index: number, value: string) => {
    const newProcedures = [...procedures]
    newProcedures[index] = value
    setProcedures(newProcedures)
  }

  const handleRemoveProcedure = (index: number) => {
    const newProcedures = [...procedures]
    newProcedures.splice(index, 1)
    setProcedures(newProcedures)
  }

  const handleAddReferralDoctor = () => {
    setReferralDoctors([...referralDoctors, ""])
  }

  const handleReferralDoctorChange = (index: number, value: string) => {
    const newReferralDoctors = [...referralDoctors]
    newReferralDoctors[index] = value
    setReferralDoctors(newReferralDoctors)
  }

  const handleRemoveReferralDoctor = (index: number) => {
    const newReferralDoctors = [...referralDoctors]
    newReferralDoctors.splice(index, 1)
    setReferralDoctors(newReferralDoctors)
  }

  const handleClearFollowUp = () => {
    setFollowUpValue("")
    setFollowUpUnit("days")
  }

  const handleSave = () => {
    onSave(template.id, {
      name,
      diagnosis,
      startWeight,
      endWeight,
      drugs: drugs.filter((drug) => drug.trim() !== ""),
      complaints: complaints.filter((complaint) => complaint.trim() !== ""),
      findings: findings.filter((finding) => finding.trim() !== ""),
      instructions: instructions.filter((instruction) => instruction.trim() !== ""),
      handouts: handouts.filter((handout) => handout.trim() !== ""),
      tests: tests.filter((test) => test.trim() !== ""),
      procedures: procedures.filter((procedure) => procedure.trim() !== ""),
      referralDoctors: referralDoctors.filter((doctor) => doctor.trim() !== ""),
      followUpValue,
      followUpUnit,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white w-full max-w-3xl rounded-sm overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-medium text-slate-700">Edit Template</h2>
        </div>

        {/* Form */}
        <div className="p-6 bg-yellow-50">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
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
              <div className="md:col-span-1">
                <label className="block text-gray-700 mb-1">
                  Diagnosis<span className="text-red-500">*</span>
                </label>
                <Input
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Start Weight(kg) <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <Input
                  value={startWeight}
                  onChange={(e) => setStartWeight(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  type="number"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  End Weight(kg) <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <Input
                  value={endWeight}
                  onChange={(e) => setEndWeight(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  type="number"
                />
              </div>
            </div>

            {/* Drugs Section */}
            <div className="border-t pt-4">
              <h3 className="text-gray-700 font-medium mb-3">Drugs</h3>
              {drugs.length > 0 && (
                <div className="space-y-2 mb-3">
                  {drugs.map((drug, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={drug}
                        onChange={(e) => handleDrugChange(index, e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                        placeholder="Enter drug name and details"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveDrug(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 hover:bg-transparent p-0"
                onClick={handleAddDrug}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Complaints Section */}
            <div className="border-t pt-4">
              <h3 className="text-gray-700 font-medium mb-3">Complaints</h3>
              {complaints.length > 0 && (
                <div className="space-y-2 mb-3">
                  {complaints.map((complaint, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={complaint}
                        onChange={(e) => handleComplaintChange(index, e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                        placeholder="Enter patient complaint"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveComplaint(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 hover:bg-transparent p-0"
                onClick={handleAddComplaint}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Findings Section */}
            <div className="border-t pt-4">
              <h3 className="text-gray-700 font-medium mb-3">Findings</h3>
              {findings.length > 0 && (
                <div className="space-y-2 mb-3">
                  {findings.map((finding, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={finding}
                        onChange={(e) => handleFindingChange(index, e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                        placeholder="Enter finding"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFinding(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 hover:bg-transparent p-0"
                onClick={handleAddFinding}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Instructions Section */}
            <div className="border-t pt-4">
              <h3 className="text-gray-700 font-medium mb-3">Instructions</h3>
              {instructions.length > 0 && (
                <div className="space-y-2 mb-3">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={instruction}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                        placeholder="Enter instruction"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveInstruction(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 hover:bg-transparent p-0"
                onClick={handleAddInstruction}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Handouts Section */}
            <div className="border-t pt-4">
              <h3 className="text-gray-700 font-medium mb-3">Handouts</h3>
              {handouts.length > 0 && (
                <div className="space-y-2 mb-3">
                  {handouts.map((handout, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={handout}
                        onChange={(e) => handleHandoutChange(index, e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                        placeholder="Enter handout"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveHandout(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 hover:bg-transparent p-0"
                onClick={handleAddHandout}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Tests Section */}
            <div className="border-t pt-4">
              <h3 className="text-gray-700 font-medium mb-3">Tests</h3>
              {tests.length > 0 && (
                <div className="space-y-2 mb-3">
                  {tests.map((test, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={test}
                        onChange={(e) => handleTestChange(index, e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                        placeholder="Enter test"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTest(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 hover:bg-transparent p-0"
                onClick={handleAddTest}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Procedures Section */}
            <div className="border-t pt-4">
              <h3 className="text-gray-700 font-medium mb-3">Procedures</h3>
              {procedures.length > 0 && (
                <div className="space-y-2 mb-3">
                  {procedures.map((procedure, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={procedure}
                        onChange={(e) => handleProcedureChange(index, e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                        placeholder="Enter procedure"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveProcedure(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 hover:bg-transparent p-0"
                onClick={handleAddProcedure}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Referral Doctor Section */}
            <div className="border-t pt-4">
              <h3 className="text-gray-700 font-medium mb-3">Referral Doctor</h3>
              {referralDoctors.length > 0 && (
                <div className="space-y-2 mb-3">
                  {referralDoctors.map((doctor, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={doctor}
                        onChange={(e) => handleReferralDoctorChange(index, e.target.value)}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                        placeholder="Enter doctor name"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveReferralDoctor(index)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 hover:bg-transparent p-0"
                onClick={handleAddReferralDoctor}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {/* Follow Up After Section */}
            <div className="border-t pt-4">
              <h3 className="text-gray-700 font-medium mb-3">Follow Up After</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={followUpValue}
                  onChange={(e) => setFollowUpValue(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white w-24"
                  placeholder=""
                />
                <Select value={followUpUnit} onValueChange={setFollowUpUnit}>
                  <SelectTrigger className="w-32 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearFollowUp}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-yellow-50">
          <Button
            onClick={handleSave}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={!name.trim() || !diagnosis.trim()}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
