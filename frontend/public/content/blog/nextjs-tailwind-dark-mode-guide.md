---
title: "Next.js Dark Mode with Tailwind CSS: Complete Guide"
date: "2024-01-23"
category: "Frontend Development"
tags: ["Next.js", "Tailwind CSS", "Dark Mode", "Theme", "React"]
---

# Next.js Dark Mode with Tailwind CSS: Complete Guide

## Table of Contents
1. [Setup](#setup)
2. [Basic Implementation](#basic-implementation)
3. [Using next-themes](#using-next-themes)
4. [Advanced Patterns](#advanced-patterns)
5. [System Preference Detection](#system-preference)
6. [Persistent Theme Storage](#persistent-storage)
7. [Production Examples](#production-examples)

## Setup

### Install Dependencies

```bash
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# For theme management
npm install next-themes
```

### Tailwind Configuration

**tailwind.config.js:**
```js
module.exports = {
  darkMode: 'class', // or 'media' for system preference only
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6',
          dark: '#60a5fa',
        },
      },
    },
  },
  plugins: [],
}
```

**globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #000000;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}

body {
  background-color: var(--background);
  color: var(--foreground);
}
```

## Basic Implementation

### Manual Dark Mode Toggle

**app/layout.tsx:**
```tsx
'use client'

import { useState, useEffect } from 'react'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('darkMode', (!darkMode).toString())
  }

  return (
    <html lang="en">
      <body>
        <button
          onClick={toggleDarkMode}
          className="fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-800"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        {children}
      </body>
    </html>
  )
}
```

### Simple Page with Dark Mode

**app/page.tsx:**
```tsx
export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          This text adapts to dark mode
        </p>
        
        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Card Component
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Card content with dark mode support
          </p>
        </div>
      </div>
    </div>
  )
}
```

## Using next-themes

### Provider Setup

**app/providers.tsx:**
```tsx
'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```

**app/layout.tsx:**
```tsx
import { Providers } from './providers'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### Theme Toggle Component

**components/ThemeToggle.tsx:**
```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  )
}
```

### Theme Selector with Multiple Options

**components/ThemeSelector.tsx:**
```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeSelector() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme('light')}
        className={`px-4 py-2 rounded ${
          theme === 'light'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`px-4 py-2 rounded ${
          theme === 'dark'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        Dark
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`px-4 py-2 rounded ${
          theme === 'system'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        System
      </button>
    </div>
  )
}
```

## Advanced Patterns

### Custom Color Schemes

**tailwind.config.js:**
```js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'bg-primary': '#ffffff',
        'bg-secondary': '#f3f4f6',
        'text-primary': '#111827',
        'text-secondary': '#6b7280',
        
        // Dark mode colors (use with dark: prefix)
        'dark-bg-primary': '#0f172a',
        'dark-bg-secondary': '#1e293b',
        'dark-text-primary': '#f1f5f9',
        'dark-text-secondary': '#94a3b8',
      },
    },
  },
}
```

**Usage:**
```tsx
<div className="bg-bg-primary dark:bg-dark-bg-primary">
  <h1 className="text-text-primary dark:text-dark-text-primary">
    Title
  </h1>
  <p className="text-text-secondary dark:text-dark-text-secondary">
    Description
  </p>
</div>
```

### CSS Variables Approach

**globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg-primary: 255 255 255;
    --color-bg-secondary: 243 244 246;
    --color-text-primary: 17 24 39;
    --color-text-secondary: 107 114 128;
    --color-accent: 59 130 246;
  }

  .dark {
    --color-bg-primary: 15 23 42;
    --color-bg-secondary: 30 41 59;
    --color-text-primary: 241 245 249;
    --color-text-secondary: 148 163 184;
    --color-accent: 96 165 250;
  }
}
```

**tailwind.config.js:**
```js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': 'rgb(var(--color-bg-primary) / <alpha-value>)',
        'bg-secondary': 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        'accent': 'rgb(var(--color-accent) / <alpha-value>)',
      },
    },
  },
}
```

**Usage:**
```tsx
<div className="bg-bg-primary text-text-primary">
  <button className="bg-accent text-white hover:bg-accent/90">
    Click me
  </button>
</div>
```

### Animated Theme Transition

**globals.css:**
```css
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Disable transitions on theme change */
.no-transition * {
  transition: none !important;
}
```

**components/ThemeToggle.tsx:**
```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  const toggleTheme = () => {
    document.documentElement.classList.add('no-transition')
    setTheme(theme === 'dark' ? 'light' : 'dark')
    setTimeout(() => {
      document.documentElement.classList.remove('no-transition')
    }, 0)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors"
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
          theme === 'dark' ? 'translate-x-7' : ''
        }`}
      />
    </button>
  )
}
```

## System Preference Detection

### Detect System Theme

**hooks/useSystemTheme.ts:**
```ts
import { useEffect, useState } from 'react'

export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return systemTheme
}
```

### Auto-sync with System

**components/ThemeProvider.tsx:**
```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      const theme = localStorage.getItem('theme')
      if (theme === 'system' || !theme) {
        document.documentElement.classList.toggle('dark', e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  )
}
```

## Persistent Theme Storage

### LocalStorage with SSR Support

**lib/theme.ts:**
```ts
export const getStoredTheme = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('theme')
}

export const setStoredTheme = (theme: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('theme', theme)
}

export const removeStoredTheme = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('theme')
}
```

### Prevent Flash of Unstyled Content

**app/layout.tsx:**
```tsx
import { Providers } from './providers'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'system';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Production Examples

### Complete Dashboard Layout

**components/DashboardLayout.tsx:**
```tsx
'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <nav className="space-y-2">
            {['Home', 'Analytics', 'Settings'].map((item) => (
              <a
                key={item}
                href="#"
                className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
```

### Card Component with Dark Mode

**components/Card.tsx:**
```tsx
interface CardProps {
  title: string
  description: string
  children?: React.ReactNode
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl dark:hover:shadow-gray-900/70">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>
      {children}
    </div>
  )
}
```

### Button Component

**components/Button.tsx:**
```tsx
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  onClick?: () => void
}

export default function Button({ 
  children, 
  variant = 'primary',
  onClick 
}: ButtonProps) {
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
    danger: 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white',
  }

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]}`}
    >
      {children}
    </button>
  )
}
```

### Form with Dark Mode

**components/Form.tsx:**
```tsx
export default function Form() {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password
        </label>
        <input
          type="password"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        Sign In
      </button>
    </form>
  )
}
```

### Complete Page Example

**app/page.tsx:**
```tsx
import DashboardLayout from '@/components/DashboardLayout'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your projects today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Total Users" description="Active users this month">
            <p className="text-4xl font-bold text-blue-500 dark:text-blue-400">
              1,234
            </p>
          </Card>

          <Card title="Revenue" description="Total revenue this month">
            <p className="text-4xl font-bold text-green-500 dark:text-green-400">
              $12,345
            </p>
          </Card>

          <Card title="Projects" description="Active projects">
            <p className="text-4xl font-bold text-purple-500 dark:text-purple-400">
              42
            </p>
          </Card>
        </div>

        <Card title="Quick Actions" description="Common tasks">
          <div className="flex gap-4">
            <Button variant="primary">New Project</Button>
            <Button variant="secondary">View Reports</Button>
            <Button variant="danger">Delete</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
```

## Summary

**Implementation Approaches:**
1. **Manual**: Full control, more code
2. **next-themes**: Easy, feature-rich, recommended
3. **CSS Variables**: Flexible, maintainable

**Key Features:**
- Class-based dark mode with Tailwind
- System preference detection
- Persistent storage
- No flash of unstyled content
- Smooth transitions
- SSR-compatible

**Best Practices:**
- Use `suppressHydrationWarning` on html tag
- Check `mounted` state before rendering theme-dependent UI
- Use CSS variables for complex color schemes
- Add transitions for smooth theme changes
- Test with system preference changes
- Provide manual override option

**Common Patterns:**
- `bg-white dark:bg-gray-900` for backgrounds
- `text-gray-900 dark:text-white` for primary text
- `text-gray-600 dark:text-gray-400` for secondary text
- `border-gray-200 dark:border-gray-700` for borders
- `hover:bg-gray-100 dark:hover:bg-gray-800` for interactive elements
