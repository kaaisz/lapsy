"use client"
import useSession from "@/hooks/useSession"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session && pathname !== "/login" && pathname !== "/register") {
      router.push("/login")
    }
    if (!loading && session && (pathname === "/login" || pathname === "/register")) {
      router.push("/mypage")
    }
  }, [session, loading, pathname, router])

  if (loading) return <p>Loading...</p>
  if (!session && pathname !== "/login" && pathname !== "/register") return null

  return <>{children}</>
} 