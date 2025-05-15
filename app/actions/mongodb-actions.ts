"use server"

import clientPromise from "@/lib/mongodb"
import type { Certificate, Enrollment } from "@/lib/models"

/**
 * Store certificate data in MongoDB
 */
export async function storeCertificateInMongoDB(
  certificateData: Certificate,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const certificates = db.collection("certificates")

    // Add timestamps
    const dataToInsert = {
      ...certificateData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await certificates.insertOne(dataToInsert)

    if (result.acknowledged) {
      return {
        success: true,
        message: "Certificate stored in MongoDB successfully",
        id: result.insertedId.toString(),
      }
    } else {
      throw new Error("Failed to store certificate in MongoDB")
    }
  } catch (error) {
    console.error("MongoDB error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to store certificate in MongoDB",
    }
  }
}

/**
 * Store enrollment data in MongoDB
 */
export async function storeEnrollmentInMongoDB(
  enrollmentData: Enrollment,
): Promise<{ success: boolean; message: string; id?: string }> {
  try {
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const enrollments = db.collection("enrollments")

    // Add timestamp
    const dataToInsert = {
      ...enrollmentData,
      createdAt: new Date(),
    }

    const result = await enrollments.insertOne(dataToInsert)

    if (result.acknowledged) {
      return {
        success: true,
        message: "Enrollment stored in MongoDB successfully",
        id: result.insertedId.toString(),
      }
    } else {
      throw new Error("Failed to store enrollment in MongoDB")
    }
  } catch (error) {
    console.error("MongoDB error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to store enrollment in MongoDB",
    }
  }
}

/**
 * Get certificates by student ID
 */
export async function getCertificatesByStudentId(
  studentId: string,
): Promise<{ success: boolean; message: string; data?: Certificate[] }> {
  try {
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const certificates = db.collection("certificates")

    const results = await certificates.find({ studentId }).sort({ createdAt: -1 }).toArray()

    return {
      success: true,
      message: `Found ${results.length} certificates`,
      data: results as unknown as Certificate[],
    }
  } catch (error) {
    console.error("MongoDB error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to retrieve certificates from MongoDB",
    }
  }
}

/**
 * Get enrollments by student ID
 */
export async function getEnrollmentsByStudentId(
  studentId: string,
): Promise<{ success: boolean; message: string; data?: Enrollment[] }> {
  try {
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const enrollments = db.collection("enrollments")

    const results = await enrollments.find({ studentId }).sort({ createdAt: -1 }).toArray()

    return {
      success: true,
      message: `Found ${results.length} enrollment records`,
      data: results as unknown as Enrollment[],
    }
  } catch (error) {
    console.error("MongoDB error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to retrieve enrollments from MongoDB",
    }
  }
}

// Add a new function to get certificates by IPFS CID
/**
 * Get certificates by IPFS CID
 */
export async function getCertificateByIpfsCid(
  ipfsCid: string,
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const certificates = db.collection("certificates")

    const result = await certificates.findOne({ ipfsCid })

    if (result) {
      return {
        success: true,
        message: "Certificate found",
        data: result,
      }
    } else {
      return {
        success: false,
        message: "No certificate found with this IPFS CID",
      }
    }
  } catch (error) {
    console.error("MongoDB error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to retrieve certificate from MongoDB",
    }
  }
}

/**
 * Get enrollment by IPFS CID
 */
export async function getEnrollmentByIpfsCid(
  ipfsCid: string,
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const client = await clientPromise
    const db = client.db("blockchain_certificates")
    const enrollments = db.collection("enrollments")

    const result = await enrollments.findOne({ ipfsCid })

    if (result) {
      return {
        success: true,
        message: "Enrollment found",
        data: result,
      }
    } else {
      return {
        success: false,
        message: "No enrollment found with this IPFS CID",
      }
    }
  } catch (error) {
    console.error("MongoDB error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to retrieve enrollment from MongoDB",
    }
  }
}
