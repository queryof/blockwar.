"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function PaymentVerificationPage() {
  const router = useRouter()

  useEffect(() => {
    // Since we removed the payment verification system, redirect to home
    router.push("/")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-center text-gray-600">Redirecting...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
