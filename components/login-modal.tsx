"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Loader2, User } from "lucide-react"

export function LoginModal() {
  const { state, dispatch } = useAuth()
  const { t } = useLanguage()
  const [username, setUsername] = useState("")
  const [isBedrock, setIsBedrock] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const getFinalUsername = () => {
    const trimmedUsername = username.trim()
    return isBedrock ? `.${trimmedUsername}` : trimmedUsername
  }

  const handleLogin = async () => {
    if (!username.trim()) {
      setError(t("login.error_username"))
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const avatarUrl = `https://minotar.net/avatar/${username.trim()}`

      // Test if the avatar URL is valid by creating an image
      const img = new Image()
      img.crossOrigin = "anonymous"

      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = avatarUrl
      })

      // Login successful
      dispatch({
        type: "LOGIN",
        payload: {
          username: getFinalUsername(), // Use final username with dot prefix if bedrock
          avatar: avatarUrl,
          isBedrock,
        },
      })

      // Reset form
      setUsername("")
      setIsBedrock(false)
    } catch (error) {
      setError(t("login.error_invalid"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    dispatch({ type: "CLOSE_LOGIN_MODAL" })
    setUsername("")
    setIsBedrock(false)
    setError("")
  }

  return (
    <Dialog open={state.isLoginModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-lg pointer-events-none" />
        <div className="relative z-10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5" />
              {t("login.title")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/90">
                {t("login.username")}
              </Label>
              <Input
                id="username"
                placeholder={t("login.username_placeholder")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-primary/50"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <Label htmlFor="bedrock" className="text-sm font-medium text-white/90">
                {t("login.bedrock_player")}
              </Label>
              <label className="switch">
                <input
                  id="bedrock"
                  className="toggle"
                  type="checkbox"
                  checked={isBedrock}
                  onChange={(e) => setIsBedrock(e.target.checked)}
                />
                <span className="slider"></span>
                <span className="card-side"></span>
              </label>
            </div>

            {username.trim() && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Label className="text-sm text-primary/90">
                  {t("login.final_username")}: <span className="font-mono text-primary">{getFinalUsername()}</span>
                </Label>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-300 bg-red-500/20 border border-red-500/30 p-3 rounded-lg backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
              >
                {t("login.cancel")}
              </Button>
              <Button
                onClick={handleLogin}
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("login.logging_in")}
                  </>
                ) : (
                  t("login.login")
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
