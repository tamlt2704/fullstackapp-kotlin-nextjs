'use client'

import { useState, useEffect } from 'react'

interface User {
  id: number
  username: string
  role: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.status === 403) {
        setUsers([])
        console.error('Access denied - Admin role required')
        return
      }
      
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin - All Users</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Username</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{user.id}</td>
              <td style={{ padding: '10px' }}>{user.username}</td>
              <td style={{ padding: '10px' }}>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px' }}>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
          Back to Home
        </a>
      </div>
    </div>
  )
}