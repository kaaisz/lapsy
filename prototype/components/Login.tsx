import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { User, Lock, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    form?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } =
      {};

    if (!username.trim()) {
      newErrors.username = "ユーザー名は必須です";
    } else if (username.length < 3) {
      newErrors.username =
        "ユーザー名は3文字以上で入力してください";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication logic
      if (username === "demo" && password === "password") {
        onLogin();
      } else {
        setErrors({
          form: "ユーザー名またはパスワードが正しくありません",
        });
      }
    } catch (error) {
      setErrors({
        form: "ログイン中にエラーが発生しました。もう一度お試しください。",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hasFormErrors =
    errors.username || errors.password || errors.form;

  return (
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
            <div>
              <h1 className="text-2xl">Lapsyにログイン</h1>
              <p className="text-muted-foreground mt-2">
                アカウント情報を入力してください
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            {/* Form-level error */}
            {errors.form && (
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
            )}

            {/* Username field */}
            <Input
              type="text"
              label="ユーザー名"
              placeholder="ユーザー名を入力"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) {
                  setErrors((prev) => ({
                    ...prev,
                    username: undefined,
                  }));
                }
              }}
              error={errors.username}
              required
              autoComplete="username"
              icon={
                <User className="w-4 h-4 text-muted-foreground" />
              }
              aria-describedby="username-hint"
            />
            <div id="username-hint" className="sr-only">
              ユーザー名は3文字以上で入力してください
            </div>

            {/* Password field */}
            <div className="space-y-2">
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

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                !username.trim() ||
                !password.trim()
              }
              loading={isLoading}
              loadingText="ログイン中..."
              aria-describedby={
                hasFormErrors ? "form-errors" : undefined
              }
            >
              ログイン
            </Button>
          </form>

          {/* Demo account info */}
          {/* <div className="text-center text-sm text-muted-foreground p-4 bg-muted/30 rounded-2xl">
            <p>デモアカウント</p>
            <p>ユーザー名: <code className="bg-muted px-1 rounded">demo</code></p>
            <p>パスワード: <code className="bg-muted px-1 rounded">password</code></p>
          </div> */}
        </div>
      </Card>
    </div>
  );
}