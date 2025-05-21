"use server"

import clientPromise from "@/lib/mongodb"

/**
 * Update enrollment with blockchain transaction hash
 */
export async function updateEnrollmentWithTxHash(
  enrollmentId: string,
  txHash: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const enrollments = db.collection("enrollments")

    // Update the enrollment with blockchain reference
    const result = await enrollments.updateOne(
      { ipfsCid: enrollmentId },
      {
        $set: {
          blockchainReference: txHash,
          blockchainStatus: "stored",
          processedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return {
        success: false,
        message: "Enrollment not found",
      }
    }

    return {
      success: true,
      message: "Enrollment updated with transaction hash",
    }
  } catch (error) {
    console.error("MongoDB error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update enrollment with transaction hash",
    }
  }
}

/**
 * Update certificate with blockchain transaction hash
 */
export async function updateCertificateWithTxHash(
  certificateId: string,
  txHash: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const certificates = db.collection("certificates")

    // Update the certificate with blockchain reference
    const result = await certificates.updateOne(
      { ipfsCid: certificateId },
      {
        $set: {
          blockchainReference: txHash,
          blockchainStatus: "stored",
          processedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return {
        success: false,
        message: "Certificate not found",
      }
    }

    return {
      success: true,
      message: "Certificate updated with transaction hash",
    }
  } catch (error) {
    console.error("MongoDB error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update certificate with transaction hash",
    }
  }
}
