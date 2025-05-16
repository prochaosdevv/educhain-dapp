"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TestReferral {
  id: string
  testName: string
  doctorName: string
  patientName: string
  date: string
  status: string
}

interface TestReferralsTableProps {
  referrals: TestReferral[]
  onEdit: (referral: TestReferral) => void
  onDelete: (referral: TestReferral) => void
}

export default function TestReferralsTable({ referrals, onEdit, onDelete }: TestReferralsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] text-slate-600">Test Name</TableHead>
            <TableHead className="text-slate-600">Doctor</TableHead>
            <TableHead className="text-slate-600">Patient</TableHead>
            <TableHead className="text-slate-600">Date</TableHead>
            <TableHead className="text-slate-600">Status</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                No test referrals found. Click "Add Test Referral" to add a new referral.
              </TableCell>
            </TableRow>
          ) : (
            referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell className="font-medium text-blue-600">{referral.testName}</TableCell>
                <TableCell>{referral.doctorName}</TableCell>
                <TableCell>{referral.patientName}</TableCell>
                <TableCell>{new Date(referral.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(referral.status)} variant="outline">
                    {referral.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(referral)}>
                      <Pencil className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(referral)}>
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
