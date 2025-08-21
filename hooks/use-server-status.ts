"use client"

import { useState, useEffect } from "react"

interface ServerStatus {
  online: boolean
  players: {
    now: number
    max: number
    sample: Array<{
      name: string
      id: string
    }>
  }
  server: {
    name: string
    protocol: number
  }
  motd: string
  loading: boolean
  error: string | null
}

export function useServerStatus() {
  const [status, setStatus] = useState<ServerStatus>({
    online: false,
    players: { now: 0, max: 0, sample: [] },
    server: { name: "", protocol: 0 },
    motd: "",
    loading: true,
    error: null,
  })

  const fetchServerStatus = async () => {
    try {
      const response = await fetch("https://mcapi.us/server/status?ip=blockwar.exoo.cloud")
      const data = await response.json()

      if (data.status === "success") {
        setStatus({
          online: data.online,
          players: data.players,
          server: data.server,
          motd: data.motd,
          loading: false,
          error: null,
        })
      } else {
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: data.error || "Failed to fetch server status",
        }))
      }
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        loading: false,
        error: "Network error",
      }))
    }
  }

  useEffect(() => {
    fetchServerStatus()

    // Update every 30 seconds
    const interval = setInterval(fetchServerStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  return status
}
