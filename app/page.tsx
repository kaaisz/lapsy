// app/layout.tsx または app/page.tsx どちらでも使用可能
"use client"
import useSession from "@/hooks/useSession"
import type { Session } from "@supabase/supabase-js"

export default function Page() {
  const { session, loading }: { session: Session | null, loading: boolean } = useSession() as { session: Session | null, loading: boolean }

  if (loading) return <p>Loading...</p>
  if (!session) return <p>ログインしてください</p>

  return <p>ようこそ、{session.user.email} さん！</p>
}
