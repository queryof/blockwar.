"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Users, Wifi } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

interface Player {
  name: string
  id: string
}

interface PlayerListModalProps {
  isOpen: boolean
  onClose: () => void
  players: Player[]
  online: boolean
  serverName?: string
}

export function PlayerListModal({ isOpen, onClose, players, online, serverName }: PlayerListModalProps) {
  const { t } = useLanguage()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black/60 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-lg pointer-events-none" />
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              {t("playerList.title")} ({players.length})
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Server Status */}
            <div className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
              <Wifi className={`w-4 h-4 ${online ? "text-green-400" : "text-red-400"}`} />
              <span className={`text-sm font-medium ${online ? "text-green-400" : "text-red-400"}`}>
                {online ? t("playerList.online") : t("playerList.offline")}
              </span>
              {serverName && <span className="text-sm text-white/70">• {serverName}</span>}
            </div>

            {/* Players List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {players.length > 0 ? (
                players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <Image
                      src={`https://minotar.net/avatar/${player.name}/32`}
                      alt={`${player.name}'s avatar`}
                      width={32}
                      height={32}
                      className="rounded"
                      unoptimized
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-white">{player.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                      {t("playerList.online")}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/70">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t("playerList.noPlayers")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
