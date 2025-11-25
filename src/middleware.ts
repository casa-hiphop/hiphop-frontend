import { NextRequest, NextResponse } from "next/server"

interface IPublicRoutes {
  path: string
  whenAuthenticated: "redirect" | "next"
}

export const publicRoutes: IPublicRoutes[] = [
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/forget-password", whenAuthenticated: "redirect" },
  { path: "/reset-password", whenAuthenticated: "next" },
]

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login"
const REDIRECT_WHEN_AUTHENTICATED_ROUTE = "/dashboard"

export function middleware(req: NextRequest) {
  const rawPath = req.nextUrl.pathname
  const path = rawPath.replace(/\/+$/, "") || "/"

  const token = req.cookies.get("token")?.value || null
  const isAuthenticated = Boolean(token)

  if (path === "/") {
    return NextResponse.next()
  }

  const publicRoute = publicRoutes.find((route) => {
    if (route.path === path) return true
    if (
      route.path.endsWith("/") &&
      path.startsWith(route.path)
    ) return true
    if (
      !route.path.endsWith("/") &&
      path.startsWith(route.path + "/")
    ) return true
    return false
  })

  if (publicRoute) {
    if (!isAuthenticated) return NextResponse.next()

    if (publicRoute.whenAuthenticated === "redirect") {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = REDIRECT_WHEN_AUTHENTICATED_ROUTE
      return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
  }

  if (!isAuthenticated) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
