"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { IUserLogged } from "@/dtos/login"
import { api } from "@/api"
import { MutatingDots } from "react-loader-spinner"
import { useToast } from "@/hooks/toast"

interface AuthContextProps {
  user: IUserLogged | undefined
  login: (email: string, password: string) => Promise<IUserLogged>
  logout: () => Promise<void>
  fetchMe: (loading?: boolean) => Promise<IUserLogged | undefined>
}

export interface IPublicRoutes {
  path: string
  whenAuthenticated: "redirect" | "next"
}

export const publicRoutes: IPublicRoutes[] = [
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/forget-password", whenAuthenticated: "redirect" },
  { path: "/reset-password", whenAuthenticated: "next" },
]

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { showToast } = useToast()

  const [user, setUser] = useState<IUserLogged | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(async () => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME

    if (appName) localStorage.removeItem(appName)
    localStorage.removeItem("token")

    setUser(undefined)
    router.replace("/login")
  }, [router])

  const login = useCallback(async (email: string, password: string): Promise<IUserLogged> => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME?.trim()
    if (!appName) {
      throw new Error(
        "Defina NEXT_PUBLIC_APP_NAME no .env.local (ex.: casa-hiphop-web) e reinicie o servidor.",
      )
    }

    const data = await api.auth.login(email, password)

    if (!data?.token) {
      throw new Error("Resposta da API sem token. Verifique o formato do POST /login.")
    }

    localStorage.setItem("token", data.token)
    localStorage.setItem(appName, JSON.stringify(data.user))

    const payload: IUserLogged = {
      token: data.token,
      user: data.user,
    }

    setUser(payload)

    return payload
  }, [])

  const fetchMe = useCallback(
    async (withLoading = true): Promise<IUserLogged | undefined> => {
      try {
        if (withLoading) setLoading(true)

        const appName = process.env.NEXT_PUBLIC_APP_NAME
        if (!appName) throw new Error("App name not defined")

        const token = localStorage.getItem("token")
        const savedUser = localStorage.getItem(appName)

        if (!token || !savedUser) throw new Error("User not logged")

        const parsedUser = JSON.parse(savedUser)

        const formattedUser: IUserLogged = {
          token,
          user: parsedUser,
        }

        setUser(formattedUser)

        return formattedUser
      } catch (error) {
        console.log(error)
        showToast("error", { title: "Erro ao carregar dados do usuário" })
        logout()
      } finally {
        if (withLoading) setLoading(false)
      }
    },
    [logout, showToast]
  )

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) fetchMe()
    else setLoading(false)
  }, [fetchMe])

  useEffect(() => {
    if (loading) return

    const token = localStorage.getItem("token")

    const isPublic =
      pathname === "/" ||
      publicRoutes.some((route) => pathname.startsWith(route.path))

    if (!token && !isPublic) {
      router.replace("/login")
      return
    }

    if (token && isPublic) {
      const rule = publicRoutes.find((r) => pathname.startsWith(r.path))
      if (rule?.whenAuthenticated === "redirect") {
        router.replace("/dashboard")
      }
    }
  }, [pathname, loading, router])

  // -------------------------------------------
  // RENDER
  // -------------------------------------------
  return (
    <AuthContext.Provider value={{ user, login, logout, fetchMe }}>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <MutatingDots
            visible
            height="100"
            width="100"
            color="var(--primary)"
            secondaryColor="var(--primary)"
            radius="10"
            ariaLabel="mutating-dots-loading"
          />
          <span className="text-[var(--muted-foreground)]">Carregando...</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return context
}
