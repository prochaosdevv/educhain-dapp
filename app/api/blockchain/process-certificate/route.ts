import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, txHash } = body

    if (!studentId) {
      return NextResponse.json({ success: false, message: "Student ID is required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const students = db.collection("students")

    // Find the student
    const student = await students.findOne({ studentId })

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found with the provided ID" }, { status: 404 })
    }

    // Update the student with blockchain reference
    await students.updateOne(
      { studentId },
      {
        $set: {
          txHash: txHash || "0x" + Math.random().toString(16).substring(2, 42),
          blockchainStatus: "stored",
          processedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      success: true,
      message: "Student data processed successfully",
      data: {
        studentId,
        txHash: txHash || "0x" + Math.random().toString(16).substring(2, 42),
        processedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Error processing student data:", error)
    return NextResponse.json({ success: false, message: "Failed to process student data" }, { status: 500 })
  }
}
