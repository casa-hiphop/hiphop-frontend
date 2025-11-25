"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { IUserLogged } from "@/dtos/login"
import { api } from "@/api"
import { publicRoutes } from "@/middleware"
import { MutatingDots } from "react-loader-spinner"
import { useToast } from "@/hooks/toast"

interface AuthContextProps {
  user: IUserLogged | undefined
  login: (email: string, password: string) => Promise<IUserLogged>
  logout: () => Promise<void>
  fetchMe: (loading?: boolean) => Promise<IUserLogged | undefined>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const { showToast } = useToast()

  const pathname = usePathname()

  const [user, setUser] = useState<IUserLogged | undefined>(undefined)

  const [loading, setLoading] = useState(false)

  const logout = useCallback(async () => {
    await api.auth.logout()
    router.push('/login')
    setUser(undefined)
  }, [router])

  async function login(email: string, password: string) {
    try {
      const { data: user } = await api.auth.login(email, password)

      setUser(user)

      return user
    } catch (error) {
      console.log(error)
      throw new Error("Login failed")
    }
  }

  const fetchMe = useCallback(async (loading: boolean = true) => {
    if (loading) {
      setLoading(true)
    }
    try {
      const { data: user } = await api.users.getMe()
      setUser(user)
      return user
    } catch (error) {
      console.log(error)
      showToast('error', { title: "Error fetching user data" })
      logout()
    } finally {
      setLoading(false)
    }
  }, [logout, showToast])

  useEffect(() => {
    const publicRoute =
      pathname === "/" ||
      publicRoutes.some((route) => pathname.startsWith(route.path))

    if (!user && !publicRoute) {
      fetchMe()
    }
  }, [fetchMe, logout, pathname, user])

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchMe }}>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <MutatingDots
            visible={true}
            height="100"
            width="100"
            color="var(--primary)"
            secondaryColor="var(--primary)"
            radius="10"
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
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
