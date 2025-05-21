import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enrollmentId, txHash } = body

    if (!enrollmentId) {
      return NextResponse.json({ success: false, message: "Enrollment ID is required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const enrollments = db.collection("enrollments")

    // Find the enrollment
    const enrollment = await enrollments.findOne({ ipfsCid: enrollmentId })

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: "Enrollment not found with the provided ID" },
        { status: 404 },
      )
    }

    // Update the enrollment with blockchain reference
    await enrollments.updateOne(
      { ipfsCid: enrollmentId },
      {
        $set: {
          blockchainReference: txHash || "0x" + Math.random().toString(16).substring(2, 42),
          blockchainStatus: "stored",
          processedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      success: true,
      message: "Enrollment processed successfully",
      data: {
        enrollmentId,
        txHash: txHash || "0x" + Math.random().toString(16).substring(2, 42),
        processedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Error processing enrollment:", error)
    return NextResponse.json({ success: false, message: "Failed to process enrollment" }, { status: 500 })
  }
}
