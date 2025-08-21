"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StoreHeader } from "@/components/store-header"
import { StoreSidebar } from "@/components/store-sidebar"
import { StoreFooter } from "@/components/store-footer"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useFeaturedProducts } from "@/hooks/use-products"
import { ShoppingCart, Star, Vote, ExternalLink, Trophy } from "lucide-react"
import Image from "next/image"
import { PerksPopup } from "@/components/perks-popup"

export default function HomePage() {
  const { t } = useLanguage()
  const { dispatch } = useCart()
  const { products: featuredProducts, loading, error } = useFeaturedProducts()

  const handleAddToCart = (product: any) => {
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

  const voteLinks = [
    {
      name: "Minecraft-MP",
      url: "https://minecraft-mp.com/server-s347625",
      description: "Vote on Minecraft-MP",
      icon: "🏆",
    },
    {
      name: "Minecraft Buzz",
      url: "https://minecraft.buzz/server/16080",
      description: "Vote on Minecraft Buzz",
      icon: "⭐",
    },
    {
      name: "Minecraft Server Net",
      url: "https://minecraft-server.net/details/BlockWar/",
      description: "Vote on Minecraft Server Net",
      icon: "🎯",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <div className="container mx-auto px-4 py-8 flex gap-8">
        <StoreSidebar />

        <main className="flex-1">
          <div className="text-center mb-12">
            {/* Logo centered */}
            <div className="mb-6">
              <Image
                src="/blockwar-logo.png"
                alt="BLOCKWAR"
                width={300}
                height={150}
                className="object-contain mx-auto"
              />
            </div>

            {/* Horizontal banner below logo */}
            <div className="mb-8">
              <div className="relative inline-block">
                <Image
                  src="/server-banner-new.gif"
                  alt="BANGLADESHI #1"
                  width={800}
                  height={80}
                  className="rounded-lg shadow-lg"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white drop-shadow-lg">BANGLADESHI #1</span>
                </div>
              </div>
            </div>

            {/* Server info card */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-foreground mb-2">BLOCKWAR</h1>
              <p className="text-lg text-muted-foreground mb-2">Premium LifeSteal Minecraft Server</p>
              <p className="text-primary font-medium mb-3">blockwar.exoo.cloud</p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  Owner: <span className="text-foreground font-medium">Moinul</span>
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Hosted by: <span className="text-foreground font-medium">EXoo.cloud Bangladesh</span>
                </span>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Vote for BLOCKWAR</h2>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-xl p-6 mb-6 border border-yellow-500/20">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Support Our Server!</h3>
                <p className="text-muted-foreground">
                  Vote for BLOCKWAR on these platforms to help us grow and get awesome rewards!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {voteLinks.map((link, index) => (
                  <Card
                    key={index}
                    className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-lg">
                          {link.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {link.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{link.description}</p>
                        </div>
                      </div>
                      <Button
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                        onClick={() => window.open(link.url, "_blank")}
                      >
                        <Vote className="w-4 h-4 mr-2" />
                        Vote Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4" />
                  Voting helps us reach more players and improves server ranking!
                </div>
              </div>
            </div>
          </section>

          {/* Featured Packages Section */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{t("home.featured_packages")}</h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-card/50 backdrop-blur-sm border border-border/50 p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-muted rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded mb-2"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
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
                <p className="text-destructive mb-4">Error loading products: {error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                  >
                    {product.is_popular && (
                      <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground z-10">
                        {t("product.most_popular")}
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                    <div className="relative p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                          <img
                            src={product.image_url || "/placeholder.svg?height=32&width=32"}
                            alt={product.name}
                            className="w-8 h-8"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            {product.perks_html && <PerksPopup product={product} />}
                          </div>
                          <p className="text-primary text-sm font-medium">
                            {product.category === "coins"
                              ? `${product.metadata?.coins_amount || ""} Coins`
                              : product.metadata?.prefix || product.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right mb-4">
                        <span className="text-2xl font-bold text-primary">৳{product.price}</span>
                        <span className="text-sm text-muted-foreground ml-1">{product.currency}</span>
                      </div>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {t("product.add_to_cart")}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      <StoreFooter />
    </div>
  )
}
