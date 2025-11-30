'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function BlogPage() {
  const [markdown, setMarkdown] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/content/blog/sample-post.md')
      .then(response => response.text())
      .then(text => {
        setMarkdown(text)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading markdown:', error)
        setLoading(false)
      })
  }, [])

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      lineHeight: '1.6'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <a href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
          ← Back to Portfolio
        </a>
      </div>
      
      <article style={{
        fontSize: '16px',
        color: '#333'
      }}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({children}) => <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>{children}</h1>,
            h2: ({children}) => <h2 style={{ color: '#34495e', marginTop: '30px', marginBottom: '15px' }}>{children}</h2>,
            h3: ({children}) => <h3 style={{ color: '#34495e', marginTop: '25px', marginBottom: '10px' }}>{children}</h3>,
            p: ({children}) => <p style={{ marginBottom: '15px' }}>{children}</p>,
            code: ({children}) => <code style={{ 
              background: '#f4f4f4', 
              padding: '2px 4px', 
              borderRadius: '3px',
              fontSize: '14px'
            }}>{children}</code>,
            pre: ({children}) => <pre style={{ 
              background: '#f8f8f8', 
              padding: '15px', 
              borderRadius: '5px',
              overflow: 'auto',
              marginBottom: '15px'
            }}>{children}</pre>,
            ul: ({children}) => <ul style={{ marginBottom: '15px', paddingLeft: '20px' }}>{children}</ul>,
            ol: ({children}) => <ol style={{ marginBottom: '15px', paddingLeft: '20px' }}>{children}</ol>,
            li: ({children}) => <li style={{ marginBottom: '5px' }}>{children}</li>,
            blockquote: ({children}) => <blockquote style={{ 
              borderLeft: '4px solid #ddd', 
              paddingLeft: '15px', 
              margin: '15px 0',
              fontStyle: 'italic'
            }}>{children}</blockquote>
          }}
        >
          {markdown}
        </ReactMarkdown>
      </article>
    </div>
  )
}