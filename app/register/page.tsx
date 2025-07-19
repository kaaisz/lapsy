// 新規登録画面
"use client"
import AuthGuard from "../components/AuthGuard";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setInfo("")

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // サインアップ後にprofilesテーブルへ登録
    const user = signUpData.user
    if (user) {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            email: user.email,
          },
        ])
      if (insertError) {
        setError("プロフィール作成に失敗しました: " + insertError.message)
        console.error(insertError)
        setLoading(false)
        return
      }
      router.push("/mypage") // 登録成功後にマイページへ遷移
    } else {
      setInfo("登録は完了しました。認証メールを確認し、メール内のリンクをクリックしてからログインしてください。もしログインできない場合はパスワードリセットもお試しください。")
      setLoading(false)
      return
    }
  }

  return (
    <AuthGuard>
      <div className="max-w-md mx-auto mt-10 p-4 border rounded">
        <h1 className="text-xl font-bold mb-4">新規登録</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {info && <p className="text-blue-600">{info}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "登録中..." : "新規登録"}
          </button>
        </form>
      </div>
    </AuthGuard>
  )
} 