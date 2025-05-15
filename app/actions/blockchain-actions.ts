"use server"

import clientPromise from "@/lib/mongodb"

/**
 * Update student with blockchain transaction hash
 */
export async function updateStudentWithTxHash(
  studentId: string,
  txHash: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const students = db.collection("students")

    // Update the student with blockchain reference
    const result = await students.updateOne(
      { studentId },
      {
        $set: {
          txHash,
          blockchainStatus: "stored",
          processedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return {
        success: false,
        message: "Student not found",
      }
    }

    return {
      success: true,
      message: "Student updated with transaction hash",
    }
  } catch (error) {
    console.error("MongoDB error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update student with transaction hash",
    }
  }
}
