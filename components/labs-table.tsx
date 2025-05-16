"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Lab {
  id: string
  name: string
  email: string
  mobile: string
  address: string
}

interface LabsTableProps {
  labs: Lab[]
  onEdit: (lab: Lab) => void
  onDelete: (lab: Lab) => void
}

export default function LabsTable({ labs, onEdit, onDelete }: LabsTableProps) {
  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px] text-slate-600">Name</TableHead>
            <TableHead className="text-slate-600">Email</TableHead>
            <TableHead className="text-slate-600">Mobile</TableHead>
            <TableHead className="text-slate-600">Address</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                No labs found. Click "Add Location" to add a new lab.
              </TableCell>
            </TableRow>
          ) : (
            labs.map((lab) => (
              <TableRow key={lab.id}>
                <TableCell className="font-medium text-blue-600">{lab.name}</TableCell>
                <TableCell>{lab.email}</TableCell>
                <TableCell>{lab.mobile}</TableCell>
                <TableCell>{lab.address}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(lab)}>
                      <Pencil className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(lab)}>
                      <Trash2 className="h-4 w-4 text-slate-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
