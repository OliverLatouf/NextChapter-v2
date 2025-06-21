'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface RegisterFormProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('Starting registration...')
      
      // Register user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      console.log('Auth response:', { authData, authError })

      if (authError) {
        throw authError
      }

      if (authData.user) {
        console.log('User created, creating profile...')
        
        // Create profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email!,
              name: name || null,
            }
          ])
          .select()

        console.log('Profile response:', { profileData, profileError })

        if (profileError) {
          console.error('Profile error:', profileError)
          // Don't throw here - user is created, just profile failed
          setSuccess(true)
          setTimeout(() => onSuccess(), 2000)
        } else {
          console.log('Registration successful!')
          setSuccess(true)
          setTimeout(() => onSuccess(), 2000)
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#38a169' }}>
          Welcome to NextChapter!
        </h2>
        <p style={{ color: '#718096', marginBottom: '1rem' }}>
          Your account has been created successfully.
        </p>
        <div className="success-banner">
          🎉 Redirecting to your dashboard...
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-3">
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
        Join NextChapter
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
        type="text"
        placeholder="Full name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="form-input"
      />

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
        placeholder="Password (6+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input"
        minLength={6}
        required
      />

      <button
        type="submit"
        className="button-primary"
        disabled={loading}
        style={{ marginTop: '0.5rem' }}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      <p style={{ textAlign: 'center', color: '#718096', fontSize: '0.9rem' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          style={{ color: '#667eea', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
        >
          Sign in here
        </button>
      </p>
    </form>
  )
}
