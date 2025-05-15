export interface Certificate {
  studentId: string
  studentName: string
  program: string
  certificateType: string
  issueDate: string
  graduationDate: string
  achievements?: string
  ipfsCid: string
  ipfsUrl: string
  fileCid?: string
  fileUrl?: string
  fileName?: string
  issuer: string
  issuedAt: string
  blockchainReference?: string
  blockchainStatus?: string
  processedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Enrollment {
  studentId: string
  studentName: string
  program: string
  semester: string
  enrollmentDate: string
  expectedGraduation: string
  isActive: boolean
  enrollmentType: string
  financialStatus: string
  ipfsCid: string
  ipfsUrl: string
  updatedBy: string
  updatedAt: string
  blockchainReference?: string
  createdAt: Date
  icNumber?: string // Added IC number field
}

export interface StudentLoan {
  studentId: string
  studentName: string
  icNumber: string
  program: string
  loanAmount: number
  loanStatus: "pending" | "approved" | "disbursed" | "rejected"
  verificationResult: "active" | "inactive" | "partial"
  institution: string
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
}
