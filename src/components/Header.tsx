'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Shield, Settings, LogOut, User, ChevronDown } from 'lucide-react'

interface HeaderProps {
  onAuthModalOpen?: (mode: 'login' | 'register') => void
  showNavLinks?: boolean
  variant?: 'homepage' | 'dashboard' | 'admin'
}

export default function Header({ 
  onAuthModalOpen, 
  showNavLinks = true, 
  variant = 'homepage' 
}: HeaderProps) {
  const { user, signOut } = useAuth()
  const { isAdmin, isSuperAdmin, adminUser } = useAdminAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur border-b border-gray-200 z-50 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">📖</span>
          <span className="text-2xl font-bold text-gray-800">NextChapter</span>
        </Link>
        {/* Navigation Links */}
        {showNavLinks && variant === 'homepage' && (
          <div className="flex items-center gap-8">
            <a href="#stories" className="text-gray-500 hover:text-primary-600 font-medium transition-colors">Stories</a>
            <a href="#how-it-works" className="text-gray-500 hover:text-primary-600 font-medium transition-colors">How It Works</a>
            <a href="#testimonials" className="text-gray-500 hover:text-primary-600 font-medium transition-colors">Reviews</a>
            {/* Admin Link in Main Navigation */}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center gap-2 text-primary-600 font-semibold px-4 py-2 bg-primary-50 border border-primary-200 rounded-md shadow-sm hover:bg-primary-100 hover:border-primary-300 transition-all"
              >
                <Shield className="w-4 h-4" />
                Admin
                {isSuperAdmin && (
                  <span style={{
                    fontSize: '0.7rem',
                    background: 'rgba(102, 126, 234, 0.2)',
                    color: '#667eea',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '3px',
                    fontWeight: '700'
                  }}>
                    SUPER
                  </span>
                )}
              </Link>
            )}
          </div>
        )}

        {/* Dashboard Navigation */}
        {variant === 'dashboard' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/" style={{ color: '#718096', textDecoration: 'none', fontWeight: '500' }}>
              Home
            </Link>
            <Link href="/dashboard" style={{ color: '#718096', textDecoration: 'none', fontWeight: '500' }}>
              Dashboard
            </Link>
            <Link href="/stories" style={{ color: '#718096', textDecoration: 'none', fontWeight: '500' }}>
              Browse Stories
            </Link>
            {/* Admin Link in Dashboard Navigation */}
            {isAdmin && (
              <Link 
                href="/admin" 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#667eea', 
                  textDecoration: 'none', 
                  fontWeight: '600',
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                  borderRadius: '6px',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Shield style={{ width: '16px', height: '16px' }} />
                Admin Panel
              </Link>
            )}
          </div>
        )}

        {/* Admin Navigation */}
        {variant === 'admin' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href="/" style={{ color: '#718096', textDecoration: 'none', fontWeight: '500' }}>
              Home
            </Link>
            <Link href="/dashboard" style={{ color: '#718096', textDecoration: 'none', fontWeight: '500' }}>
              Dashboard
            </Link>
            {/* Admin Status Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              <Shield style={{ width: '16px', height: '16px' }} />
              Admin Mode
              {isSuperAdmin && (
                <span style={{
                  fontSize: '0.7rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '3px'
                }}>
                  SUPER
                </span>
              )}
            </div>
          </div>
        )}

        {/* User Menu */}
        {!user ? (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="button-secondary"
              onClick={() => onAuthModalOpen?.('login')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              Sign In
            </button>
            <button 
              className="button-primary"
              onClick={() => onAuthModalOpen?.('register')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              Sign Up Free
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* User Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: '#718096', fontWeight: '500', fontSize: '0.9rem' }}>
                  {adminUser?.name || 'User'}
                </span>
                <ChevronDown style={{ 
                  width: '16px', 
                  height: '16px', 
                  color: '#718096',
                  transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '220px',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  zIndex: 1000
                }}>
                  {/* User Info */}
                  <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                    <p style={{ fontWeight: '600', color: '#2d3748', margin: '0', fontSize: '0.9rem' }}>
                      {adminUser?.name || 'User'}
                    </p>
                    <p style={{ color: '#718096', margin: '0', fontSize: '0.8rem' }}>
                      {user.email}
                    </p>
                    {isAdmin && (
                      <div style={{
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Shield style={{ width: '12px', height: '12px', color: '#667eea' }} />
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#667eea',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {adminUser?.role?.replace('_', ' ')} Access
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: '0.5rem 0' }}>
                    <Link
                      href="/dashboard"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        color: '#4a5568',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User style={{ width: '16px', height: '16px' }} />
                      My Dashboard
                    </Link>

                    <Link
                      href="/settings"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        color: '#4a5568',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings style={{ width: '16px', height: '16px' }} />
                      Settings
                    </Link>

                    {isAdmin && (
                      <>
                        <div style={{ height: '1px', background: 'rgba(0, 0, 0, 0.1)', margin: '0.5rem 0' }}></div>
                        <Link
                          href="/admin"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            color: '#667eea',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield style={{ width: '16px', height: '16px' }} />
                          Admin Panel
                          {isSuperAdmin && (
                            <span style={{
                              fontSize: '0.7rem',
                              background: 'rgba(102, 126, 234, 0.2)',
                              color: '#667eea',
                              padding: '0.1rem 0.3rem',
                              borderRadius: '3px',
                              fontWeight: '700'
                            }}>
                              SUPER
                            </span>
                          )}
                        </Link>
                      </>
                    )}

                    <div style={{ height: '1px', background: 'rgba(0, 0, 0, 0.1)', margin: '0.5rem 0' }}></div>
                    
                    <button
                      onClick={handleSignOut}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        color: '#e53e3e',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(229, 62, 62, 0.1)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <LogOut style={{ width: '16px', height: '16px' }} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  )
}
