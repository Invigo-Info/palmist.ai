'use client'

import { useState, useEffect } from 'react'

// Avatar images for social proof
const avatars = [
  'https://framerusercontent.com/images/2AdjhgGSRqD2VZDKSrMJb5N9Q6E.jpg?scale-down-to=512',
  'https://framerusercontent.com/images/KuIBzI0VbhnNU4FBscAHrIRO2DQ.jpg?scale-down-to=512',
  'https://framerusercontent.com/images/Z4kmYBAi7pNNnGeW41ZiDk92B9c.jpg?scale-down-to=512',
]

export default function Home() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [signupCount, setSignupCount] = useState(28700212)

  // Fetch current signup count on load
  useEffect(() => {
    fetchCount()
  }, [])

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/count')
      const data = await res.json()
      if (data.count) {
        setSignupCount(data.count)
      }
    } catch (error) {
      console.error('Failed to fetch count:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' })
      return
    }

    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Welcome! Check your inbox for confirmation.' })
        setEmail('')
        setSignupCount(data.count || signupCount + 1)
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Format number without commas (matching original)
  const formatNumber = (num) => {
    return num.toString()
  }

  return (
    <main className="main-container">
      <div className="bg-auras" aria-hidden="true">
        <span className="aura aura-left"></span>
        <span className="aura2 aura-right"></span>
        {/* <span className="aura aura-bottom"></span> */}
      </div>

      {/* Content */}
      <div className="content">
        {/* Badge */}
        <span className="badge">
          WORLD&apos;S BEST AI-POWERED PALM READER
        </span>

        {/* Main Title */}
        <h1 className="title">
          Unlock insights into your future with expert palm readings&mdash;in seconds.
        </h1>

        {/* Subtitle */}
        <p className="subtitle">
          Sign up now for early access and be among the first to discover what your palm reveals!
        </p>

        {/* Email Form */}
        <form className="email-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="email-input"
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </button>
        </form>

        {/* Message */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Social Proof */}
        <div className="social-proof">
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <img 
                key={index}
                src={avatar} 
                alt="User"
                className="avatar"
                style={{ zIndex: 3 - index }}
              />
            ))}
          </div>
          <span className="signup-count">
            {formatNumber(signupCount)} people signed up
          </span>
        </div>
      </div>
    </main>
  )
}
