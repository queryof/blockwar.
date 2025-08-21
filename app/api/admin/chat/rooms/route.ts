import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: rooms, error } = await supabase
      .from("chat_rooms")
      .select(`
        *,
        chat_participants (
          id,
          username,
          email,
          is_staff,
          is_online,
          last_seen
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch chat rooms" }, { status: 500 })
    }

    return NextResponse.json({ rooms: rooms || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
