"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Gift, Coins, Key } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"

const votingLinks = [
  {
    id: 1,
    name: "MinecraftServers.org",
    url: "https://minecraftservers.org/vote/123456",
    reward: "50 Coins + 1 Vote Key",
    cooldown: "24 hours",
  },
  {
    id: 2,
    name: "Minecraft-Server-List.com",
    url: "https://minecraft-server-list.com/vote/123456",
    reward: "75 Coins + 1 Vote Key",
    cooldown: "24 hours",
  },
  {
    id: 3,
    name: "TopMinecraftServers.org",
    url: "https://topminecraftservers.org/vote/123456",
    reward: "100 Coins + 2 Vote Keys",
    cooldown: "24 hours",
  },
  {
    id: 4,
    name: "MinecraftMP.com",
    url: "https://minecraftmp.com/vote/123456",
    reward: "60 Coins + 1 Vote Key",
    cooldown: "24 hours",
  },
  {
    id: 5,
    name: "Minecraft-Servers.biz",
    url: "https://minecraft-servers.biz/vote/123456",
    reward: "80 Coins + 1 Vote Key",
    cooldown: "24 hours",
  },
]

export default function VotePage() {
  const { t } = useLanguage()

  const handleVoteClick = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">{t("vote.title")}</h1>
            <p className="text-lg text-muted-foreground mb-6">{t("vote.description")}</p>

            {/* Rewards Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-card border-border">
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">{t("vote.rewards.coins")}</h3>
                    <p className="text-sm text-muted-foreground">50-100 per vote</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <Key className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">{t("vote.rewards.keys")}</h3>
                    <p className="text-sm text-muted-foreground">1-2 per vote</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <Gift className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">{t("vote.rewards.bonus")}</h3>
                    <p className="text-sm text-muted-foreground">Special rewards</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Voting Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {votingLinks.map((link) => (
              <Card key={link.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">
                      {t("vote.link")} {link.id}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {link.cooldown}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground">{link.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Gift className="w-4 h-4 text-green-500" />
                      <span className="text-foreground font-medium">{t("vote.reward")}:</span>
                      <span className="text-muted-foreground">{link.reward}</span>
                    </div>

                    <Button
                      onClick={() => handleVoteClick(link.url)}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t("vote.button")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <Card className="mt-8 bg-secondary/10 border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">{t("vote.info.title")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• {t("vote.info.point1")}</li>
                <li>• {t("vote.info.point2")}</li>
                <li>• {t("vote.info.point3")}</li>
                <li>• {t("vote.info.point4")}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
