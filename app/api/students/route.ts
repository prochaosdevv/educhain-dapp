import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("blockchain_certificates")

    // Create a students collection if it doesn't exist
    if (!(await db.listCollections({ name: "students" }).toArray()).length) {
      await db.createCollection("students")

      // Insert some sample data if the collection is empty
      const students = [
        {
          studentId: "STU-2023-12345",
          name: "Ahmad Bin Abdullah",
          program: "Bachelor of Computer Science",
          icNumber: "901234-56-7890",
          enrollmentHash: "QmX7bVbVH5mKgbFJ9xJ4...",
          certificateHash: "QmY8bVbVH5mKgbFJ9xJ4...",
          blockchainStatus: "stored",
          txHash: "0x7f9e8d7c6b5a4e3d2c1b0a9f8e7d6c5b4a3f2e1d",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          studentId: "STU-2023-12346",
          name: "Siti Binti Mohamed",
          program: "Bachelor of Business Administration",
          icNumber: "901234-56-7891",
          enrollmentHash: "QmX7bVbVH5mKgbFJ9xJ5...",
          certificateHash: "QmY8bVbVH5mKgbFJ9xJ5...",
          blockchainStatus: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          studentId: "STU-2023-12347",
          name: "John Smith",
          program: "Bachelor of Engineering",
          icNumber: "901234-56-7892",
          enrollmentHash: "QmX7bVbVH5mKgbFJ9xJ6...",
          certificateHash: "QmY8bVbVH5mKgbFJ9xJ6...",
          blockchainStatus: "failed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      await db.collection("students").insertMany(students)
    }

    // Get all students
    const students = await db.collection("students").find({}).toArray()

    return NextResponse.json({
      success: true,
      message: "Students retrieved successfully",
      data: students,
    })
  } catch (error) {
    console.error("Error retrieving students:", error)
    return NextResponse.json({ success: false, message: "Failed to retrieve students" }, { status: 500 })
  }
}
