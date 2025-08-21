"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { LoginModal } from "@/components/login-modal"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { ArrowLeft, CreditCard, Shield, User, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const { state: authState, dispatch: authDispatch } = useAuth()
  const user = authState.user
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isCorrectId, setIsCorrectId] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [ageConsent, setAgeConsent] = useState(false)
  const [currentStep, setCurrentStep] = useState<"details" | "processing" | "complete">("details")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const createOrder = async () => {
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items,
          total: state.total,
          customerInfo: {
            username: user?.username,
            email,
            phone,
            isBedrock: user?.isBedrock || false,
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        setOrderId(result.orderNumber)
        return result.orderNumber
      } else {
        throw new Error(result.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Order creation failed:", error)
      setPaymentError(error instanceof Error ? error.message : "Failed to create order")
      return null
    }
  }

  const handleProceedToPayment = async () => {
    if (!user) {
      authDispatch({ type: "OPEN_LOGIN_MODAL" })
      return
    }

    if (!isCorrectId || !acceptTerms || !ageConsent || !email || !phone) {
      alert("Please complete all required fields and confirmations")
      return
    }

    setIsProcessing(true)
    setPaymentError(null)

    try {
      // Create order first
      const orderNumber = await createOrder()
      if (!orderNumber) {
        setIsProcessing(false)
        return
      }

      // Clear cart before redirecting
      dispatch({ type: "CLEAR_CART" })

      // Redirect to external payment processor
      window.location.href = `https://pay.xo.je/api.php?orderid=${orderNumber}`
    } catch (error) {
      console.error("Order creation failed:", error)
      setPaymentError(error instanceof Error ? error.message : "Failed to create order")
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen gradient-bg">
        <StoreHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Your cart is empty</h1>
          <p className="text-slate-400 mb-8">Add some items to your cart before checking out.</p>
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>
        <StoreFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <StoreHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-400 hover:text-green-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Store
          </Link>
          <h1 className="text-4xl font-bold text-white">Checkout</h1>

          <div className="flex items-center gap-4 mt-4">
            <div
              className={`flex items-center gap-2 ${currentStep === "details" ? "text-green-400" : "text-green-500"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "details" ? "bg-green-600" : "bg-green-500"}`}
              >
                {currentStep === "processing" || currentStep === "complete" ? <CheckCircle className="w-4 h-4" /> : "1"}
              </div>
              <span>Details & Payment</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep === "complete" ? "bg-green-500" : "bg-slate-600"}`}></div>
            <div
              className={`flex items-center gap-2 ${currentStep === "complete" ? "text-green-400" : "text-slate-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "complete" ? "bg-green-500" : "bg-slate-600"}`}
              >
                {currentStep === "complete" ? <CheckCircle className="w-4 h-4" /> : "2"}
              </div>
              <span>Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="glass-card border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg backdrop-blur-sm">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-12 h-12" />
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{item.name}</h3>
                    {item.bonus && <p className="text-slate-400 text-sm">{item.bonus}</p>}
                  </div>
                  <span className="text-green-400 font-bold">৳{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-600 pt-4">
              <div className="flex items-center justify-between text-xl font-bold">
                <span className="text-white">Total:</span>
                <span className="text-green-400">৳{state.total} BDT</span>
              </div>
            </div>
          </Card>

          {/* Checkout Form */}
          <Card className="glass-card border-slate-700 p-6">
            {!user ? (
              <div className="text-center py-8">
                <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-4">Login Required</h2>
                <p className="text-slate-400 mb-6">Please login to continue with your purchase</p>
                <Button
                  onClick={() => authDispatch({ type: "OPEN_LOGIN_MODAL" })}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Login to Continue
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  Customer Details & Payment
                </h2>

                {paymentError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                    <p className="text-red-400">{paymentError}</p>
                  </div>
                )}

                <form className="space-y-6">
                  <div className="bg-slate-700/30 p-4 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">Delivery Information</span>
                    </div>
                    <p className="text-white mb-3">
                      Your items will be delivered to: <span className="text-green-400 font-bold">{user.username}</span>
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="correctId"
                        checked={isCorrectId}
                        onCheckedChange={setIsCorrectId}
                        className="border-slate-500"
                      />
                      <Label htmlFor="correctId" className="text-slate-300 text-sm">
                        Verify this is your correct Minecraft ID
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-slate-300">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="bg-slate-700/50 border-slate-600 text-white backdrop-blur-sm"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-slate-300">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="bg-slate-700/50 border-slate-600 text-white backdrop-blur-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={setAcceptTerms}
                        className="border-slate-500 mt-1"
                      />
                      <Label htmlFor="terms" className="text-slate-300 text-sm leading-relaxed">
                        I accept the{" "}
                        <Link href="/terms" className="text-green-400 hover:text-green-300 underline">
                          Terms and Conditions
                        </Link>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="ageConsent"
                        checked={ageConsent}
                        onCheckedChange={setAgeConsent}
                        className="border-slate-500 mt-1"
                      />
                      <Label htmlFor="ageConsent" className="text-slate-300 text-sm leading-relaxed">
                        I am purchasing this product because I am 18 years old or older, or have guardian permission,
                        and I consent to my data being processed by BlockWar billing department
                      </Label>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 p-4 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-green-400 font-medium">Secure Payment Processing</span>
                    </div>
                    <p className="text-slate-300 text-sm">
                      You will be redirected to our secure payment gateway. Items will be delivered within 1-20 minutes
                      after successful payment.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                    disabled={!isCorrectId || !acceptTerms || !ageConsent || !email || !phone || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay ৳{state.total} BDT</>
                    )}
                  </Button>
                </form>
              </>
            )}
          </Card>
        </div>
      </div>

      <StoreFooter />

      <LoginModal />
    </div>
  )
}
