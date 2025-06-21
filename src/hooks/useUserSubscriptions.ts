'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

interface Subscription {
  id: string
  story_id: string
  status: string
  created_at: string
}

export function useUserSubscriptions() {
  const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubscriptions() {
      if (!user) {
        setSubscriptions([])
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('id, story_id, status, created_at')
          .eq('user_id', user.id)
          .eq('status', 'active')

        if (error) {
          console.error('Error fetching subscriptions:', error)
        } else {
          setSubscriptions(data || [])
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [user])

  const isSubscribed = (storyId: string) => {
    return subscriptions.some(sub => sub.story_id === storyId)
  }

  return { subscriptions, loading, isSubscribed }
}
