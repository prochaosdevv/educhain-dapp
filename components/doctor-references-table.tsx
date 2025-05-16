"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Doctor {
  id: string
  name: string
  specialization: string
  mobile: string
  email: string
}

interface DoctorReferencesTableProps {
  doctors: Doctor[]
  onEdit: (doctor: Doctor) => void
  onDelete: (doctor: Doctor) => void
}

export default function DoctorReferencesTable({ doctors, onEdit, onDelete }: DoctorReferencesTableProps) {
  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px] text-slate-600">Name</TableHead>
            <TableHead className="text-slate-600">Specialization</TableHead>
            <TableHead className="text-slate-600">Mobile</TableHead>
            <TableHead className="text-slate-600">Email</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell className="font-medium text-blue-600">{doctor.name}</TableCell>
              <TableCell>{doctor.specialization}</TableCell>
              <TableCell>{doctor.mobile}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(doctor)}>
                    <Pencil className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(doctor)}>
                    <Trash2 className="h-4 w-4 text-slate-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
