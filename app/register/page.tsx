// 新規登録画面
"use client"
import AuthGuard from "../components/AuthGuard";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Lock, Eye, EyeOff, Mail } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } =
      {};

    if (!email.trim()) {
      newErrors.email = "Emailは必須です";
    } else if (email.length < 3) {
      newErrors.email =
        "Emailは3文字以上で入力してください";
    }

    if (!password.trim()) {
      newErrors.password = "パスワードは必須です";
    } else if (password.length < 6) {
      newErrors.password =
        "パスワードは6文字以上で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return;
    }

    setLoading(true)
    setErrors({})

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      setErrors({ form: signUpError.message })
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
        setErrors({ form: "プロフィール作成に失敗しました: " + insertError.message })
        console.error(insertError)
        setLoading(false)
        return
      }
      router.push("/mypage") // 登録成功後にマイページへ遷移
    } else {
      setErrors({ general: "登録は完了しました。認証メールを確認し、メール内のリンクをクリックしてからログインしてください。もしログインできない場合はパスワードリセットもお試しください。" })
      setLoading(false)
      return
    }

  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hasFormErrors =
  errors.email || errors.password || errors.form;

  return (
    <AuthGuard>
      <div className="max-w-md mx-auto mt-10 p-4 border rounded">
        <Card>
          <h1 className="text-xl font-bold mb-4">新規登録</h1>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username field */}
            {/* <label className="block mb-1">メールアドレス</label> */}
            <Input
              type="email"
              label="メールアドレス"
              placeholder="メールアドレスを入力"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              icon={
                <Mail className="w-4 h-4 text-muted-foreground" />
              }
              aria-describedby="email-hint"
              // className="w-full border px-3 py-2 rounded"
              required
            />
            <div id="email-hint" className="sr-only">
              Emailは3文字以上で入力してください
            </div>
            {/* Password field */}
            <div className="space-y-2">
              {/* <label className="block mb-1">パスワード</label> */}
              <Input
                type={showPassword ? "text" : "password"}
                label="パスワード"
                placeholder="パスワードを入力"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
                autoComplete="current-password"
                icon={
                  <Lock className="w-4 h-4 text-muted-foreground" />
                }
                aria-describedby="password-hint"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={togglePasswordVisibility}
                className="ml-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                aria-label={
                  showPassword
                    ? "パスワードを隠す"
                    : "パスワードを表示"
                }
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    パスワードを隠す
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    パスワードを表示
                  </>
                )}
              </Button>
              <div id="password-hint" className="sr-only">
                パスワードは6文字以上で入力してください
              </div>
            </div>
            {errors.form && (
              <p className="text-red-500 text-sm">{errors.form}</p>
            )}
            {errors.general && (
              <p className="text-blue-600 text-sm">{errors.general}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
              disabled={
                loading ||
                !email.trim() ||
                !password.trim()
              }
              loading={loading}
              loadingText="登録中..."
              aria-describedby={
                hasFormErrors ? "form-errors" : undefined
              }
            >
              {loading ? "登録中..." : "新規登録"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/login" className="text-muted-foreground underline">ログインはこちら</a>
          </div>
        </Card>
      </div>
    </AuthGuard>
  )
} 