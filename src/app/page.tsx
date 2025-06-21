'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import AuthModal from '@/components/auth/AuthModal'
import UserDashboard from '@/components/dashboard/UserDashboard'
import SubscribeButton from '@/components/checkout/SubscribeButton'
import { supabase } from '@/lib/supabase'

interface Story {
  id: string
  title: string
  description: string
  author: string
  price: number
  total_chapters: number
}

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' } | null>(null)

  useEffect(() => {
    async function fetchStories() {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setStories(data || [])
      } catch (error) {
        console.error('Error fetching stories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  if (authLoading || loading) {
    return (
      <div className="page-wrapper">
        <div className="card">
          <h1 className="title">Loading NextChapter...</h1>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', padding: '2rem' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 className="title">NextChapter</h1>
          <p className="subtitle">Amazing stories delivered daily to your inbox</p>
          <div className="success-banner">
            🎉 Ready for payments! {stories.length} stories available
          </div>
          
          {/* Auth buttons for non-logged in users */}
          {!user && (
            <div className="flex gap-2 mt-3" style={{ justifyContent: 'center' }}>
              <button 
                className="button-secondary"
                onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
              >
                Sign In
              </button>
              <button 
                className="button-primary"
                onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* User Dashboard for logged in users */}
        {user && <UserDashboard />}

        {/* Stories Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {stories.map((story) => (
            <div key={story.id} className="card" style={{ textAlign: 'left' }}>
              <h3 style={{ color: '#2d3748', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                {story.title}
              </h3>
              <p style={{ color: '#718096', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                by {story.author}
              </p>
              <p style={{ color: '#4a5568', marginBottom: '1rem', lineHeight: '1.6' }}>
                {story.description}
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ color: '#38a169', fontWeight: 'bold', fontSize: '1.25rem' }}>
                  ${(story.price / 100).toFixed(2)}
                </span>
                <span style={{ color: '#718096', marginLeft: '0.5rem' }}>
                  • {story.total_chapters} chapters
                </span>
              </div>

              <SubscribeButton
                story={{
                  id: story.id,
                  title: story.title,
                  author: story.author,
                  price: story.price
                }}
                onAuthRequired={() => setAuthModal({ isOpen: true, mode: 'register' })}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem', color: 'white' }}>
          <p>NextChapter 2.0 - Powered by Next.js, Supabase & AI</p>
        </div>
      </div>

      {/* Auth Modal */}
      {authModal && (
        <AuthModal
          isOpen={authModal.isOpen}
          onClose={() => setAuthModal(null)}
          initialMode={authModal.mode}
        />
      )}
    </div>
  )
}
