"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { Info } from "lucide-react"
import type { Product } from "@/hooks/use-products"

interface PerksPopupProps {
  product: Product
  trigger?: React.ReactNode
}

export function PerksPopup({ product, trigger }: PerksPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  if (!product.perks_html) {
    return null
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Trigger Button */}
      <div onClick={handleTriggerClick} className="cursor-pointer">
        {trigger || (
          <Button size="sm" variant="ghost" className="w-6 h-6 p-0 text-muted-foreground hover:text-primary">
            <Info className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-lg pointer-events-none" />
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <img
                    src={product.image_url || "/placeholder.svg?height=24&width=24"}
                    alt={product.name}
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-sm text-white/70">
                    ৳{product.price} {product.currency}
                  </p>
                  {product.metadata?.tag && (
                    <span className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded-full mt-1">
                      {product.metadata.tag === "special"
                        ? "Special Rank"
                        : product.metadata.tag === "ultimate"
                          ? "Ultimate Rank"
                          : product.metadata.tag === "premium"
                            ? "Premium Rank"
                            : product.metadata.tag}
                    </span>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {product.weekly_price && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm text-primary/90">
                    Weekly Subscription: ৳{product.weekly_price} {product.currency}/week
                  </p>
                </div>
              )}

              {/* HTML Content */}
              <div
                className="perks-html-content text-white/90"
                dangerouslySetInnerHTML={{ __html: product.perks_html }}
              />

              {/* Footer */}
              <Button onClick={handleClose} className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg">
                {t("common.close")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
