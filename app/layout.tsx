import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { FloatingNavbar } from "@/components/floating-navbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "BLOCKWAR Store - Premium LifeSteal Minecraft Server",
  description:
    "Official BLOCKWAR Minecraft Server Store - Purchase ranks, coins, and exclusive items for the ultimate LifeSteal experience.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="gradient-bg min-h-screen">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartSidebar />
              <FloatingNavbar />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
