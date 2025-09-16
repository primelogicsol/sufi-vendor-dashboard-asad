// // lib/utils/bulk-upload-client.ts

// import { TokenManager } from "@/lib/auth/token-manager"
// import { AuthService } from "@/lib/auth/auth-service"

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// export class BulkUploadClient {
//   static async uploadCSV(category: string, file: File): Promise<Response> {
//     // Ensure we have a valid token
//     const hasValidToken = await AuthService.ensureValidToken()
//     if (!hasValidToken) {
//       if (typeof window !== "undefined") {
//         window.location.href = "/login"
//       }
//       throw new Error("Authentication required")
//     }

//     const accessToken = TokenManager.getAccessToken()
//     if (!accessToken) {
//       throw new Error("No access token found")
//     }

//     // Prepare form data
//     const formData = new FormData()
//     formData.append("file", file)

//     // Build endpoint with query param
//     // const endpoint = `${API_BASE_URL}/bulk-uploader/upload-bulk?category=${encodeURIComponent(
//     //   category.toLowerCase()
//     // )}`
//      const endpoint = `${API_BASE_URL}/bulk-uploader/upload-bulk?category=${category}`

//     try { 
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`, // 🔹 Auth header
//         },
//         body: formData,
//       })
//       console.log(endpoint,response)

//       if (!response.ok) {
//         throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
//       }

//       return response
//     } catch (error) {
//       console.error("Bulk upload failed:", error)
//       throw error
//     }
//   }
// }


// lib/utils/bulk-upload-client.ts
import { TokenManager } from "@/lib/auth/token-manager"
import { AuthService } from "@/lib/auth/auth-service"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// lib/utils/bulk-upload-client.ts
export class BulkUploadClient {
  static async uploadCSV(category: string, formData: FormData): Promise<Response> {
    const hasValidToken = await AuthService.ensureValidToken()
    if (!hasValidToken) {
      if (typeof window !== "undefined") window.location.href = "/login"
      throw new Error("Authentication required")
    }

    const accessToken = TokenManager.getAccessToken()
    if (!accessToken) throw new Error("No access token found")

    const endpoint = `${API_BASE_URL}/bulk-uploader/upload-bulk?category=${category}`

    return fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    })
  }

  
  static async uploadImageBySku(category: string, sku: string, file: File): Promise<Response> {
    const hasValidToken = await AuthService.ensureValidToken()
    if (!hasValidToken) {
      if (typeof window !== "undefined") window.location.href = "/login"
      throw new Error("Authentication required")
    }

    const accessToken = TokenManager.getAccessToken()
    if (!accessToken) throw new Error("No access token found")

    const formData = new FormData()
    formData.append("file", file)         // image file
    formData.append("category", category) // required by backend
    formData.append("sku", sku)           // required by backend

    const endpoint = `${API_BASE_URL}/bulk-uploader/upload-image-by-sku`

    return fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    })
  }
}

