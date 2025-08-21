"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StoreHeader } from "@/components/store-header"
import { StoreSidebar } from "@/components/store-sidebar"
import { StoreFooter } from "@/components/store-footer"
import { useCart } from "@/contexts/cart-context"
import { useProducts } from "@/hooks/use-products"
import { PerksPopup } from "@/components/perks-popup"
import { Info, ShoppingCart, Crown, Star, Zap, Shield, Sword, Skull } from "lucide-react"

export default function LifeStealRanksPage() {
  const { dispatch } = useCart()
  const { products: rankPackages, loading, error } = useProducts("ranks")

  const addToCart = (rank: any) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: rank.id,
        name: rank.name,
        price: rank.price,
        image: rank.image_url || "/placeholder.svg?height=64&width=64",
        category: rank.category,
      },
    })
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Ultimate":
        return <Skull className="w-4 h-4" />
      case "Special":
        return <Sword className="w-4 h-4" />
      case "Premium":
        return <Crown className="w-4 h-4" />
      case "Advanced":
        return <Star className="w-4 h-4" />
      case "Standard":
        return <Zap className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Ultimate":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
      case "Special":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
      case "Premium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
      case "Advanced":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
      case "Standard":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
    }
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
                <Crown className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">LifeSteal Ranks</h1>
                <p className="text-muted-foreground">reg gridint</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Unlock exclusive perks and abilities with premium ranks. Each rank includes bonus coins and special
              privileges in LifeSteal Gamemode.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="bg-card border border-border p-6">
                  <div className="animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded"></div>
                        <div>
                          <div className="h-6 bg-muted rounded mb-2 w-20"></div>
                          <div className="h-4 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                    <div className="mb-6">
                      <div className="space-y-2">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="h-4 bg-muted rounded"></div>
                        ))}
                      </div>
                    </div>
                    <div className="h-8 bg-muted rounded mb-4"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">Error loading ranks: {error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {rankPackages.map((rank) => (
                <Card
                  key={rank.id}
                  className="relative bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  {rank.is_popular && (
                    <div className="absolute -top-3 left-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  {rank.metadata?.special && (
                    <div className="absolute -top-3 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Special Rank
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rank.image_url || "/placeholder.svg"}
                          alt={rank.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                            {rank.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className={`${getTierColor(rank.metadata?.tier || "Standard")} border`}>
                          {getTierIcon(rank.metadata?.tier || "Standard")}
                          <span className="ml-1">{rank.metadata?.tier || "Standard"}</span>
                        </Badge>
                        {rank.metadata?.tag && (
                          <Badge variant="secondary" className="text-xs">
                            {rank.metadata.tag === "special"
                              ? "Special Rank"
                              : rank.metadata.tag === "ultimate"
                                ? "Ultimate Rank"
                                : rank.metadata.tag === "premium"
                                  ? "Premium Rank"
                                  : rank.metadata.tag}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="text-sm text-muted-foreground">
                        {rank.description && <p className="mb-2">{rank.description}</p>}
                        <p>Exclusive {rank.name} rank privileges and abilities</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {rank.weekly_price ? (
                          <div className="space-y-1">
                            <div className="text-2xl font-bold text-primary">
                              ৳{rank.weekly_price}
                              <span className="text-sm font-normal text-muted-foreground ml-1">/week</span>
                            </div>
                            <div className="text-lg font-semibold text-foreground">
                              ৳{rank.price}
                              <span className="text-sm font-normal text-muted-foreground ml-1">/month</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-3xl font-bold text-primary">
                            ৳{rank.price}
                            <span className="text-sm font-normal text-muted-foreground ml-1">{rank.currency}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {rank.perks_html ? (
                        <PerksPopup
                          product={rank}
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
                        onClick={() => addToCart(rank)}
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
              <h2 className="font-bold text-xl text-foreground mb-6 flex items-center gap-2">
                <Crown className="w-5 h-5 text-secondary" />
                Rank Benefits Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-red-100 text-red-800 border-red-200 border dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                      <Skull className="w-3 h-3 mr-1" />
                      Ultimate Tier
                    </Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      5000 Bonus Coins included
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      Ultimate DEVIL prefix
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      Maximum server privileges
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      Exclusive devil abilities
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 border dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                      <Sword className="w-3 h-3 mr-1" />
                      Special Tier
                    </Badge>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      4000 Bonus Coins included
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      Special MADARA prefix
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      Unique special abilities
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                      Exclusive command access
                    </li>
                  </ul>
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
