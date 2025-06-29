'use client'

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Header from '@/components/Header';
import AuthModal from '@/components/auth/AuthModal';
import UserDashboard from '@/components/dashboard/UserDashboard';
import SubscribeButton from '@/components/checkout/SubscribeButton';
import { supabase } from '@/lib/supabase';

interface Story {
  id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  total_chapters: number;
}

const getStoryCover = (title: string) => {
  if (title.toLowerCase().includes('detective') || title.toLowerCase().includes('digital')) {
    return 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
  }
  if (title.toLowerCase().includes('moon') || title.toLowerCase().includes('space')) {
    return 'https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
  }
  if (title.toLowerCase().includes('library')) {
    return 'https://images.pexels.com/photos/775201/pexels-photo-775201.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
  }
  return 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
};

const getGenre = (title: string) => {
  if (title.toLowerCase().includes('detective') || title.toLowerCase().includes('digital')) return 'Mystery';
  if (title.toLowerCase().includes('moon') || title.toLowerCase().includes('space')) return 'Sci-Fi';
  if (title.toLowerCase().includes('library')) return 'Fantasy';
  return 'Fiction';
};

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' } | null>(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setStories(data || []);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  if (authLoading || loading) {
    return (
      <div className="page-wrapper">
        <div className="card">
          <h1 className="title">Loading NextChapter...</h1>
          <p className="subtitle">Preparing your reading experience</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Reusable Header Component */}
      <Header
        onAuthModalOpen={(mode) => setAuthModal({ isOpen: true, mode })}
        variant="homepage"
        showNavLinks={true}
      />

      <div style={{ paddingTop: '5rem' }}>
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '5rem 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1
          }}></div>
          
          <div className="container" style={{ position: 'relative', maxWidth: '800px' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              lineHeight: '1.2'
            }}>
              Stories delivered chapter by chapter, right to your inbox
            </h1>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '2rem',
              opacity: 0.9,
              lineHeight: '1.6'
            }}>
              Subscribe to captivating stories for just $1 each. Receive one chapter daily and enjoy the anticipation of tomorrow&apos;s continuation.
            </p>
            
            {/* Live Status Banner */}
            {stories.length > 0 && (
              <div style={{
                background: 'rgba(72, 187, 120, 0.2)',
                border: '1px solid rgba(72, 187, 120, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Zap style={{ width: '16px', height: '16px' }} />
                <span style={{ fontWeight: '500' }}>
                  🎉 Live & Ready! {stories.length} stories available for subscription
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="button-primary"
                onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse Stories
              </button>
              <button 
                className="button-secondary"
                onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
              >
                Sign Up for Free
              </button>
            </div>
          </div>
        </section>

        {/* User Dashboard for logged in users */}
        {user && (
          <section style={{ padding: '2rem 0', background: '#f7fafc' }}>
            <div className="container">
              <UserDashboard />
            </div>
          </section>
        )}

        {/* How It Works Section */}
        <section id="how-it-works" style={{ padding: '5rem 2rem', background: 'white' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#2d3748',
                marginBottom: '1rem'
              }}>
                How NextChapter Works
              </h2>
              <p style={{
                fontSize: '1.25rem',
                color: '#718096',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                A new way to experience stories, one chapter at a time
              </p>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  fontSize: '2rem'
                }}>
                  📚
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#2d3748',
                  marginBottom: '1rem'
                }}>
                  1. Choose a Story
                </h3>
                <p style={{ color: '#718096', lineHeight: '1.6' }}>
                  Browse our curated library of stories across various genres and select one that captures your interest.
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  fontSize: '2rem'
                }}>
                  ��
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#2d3748',
                  marginBottom: '1rem'
                }}>
                  2. Subscribe for $1
                </h3>
                <p style={{ color: '#718096', lineHeight: '1.6' }}>
                  Pay just $1 per story and get access to the entire narrative, delivered one chapter at a time.
                </p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  fontSize: '2rem'
                }}>
                  📧
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#2d3748',
                  marginBottom: '1rem'
                }}>
                  3. Daily Chapters
                </h3>
                <p style={{ color: '#718096', lineHeight: '1.6' }}>
                  Receive a new chapter in your inbox every day until the story concludes. Read at your own pace.
                </p>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <button 
                className="button-primary"
                onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Our Library →
              </button>
            </div>
          </div>
        </section>

        {/* Featured Stories Section */}
        <section id="stories" style={{ padding: '5rem 2rem', background: '#f7fafc' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#2d3748',
                marginBottom: '1rem'
              }}>
                Featured Stories
              </h2>
              <p style={{
                fontSize: '1.25rem',
                color: '#718096',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: '1.6'
              }}>
                Start your reading journey with these captivating tales
              </p>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}>
              {stories.map((story) => {
                const coverImage = getStoryCover(story.title);
                const genre = getGenre(story.title);
                
                return (
                  <div 
                    key={story.id} 
                    className="card"
                    style={{
                      textAlign: 'left',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '200px',
                      background: `url("${coverImage}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'linear-gradient(90deg, #667eea, #764ba2)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {genre}
                      </div>
                    </div>
                    
                    <h3 style={{
                      color: '#2d3748',
                      marginBottom: '0.5rem',
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}>
                      {story.title}
                    </h3>
                    <p style={{
                      color: '#718096',
                      marginBottom: '1rem',
                      fontStyle: 'italic'
                    }}>
                      by {story.author}
                    </p>
                    <p style={{
                      color: '#4a5568',
                      marginBottom: '1.5rem',
                      lineHeight: '1.6',
                      fontSize: '0.95rem'
                    }}>
                      {story.description}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      <div>
                        <span style={{
                          color: '#38a169',
                          fontWeight: 'bold',
                          fontSize: '1.25rem'
                        }}>
                          ${(story.price / 100).toFixed(2)}
                        </span>
                        <span style={{
                          color: '#718096',
                          marginLeft: '0.5rem',
                          fontSize: '0.9rem'
                        }}>
                          • {story.total_chapters} chapters
                        </span>
                      </div>
                      <div style={{
                        color: '#667eea',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        Daily delivery
                      </div>
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
                );
              })}
            </div>

            {stories.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
                <h3 style={{ color: '#718096', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                  No stories available yet
                </h3>
                <p style={{ color: '#a0aec0' }}>Check back soon for new stories!</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          background: '#2d3748',
          color: 'white',
          padding: '3rem 2rem 2rem 2rem'
        }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>📖</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>NextChapter</span>
                </div>
                <p style={{ color: '#a0aec0', lineHeight: '1.6', marginBottom: '1rem' }}>
                  The modern way to experience fiction. Stories delivered daily, one chapter at a time.
                </p>
                <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                  Powered by Next.js, Supabase & AI
                </p>
              </div>
            </div>
            
            <div style={{
              borderTop: '1px solid #4a5568',
              paddingTop: '2rem',
              textAlign: 'center',
              color: '#a0aec0'
            }}>
              <p>&copy; 2025 NextChapter. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      {authModal && (
        <AuthModal
          isOpen={authModal.isOpen}
          onClose={() => setAuthModal(null)}
          initialMode={authModal.mode}
        />
      )}
    </>
  );
}
