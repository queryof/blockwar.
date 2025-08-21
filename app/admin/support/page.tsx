"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  ArrowLeft,
  Send,
  Loader2,
  Shield,
} from "lucide-react"
import Link from "next/link"

interface SupportTicket {
  id: string
  ticket_number: string
  minecraft_username: string
  email: string
  subject: string
  message: string
  category: string
  priority: string
  status: string
  assigned_to: string
  created_at: string
  updated_at: string
  replies?: TicketReply[]
}

interface TicketReply {
  id: string
  sender_username: string
  sender_email: string
  message: string
  is_staff_reply: boolean
  created_at: string
}

interface ChatRoom {
  id: string
  name: string
  type: string
  is_active: boolean
  participant_count: number
  last_message: string
  last_activity: string
}

interface DashboardStats {
  total_tickets: number
  open_tickets: number
  in_progress_tickets: number
  resolved_tickets: number
  active_chats: number
  avg_response_time: string
}

export default function AdminSupportDashboard() {
  const { state, dispatch } = useAuth() // Added dispatch to destructuring
  const [activeTab, setActiveTab] = useState("overview")
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  // Simple admin check - in production, this should be more secure
  const isAdmin =
    state.user && (state.user.username === "Moinul" || state.user.username.toLowerCase().includes("admin"))

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData()
    }
  }, [isAdmin])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      await Promise.all([fetchTickets(), fetchChatRooms(), fetchStats()])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/admin/support/tickets")
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
    }
  }

  const fetchChatRooms = async () => {
    try {
      const response = await fetch("/api/admin/chat/rooms")
      if (response.ok) {
        const data = await response.json()
        setChatRooms(data.rooms || [])
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/support/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleTicketUpdate = async (ticketId: string, updates: Partial<SupportTicket>) => {
    try {
      const response = await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        fetchTickets()
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, ...updates })
        }
      }
    } catch (error) {
      console.error("Error updating ticket:", error)
    }
  }

  const handleStaffReply = async (ticketId: string) => {
    if (!replyMessage.trim() || !state.user) return

    try {
      const response = await fetch("/api/support/tickets/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: ticketId,
          message: replyMessage,
          sender_username: state.user.username,
          sender_email: `${state.user.username}@staff.blockwar`,
          is_staff_reply: true,
        }),
      })

      if (response.ok) {
        setReplyMessage("")
        fetchTickets()
      }
    } catch (error) {
      console.error("Error sending staff reply:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "closed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch = filterStatus === "all" || ticket.status === filterStatus
    const priorityMatch = filterPriority === "all" || ticket.priority === filterPriority
    return statusMatch && priorityMatch
  })

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/20">
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-white/60" />
            <h1 className="text-2xl font-bold text-white mb-2">Login Required</h1>
            <p className="text-white/70 mb-6">You need to login to access the admin dashboard</p>
            <Button
              onClick={() => dispatch({ type: "OPEN_LOGIN_MODAL" })} // Fixed dispatch call
              className="w-full bg-primary hover:bg-primary/90"
            >
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/20">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-white/70 mb-6">You don't have permission to access the admin dashboard</p>
            <Link href="/">
              <Button className="w-full bg-primary hover:bg-primary/90">
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Support Dashboard</h1>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/40 backdrop-blur-xl border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Tickets ({tickets.length})
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              {/* Added icon for chat tab */}
              <MessageSquare className="w-4 h-4 mr-2" />
              Live Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-white">Loading dashboard...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Total Tickets</p>
                        <p className="text-2xl font-bold text-white">{stats?.total_tickets || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Open Tickets</p>
                        <p className="text-2xl font-bold text-white">{stats?.open_tickets || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Resolved</p>
                        <p className="text-2xl font-bold text-white">{stats?.resolved_tickets || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">In Progress</p>
                        <p className="text-2xl font-bold text-white">{stats?.in_progress_tickets || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Active Chats</p>
                        <p className="text-2xl font-bold text-white">{stats?.active_chats || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Avg Response</p>
                        <p className="text-2xl font-bold text-white">{stats?.avg_response_time || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tickets">
            <div className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div>
                      <Label className="text-white/90">Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white/90">Priority</Label>
                      <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priority</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="bg-black/40 backdrop-blur-xl border border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg">{ticket.subject}</h3>
                          <p className="text-white/60 text-sm">
                            #{ticket.ticket_number} • {ticket.minecraft_username}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        </div>
                      </div>

                      <div className="text-white/70 mb-4">
                        <p className="mb-2">{ticket.message}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Category: {ticket.category}</span>
                          <span>•</span>
                          <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTicket(ticket)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                        <Select
                          value={ticket.status}
                          onValueChange={(value) => handleTicketUpdate(ticket.id, { status: value })}
                        >
                          <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {chatRooms.map((room) => (
                <Card key={room.id} className="bg-black/40 backdrop-blur-xl border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{room.name}</span>
                      <Badge variant="outline" className="text-white/70">
                        {room.participant_count} users
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-white/70 text-sm">Last message: {room.last_message || "No messages"}</p>
                      <p className="text-white/60 text-xs">
                        Last activity: {room.last_activity ? new Date(room.last_activity).toLocaleString() : "Never"}
                      </p>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Join Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Ticket Management Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Manage Ticket #{selectedTicket.ticket_number}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTicket(null)}
                    className="text-white/70 hover:text-white"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/90">Status</Label>
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(value) => handleTicketUpdate(selectedTicket.id, { status: value })}
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
                  <div>
                    <Label className="text-white/90">Priority</Label>
                    <Select
                      value={selectedTicket.priority}
                      onValueChange={(value) => handleTicketUpdate(selectedTicket.id, { priority: value })}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Original Message</h4>
                  <p className="text-white/90">{selectedTicket.message}</p>
                  <div className="mt-2 text-sm text-white/60">
                    From: {selectedTicket.minecraft_username} • {new Date(selectedTicket.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Staff Reply</h4>
                  <div className="space-y-2">
                    <Textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your staff response..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Button
                      onClick={() => handleStaffReply(selectedTicket.id)}
                      disabled={!replyMessage.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Staff Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
