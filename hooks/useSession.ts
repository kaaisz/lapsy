// hooks/useSession.ts
"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function useSession() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初回読み込みでセッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // ログイン/ログアウト時の監視
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  return { session, loading }
}
