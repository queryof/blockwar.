"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Users, Minimize2, Maximize2, X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

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

interface ChatParticipant {
  id: string
  room_id: string
  username: string
  email: string
  is_staff: boolean
  is_online: boolean
  last_seen: string
}

interface LiveChatProps {
  roomId?: string
  roomName?: string
  className?: string
}

export function LiveChat({ roomId = "default", roomName = "Support Chat", className = "" }: LiveChatProps) {
  const { state } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [participants, setParticipants] = useState<ChatParticipant[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [actualRoomId, setActualRoomId] = useState<string>("")

  useEffect(() => {
    if (state.user && supabase) {
      initializeChat()
    }
    return () => {
      if (supabase) {
        supabase.removeAllChannels()
      }
    }
  }, [state.user, roomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeChat = async () => {
    try {
      // Get or create chat room
      const { data: room, error: roomError } = await supabase
        .from("chat_rooms")
        .select("id")
        .eq("name", roomName)
        .single()

      let currentRoomId = room?.id
      if (!currentRoomId) {
        const { data: newRoom, error: createError } = await supabase
          .from("chat_rooms")
          .insert({ name: roomName, type: "support" })
          .select("id")
          .single()

        if (createError) throw createError
        currentRoomId = newRoom.id
      }

      setActualRoomId(currentRoomId)

      // Load existing messages
      await loadMessages(currentRoomId)
      await loadParticipants(currentRoomId)

      // Join the room as participant
      await joinRoom(currentRoomId)

      // Set up realtime subscriptions
      setupRealtimeSubscriptions(currentRoomId)

      setIsConnected(true)
    } catch (error) {
      console.error("Error initializing chat:", error)
    }
  }

  const loadMessages = async (roomId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("Error loading messages:", error)
      return
    }

    setMessages(data || [])
  }

  const loadParticipants = async (roomId: string) => {
    const { data, error } = await supabase
      .from("chat_participants")
      .select("*")
      .eq("room_id", roomId)
      .eq("is_online", true)

    if (error) {
      console.error("Error loading participants:", error)
      return
    }

    setParticipants(data || [])
  }

  const joinRoom = async (roomId: string) => {
    if (!state.user) return

    const { error } = await supabase.from("chat_participants").upsert(
      {
        room_id: roomId,
        username: state.user.username,
        email: `${state.user.username}@minecraft.player`,
        is_staff: false,
        is_online: true,
        last_seen: new Date().toISOString(),
      },
      { onConflict: "room_id,username" },
    )

    if (error) {
      console.error("Error joining room:", error)
    }
  }

  const setupRealtimeSubscriptions = (roomId: string) => {
    if (!supabase) return

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`chat_messages_${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage
          setMessages((prev) => [...prev, newMessage])
        },
      )
      .subscribe()

    // Subscribe to participant changes
    const participantsChannel = supabase
      .channel(`chat_participants_${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_participants",
          filter: `room_id=eq.${roomId}`,
        },
        () => {
          loadParticipants(roomId)
        },
      )
      .subscribe()
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !state.user || !actualRoomId) return

    try {
      const { error } = await supabase.from("chat_messages").insert({
        room_id: actualRoomId,
        sender_username: state.user.username,
        sender_email: `${state.user.username}@minecraft.player`,
        message: newMessage.trim(),
        is_staff: false,
        message_type: "text",
      })

      if (error) throw error

      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, 100)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!state.user) {
    return null
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isVisible && (
        <Button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary/90 rounded-full w-14 h-14 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isVisible && (
        <Card
          className={`fixed bottom-6 right-6 z-50 w-96 bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 ${
            isMinimized ? "h-16" : "h-96"
          } ${className}`}
        >
          <CardHeader className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4" />
                {roomName}
                {isConnected && (
                  <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                    Online
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/70 hover:text-white p-1 h-auto"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="text-white/70 hover:text-white p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {!isMinimized && (
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Users className="w-3 h-3" />
                {participants.length} online
              </div>
            )}
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-80">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_username === state.user?.username ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender_username === state.user?.username
                            ? "bg-primary text-white"
                            : message.is_staff
                              ? "bg-yellow-500/20 text-yellow-100 border border-yellow-500/30"
                              : "bg-white/10 text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.sender_username}
                            {message.is_staff && (
                              <Badge variant="outline" className="ml-1 text-xs">
                                Staff
                              </Badge>
                            )}
                          </span>
                          <span className="text-xs opacity-70">{formatTime(message.created_at)}</span>
                        </div>
                        <p className="text-sm">{message.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} className="h-1" />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </>
  )
}
