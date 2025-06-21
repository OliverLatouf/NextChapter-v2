'use client'

import { useAuth } from '@/lib/auth-context'

export default function UserDashboard() {
  const { user, signOut } = useAuth()

  return (
    <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Welcome back, {user?.email}!
      </h2>
      <p style={{ color: '#718096', marginBottom: '1rem' }}>
        Manage your story subscriptions and account settings
      </p>
      <div className="flex gap-2" style={{ justifyContent: 'center' }}>
        <button className="button-secondary" onClick={signOut}>
          Sign Out
        </button>
      </div>
    </div>
  )
}
