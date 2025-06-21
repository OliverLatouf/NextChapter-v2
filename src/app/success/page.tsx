'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setError('No session ID found')
        setLoading(false)
        return
      }

      try {
        console.log('Verifying session:', sessionId)
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
        const data = await response.json()
        
        console.log('Verify response:', data)
        
        if (response.ok && data.success) {
          setResult(data)
        } else {
          setError(data.error || 'Verification failed')
        }
      } catch (err) {
        console.error('Verification error:', err)
        setError('Failed to verify payment')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId])

  return (
    <div className="page-wrapper">
      <div className="card" style={{ textAlign: 'center' }}>
        {loading && (
          <>
            <h1 className="title">Verifying Payment...</h1>
            <p>Session: {sessionId}</p>
          </>
        )}
        
        {error && (
          <>
            <h1 className="title" style={{ color: '#e53e3e' }}>Payment Issue</h1>
            <p>{error}</p>
            <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Session: {sessionId}</p>
          </>
        )}
        
        {result && (
          <>
            <h1 className="title" style={{ color: '#38a169' }}>🎉 Payment Successful!</h1>
            <p style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>
              Thank you for subscribing to <strong>{result.storyTitle}</strong>!
            </p>
            <div className="success-banner">
              You'll receive your first chapter via email shortly.
            </div>
            
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#f7fafc', 
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#4a5568'
            }}>
              <div><strong>Subscription Details:</strong></div>
              <div>Amount: ${(result.amount / 100).toFixed(2)}</div>
              <div>Status: {result.subscription?.[0]?.status || 'Active'}</div>
              <div>Subscription ID: {result.subscription?.[0]?.id}</div>
            </div>
          </>
        )}
        
        <div style={{ marginTop: '2rem' }}>
          <Link href="/" className="button-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Back to Stories
          </Link>
        </div>
      </div>
    </div>
  )
}
