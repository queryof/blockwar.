"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StoreHeader } from "@/components/store-header"
import { StoreSidebar } from "@/components/store-sidebar"
import { StoreFooter } from "@/components/store-footer"
import { useCart } from "@/contexts/cart-context"
import { useProducts } from "@/hooks/use-products"
import { PerksPopup } from "@/components/perks-popup"
import { Info, ShoppingCart } from "lucide-react"

export default function LifeStealCoinsPage() {
  const { dispatch } = useCart()
  const { products: coinPackages, loading, error } = useProducts("coins")

  const addToCart = (product: any) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || "/placeholder.svg?height=64&width=64",
        category: product.category,
      },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <div className="container mx-auto px-4 py-8 flex gap-8">
        <StoreSidebar />

        <main className="flex-1">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <img src="/minecraft-gold-coins-stack.png" alt="Coins" className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">LifeSteal Coins</h1>
                <p className="text-muted-foreground">reg gridint</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Get yourself some coins to get awesome keys & perks from coinshop. You will receive these coins in
              LifeSteal Gamemode.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="bg-card border border-border p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-center mb-6 bg-muted/30 rounded-lg p-4">
                      <div className="w-16 h-16 bg-muted rounded"></div>
                    </div>
                    <div className="text-center mb-6">
                      <div className="h-6 bg-muted rounded mb-2"></div>
                      <div className="h-8 bg-muted rounded"></div>
                    </div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">Error loading coins: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {coinPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="relative bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  {pkg.is_popular && (
                    <div className="absolute -top-3 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-center mb-6 bg-muted/30 rounded-lg p-4">
                      <img
                        src={pkg.image_url || "/placeholder.svg"}
                        alt={pkg.name}
                        className="w-16 h-16 object-contain"
                      />
                    </div>

                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {pkg.name}
                      </h3>
                      <div className="text-3xl font-bold text-primary">
                        ৳{pkg.price}
                        <span className="text-sm font-normal text-muted-foreground ml-1">{pkg.currency}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {pkg.perks_html ? (
                        <PerksPopup
                          product={pkg}
                          trigger={
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-muted-foreground/20 hover:border-secondary hover:bg-secondary/10 bg-transparent"
                            >
                              <Info className="w-4 h-4" />
                            </Button>
                          }
                        />
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-muted-foreground/20 hover:border-secondary hover:bg-secondary/10 bg-transparent"
                          disabled
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => addToCart(pkg)}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <section>
            <Card className="bg-card border border-border p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-xl text-foreground mb-3">Need Support?</h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Have questions before checkout? Package not arrived after 20 minutes? Contact our community on
                    Discord or submit a support ticket for payment assistance.
                  </p>
                  <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    Join Discord Server
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>

      <StoreFooter />
    </div>
  )
}
