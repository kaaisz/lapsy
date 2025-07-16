// 認証済ユーザー専用ページ
"use client"

import useSession from "@/hooks/useSession"

export default function MyPage() {
  const { session, loading } = useSession()

  if (loading) return <p>読み込み中...</p>
  if (!session) return null // layout.tsxでリダイレクトされる

  return (
    <div>
      <h1>こんにちは、{session.user.email} さん！</h1>
      <p>これはログイン済ユーザー専用ページです。</p>
    </div>
  )
}
