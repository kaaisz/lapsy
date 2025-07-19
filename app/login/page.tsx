// ログイン画面

"use client"
import AuthGuard from "../components/AuthGuard";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false)
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
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return;
    }

    setLoading(true)
    setErrors({})

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrors({
        form: error.message,
      });
    } else {
      router.push("/mypage") // ログイン成功後にマイページへ
    }

    setLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hasFormErrors =
  errors.email || errors.password || errors.form;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-8 rounded-3xl border-0 shadow-lg">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <div
                className="w-16 h-16 rounded-full bg-neon-lime flex items-center justify-center mx-auto"
                role="img"
                aria-label="ユーザーアイコン"
              >
                <User
                  className="w-8 h-8 text-white"
                  aria-hidden="true"
                />
              </div>
              <h1 className="text-2xl">Lapsyにログイン</h1>
              <p className="text-muted-foreground mt-2">
                アカウント情報を入力してください
              </p>
            </div>
          </div>
        
          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Form-level error */}
            {/* {errors.form && (
              <div
                className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20"
                role="alert"
                aria-live="assertive"
              >
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <div className="w-4 h-4 rounded-full bg-destructive flex items-center justify-center flex-shrink-0">
                    <span
                      className="text-xs text-white"
                      aria-hidden="true"
                    >
                      !
                    </span>
                  </div>
                  <span>{errors.form}</span>
                </div>
              </div>
            )} */}
            {/* Username field */}
            <Input
              type="email"
              label="メールアドレス"
              placeholder="メールアドレスを入力"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              icon={
                <User className="w-4 h-4 text-muted-foreground" />
              }
              aria-describedby="email-hint"
              required
            />
            <div id="username-hint" className="sr-only">
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }
                }}
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
            {/* {error && <p className="text-red-500">{error}</p>} */}
            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                loading ||
                !email.trim() ||
                !password.trim()
              }
              loading={loading}
              loadingText="ログイン中..."
              aria-describedby={
                hasFormErrors ? "form-errors" : undefined
              }
            >
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/register" className="text-muted-foreground underline">新規登録はこちら</a>
          </div>
        </Card>
      </div>
    </AuthGuard>
  );
}
