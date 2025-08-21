import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get order stats
    const { data: orders } = await supabase.from("orders").select("status, total_amount")
    const { data: tickets } = await supabase.from("support_tickets").select("status")

    const totalOrders = orders?.length || 0
    const totalTickets = tickets?.length || 0
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const pendingOrders = orders?.filter((order) => order.status === "pending").length || 0
    const openTickets = tickets?.filter((ticket) => ticket.status === "open").length || 0

    return NextResponse.json({
      totalOrders,
      totalTickets,
      activeChats: 0, // TODO: Implement chat stats
      totalRevenue,
      pendingOrders,
      openTickets,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 })
  }
}
