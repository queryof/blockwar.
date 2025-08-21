"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Crown, Sword, User, Globe } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function StoreSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-80 space-y-6">
      {/* Navigation */}
      <Card className="bg-card border border-border p-6">
        <h3 className="font-semibold text-foreground text-sm mb-4 tracking-wide uppercase">Store Categories</h3>
        <nav className="space-y-2">
          <Link href="/store/lifesteal-coins">
            <Button
              variant="ghost"
              className={`w-full justify-start text-left h-auto py-3 ${
                pathname === "/store/lifesteal-coins"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    pathname === "/store/lifesteal-coins" ? "bg-primary-foreground/20" : "bg-secondary/20"
                  }`}
                >
                  <Coins className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <div className="font-medium">LifeSteal Coins</div>
                  <div className="text-xs opacity-70">Purchase in-game currency</div>
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/store/lifesteal-ranks">
            <Button
              variant="ghost"
              className={`w-full justify-start text-left h-auto py-3 ${
                pathname === "/store/lifesteal-ranks"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    pathname === "/store/lifesteal-ranks" ? "bg-primary-foreground/20" : "bg-secondary/20"
                  }`}
                >
                  <Crown className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <div className="font-medium">LifeSteal Ranks</div>
                  <div className="text-xs opacity-70">Unlock exclusive perks</div>
                </div>
              </div>
            </Button>
          </Link>
        </nav>
      </Card>

      {/* Server Information */}
      <Card className="bg-card border border-border p-6">
        <h3 className="font-semibold text-foreground text-sm mb-4 tracking-wide uppercase">Server Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Owner</div>
              <div className="font-medium text-foreground">Moinul</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Hosted by</div>
              <div className="font-medium text-foreground">EXoo.cloud Bangladesh</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Sword className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Gamemode</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-primary text-primary-foreground text-xs">LifeSteal</Badge>
                <span className="text-xs text-secondary font-medium">(reg gridint)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </aside>
  )
}
