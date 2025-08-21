import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get ticket counts by status
    const { data: ticketStats, error: ticketError } = await supabase.from("support_tickets").select("status")

    if (ticketError) {
      console.error("Database error:", ticketError)
      return NextResponse.json({ error: "Failed to fetch ticket stats" }, { status: 500 })
    }

    // Get active chat count
    const { data: chatStats, error: chatError } = await supabase
      .from("chat_participants")
      .select("id")
      .eq("is_online", true)

    if (chatError) {
      console.error("Database error:", chatError)
      return NextResponse.json({ error: "Failed to fetch chat stats" }, { status: 500 })
    }

    const stats = {
      total_tickets: ticketStats?.length || 0,
      open_tickets: ticketStats?.filter((t) => t.status === "open").length || 0,
      in_progress_tickets: ticketStats?.filter((t) => t.status === "in_progress").length || 0,
      resolved_tickets: ticketStats?.filter((t) => t.status === "resolved").length || 0,
      active_chats: chatStats?.length || 0,
      avg_response_time: "2.5h", // This would be calculated from actual data
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
