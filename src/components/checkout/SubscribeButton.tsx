'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { stripePromise } from '@/lib/stripe'
import { useUserSubscriptions } from '@/hooks/useUserSubscriptions'

interface SubscribeButtonProps {
  story: {
    id: string
    title: string
    author: string
    price: number
  }
  onAuthRequired: () => void
}

export default function SubscribeButton({ story, onAuthRequired }: SubscribeButtonProps) {
  const { user } = useAuth()
  const { isSubscribed, loading: subscriptionsLoading } = useUserSubscriptions()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const alreadySubscribed = isSubscribed(story.id)

  const handleSubscribe = async () => {
    if (!user) {
      onAuthRequired()
      return
    }

    if (alreadySubscribed) {
      return // Do nothing if already subscribed
    }

    setLoading(true)
    setError(null)

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId: story.id,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })

        if (error) {
          throw error
        }
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (subscriptionsLoading) {
    return (
      <button className="button-secondary" style={{ width: '100%' }} disabled>
        Loading...
      </button>
    )
  }

  if (alreadySubscribed) {
    return (
      <button 
        className="button-secondary" 
        style={{ 
          width: '100%', 
          backgroundColor: '#48bb78',
          color: 'white',
          cursor: 'default'
        }}
        disabled
      >
        ✅ Subscribed
      </button>
    )
  }

  return (
    <div>
      {error && (
        <div style={{ 
          backgroundColor: '#fed7d7', 
          color: '#c53030', 
          padding: '0.5rem', 
          borderRadius: '4px',
          fontSize: '0.8rem',
          marginBottom: '0.5rem'
        }}>
          {error}
        </div>
      )}
      
      <button 
        className="button-primary" 
        style={{ width: '100%' }}
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? (
          'Processing...'
        ) : user ? (
          `Subscribe for $${(story.price / 100).toFixed(2)}`
        ) : (
          'Sign Up to Subscribe'
        )}
      </button>
    </div>
  )
}
