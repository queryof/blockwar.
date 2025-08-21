"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

interface User {
  username: string
  avatar: string
  isBedrock: boolean
}

interface AuthState {
  user: User | null
  isLoginModalOpen: boolean
}

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "OPEN_LOGIN_MODAL" }
  | { type: "CLOSE_LOGIN_MODAL" }
  | { type: "RESTORE_SESSION"; payload: User | null }

const initialState: AuthState = {
  user: null,
  isLoginModalOpen: false,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      if (typeof window !== "undefined") {
        localStorage.setItem("blockwar_user", JSON.stringify(action.payload))
      }
      return {
        ...state,
        user: action.payload,
        isLoginModalOpen: false,
      }
    case "LOGOUT":
      if (typeof window !== "undefined") {
        localStorage.removeItem("blockwar_user")
      }
      return {
        ...state,
        user: null,
      }
    case "OPEN_LOGIN_MODAL":
      return {
        ...state,
        isLoginModalOpen: true,
      }
    case "CLOSE_LOGIN_MODAL":
      return {
        ...state,
        isLoginModalOpen: false,
      }
    case "RESTORE_SESSION":
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state
  }
}

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedUser = localStorage.getItem("blockwar_user")
        if (savedUser) {
          const user = JSON.parse(savedUser)
          dispatch({ type: "RESTORE_SESSION", payload: user })
        }
      } catch (error) {
        console.error("Error restoring user session:", error)
        localStorage.removeItem("blockwar_user")
      }
    }
  }, [])

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
