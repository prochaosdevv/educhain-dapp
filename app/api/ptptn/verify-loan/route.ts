import { type NextRequest, NextResponse } from "next/server"
import { getEnrollmentsByStudentId } from "@/app/actions/mongodb-actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, icNumber } = body

    if (!studentId) {
      return NextResponse.json({ success: false, message: "Student ID is required" }, { status: 400 })
    }

    // Get the student's enrollment records
    const enrollmentResult = await getEnrollmentsByStudentId(studentId)

    // If no enrollment records found
    if (!enrollmentResult.success || !enrollmentResult.data || enrollmentResult.data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No enrollment records found for this student",
          verificationResult: "inactive",
          studentData: null,
        },
        { status: 404 },
      )
    }

    // Get the most recent enrollment record
    const latestEnrollment = enrollmentResult.data.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0]

    // Determine verification result based on enrollment status
    let verificationResult: "active" | "inactive" | "partial" = "inactive"

    if (latestEnrollment.isActive) {
      if (latestEnrollment.enrollmentType === "fullTime") {
        verificationResult = "active"
      } else {
        verificationResult = "partial"
      }
    } else {
      verificationResult = "inactive"
    }

    // Prepare student data for response
    const studentData = {
      studentId: latestEnrollment.studentId,
      studentName: latestEnrollment.studentName,
      institution: "University of Technology", // This could be dynamic in a real implementation
      program: latestEnrollment.program,
      currentSemester: latestEnrollment.semester,
      enrollmentStatus: latestEnrollment.isActive
        ? latestEnrollment.enrollmentType === "fullTime"
          ? "Full-time"
          : "Part-time"
        : "Not Enrolled",
      financialStatus:
        latestEnrollment.financialStatus === "paid"
          ? "Fees Paid"
          : latestEnrollment.financialStatus === "partial"
            ? "Partially Paid"
            : "N/A",
      lastVerified: new Date().toISOString(),
      ipfsCid: latestEnrollment.ipfsCid,
      blockchainReference: latestEnrollment.blockchainReference || null,
    }

    // Return the verification result
    return NextResponse.json({
      success: true,
      message: `Student enrollment verification completed`,
      verificationResult,
      studentData,
    })
  } catch (error) {
    console.error("Error verifying loan eligibility:", error)
    return NextResponse.json({ success: false, message: "Failed to verify loan eligibility" }, { status: 500 })
  }
}

// GET method to check API status
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "PTPTN Loan Verification API is operational",
    version: "1.0.0",
  })
}
