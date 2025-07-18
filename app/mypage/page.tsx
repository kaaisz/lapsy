// 認証済ユーザー専用ページ
"use client"

import useSession from "@/hooks/useSession"
import type { Session } from "@supabase/supabase-js"
import Header from "@/components/Header"

export default function MyPage() {
  const { session, loading }: { session: Session | null, loading: boolean } = useSession() as { session: Session | null, loading: boolean }

  if (loading) return <p>読み込み中...</p>
  if (!session) return null // layout.tsxでリダイレクトされる

  return (
    <Header />
    <div>
      <h1>こんにちは、{session.user.email} さん！</h1>
      <p>これはログイン済ユーザー専用ページです。</p>
    </div>
  )
}
