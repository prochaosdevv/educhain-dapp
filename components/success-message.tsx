import { CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SuccessMessageProps {
  title: string
  message: string
}

export function SuccessMessage({ title, message }: SuccessMessageProps) {
  return (
    <Alert className="bg-green-50 border-green-200 mb-6">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">{title}</AlertTitle>
      <AlertDescription className="text-green-700">{message}</AlertDescription>
    </Alert>
  )
}
