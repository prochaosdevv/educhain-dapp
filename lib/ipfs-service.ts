/**
 * IPFS Service - Client-side helper functions
 * This service provides client-side utilities for IPFS but delegates actual API calls to server actions
 */

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
