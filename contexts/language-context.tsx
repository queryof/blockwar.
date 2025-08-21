"use client"
import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "bn"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Header
    "header.copy": "CLICK TO COPY",
    "header.online": "online",
    "header.cart": "Cart",
    "header.guest": "Guest",
    "header.login": "LOGIN",
    "header.welcome": "Welcome",
    "header.logout": "Logout",
    "header.vote": "Vote",

    // Navigation
    "nav.home": "Home",
    "nav.lifesteal_coins": "LifeSteal Coins",
    "nav.lifesteal_ranks": "LifeSteal Ranks",
    "nav.cart": "Cart",
    "nav.vote": "Vote",
    "nav.players": "Players",

    // Homepage
    "home.title": "BLOCKWAR Store",
    "home.subtitle": "Premium LifeSteal Minecraft Server",
    "home.description": "Join the ultimate LifeSteal experience with exclusive ranks, coins, and special abilities.",
    "home.featured_packages": "Featured Packages",
    "home.server_info": "Server Information",
    "home.owner": "Owner",
    "home.hosted_by": "Hosted by",
    "home.gamemode": "Gamemode",
    "home.lifesteal": "LifeSteal",

    // Products
    "product.add_to_cart": "Add to Cart",
    "product.most_popular": "Most Popular",
    "product.special_rank": "Special Rank",
    "product.week": "week",
    "product.month": "month",

    // Ranks
    "ranks.title": "LifeSteal Ranks",
    "ranks.subtitle": "reg gridint",
    "ranks.description":
      "Unlock exclusive perks and abilities with premium ranks. Each rank includes bonus coins and special privileges in LifeSteal Gamemode.",
    "ranks.benefits_overview": "Rank Benefits Overview",

    // Coins
    "coins.title": "LifeSteal Coins",
    "coins.subtitle": "reg gridint",
    "coins.description":
      "Get yourself some coins to get awesome keys & perks from coinshop. You will receive these coins in LifeSteal Gamemode.",
    "coins.support_title": "Need Support?",
    "coins.support_description":
      "Have questions before checkout? Package not arrived after 20 minutes? Contact our community on Discord or submit a support ticket for payment assistance.",
    "coins.join_discord": "Join Discord Server",

    // Vote
    "vote.title": "Vote for BLOCKWAR",
    "vote.description":
      "Support our server by voting on these sites and earn exciting rewards like in-game coins and voting keys!",
    "vote.link": "Voting Link",
    "vote.reward": "Reward",
    "vote.button": "Vote Now",
    "vote.rewards.coins": "In-Game Coins",
    "vote.rewards.keys": "Voting Keys",
    "vote.rewards.bonus": "Bonus Rewards",
    "vote.info.title": "Important Information",
    "vote.info.point1": "You can vote once every 24 hours on each site",
    "vote.info.point2": "Rewards are automatically added to your account after voting",
    "vote.info.point3": "Make sure to use your exact Minecraft username when voting",
    "vote.info.point4": "Contact support if you don't receive rewards within 30 minutes",

    // Login
    "login.title": "Login to BLOCKWAR",
    "login.username": "Minecraft Username",
    "login.username_placeholder": "Enter your Minecraft username",
    "login.bedrock_player": "Bedrock Player",
    "login.final_username": "Final Username",
    "login.cancel": "Cancel",
    "login.login": "Login",
    "login.logging_in": "Logging in...",
    "login.error_username": "Please enter a username",
    "login.error_invalid": "Invalid username or unable to fetch avatar",

    // Player List
    "playerList.title": "Online Players",
    "playerList.online": "Online",
    "playerList.offline": "Offline",
    "playerList.noPlayers": "No players online",

    // Footer
    "footer.billing_info": "Billing and delivery managed by Exoo.cloud billing department",
    "footer.copyright": "© 2024 BLOCKWAR. All Rights Reserved.",
    "footer.not_affiliated": "We are not affiliated with Mojang AB.",

    // Common
    "common.close": "Close",
  },
  bn: {
    // Header
    "header.copy": "কপি করুন",
    "header.online": "অনলাইন",
    "header.cart": "কার্ট",
    "header.guest": "গেস্ট",
    "header.login": "লগইন",
    "header.welcome": "স্বাগতম",
    "header.logout": "লগআউট",
    "header.vote": "ভোট",

    // Navigation
    "nav.home": "হোম",
    "nav.lifesteal_coins": "লাইফস্টিল কয়েন",
    "nav.lifesteal_ranks": "লাইফস্টিল র‍্যাঙ্ক",
    "nav.cart": "কার্ট",
    "nav.vote": "ভোট",
    "nav.players": "প্লেয়ার",

    // Homepage
    "home.title": "BLOCKWAR স্টোর",
    "home.subtitle": "প্রিমিয়াম লাইফস্টিল মাইনক্রাফট সার্ভার",
    "home.description": "এক্সক্লুসিভ র‍্যাঙ্ক, কয়েন এবং বিশেষ ক্ষমতা সহ চূড়ান্ত লাইফস্টিল অভিজ্ঞতায় যোগ দিন।",
    "home.featured_packages": "ফিচার্ড প্যাকেজ",
    "home.server_info": "সার্ভার তথ্য",
    "home.owner": "মালিক",
    "home.hosted_by": "হোস্ট করেছে",
    "home.gamemode": "গেমমোড",
    "home.lifesteal": "লাইফস্টিল",

    // Products
    "product.add_to_cart": "কার্টে যোগ করুন",
    "product.most_popular": "সবচেয়ে জনপ্রিয়",
    "product.special_rank": "বিশেষ র‍্যাঙ্ক",
    "product.week": "সপ্তাহ",
    "product.month": "মাস",

    // Ranks
    "ranks.title": "লাইফস্টিল র‍্যাঙ্ক",
    "ranks.subtitle": "reg gridint",
    "ranks.description":
      "প্রিমিয়াম র‍্যাঙ্কের সাথে এক্সক্লুসিভ সুবিধা এবং ক্ষমতা আনলক করুন। প্রতিটি র‍্যাঙ্কে বোনাস কয়েন এবং লাইফস্টিল গেমমোডে বিশেষ সুবিধা রয়েছে।",
    "ranks.benefits_overview": "র‍্যাঙ্ক সুবিধার ওভারভিউ",

    // Coins
    "coins.title": "লাইফস্টিল কয়েন",
    "coins.subtitle": "reg gridint",
    "coins.description":
      "কয়েনশপ থেকে দুর্দান্ত চাবি এবং সুবিধা পেতে কিছু কয়েন সংগ্রহ করুন। আপনি লাইফস্টিল গেমমোডে এই কয়েনগুলি পাবেন।",
    "coins.support_title": "সাহায্য প্রয়োজন?",
    "coins.support_description":
      "চেকআউটের আগে প্রশ্ন আছে? ২০ মিনিট পরেও প্যাকেজ আসেনি? ডিসকর্ডে আমাদের কমিউনিটির সাথে যোগাযোগ করুন বা পেমেন্ট সহায়তার জন্য সাপোর্ট টিকিট জমা দিন।",
    "coins.join_discord": "ডিসকর্ড সার্ভারে যোগ দিন",

    // Vote
    "vote.title": "BLOCKWAR এর জন্য ভোট দিন",
    "vote.description":
      "এই সাইটগুলিতে ভোট দিয়ে আমাদের সার্ভারকে সমর্থন করুন এবং ইন-গেম কয়েন এবং ভোটিং কী এর মতো উত্তেজনাপূর্ণ পুরস্কার অর্জন করুন!",
    "vote.link": "ভোটিং লিঙ্ক",
    "vote.reward": "পুরস্কার",
    "vote.button": "এখনই ভোট দিন",
    "vote.rewards.coins": "ইন-গেম কয়েন",
    "vote.rewards.keys": "ভোটিং কী",
    "vote.rewards.bonus": "বোনাস পুরস্কার",
    "vote.info.title": "গুরুত্বপূর্ণ তথ্য",
    "vote.info.point1": "আপনি প্রতিটি সাইটে প্রতি ২৪ ঘন্টায় একবার ভোট দিতে পারেন",
    "vote.info.point2": "ভোট দেওয়ার পর পুরস্কার স্বয়ংক্রিয়ভাবে আপনার অ্যাকাউন্টে যোগ হয়",
    "vote.info.point3": "ভোট দেওয়ার সময় আপনার সঠিক মাইনক্রাফট ইউজারনেম ব্যবহার করতে ভুলবেন না",
    "vote.info.point4": "৩০ মিনিটের মধ্যে পুরস্কার না পেলে সাপোর্টের সাথে যোগাযোগ করুন",

    // Login
    "login.title": "BLOCKWAR এ লগইন করুন",
    "login.username": "মাইনক্রাফট ইউজারনেম",
    "login.username_placeholder": "আপনার মাইনক্রাফট ইউজারনেম লিখুন",
    "login.bedrock_player": "বেডরক প্লেয়ার",
    "login.final_username": "চূড়ান্ত ইউজারনেম",
    "login.cancel": "বাতিল",
    "login.login": "লগইন",
    "login.logging_in": "লগইন হচ্ছে...",
    "login.error_username": "অনুগ্রহ করে একটি ইউজারনেম লিখুন",
    "login.error_invalid": "অবৈধ ইউজারনেম বা অবতার আনতে অক্ষম",

    // Player List
    "playerList.title": "অনলাইন প্লেয়ার",
    "playerList.online": "অনলাইন",
    "playerList.offline": "অফলাইন",
    "playerList.noPlayers": "কোন প্লেয়ার অনলাইন নেই",

    // Footer
    "footer.billing_info": "বিলিং এবং ডেলিভারি Exoo.cloud বিলিং বিভাগ দ্বারা পরিচালিত",
    "footer.copyright": "© ২০২৪ BLOCKWAR। সমস্ত অধিকার সংরক্ষিত।",
    "footer.not_affiliated": "আমরা Mojang AB এর সাথে অধিভুক্ত নই।",

    // Common
    "common.close": "বন্ধ করুন",
  },
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
