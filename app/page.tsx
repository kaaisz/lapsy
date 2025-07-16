// app/layout.tsx または app/page.tsx どちらでも使用可能
"use client"
import useSession from "@/hooks/useSession"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useSession()

  if (loading) return <p>Loading...</p>

  return (
    <>
      {/* ログインしているときだけUI表示 */}
      {session ? children : <p>ログインしてください</p>}
    </>
  )
}
