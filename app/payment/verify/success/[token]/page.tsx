"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, XCircle, Clock } from "lucide-react"
import { validatePaymentParams } from "@/lib/payment-tokens"

export default function PaymentSuccessTokenPage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [paymentData, setPaymentData] = useState<any>(null)

  const token = params.token as string

  useEffect(() => {
    console.log("[v0] Payment success route accessed with token:", token)
    console.log("[v0] Search params:", Object.fromEntries(searchParams.entries()))
  }, [])

  useEffect(() => {
    if (token && searchParams) {
      verifyTokenAndPayment()
    }
  }, [token, searchParams])

  const verifyTokenAndPayment = async () => {
    try {
      console.log("[v0] Starting payment verification for token:", token)
      const validatedParams = validatePaymentParams(searchParams)
      console.log("[v0] Validated params:", validatedParams)
      setPaymentData(validatedParams)

      // Verify token and update order status
      const response = await fetch("/api/payments/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          paymentData: validatedParams,
        }),
      })

      const result = await response.json()
      console.log("[v0] Verification result:", result)
      setVerificationResult(result)
    } catch (error) {
      console.error("[v0] Payment verification failed:", error)
      setVerificationResult({ success: false, error: "Verification failed" })
    } finally {
      setIsVerifying(false)
    }
  }

  const isPaymentCompleted = () => {
    return paymentData?.status === "completed" && verificationResult?.success
  }

  const isPaymentPending = () => {
    return paymentData?.status === "pending"
  }

  const getStatusIcon = () => {
    if (isPaymentCompleted()) {
      return <CheckCircle className="h-16 w-16 text-green-600" />
    } else if (isPaymentPending()) {
      return <Clock className="h-16 w-16 text-yellow-600" />
    } else {
      return <XCircle className="h-16 w-16 text-red-600" />
    }
  }

  const getStatusTitle = () => {
    if (isPaymentCompleted()) {
      return "Payment Successful!"
    } else if (isPaymentPending()) {
      return "Payment Processing"
    } else {
      return "Payment Verification Failed"
    }
  }

  const getStatusDescription = () => {
    if (isPaymentCompleted()) {
      return "Your payment has been processed successfully."
    } else if (isPaymentPending()) {
      return "Your payment is being processed. Please wait for confirmation."
    } else {
      return "There was an issue verifying your payment."
    }
  }

  const getStatusColor = () => {
    if (isPaymentCompleted()) {
      return "text-green-600"
    } else if (isPaymentPending()) {
      return "text-yellow-600"
    } else {
      return "text-red-600"
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-center text-gray-600">Verifying your payment...</p>
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
          <div className="mx-auto mb-4">{getStatusIcon()}</div>
          <CardTitle className={`text-2xl ${getStatusColor()}`}>{getStatusTitle()}</CardTitle>
          <CardDescription>{getStatusDescription()}</CardDescription>
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
                <strong>Status:</strong> {paymentData.status}
              </p>
            </div>
          )}
          <div className="flex flex-col space-y-2">
            {isPaymentPending() ? (
              <>
                <Button onClick={() => window.location.reload()} className="w-full">
                  Refresh Status
                </Button>
                <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                  Continue Shopping
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => router.push("/")} className="w-full">
                  Continue Shopping
                </Button>
                <Button variant="outline" onClick={() => router.push("/orders")} className="w-full">
                  View Orders
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
