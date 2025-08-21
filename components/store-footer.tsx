"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Server, MapPin, Sword, Gift, Mail, MessageCircle, HelpCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function StoreFooter() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Giftcard Balance Section */}
        <Card className="bg-card border border-border p-6 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Check Giftcard Balance</h3>
          </div>
          <div className="flex gap-4 items-end max-w-md">
            <div className="flex-1">
              <label htmlFor="cardNumber" className="block text-muted-foreground text-sm mb-2">
                Card Number
              </label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="Enter your giftcard number"
                className="bg-background border-border"
              />
            </div>
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6">Check Balance</Button>
          </div>
        </Card>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Server Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("home.server_info")}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                <span className="text-foreground font-medium">blockwar.exoo.cloud</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t("home.owner")}:</span>
                <span className="text-foreground">Moinul</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-foreground">EXoo.cloud Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Sword className="w-4 h-4 text-primary" />
                <span className="text-foreground">
                  {t("home.lifesteal")} {t("home.gamemode")}
                </span>
                <span className="text-xs text-secondary">(reg gridint)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors">
                {t("nav.home")}
              </Link>
              <Link
                href="/store/lifesteal-coins"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t("nav.lifesteal_coins")}
              </Link>
              <Link
                href="/store/lifesteal-ranks"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                {t("nav.lifesteal_ranks")}
              </Link>
              <Link href="/checkout" className="block text-muted-foreground hover:text-primary transition-colors">
                Checkout
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <div className="space-y-2 text-sm">
              <a
                href="#"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                Discord Server
              </a>
              <a
                href="mailto:contact@blockwar.exoo.cloud"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-3 h-3" />
                Email Support
              </a>
              <Link
                href="/support"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <HelpCircle className="w-3 h-3" />
                Help Center
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <div className="space-y-2 text-sm">
              <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms and Conditions
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/refund" className="block text-muted-foreground hover:text-primary transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Bar */}
        <div className="text-center text-muted-foreground text-sm space-y-2">
          <p className="font-medium text-foreground">{t("footer.copyright")}</p>
          <p>
            {t("home.hosted_by")} EXoo.cloud Bangladesh | {t("home.owner")}: Moinul
          </p>
          <p className="text-secondary font-medium">{t("footer.billing_info")}</p>
          <p className="text-xs">{t("footer.not_affiliated")}</p>
        </div>
      </div>
    </footer>
  )
}
