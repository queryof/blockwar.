"use client"

import { Home, ShoppingCart, Vote, Users } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { useState } from "react"
import { PlayerListModal } from "./player-list-modal"
import { useServerStatus } from "@/hooks/use-server-status"

export function FloatingNavbar() {
  const { state, dispatch } = useCart()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [showPlayerList, setShowPlayerList] = useState(false)
  const serverStatus = useServerStatus()

  const navItems = [
    {
      icon: Home,
      label: t("nav.home"),
      href: "/",
      active: true,
    },
    {
      icon: ShoppingCart,
      label: t("nav.cart"),
      onClick: () => dispatch({ type: "TOGGLE_CART" }),
      badge: state.items.length > 0 ? state.items.length : undefined,
    },
    {
      icon: Vote,
      label: t("nav.vote"),
      href: "/vote",
    },
    {
      icon: Users,
      label: t("nav.players"),
      onClick: () => setShowPlayerList(true),
      badge: serverStatus.players.now || 0,
    },
  ]

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
          <div className="flex items-center gap-1">
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {item.href ? (
                  <Link href={item.href}>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium">
                      <item.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                      {item.badge && (
                        <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium"
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PlayerListModal
        isOpen={showPlayerList}
        onClose={() => setShowPlayerList(false)}
        players={serverStatus.players.sample || []}
        online={serverStatus.online || false}
        serverName={serverStatus.server.name}
      />
    </>
  )
}
