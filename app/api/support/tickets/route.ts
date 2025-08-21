import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { minecraft_username, email, subject, message, category, priority } = body

    if (!minecraft_username || !subject || !message || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { data: ticket, error } = await supabase
      .from("support_tickets")
      .insert({
        minecraft_username,
        email: email || `${minecraft_username}@minecraft.player`,
        subject,
        message,
        category,
        priority: priority || "medium",
        status: "open",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
    }

    return NextResponse.json({ ticket })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { data: tickets, error } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("minecraft_username", username)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
    }

    return NextResponse.json({ tickets: tickets || [] })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
