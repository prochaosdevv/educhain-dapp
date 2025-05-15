import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("blockchain_certificates")

    // Count students with blockchain status "stored"
    const storedCount = await db.collection("students").countDocuments({ blockchainStatus: "stored" })

    return NextResponse.json({
      success: true,
      count: storedCount,
    })
  } catch (error) {
    console.error("Error fetching student count:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch student count" }, { status: 500 })
  }
}
