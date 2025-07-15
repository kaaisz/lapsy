import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleSubmit = async () => {
    const fn = mode === 'login'
      ? supabase.auth.signInWithPassword
      : supabase.auth.signUp

    const { error } = await fn({ email, password })
    if (error) alert(error.message)
    else alert(`${mode} success`)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{mode === 'login' ? 'ログイン' : '新規登録'}</h1>
      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>
        {mode === 'login' ? 'ログイン' : '新規登録'}
      </button>
      <br />
      <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? '新規登録へ' : 'ログインへ'}
      </button>
    </div>
  )
}
