// components/Header.tsx
"use client"
import useSession from "@/hooks/useSession"
import type { Session } from "@supabase/supabase-js"

export default function Header() {
  const { session }: { session: Session | null } = useSession() as { session: Session | null }

  return (
    <header>
      {session ? (
        <p>{session.user.email} さん、こんにちは</p>
      ) : (
        <p>ゲストユーザー</p>
      )}
    </header>
  )
}
