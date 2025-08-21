"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ChatRoom {
  id: string
  name: string
  type: string
  is_active: boolean
  created_at: string
  chat_participants: ChatParticipant[]
}

interface ChatParticipant {
  id: string
  username: string
  email: string
  is_staff: boolean
  is_online: boolean
  last_seen: string
}

interface ChatMessage {
  id: string
  room_id: string
  sender_username: string
  sender_email: string
  message: string
  is_staff: boolean
  message_type: string
  created_at: string
}

export default function AdminChatPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadChatRooms()
  }, [])

  useEffect(() => {
    if (selectedRoom) {
      loadMessages(selectedRoom.id)
      const interval = setInterval(() => loadMessages(selectedRoom.id), 3000)
      return () => clearInterval(interval)
    }
  }, [selectedRoom])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadChatRooms = async () => {
    try {
      const response = await fetch("/api/admin/chat/rooms")
      if (response.ok) {
        const data = await response.json()
        setRooms(data.rooms || [])
      }
    } catch (error) {
      console.error("Failed to load chat rooms:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (roomId: string) => {
    try {
      const response = await fetch(`/api/admin/chat/messages/${roomId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedRoom) return

    try {
      const response = await fetch(`/api/admin/chat/messages/${selectedRoom.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newMessage,
          sender_username: "Admin",
          sender_email: "admin@blockwar.com",
          is_staff: true,
        }),
      })

      if (response.ok) {
        setNewMessage("")
        loadMessages(selectedRoom.id)
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Live Chat Admin</h1>
            <p className="text-white/70">Manage customer support conversations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Rooms List */}
          <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat Rooms ({rooms.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedRoom?.id === room.id
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{room.name}</p>
                          <p className="text-white/60 text-sm">{room.chat_participants?.length || 0} participants</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500/20 text-green-400">{room.type}</Badge>
                          {room.chat_participants?.some((p) => p.is_online && !p.is_staff) && (
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <div className="lg:col-span-2">
            {selectedRoom ? (
              <Card className="bg-black/40 backdrop-blur-xl border border-white/20 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      {selectedRoom.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{selectedRoom.chat_participants?.length || 0}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 mb-4">
                    <div className="space-y-4 pr-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.is_staff ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.is_staff ? "bg-primary/20 text-white" : "bg-white/10 text-white"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{message.sender_username}</span>
                              <span className="text-xs text-white/60">{formatTime(message.created_at)}</span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <form onSubmit={sendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="bg-white/10 border-white/20 text-white flex-1"
                    />
                    <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/40 backdrop-blur-xl border border-white/20 h-full flex items-center justify-center">
                <div className="text-center text-white/60">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a chat room to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
