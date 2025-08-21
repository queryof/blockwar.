import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const supabase = createClient()

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("room_id", params.roomId)
      .order("created_at", { ascending: true })

    if (error) throw error

    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    console.error("Chat messages fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const { message, sender_username, sender_email, is_staff = true } = await request.json()
    const supabase = createClient()

    const { data: newMessage, error } = await supabase
      .from("chat_messages")
      .insert({
        room_id: params.roomId,
        sender_username,
        sender_email,
        message,
        is_staff,
        message_type: "text",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ message: newMessage })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
