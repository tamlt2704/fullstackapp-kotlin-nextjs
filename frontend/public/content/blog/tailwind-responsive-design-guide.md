---
title: "Responsive UI/UX Design with Tailwind CSS: Beginner to Professional"
date: "2024-01-24"
category: "Frontend Development"
tags: ["Tailwind CSS", "Responsive Design", "UI/UX", "Mobile", "Web Design"]
---

# Responsive UI/UX Design with Tailwind CSS

## Table of Contents
1. [Fundamentals](#fundamentals)
2. [Breakpoints & Mobile-First](#breakpoints)
3. [Layout Patterns](#layout-patterns)
4. [Navigation Components](#navigation)
5. [Forms & Inputs](#forms)
6. [Cards & Content](#cards)
7. [Advanced Patterns](#advanced-patterns)
8. [Professional Examples](#professional-examples)

## Fundamentals

### Tailwind Breakpoints

```js
// Default breakpoints
sm: '640px'   // Small devices (landscape phones)
md: '768px'   // Medium devices (tablets)
lg: '1024px'  // Large devices (desktops)
xl: '1280px'  // Extra large devices
2xl: '1536px' // 2X Extra large devices
```

### Mobile-First Approach

```tsx
// Mobile first: base styles apply to mobile, then override for larger screens
<div className="
  text-sm      // Mobile: small text
  md:text-base // Tablet: normal text
  lg:text-lg   // Desktop: large text
">
  Responsive Text
</div>

// Width example
<div className="
  w-full       // Mobile: full width
  md:w-1/2     // Tablet: half width
  lg:w-1/3     // Desktop: one-third width
">
  Responsive Container
</div>
```

### Container Setup

```tsx
// Centered container with responsive padding
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    Content
  </div>
</div>

// Full-width on mobile, contained on desktop
<div className="w-full lg:max-w-screen-xl lg:mx-auto">
  Content
</div>
```

## Breakpoints & Mobile-First

### Responsive Typography

```tsx
export default function Typography() {
  return (
    <div className="space-y-4">
      {/* Heading */}
      <h1 className="
        text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
        font-bold
        leading-tight
      ">
        Responsive Heading
      </h1>

      {/* Body text */}
      <p className="
        text-sm sm:text-base md:text-lg
        leading-relaxed sm:leading-loose
        text-gray-600
      ">
        Responsive paragraph text that scales with screen size.
      </p>

      {/* Line clamp */}
      <p className="
        line-clamp-3 md:line-clamp-none
        text-gray-700
      ">
        Long text that shows 3 lines on mobile and full text on desktop...
      </p>
    </div>
  )
}
```

### Responsive Spacing

```tsx
// Padding
<div className="p-4 md:p-6 lg:p-8 xl:p-12">
  Content with responsive padding
</div>

// Margin
<div className="mt-4 md:mt-8 lg:mt-12">
  Content with responsive margin
</div>

// Gap in flex/grid
<div className="flex gap-2 md:gap-4 lg:gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Show/Hide Elements

```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">
  Desktop only content
</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">
  Mobile only content
</div>

// Different content for different screens
<>
  <div className="md:hidden">Mobile Menu Icon</div>
  <div className="hidden md:block">Desktop Navigation</div>
</>
```

## Layout Patterns

### Flexbox Layouts

```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">Column 1</div>
  <div className="flex-1">Column 2</div>
  <div className="flex-1">Column 3</div>
</div>

// Responsive alignment
<div className="
  flex
  flex-col md:flex-row
  items-start md:items-center
  justify-between
  gap-4
">
  <div>Left content</div>
  <div>Right content</div>
</div>

// Responsive order
<div className="flex flex-col md:flex-row">
  <div className="order-2 md:order-1">First on desktop</div>
  <div className="order-1 md:order-2">Second on desktop</div>
</div>
```

### Grid Layouts

```tsx
// Responsive grid columns
<div className="
  grid
  grid-cols-1        // 1 column on mobile
  sm:grid-cols-2     // 2 columns on small screens
  md:grid-cols-3     // 3 columns on medium screens
  lg:grid-cols-4     // 4 columns on large screens
  gap-4 md:gap-6 lg:gap-8
">
  {items.map(item => (
    <div key={item.id} className="bg-white p-4 rounded-lg">
      {item.content}
    </div>
  ))}
</div>

// Auto-fit grid
<div className="
  grid
  grid-cols-[repeat(auto-fit,minmax(250px,1fr))]
  gap-4
">
  {/* Items automatically wrap */}
</div>

// Asymmetric grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="md:col-span-2">Main content (2/3)</div>
  <div className="md:col-span-1">Sidebar (1/3)</div>
</div>
```

### Sidebar Layouts

```tsx
export default function SidebarLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="
        w-full md:w-64 lg:w-80
        bg-gray-800 text-white
        p-4 md:p-6
      ">
        <nav className="space-y-2">
          <a href="#" className="block p-2 hover:bg-gray-700 rounded">
            Dashboard
          </a>
          <a href="#" className="block p-2 hover:bg-gray-700 rounded">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          Content
        </div>
      </main>
    </div>
  )
}
```

## Navigation Components

### Mobile-First Navigation

```tsx
'use client'

import { useState } from 'react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-xl font-bold">Logo</div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-blue-500">Home</a>
            <a href="#" className="hover:text-blue-500">About</a>
            <a href="#" className="hover:text-blue-500">Services</a>
            <a href="#" className="hover:text-blue-500">Contact</a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <a href="#" className="block py-2 hover:bg-gray-100 px-4">Home</a>
            <a href="#" className="block py-2 hover:bg-gray-100 px-4">About</a>
            <a href="#" className="block py-2 hover:bg-gray-100 px-4">Services</a>
            <a href="#" className="block py-2 hover:bg-gray-100 px-4">Contact</a>
          </div>
        )}
      </div>
    </nav>
  )
}
```

### Sticky Header

```tsx
export default function StickyHeader() {
  return (
    <header className="
      sticky top-0 z-50
      bg-white shadow-md
      transition-all duration-300
    ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          <div className="text-lg sm:text-xl md:text-2xl font-bold">
            Brand
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">About</a>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

### Bottom Navigation (Mobile)

```tsx
export default function BottomNav() {
  return (
    <nav className="
      md:hidden
      fixed bottom-0 left-0 right-0
      bg-white border-t border-gray-200
      z-50
    ">
      <div className="flex justify-around items-center h-16">
        {['Home', 'Search', 'Profile', 'Settings'].map((item) => (
          <button
            key={item}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <span className="text-xs mt-1">{item}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
```

## Forms & Inputs

### Responsive Form Layout

```tsx
export default function ResponsiveForm() {
  return (
    <form className="
      w-full max-w-4xl mx-auto
      p-4 sm:p-6 md:p-8
      space-y-4 md:space-y-6
    ">
      {/* Single column on mobile, two columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            className="
              w-full
              px-3 py-2 sm:px-4 sm:py-3
              border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-sm sm:text-base
            "
            placeholder="John"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            className="
              w-full
              px-3 py-2 sm:px-4 sm:py-3
              border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              text-sm sm:text-base
            "
            placeholder="Doe"
          />
        </div>
      </div>

      {/* Full width field */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          className="
            w-full
            px-3 py-2 sm:px-4 sm:py-3
            border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-sm sm:text-base
          "
          placeholder="john@example.com"
        />
      </div>

      {/* Textarea */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          rows={4}
          className="
            w-full
            px-3 py-2 sm:px-4 sm:py-3
            border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-sm sm:text-base
            resize-none sm:resize-y
          "
          placeholder="Your message..."
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="
          w-full sm:w-auto
          px-6 py-2 sm:px-8 sm:py-3
          bg-blue-500 hover:bg-blue-600
          text-white font-medium rounded-lg
          transition-colors
          text-sm sm:text-base
        "
      >
        Submit
      </button>
    </form>
  )
}
```

### Search Bar

```tsx
export default function SearchBar() {
  return (
    <div className="
      w-full max-w-2xl mx-auto
      px-4 sm:px-0
    ">
      <div className="relative">
        <input
          type="search"
          placeholder="Search..."
          className="
            w-full
            pl-10 sm:pl-12
            pr-4
            py-2 sm:py-3 md:py-4
            text-sm sm:text-base
            border border-gray-300 rounded-full
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
          "
        />
        <svg
          className="
            absolute left-3 sm:left-4
            top-1/2 -translate-y-1/2
            w-4 h-4 sm:w-5 sm:h-5
            text-gray-400
          "
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  )
}
```

## Cards & Content

### Responsive Card Grid

```tsx
interface Product {
  id: number
  name: string
  price: number
  image: string
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="
      grid
      grid-cols-1           // 1 column on mobile
      sm:grid-cols-2        // 2 columns on small screens
      lg:grid-cols-3        // 3 columns on large screens
      xl:grid-cols-4        // 4 columns on xl screens
      gap-4 sm:gap-6 lg:gap-8
      p-4 sm:p-6 lg:p-8
    ">
      {products.map((product) => (
        <div
          key={product.id}
          className="
            bg-white rounded-lg shadow-md
            overflow-hidden
            hover:shadow-xl transition-shadow
            cursor-pointer
          "
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 sm:h-56 md:h-64 object-cover"
          />
          <div className="p-4 sm:p-6">
            <h3 className="
              text-base sm:text-lg md:text-xl
              font-semibold
              mb-2
              line-clamp-2
            ">
              {product.name}
            </h3>
            <p className="
              text-lg sm:text-xl md:text-2xl
              font-bold text-blue-600
            ">
              ${product.price}
            </p>
            <button className="
              mt-4
              w-full
              px-4 py-2 sm:py-3
              bg-blue-500 hover:bg-blue-600
              text-white rounded-lg
              transition-colors
              text-sm sm:text-base
            ">
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Hero Section

```tsx
export default function Hero() {
  return (
    <section className="
      relative
      min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]
      flex items-center justify-center
      bg-gradient-to-r from-blue-500 to-purple-600
      text-white
    ">
      <div className="
        container mx-auto
        px-4 sm:px-6 lg:px-8
        text-center
      ">
        <h1 className="
          text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
          font-bold
          mb-4 sm:mb-6 md:mb-8
          leading-tight
        ">
          Welcome to Our Platform
        </h1>
        <p className="
          text-base sm:text-lg md:text-xl lg:text-2xl
          mb-6 sm:mb-8 md:mb-10
          max-w-3xl mx-auto
          leading-relaxed
        ">
          Build amazing things with our powerful tools
        </p>
        <div className="
          flex flex-col sm:flex-row
          gap-4
          justify-center
          items-center
        ">
          <button className="
            w-full sm:w-auto
            px-6 sm:px-8 md:px-10
            py-3 sm:py-4
            bg-white text-blue-600
            font-semibold rounded-lg
            hover:bg-gray-100 transition-colors
            text-sm sm:text-base md:text-lg
          ">
            Get Started
          </button>
          <button className="
            w-full sm:w-auto
            px-6 sm:px-8 md:px-10
            py-3 sm:py-4
            border-2 border-white
            font-semibold rounded-lg
            hover:bg-white hover:text-blue-600 transition-colors
            text-sm sm:text-base md:text-lg
          ">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}
```

### Feature Cards

```tsx
export default function Features() {
  const features = [
    { icon: '🚀', title: 'Fast', description: 'Lightning fast performance' },
    { icon: '🔒', title: 'Secure', description: 'Bank-level security' },
    { icon: '📱', title: 'Responsive', description: 'Works on all devices' },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl
          font-bold text-center
          mb-8 sm:mb-12 md:mb-16
        ">
          Features
        </h2>
        <div className="
          grid grid-cols-1 md:grid-cols-3
          gap-6 sm:gap-8 md:gap-10 lg:gap-12
        ">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
                text-center
                p-6 sm:p-8
                bg-white rounded-xl shadow-lg
                hover:shadow-2xl transition-shadow
              "
            >
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4">
                {feature.icon}
              </div>
              <h3 className="
                text-xl sm:text-2xl md:text-3xl
                font-semibold mb-3
              ">
                {feature.title}
              </h3>
              <p className="
                text-sm sm:text-base md:text-lg
                text-gray-600
              ">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## Advanced Patterns

### Responsive Images

```tsx
export default function ResponsiveImage() {
  return (
    <>
      {/* Aspect ratio container */}
      <div className="
        aspect-video        // 16:9 ratio
        sm:aspect-square    // 1:1 on small screens
        md:aspect-[4/3]     // 4:3 on medium screens
        overflow-hidden rounded-lg
      ">
        <img
          src="/image.jpg"
          alt="Responsive"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Different images for different screens */}
      <picture>
        <source media="(min-width: 1024px)" srcSet="/desktop.jpg" />
        <source media="(min-width: 768px)" srcSet="/tablet.jpg" />
        <img src="/mobile.jpg" alt="Responsive" className="w-full" />
      </picture>

      {/* Object fit variations */}
      <img
        src="/image.jpg"
        className="
          w-full h-48 sm:h-64 md:h-80
          object-cover sm:object-contain md:object-fill
        "
      />
    </>
  )
}
```

### Modal/Dialog

```tsx
'use client'

import { useState } from 'react'

export default function Modal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Open Modal
      </button>

      {isOpen && (
        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          p-4 sm:p-6 md:p-8
          bg-black bg-opacity-50
        ">
          <div className="
            bg-white rounded-lg
            w-full max-w-md sm:max-w-lg md:max-w-2xl
            max-h-[90vh] overflow-y-auto
            p-6 sm:p-8
          ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
                Modal Title
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-sm sm:text-base mb-6">
              Modal content goes here...
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="
                  px-4 py-2
                  border border-gray-300 rounded
                  hover:bg-gray-100
                "
              >
                Cancel
              </button>
              <button className="
                px-4 py-2
                bg-blue-500 text-white rounded
                hover:bg-blue-600
              ">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

### Tabs

```tsx
'use client'

import { useState } from 'react'

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = ['Overview', 'Details', 'Reviews']

  return (
    <div className="w-full">
      {/* Tab buttons - scrollable on mobile */}
      <div className="
        flex
        overflow-x-auto
        border-b border-gray-200
        scrollbar-hide
      ">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`
              px-4 sm:px-6 md:px-8
              py-2 sm:py-3
              text-sm sm:text-base
              font-medium
              whitespace-nowrap
              border-b-2 transition-colors
              ${activeTab === index
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 sm:p-6 md:p-8">
        <p className="text-sm sm:text-base">
          Content for {tabs[activeTab]}
        </p>
      </div>
    </div>
  )
}
```

### Accordion

```tsx
'use client'

import { useState } from 'react'

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const items = [
    { title: 'Question 1', content: 'Answer 1' },
    { title: 'Question 2', content: 'Answer 2' },
    { title: 'Question 3', content: 'Answer 3' },
  ]

  return (
    <div className="
      w-full max-w-3xl mx-auto
      space-y-2 sm:space-y-3
      p-4 sm:p-6
    ">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="
              w-full
              flex justify-between items-center
              p-4 sm:p-5 md:p-6
              text-left
              hover:bg-gray-50 transition-colors
            "
          >
            <span className="text-sm sm:text-base md:text-lg font-medium">
              {item.title}
            </span>
            <svg
              className={`
                w-5 h-5 sm:w-6 sm:h-6
                transition-transform
                ${openIndex === index ? 'rotate-180' : ''}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === index && (
            <div className="
              p-4 sm:p-5 md:p-6
              pt-0
              text-sm sm:text-base
              text-gray-600
            ">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

## Professional Examples

### E-commerce Product Page

```tsx
export default function ProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="
          grid grid-cols-1 lg:grid-cols-2
          gap-8 lg:gap-12
          bg-white rounded-lg shadow-lg
          p-4 sm:p-6 lg:p-8
        ">
          {/* Image gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src="/product.jpg"
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="
              grid grid-cols-4
              gap-2 sm:gap-4
            ">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg cursor-pointer">
                  <img src={`/thumb${i}.jpg`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="
                text-2xl sm:text-3xl md:text-4xl
                font-bold mb-2
              ">
                Product Name
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
                <span className="text-sm text-gray-600">
                  (128 reviews)
                </span>
              </div>
            </div>

            <div className="text-3xl sm:text-4xl font-bold text-blue-600">
              $299.99
            </div>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Product description goes here with all the amazing features...
            </p>

            {/* Size selector */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    className="
                      px-4 py-2
                      border-2 border-gray-300
                      rounded-lg
                      hover:border-blue-500
                      transition-colors
                    "
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 border rounded-lg">-</button>
                <span className="text-lg font-medium">1</span>
                <button className="w-10 h-10 border rounded-lg">+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="
              flex flex-col sm:flex-row
              gap-3 sm:gap-4
              pt-4
            ">
              <button className="
                flex-1
                px-6 py-3 sm:py-4
                bg-blue-500 hover:bg-blue-600
                text-white font-semibold rounded-lg
                transition-colors
              ">
                Add to Cart
              </button>
              <button className="
                px-6 py-3 sm:py-4
                border-2 border-blue-500
                text-blue-500 font-semibold rounded-lg
                hover:bg-blue-50
                transition-colors
              ">
                ♥
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Dashboard with Sidebar

```tsx
'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50
        w-64 h-full
        bg-gray-900 text-white
        transform transition-transform duration-300
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-8">Dashboard</h2>
          <nav className="space-y-2">
            {['Overview', 'Analytics', 'Reports', 'Settings'].map((item) => (
              <a
                key={item}
                href="#"
                className="
                  block px-4 py-3
                  rounded-lg
                  hover:bg-gray-800
                  transition-colors
                "
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="
          bg-white shadow-sm
          sticky top-0 z-30
        ">
          <div className="
            flex items-center justify-between
            px-4 sm:px-6 lg:px-8
            h-16
          ">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-semibold">Overview</h1>
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Stats grid */}
          <div className="
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
            gap-4 sm:gap-6
            mb-8
          ">
            {[
              { label: 'Total Users', value: '1,234', change: '+12%' },
              { label: 'Revenue', value: '$45.2K', change: '+8%' },
              { label: 'Orders', value: '892', change: '+23%' },
              { label: 'Conversion', value: '3.2%', change: '+0.5%' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-4 sm:p-6 rounded-lg shadow"
              >
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Revenue Chart
            </h3>
            <div className="h-64 sm:h-80 bg-gray-100 rounded flex items-center justify-center">
              Chart placeholder
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
```

### Blog Layout

```tsx
export default function BlogLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="
        bg-gradient-to-r from-purple-600 to-blue-600
        text-white
        py-12 sm:py-16 md:py-20 lg:py-24
      ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
            font-bold mb-4
          ">
            Our Blog
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl opacity-90">
            Latest articles and insights
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="
          grid grid-cols-1 lg:grid-cols-3
          gap-8 lg:gap-12
        ">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {[1, 2, 3].map((i) => (
              <article
                key={i}
                className="
                  bg-white border border-gray-200 rounded-lg
                  overflow-hidden
                  hover:shadow-lg transition-shadow
                "
              >
                <img
                  src={`/blog${i}.jpg`}
                  alt="Blog post"
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>Jan 15, 2024</span>
                    <span>•</span>
                    <span>5 min read</span>
                  </div>
                  <h2 className="
                    text-xl sm:text-2xl md:text-3xl
                    font-bold mb-3
                    hover:text-blue-600 cursor-pointer
                  ">
                    Blog Post Title {i}
                  </h2>
                  <p className="
                    text-sm sm:text-base
                    text-gray-600 mb-4
                    line-clamp-3
                  ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                  </p>
                  <button className="
                    text-blue-600 font-medium
                    hover:text-blue-700
                  ">
                    Read more →
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 sm:space-y-8">
            {/* Search */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Search</h3>
              <input
                type="search"
                placeholder="Search articles..."
                className="
                  w-full px-4 py-2
                  border border-gray-300 rounded-lg
                  focus:ring-2 focus:ring-blue-500
                "
              />
            </div>

            {/* Categories */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {['Technology', 'Design', 'Business', 'Marketing'].map((cat) => (
                  <a
                    key={cat}
                    href="#"
                    className="
                      block px-3 py-2
                      hover:bg-white rounded
                      transition-colors
                    "
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>

            {/* Popular posts */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Popular Posts</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <img
                      src={`/thumb${i}.jpg`}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-medium line-clamp-2 mb-1">
                        Popular Post Title {i}
                      </h4>
                      <p className="text-xs text-gray-600">Jan {i}, 2024</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
```

### Pricing Table

```tsx
export default function PricingTable() {
  const plans = [
    {
      name: 'Basic',
      price: '$9',
      features: ['10 Projects', '5GB Storage', 'Email Support'],
    },
    {
      name: 'Pro',
      price: '$29',
      features: ['Unlimited Projects', '50GB Storage', 'Priority Support', 'Advanced Analytics'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      features: ['Unlimited Everything', 'Dedicated Support', 'Custom Integration', 'SLA'],
    },
  ]

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="
            text-3xl sm:text-4xl md:text-5xl
            font-bold mb-4
          ">
            Choose Your Plan
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>

        <div className="
          grid grid-cols-1 md:grid-cols-3
          gap-6 sm:gap-8
          max-w-6xl mx-auto
        ">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                bg-white rounded-xl shadow-lg
                p-6 sm:p-8
                ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}
                hover:shadow-2xl transition-all
              `}
            >
              {plan.popular && (
                <span className="
                  inline-block
                  px-3 py-1 mb-4
                  bg-blue-500 text-white
                  text-xs font-semibold rounded-full
                ">
                  POPULAR
                </span>
              )}
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl sm:text-5xl font-bold">
                  {plan.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`
                w-full py-3 sm:py-4
                font-semibold rounded-lg
                transition-colors
                ${plan.popular
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }
              `}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

### Contact Form with Map

```tsx
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="
              text-3xl sm:text-4xl md:text-5xl
              font-bold mb-4
            ">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-gray-600">
              We'd love to hear from you
            </p>
          </div>

          <div className="
            grid grid-cols-1 lg:grid-cols-2
            gap-8 lg:gap-12
          ">
            {/* Contact form */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="
                      w-full px-4 py-3
                      border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="
                      w-full px-4 py-3
                      border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="
                      w-full px-4 py-3
                      border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    "
                  />
                </div>
                <button className="
                  w-full py-3
                  bg-blue-500 hover:bg-blue-600
                  text-white font-semibold rounded-lg
                  transition-colors
                ">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">123 Main St, City, Country</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-600">contact@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="
                bg-gray-200 rounded-lg
                h-64 sm:h-80
                flex items-center justify-center
              ">
                <p className="text-gray-500">Map placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Summary

**Key Principles:**
- **Mobile-First**: Start with mobile, enhance for desktop
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Flexible Layouts**: Use flex and grid with responsive columns
- **Spacing**: Scale padding, margin, and gaps across breakpoints
- **Typography**: Adjust font sizes and line heights
- **Show/Hide**: Display different content per screen size

**Common Patterns:**
- `flex flex-col md:flex-row` - Stack on mobile, row on desktop
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` - Responsive grid
- `hidden md:block` - Desktop only
- `block md:hidden` - Mobile only
- `text-sm sm:text-base md:text-lg` - Responsive text
- `p-4 sm:p-6 md:p-8` - Responsive spacing
- `w-full md:w-1/2 lg:w-1/3` - Responsive width

**Best Practices:**
- Test on real devices
- Use container with max-width
- Maintain touch targets (min 44x44px)
- Optimize images for different screens
- Use aspect-ratio for consistent layouts
- Implement smooth transitions
- Consider landscape orientation
- Test with different content lengths
- Use semantic HTML
- Ensure accessibility (ARIA labels, keyboard navigation)

**Performance Tips:**
- Lazy load images
- Use responsive images (srcset)
- Minimize layout shifts
- Optimize for Core Web Vitals
- Use CSS containment
- Defer non-critical CSS
- Implement skeleton screens
- Use intersection observer for animations
