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
}
