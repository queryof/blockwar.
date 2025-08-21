"use client"

import type React from "react"
import { LiveChat } from "@/components/live-chat"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Plus, XCircle, User, ArrowLeft, Send, Loader2 } from "lucide-react"
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

export default function SupportPage() {
  const { state, dispatch } = useAuth()
  const [activeTab, setActiveTab] = useState("create")
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [replyMessage, setReplyMessage] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: "",
    priority: "medium",
    email: "",
  })

  useEffect(() => {
    if (state.user) {
      fetchTickets()
      setFormData((prev) => ({ ...prev, email: state.user?.username + "@minecraft.player" || "" }))
    }
  }, [state.user])

  const fetchTickets = async () => {
    if (!state.user) return

    setLoading(true)
    try {
      const response = await fetch(`/api/support/tickets?username=${encodeURIComponent(state.user.username)}`)
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      }
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!state.user) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          minecraft_username: state.user.username,
        }),
      })

      if (response.ok) {
        setFormData({
          subject: "",
          message: "",
          category: "",
          priority: "medium",
          email: state.user.username + "@minecraft.player",
        })
        setActiveTab("tickets")
        fetchTickets()
      }
    } catch (error) {
      console.error("Error creating ticket:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (ticketId: string) => {
    if (!replyMessage.trim() || !state.user) return

    try {
      const response = await fetch("/api/support/tickets/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket_id: ticketId,
          message: replyMessage,
          sender_username: state.user.username,
          sender_email: state.user.username + "@minecraft.player",
        }),
      })

      if (response.ok) {
        setReplyMessage("")
        fetchTickets()
        // Refresh selected ticket
        if (selectedTicket) {
          const updatedTicket = tickets.find((t) => t.id === ticketId)
          if (updatedTicket) setSelectedTicket(updatedTicket)
        }
      }
    } catch (error) {
      console.error("Error sending reply:", error)
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

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/20">
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-white/60" />
            <h1 className="text-2xl font-bold text-white mb-2">Login Required</h1>
            <p className="text-white/70 mb-6">You need to login to access support</p>
            <Button
              onClick={() => dispatch({ type: "OPEN_LOGIN_MODAL" })}
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
            <h1 className="text-4xl font-bold text-white mb-2">Support Center</h1>
            <p className="text-white/70">
              Get help with your BLOCKWAR experience,{" "}
              <span className="text-primary font-medium">{state.user.username}</span>
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
            <TabsTrigger value="create" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              My Tickets ({tickets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/90">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="technical">Technical Issues</SelectItem>
                          <SelectItem value="gameplay">Gameplay Support</SelectItem>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="report">Report Player/Bug</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white/90">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
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

                  <div>
                    <Label className="text-white/90">Subject</Label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white/90">Message</Label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Please provide detailed information about your issue..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-32"
                      required
                    />
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90">
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Ticket...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Create Ticket
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-white">Loading tickets...</span>
              </div>
            ) : tickets.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/60" />
                  <h2 className="text-2xl font-bold text-white mb-2">No Support Tickets</h2>
                  <p className="text-white/70 mb-6">You haven't created any support tickets yet.</p>
                  <Button onClick={() => setActiveTab("create")} className="bg-primary hover:bg-primary/90">
                    Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="bg-black/40 backdrop-blur-xl border border-white/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-white font-bold text-lg">{ticket.subject}</h3>
                          <p className="text-white/60 text-sm">#{ticket.ticket_number}</p>
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
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Ticket Detail Modal/Overlay */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">
                    {selectedTicket.subject} - #{selectedTicket.ticket_number}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTicket(null)}
                    className="text-white/70 hover:text-white"
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Badge className={getStatusColor(selectedTicket.status)}>{selectedTicket.status}</Badge>
                  <Badge className={getPriorityColor(selectedTicket.priority)}>{selectedTicket.priority}</Badge>
                  <Badge variant="outline" className="text-white/70">
                    {selectedTicket.category}
                  </Badge>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white">{selectedTicket.message}</p>
                  <div className="mt-2 text-sm text-white/60">
                    Created: {new Date(selectedTicket.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Reply Section */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Add Reply</h4>
                  <div className="flex gap-2">
                    <Textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Button
                      onClick={() => handleReply(selectedTicket.id)}
                      disabled={!replyMessage.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <LiveChat roomName="Support Chat" />
      </div>
    </div>
  )
}
