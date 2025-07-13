// 認証済ユーザー専用ページ（ガード付き）
"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function MyPage() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login") // 認証がないときはログインページへ
      } else {
        setSession(session)
      }
      setLoading(false)
    }

    checkSession()
  }, [])

  if (loading || !session) return <p>読み込み中...</p>

  return (
    <div>
      <h1>こんにちは、{session.user.email} さん！</h1>
      <p>これはログイン済ユーザー専用ページです。</p>
    </div>
  )
}
