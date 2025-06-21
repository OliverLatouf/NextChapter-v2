'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface LoginFormProps {
  onSuccess: () => void
  onSwitchToRegister: () => void
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      onSuccess()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-3">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
        Welcome Back
      </h2>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fed7d7', 
          color: '#c53030', 
          padding: '0.75rem', 
          borderRadius: '6px',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input"
        required
      />

      <button
        type="submit"
        className="button-primary"
        disabled={loading}
        style={{ marginTop: '0.5rem' }}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      <p style={{ textAlign: 'center', color: '#718096', fontSize: '0.9rem' }}>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          style={{ color: '#667eea', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
        >
          Sign up here
        </button>
      </p>
    </form>
  )
}
