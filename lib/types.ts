export interface FormState {
  success: boolean
  message: string
  data?: {
    cid: string
    url: string
    name: string
  }
}
