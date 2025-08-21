import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticket_id, message, sender_username, sender_email } = body

    if (!ticket_id || !message || !sender_username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { data: reply, error } = await supabase
      .from("support_ticket_replies")
      .insert({
        ticket_id,
        sender_username,
        sender_email: sender_email || `${sender_username}@minecraft.player`,
        message,
        is_staff_reply: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create reply" }, { status: 500 })
    }

    // Update ticket status to show activity
    await supabase.from("support_tickets").update({ updated_at: new Date().toISOString() }).eq("id", ticket_id)

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
