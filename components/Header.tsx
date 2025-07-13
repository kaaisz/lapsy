// components/Header.tsx
"use client"
import useSession from "@/hooks/useSession"

export default function Header() {
  const { session } = useSession()

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
