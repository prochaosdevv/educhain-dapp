import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { StudentLoan } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, icNumber, loanAmount } = body

    if (!studentId || !icNumber) {
      return NextResponse.json({ success: false, message: "Student ID and IC Number are required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("blockchain_certificates")

    // Get the enrollments collection
    const enrollments = db.collection("enrollments")

    // Find the student's enrollment
    const enrollment = await enrollments.findOne({ studentId })

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "No enrollment record found for this student" },
        { status: 404 },
      )
    }

    // Update the enrollment with the IC number
    await enrollments.updateOne({ studentId }, { $set: { icNumber } })

    // Get the loans collection
    const loans = db.collection("student_loans")

    // Create a new loan record
    const loanRecord: StudentLoan = {
      studentId,
      studentName: enrollment.studentName,
      icNumber,
      program: enrollment.program,
      loanAmount: loanAmount || 10000, // Default amount if not provided
      loanStatus: "approved",
      verificationResult: enrollment.isActive
        ? enrollment.enrollmentType === "fullTime"
          ? "active"
          : "partial"
        : "inactive",
      institution: "University of Technology",
      approvedBy: "PTPTN Officer",
      approvedAt: new Date(),
      createdAt: new Date(),
    }

    // Insert the loan record
    const result = await loans.insertOne(loanRecord)

    if (!result.acknowledged) {
      throw new Error("Failed to create loan record")
    }

    return NextResponse.json({
      success: true,
      message: "Loan processed successfully and IC number recorded",
      data: {
        loanId: result.insertedId.toString(),
        studentId,
        icNumber,
        loanStatus: "approved",
        approvedAt: loanRecord.approvedAt,
      },
    })
  } catch (error) {
    console.error("Error processing loan:", error)
    return NextResponse.json({ success: false, message: "Failed to process loan" }, { status: 500 })
  }
}
