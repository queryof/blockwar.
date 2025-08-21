"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { X, ShoppingCart, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"

export function CartSidebar() {
  const { state, dispatch } = useCart()

  if (!state.isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-96 bg-black/60 backdrop-blur-xl border-l border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <ShoppingBag className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "CLOSE_CART" })}
              className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                  <ShoppingCart className="w-8 h-8 text-white/70" />
                </div>
                <h3 className="font-medium text-white mb-2">Your cart is empty</h3>
                <p className="text-white/70 text-sm mb-6">Add some items to get started</p>
                <Button
                  onClick={() => dispatch({ type: "CLOSE_CART" })}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item, index) => (
                  <div key={item.id}>
                    <Card className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 hover:bg-white/15 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm leading-tight mb-1">{item.name}</h3>
                          {item.bonus && <p className="text-secondary text-xs mb-2">{item.bonus}</p>}
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-primary">৳{item.price}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                              className="text-white/70 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                    {index < state.items.length - 1 && <Separator className="my-2 bg-white/20" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-white/20 bg-white/5 backdrop-blur-sm p-6">
              <div className="space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">Total</span>
                  <span className="text-xl font-bold text-primary">৳{state.total}</span>
                </div>

                <Separator className="bg-white/20" />

                {/* Actions */}
                <div className="space-y-3">
                  <Link href="/checkout" className="block">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11"
                      onClick={() => dispatch({ type: "CLOSE_CART" })}
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 bg-transparent backdrop-blur-sm"
                    onClick={() => dispatch({ type: "CLEAR_CART" })}
                  >
                    Clear Cart
                  </Button>
                </div>

                {/* Security Note */}
                <p className="text-xs text-white/60 text-center mt-4">
                  Secure checkout powered by industry-standard encryption
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
