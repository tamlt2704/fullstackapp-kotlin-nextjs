'use client'

import { useState } from 'react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const result = await response.text()
      setMessage(result)
    } catch (error) {
      setMessage('Error occurred')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <button 
        onClick={() => setIsLogin(!isLogin)}
        style={{ marginTop: '10px', width: '100%', padding: '10px' }}
      >
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          Back to Portfolio
        </a>
      </div>
    </div>
  )
}