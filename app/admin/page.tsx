"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Users, MessageSquare, ShoppingCart, BarChart3, LogOut, Eye, Loader2 } from "lucide-react"

interface AdminUser {
  username: string
  role: string
  lastLogin: string
}

interface DashboardStats {
  totalOrders: number
  totalTickets: number
  activeChats: number
  totalRevenue: number
  pendingOrders: number
  openTickets: number
}

interface Order {
  id: string
  order_number: string
  minecraft_username: string
  total_amount: number
  status: string
  created_at: string
  items: any[]
  payment_status: string
  transaction_id: string
  email: string
  order_items: any[]
  payment_method: string
  notes: string
}

interface SupportTicket {
  id: string
  ticket_number: string
  minecraft_username: string
  subject: string
  status: string
  priority: string
  created_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [orderNotes, setOrderNotes] = useState("")
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/admin/auth/check")
      if (response.ok) {
        setIsAuthenticated(true)
        loadDashboardData()
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        loadDashboardData()
      } else {
        alert("Invalid credentials")
      }
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" })
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const loadDashboardData = async () => {
    try {
      // Load stats
      const statsResponse = await fetch("/api/admin/dashboard/stats")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Load orders
      const ordersResponse = await fetch("/api/admin/orders")
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setOrders(ordersData.orders || [])
      }

      // Load tickets
      const ticketsResponse = await fetch("/api/admin/support/tickets")
      if (ticketsResponse.ok) {
        const ticketsData = await ticketsResponse.json()
        setTickets(ticketsData.tickets || [])
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        loadDashboardData()
        setSelectedOrder(null)
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    }
  }

  const updateOrderNotes = async (orderId: string, notes: string) => {
    setIsUpdatingNotes(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })

      if (response.ok) {
        // Update the selected order with new notes
        if (selectedOrder) {
          setSelectedOrder({ ...selectedOrder, notes })
        }
        // Refresh the orders list
        loadDashboardData()
      }
    } catch (error) {
      console.error("Failed to update order notes:", error)
    } finally {
      setIsUpdatingNotes(false)
    }
  }

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        loadDashboardData()
        setSelectedTicket(null)
      }
    } catch (error) {
      console.error("Failed to update ticket:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/20">
          <CardHeader className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-white/90">Username</Label>
                <Input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-white/90">Password</Label>
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-white/70">BLOCKWAR Server Management</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="bg-white/10 border-white/20 text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/40 backdrop-blur-xl border border-white/20">
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="tickets">
              <MessageSquare className="w-4 h-4 mr-2" />
              Support
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Orders</p>
                        <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                      </div>
                      <ShoppingCart className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Support Tickets</p>
                        <p className="text-2xl font-bold text-white">{stats.totalTickets}</p>
                      </div>
                      <MessageSquare className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-white">৳{stats.totalRevenue}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-sm">Pending Orders</p>
                        <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
                      </div>
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <div className="mt-8">
              <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <a href="/admin/chat">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Live Chat Admin
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-medium">#{order.order_number}</p>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                order.status === "completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : order.status === "processing"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : order.status === "pending"
                                      ? "bg-blue-500/20 text-blue-400"
                                      : "bg-red-500/20 text-red-400"
                              }
                            >
                              {order.status}
                            </Badge>
                            <Badge
                              className={
                                order.payment_status === "completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : order.payment_status === "pending"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                              }
                            >
                              {order.payment_status || "unknown"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-white/70 text-sm mb-2">
                          {order.minecraft_username} - ৳{order.total_amount}
                        </p>
                        {order.transaction_id && (
                          <p className="text-white/60 text-xs">Transaction: {order.transaction_id}</p>
                        )}
                        {order.order_items && order.order_items.length > 0 && (
                          <div className="mt-2 text-xs text-white/60">
                            Items:{" "}
                            {order.order_items.map((item: any) => `${item.product_name} (${item.quantity})`).join(", ")}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                        className="bg-white/10 border-white/20 text-white ml-4"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">#{ticket.ticket_number}</p>
                        <p className="text-white/70 text-sm">
                          {ticket.subject} - {ticket.minecraft_username}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            ticket.status === "resolved"
                              ? "bg-green-500/20 text-green-400"
                              : ticket.status === "in_progress"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                          }
                        >
                          {ticket.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTicket(ticket)}
                          className="bg-white/10 border-white/20 text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Order #{selectedOrder.order_number}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/90">Customer</Label>
                    <p className="text-white">{selectedOrder.minecraft_username}</p>
                  </div>
                  <div>
                    <Label className="text-white/90">Email</Label>
                    <p className="text-white">{selectedOrder.email || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-white/90">Total Amount</Label>
                    <p className="text-white">৳{selectedOrder.total_amount}</p>
                  </div>
                  <div>
                    <Label className="text-white/90">Payment Status</Label>
                    <Badge
                      className={
                        selectedOrder.payment_status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : selectedOrder.payment_status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }
                    >
                      {selectedOrder.payment_status || "unknown"}
                    </Badge>
                  </div>
                  {selectedOrder.transaction_id && (
                    <div>
                      <Label className="text-white/90">Transaction ID</Label>
                      <p className="text-white font-mono text-sm">{selectedOrder.transaction_id}</p>
                    </div>
                  )}
                  {selectedOrder.payment_method && (
                    <div>
                      <Label className="text-white/90">Payment Method</Label>
                      <p className="text-white">{selectedOrder.payment_method}</p>
                    </div>
                  )}
                </div>

                {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                  <div>
                    <Label className="text-white/90 text-lg">Order Items</Label>
                    <div className="mt-2 space-y-2">
                      {selectedOrder.order_items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{item.product_name}</p>
                            <p className="text-white/60 text-sm">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">৳{item.subtotal}</p>
                            <p className="text-white/60 text-sm">৳{item.product_price} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-white/90 text-lg">Order Notes</Label>
                  <div className="mt-2 space-y-3">
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder={selectedOrder.notes || "Add notes about this order..."}
                      className="w-full h-32 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      onFocus={() => setOrderNotes(selectedOrder.notes || "")}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateOrderNotes(selectedOrder.id, orderNotes)}
                        disabled={isUpdatingNotes}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isUpdatingNotes ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Notes"
                        )}
                      </Button>
                      <Button
                        onClick={() => setOrderNotes("")}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white"
                      >
                        Clear
                      </Button>
                    </div>
                    {selectedOrder.notes && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <Label className="text-white/70 text-sm">Current Notes:</Label>
                        <p className="text-white/90 mt-1 whitespace-pre-wrap">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-white/90">Order Status</Label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedOrder(null)}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-black/90 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Ticket #{selectedTicket.ticket_number}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white/90">Status</Label>
                  <Select
                    value={selectedTicket.status}
                    onValueChange={(value) => updateTicketStatus(selectedTicket.id, value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setSelectedTicket(null)} variant="outline">
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
