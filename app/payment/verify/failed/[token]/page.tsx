"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, Loader2 } from "lucide-react"
import { validatePaymentParams } from "@/lib/payment-tokens"

export default function PaymentFailedTokenPage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [paymentData, setPaymentData] = useState<any>(null)

  const token = params.token as string

  useEffect(() => {
    if (token && searchParams) {
      processFailedPayment()
    }
  }, [token, searchParams])

  const processFailedPayment = async () => {
    try {
      const validatedParams = validatePaymentParams(searchParams)
      setPaymentData(validatedParams)

      // Update order status to failed
      await fetch("/api/payments/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          paymentData: { ...validatedParams, status: "failed" },
        }),
      })
    } catch (error) {
      console.error("Failed payment processing error:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-center text-gray-600">Processing payment status...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Payment Declined</CardTitle>
          <CardDescription>Your payment was declined or cancelled.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentData?.isValid && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm">
                <strong>Transaction ID:</strong> {paymentData.transactionId}
              </p>
              <p className="text-sm">
                <strong>Amount:</strong> ৳{paymentData.paymentAmount}
              </p>
              <p className="text-sm">
                <strong>Method:</strong> {paymentData.paymentMethod}
              </p>
              <p className="text-sm">
                <strong>Status:</strong> failed
              </p>
            </div>
          )}
          <div className="flex flex-col space-y-2">
            <Button onClick={() => router.push("/checkout")} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
