import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, total, customerInfo } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Items are required" }, { status: 400 })
    }

    if (!total || typeof total !== "number") {
      return NextResponse.json({ success: false, error: "Total amount is required" }, { status: 400 })
    }

    if (!customerInfo || !customerInfo.username || !customerInfo.email || !customerInfo.phone) {
      return NextResponse.json({ success: false, error: "Customer information is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    if (!supabase) {
      return NextResponse.json({ success: false, error: "Database connection not available" }, { status: 500 })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        minecraft_username: customerInfo.username,
        email: customerInfo.email,
        phone: customerInfo.phone,
        is_bedrock: customerInfo.isBedrock || false,
        total_amount: total,
        currency: "BDT",
        status: "pending",
        payment_status: "pending",
        delivery_status: "pending",
        terms_accepted: true,
        age_consent: true,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity || 1,
      subtotal: item.price * (item.quantity || 1),
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      // Try to clean up the order if items creation failed
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ success: false, error: "Failed to create order items" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
