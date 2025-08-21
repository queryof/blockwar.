"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="border-border hover:bg-muted bg-transparent"
    >
      <Globe className="w-4 h-4 mr-2" />
      {language === "en" ? "বাংলা" : "English"}
    </Button>
  )
}
