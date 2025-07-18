// components/Header.tsx
"use client"
import useSession from "@/hooks/useSession"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Header() {
  const { session }: { session: Session | null } = useSession() as { session: Session | null }
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header>
      {session ? (
        <>
          <p>{session.user.email} さん、こんにちは</p>
          <button
            onClick={handleLogout}
            className="ml-4 px-3 py-1 bg-gray-200 rounded"
          >
            ログアウト
          </button>
        </>
      ) : (
        <p>ゲストユーザー</p>
      )}
    </header>
  )
}
