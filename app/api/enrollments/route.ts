import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("blockchain_certificates")

    // Get all enrollments
    const enrollments = await db.collection("enrollments").find({}).toArray()

    return NextResponse.json({
      success: true,
      message: "Enrollments retrieved successfully",
      data: enrollments,
    })
  } catch (error) {
    console.error("Error retrieving enrollments:", error)
    return NextResponse.json({ success: false, message: "Failed to retrieve enrollments" }, { status: 500 })
  }
}
