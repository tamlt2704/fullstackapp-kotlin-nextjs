'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface BlogPost {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  content: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState(true)

  const blogFiles = [
    // Programming Guides
    'react-hooks-guide.md',
    'react-nextjs-senior-developer-guide.md',
    'kotlin-complete-guide.md',
    'java-streams-data-structures-guide.md',
    'kotlin-concurrency-guide.md',
    'kotlin-everyday-tasks.md',
    'kotlin-competitive-programming.md',
    'kotlin-dataframe-letsplot-guide.md',
    'kotlin-javascript-interop-guide.md',
    'kotlin-ai-agent-building-guide.md',
    'java-concurrency-guide.md',
    'java-jpa-persistence-guide.md',
    
    // Backend & Frameworks
    'spring-boot-security.md',
    'spring-integration-guide.md',
    'spring-testing-advanced-guide.md',
    'SPRING_CLOUD_KOTLIN_GUIDE.md',
    
    // Testing & Automation
    'playwright-typescript-complete-guide.md',
    
    // Database & System Design
    'database-design-tips.md',
    'postgresql-complete-guide.md',
    'system-design-complete-guide.md',
    
    // DevOps & Cloud
    'aws-cloud-practitioner-notes.md',
    'aws-cloud-practitioner-complete-guide.md',
    'aws-cloud-practitioner-exam-guide.md',
    'aws-cloud-practitioner-practice-exams-index.md',
    'aws-cloud-practitioner-practice-exam-1.md',
    'aws-cloud-practitioner-practice-exam-2.md',
    'aws-cloud-practitioner-practice-exam-3.md',
    'aws-cloud-practitioner-practice-exam-4.md',
    'aws-cloud-practitioner-practice-exam-5.md',
    'aws-cloud-practitioner-practice-exam-6.md',
    'aws-cloud-practitioner-practice-exam-7.md',
    'aws-cloud-practitioner-practice-exam-8.md',
    'aws-cloud-practitioner-practice-exam-9.md',
    'aws-cloud-practitioner-practice-exam-10.md',
    'aws-cloud-practitioner-practice-exam-11.md',
    'aws-cloud-practitioner-practice-exam-12.md',
    'aws-cloud-practitioner-practice-exam-13.md',
    'aws-cloud-practitioner-practice-exam-14.md',
    'aws-cloud-practitioner-practice-exam-15.md',
    'docker-kubernetes-guide.md',
    'gradle-complete-guide.md',
    'github-workflows-guide.md',
    'gitlab-ci-complete-guide.md',
    
    // Data & Visualization
    'd3js-geospatial-guide.md',
    'nextjs-complete-guide.md',
    'jmathanim-animation-guide.md',
    'nextjs-tailwind-dark-mode-guide.md',
    'tailwind-responsive-design-guide.md',
    'shadcn-ui-complete-guide.md',
    
    // Algorithms & Problem Solving
    'leetcode-collections.md',
    'leetcode-500-problems-guide.md',
    'leetcode-medium-hard-problems.md',
    'LEETCODE-GUIDE-README.md',
    'linear-programming-lpsolve-guide.md',
    
    // Language Learning
    'chinese-hsk1-complete-guide.md',
    'chinese-hsk2-complete-guide.md',
    'chinese-hsk3-complete-guide.md',
    'chinese-hsk4-complete-guide.md',
    'chinese-hsk5-complete-guide.md',
    'chinese-hsk6-complete-guide.md',
    
    // Sample
    'sample-post.md'
  ]

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    const loadedPosts: BlogPost[] = []
    
    for (const file of blogFiles) {
      try {
        const response = await fetch(`/content/blog/${file}`)
        const content = await response.text()
        const post = parseMarkdown(file, content)
        loadedPosts.push(post)
      } catch (error) {
        console.error(`Error loading ${file}:`, error)
      }
    }
    
    loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setPosts(loadedPosts)
    setSelectedPost(loadedPosts[0])
    setLoading(false)
  }

  const parseMarkdown = (filename: string, content: string): BlogPost => {
    const slug = filename.replace('.md', '')
    let frontmatter: any = {}
    let markdownContent = content

    if (content.startsWith('---')) {
      const parts = content.split('---')
      if (parts.length >= 3) {
        const frontmatterText = parts[1]
        markdownContent = parts.slice(2).join('---')
        
        frontmatterText.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(':')
          if (key && valueParts.length) {
            const value = valueParts.join(':').trim().replace(/"/g, '')
            if (key.trim() === 'tags') {
              frontmatter[key.trim()] = value.replace(/[\[\]]/g, '').split(',').map(t => t.trim())
            } else {
              frontmatter[key.trim()] = value
            }
          }
        })
      }
    }

    return {
      slug,
      title: frontmatter.title || 'Untitled',
      date: frontmatter.date || '2024-01-01',
      category: frontmatter.category || 'General',
      tags: frontmatter.tags || [],
      content: markdownContent
    }
  }

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))]
  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory)

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '20px', gap: '30px' }}>
      {/* Sidebar */}
      <aside style={{ width: '300px', flexShrink: 0 }}>
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Categories</h3>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                margin: '5px 0',
                border: 'none',
                background: selectedCategory === category ? '#0070f3' : '#fff',
                color: selectedCategory === category ? '#fff' : '#333',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Recent Posts</h3>
          {filteredPosts.map(post => (
            <div
              key={post.slug}
              onClick={() => setSelectedPost(post)}
              style={{
                padding: '12px',
                margin: '8px 0',
                border: selectedPost?.slug === post.slug ? '2px solid #0070f3' : '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                background: '#fff'
              }}
            >
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{post.title}</h4>
              <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                {post.category} • {post.date}
              </p>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {selectedPost && (
          <article style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
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
              {selectedPost.content}
            </ReactMarkdown>
          </article>
        )}
      </main>
    </div>
  )
}