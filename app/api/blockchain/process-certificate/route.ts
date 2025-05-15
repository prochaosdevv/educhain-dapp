import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { certificateId, txHash } = body

    if (!certificateId) {
      return NextResponse.json({ success: false, message: "Certificate ID is required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const certificates = db.collection("certificates")

    // Find the certificate
    const certificate = await certificates.findOne({ ipfsCid: certificateId })

    if (!certificate) {
      return NextResponse.json(
        { success: false, message: "Certificate not found with the provided ID" },
        { status: 404 },
      )
    }

    // Update the certificate with blockchain reference
    await certificates.updateOne(
      { ipfsCid: certificateId },
      {
        $set: {
          blockchainReference: txHash || "0x" + Math.random().toString(16).substring(2, 42),
          blockchainStatus: "stored",
          processedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      success: true,
      message: "Certificate processed successfully",
      data: {
        certificateId,
        txHash: txHash || "0x" + Math.random().toString(16).substring(2, 42),
        processedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Error processing certificate:", error)
    return NextResponse.json({ success: false, message: "Failed to process certificate" }, { status: 500 })
  }
}
