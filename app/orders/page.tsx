"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, Calendar, CreditCard, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

interface Order {
  id: string
  order_number: string
  minecraft_username: string
  email: string
  total_amount: number
  currency: string
  status: string
  payment_status: string
  delivery_status: string
  created_at: string
  order_items: {
    id: string
    product_name: string
    quantity: number
    product_price: number
    subtotal: number
  }[]
}

export default function OrdersPage() {
  const { state, dispatch } = useAuth() // Added dispatch to destructuring
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (state.user) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [state.user])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders/user?username=${encodeURIComponent(state.user!.username)}`)
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      setError("Failed to load orders")
      console.error("Error fetching orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "processing":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "cancelled":
      case "declined":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/20">
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-white/60" />
            <h1 className="text-2xl font-bold text-white mb-2">Login Required</h1>
            <p className="text-white/70 mb-6">You need to login to view your orders</p>
            <Button
              onClick={() => dispatch({ type: "OPEN_LOGIN_MODAL" })} // Fixed dispatch call
              className="w-full bg-primary hover:bg-primary/90"
            >
              Login to Continue
            </Button>
            <Link href="/" className="inline-block mt-4">
              <Button variant="ghost" className="text-white/70 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
            <p className="text-white/70">
              Welcome back, <span className="text-primary font-medium">{state.user.username}</span>
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-white">Loading your orders...</span>
          </div>
        ) : error ? (
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="p-6 text-center">
              <p className="text-red-400">{error}</p>
              <Button onClick={fetchOrders} className="mt-4 bg-transparent" variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-white/60" />
              <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
              <p className="text-white/70 mb-6">
                You haven't made any purchases yet. Start shopping to see your orders here!
              </p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="bg-black/40 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Order #{order.order_number}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      <Badge className={getStatusColor(order.payment_status)}>{order.payment_status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {order.currency} {order.total_amount}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <User className="w-4 h-4" />
                      <span>{order.minecraft_username}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Items:</h4>
                    {order.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div>
                          <p className="text-white font-medium">{item.product_name}</p>
                          <p className="text-white/60 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">
                            {order.currency} {item.subtotal}
                          </p>
                          <p className="text-white/60 text-sm">
                            {order.currency} {item.product_price} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
