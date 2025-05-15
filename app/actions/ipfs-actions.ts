"use server"
import type { FormState } from "@/lib/types"

// Function to get the Pinata API key from environment variables (server-side only)
const getPinataApiKey = () => process.env.PINATA_API_KEY || ""
const getPinataApiSecret = () => process.env.PINATA_API_SECRET || ""

/**
 * Server action to upload a file to IPFS using Pinata
 * @param formData FormData containing the file to upload
 * @returns The CID of the uploaded file and the pinned URL
 */
export async function uploadFileToPinata(formData: FormData): Promise<FormState> {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return {
        success: false,
        message: "No file provided",
      }
    }

    // Create a new FormData object for the Pinata API
    const pinataFormData = new FormData()
    pinataFormData.append("file", file)

    // Add metadata about the file
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        filename: file.name,
        type: file.type,
        size: file.size,
      },
    })
    pinataFormData.append("pinataMetadata", metadata)

    // Add options for pinning
    const options = JSON.stringify({
      cidVersion: 1,
    })
    pinataFormData.append("pinataOptions", options)

    // Make the API request to Pinata
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: getPinataApiKey(),
        pinata_secret_api_key: getPinataApiSecret(),
      },
      body: pinataFormData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Pinata API error: ${error.error || "Unknown error"}`)
    }

    const result = await response.json()

    return {
      success: true,
      message: "File uploaded successfully",
      data: {
        cid: result.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        name: file.name,
      },
    }
  } catch (error) {
    console.error("Error uploading file to IPFS via Pinata:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload file to IPFS",
    }
  }
}

/**
 * Server action to upload JSON data to IPFS using Pinata
 * @param data The data to upload
 * @param name The name of the file
 * @returns The CID of the uploaded data and the pinned URL
 */
export async function uploadJSONToPinata(data: any, name = "data.json"): Promise<FormState> {
  try {
    // Prepare the JSON data for the API request
    const jsonData = {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name,
        keyvalues: {
          type: "application/json",
        },
      },
      pinataContent: data,
    }

    // Make the API request to Pinata
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: getPinataApiKey(),
        pinata_secret_api_key: getPinataApiSecret(),
      },
      body: JSON.stringify(jsonData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Pinata API error: ${error.error || "Unknown error"}`)
    }

    const result = await response.json()

    return {
      success: true,
      message: "JSON data uploaded successfully",
      data: {
        cid: result.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        name,
      },
    }
  } catch (error) {
    console.error("Error uploading JSON to IPFS via Pinata:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload JSON to IPFS",
    }
  }
}

/**
 * Gets the URL for a file stored on IPFS via Pinata
 * @param cid The CID of the file
 * @param filename Optional filename
 * @returns The URL of the file
 */
export function getIPFSUrl(cid: string, filename?: string): string {
  // Use Pinata's gateway for accessing the file
  return `https://gateway.pinata.cloud/ipfs/${cid}${filename ? "/" + encodeURIComponent(filename) : ""}`
}
