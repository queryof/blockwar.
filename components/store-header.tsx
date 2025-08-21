"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, ShoppingCart, User, LogOut, Copy, Wifi, WifiOff, Vote, Package } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useServerStatus } from "@/hooks/use-server-status"
import { LoginModal } from "@/components/login-modal"
import { PlayerListModal } from "@/components/player-list-modal"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useState } from "react"

export function StoreHeader() {
  const { state, dispatch } = useCart()
  const { state: authState, dispatch: authDispatch } = useAuth()
  const { t } = useLanguage()
  const serverStatus = useServerStatus()
  const [showPlayerList, setShowPlayerList] = useState(false)

  const handleLoginClick = () => {
    authDispatch({ type: "OPEN_LOGIN_MODAL" })
  }

  const handleLogout = () => {
    authDispatch({ type: "LOGOUT" })
  }

  const copyServerIP = () => {
    navigator.clipboard.writeText("blockwar.exoo.cloud")
  }

  const handlePlayerCountClick = () => {
    if (!serverStatus.loading && serverStatus.players.sample.length > 0) {
      setShowPlayerList(true)
    }
  }

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Server Status and IP */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayerCountClick}
                className={`flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-lg transition-colors ${
                  !serverStatus.loading && serverStatus.players.sample.length > 0
                    ? "hover:bg-secondary/20 cursor-pointer"
                    : "cursor-default"
                }`}
                disabled={serverStatus.loading || serverStatus.players.sample.length === 0}
              >
                <Users className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-foreground">
                  {serverStatus.loading ? "..." : serverStatus.players.now}
                  {!serverStatus.loading && <span className="text-muted-foreground">/{serverStatus.players.max}</span>}
                </span>
                <span className="text-xs text-muted-foreground">{t("header.online")}</span>
              </button>

              <div className="flex items-center gap-2">
                {serverStatus.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground">Checking...</span>
                  </div>
                ) : serverStatus.error ? (
                  <div className="flex items-center gap-2">
                    <WifiOff className="w-3 h-3 text-destructive" />
                    <span className="text-xs text-destructive">Offline</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {serverStatus.online ? (
                      <Wifi className="w-3 h-3 text-green-500" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-destructive" />
                    )}
                    <span className={`text-xs ${serverStatus.online ? "text-green-500" : "text-destructive"}`}>
                      {serverStatus.online ? "Online" : "Offline"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">IP:</span>
                <code className="text-xs font-mono bg-muted px-2 py-1 rounded text-foreground">
                  blockwar.exoo.cloud
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyServerIP}
                  className="h-6 w-6 p-0 hover:bg-muted"
                  title="Copy server IP"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />

              <Link href="/vote">
                <Button variant="outline" size="sm" className="border-border hover:bg-muted bg-transparent">
                  <Vote className="w-4 h-4 mr-2" />
                  {t("header.vote")}
                </Button>
              </Link>

              {authState.user && (
                <Link href="/orders">
                  <Button variant="outline" size="sm" className="border-border hover:bg-muted bg-transparent">
                    <Package className="w-4 h-4 mr-2" />
                    Orders
                  </Button>
                </Link>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch({ type: "TOGGLE_CART" })}
                className="relative border-border hover:bg-muted"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t("header.cart")}
                {state.items.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {state.items.length}
                  </Badge>
                )}
              </Button>

              {authState.user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-lg">
                    <img
                      src={authState.user.avatar || "/placeholder.svg"}
                      alt={authState.user.username}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm font-medium text-foreground">{authState.user.username}</span>
                    {authState.user.isBedrock && (
                      <Badge variant="secondary" className="text-xs">
                        BE
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-border hover:bg-muted bg-transparent"
                    title={t("header.logout")}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <User className="w-4 h-4 mr-2" />
                  {t("header.login")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal />
      <PlayerListModal
        isOpen={showPlayerList}
        onClose={() => setShowPlayerList(false)}
        players={serverStatus.players.sample}
        online={serverStatus.online}
        serverName={serverStatus.server.name}
      />
    </>
  )
}
