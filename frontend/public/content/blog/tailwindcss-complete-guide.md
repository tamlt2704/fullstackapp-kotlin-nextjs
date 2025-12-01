---
title: "TailwindCSS Complete Guide - Beginner to Professional"
date: "2024-12-13"
category: "Design"
tags: ["TailwindCSS", "CSS", "UI", "UX", "Design", "Frontend"]
---

# TailwindCSS Complete Guide - Beginner to Professional

## What is TailwindCSS?

TailwindCSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without writing CSS.

**Key Benefits**:
- Rapid development with utility classes
- No naming conventions needed
- Consistent design system
- Responsive design built-in
- Small production bundle size
- Highly customizable

---

## Installation & Setup

### Via CDN (Quick Start)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <h1 class="text-3xl font-bold underline">Hello world!</h1>
</body>
</html>
```

### With Build Tools

```bash
# Install Tailwind
npm install -D tailwindcss postcss autoprefixer

# Initialize config
npx tailwindcss init -p
```

### Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Core Concepts

### Utility-First Approach

```html
<!-- Traditional CSS -->
<style>
  .btn {
    background-color: blue;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
  }
</style>
<button class="btn">Click me</button>

<!-- Tailwind CSS -->
<button class="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>
```

### Design Tokens

Tailwind uses a consistent scale for spacing, colors, typography, etc.

```html
<!-- Spacing: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64 -->
<div class="p-4">Padding 1rem</div>
<div class="m-8">Margin 2rem</div>

<!-- Colors: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 -->
<div class="bg-blue-500">Medium blue</div>
<div class="bg-blue-900">Dark blue</div>
```

---

## Layout

### Container

```html
<!-- Centered container with max-width -->
<div class="container mx-auto px-4">
  Content
</div>

<!-- Full width -->
<div class="w-full">Full width</div>

<!-- Max width -->
<div class="max-w-md">Max width medium</div>
<div class="max-w-lg">Max width large</div>
<div class="max-w-xl">Max width extra large</div>
<div class="max-w-7xl">Max width 7xl</div>
```

### Display

```html
<div class="block">Block</div>
<div class="inline-block">Inline block</div>
<div class="inline">Inline</div>
<div class="flex">Flex</div>
<div class="grid">Grid</div>
<div class="hidden">Hidden</div>
```

### Flexbox

```html
<!-- Basic flex -->
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Direction -->
<div class="flex flex-row">Horizontal</div>
<div class="flex flex-col">Vertical</div>
<div class="flex flex-row-reverse">Reverse horizontal</div>

<!-- Justify content -->
<div class="flex justify-start">Start</div>
<div class="flex justify-center">Center</div>
<div class="flex justify-end">End</div>
<div class="flex justify-between">Space between</div>
<div class="flex justify-around">Space around</div>
<div class="flex justify-evenly">Space evenly</div>

<!-- Align items -->
<div class="flex items-start">Top</div>
<div class="flex items-center">Middle</div>
<div class="flex items-end">Bottom</div>
<div class="flex items-stretch">Stretch</div>

<!-- Wrap -->
<div class="flex flex-wrap">Wrap</div>
<div class="flex flex-nowrap">No wrap</div>

<!-- Gap -->
<div class="flex gap-4">Gap between items</div>
<div class="flex gap-x-4 gap-y-2">Different horizontal/vertical gap</div>

<!-- Flex grow/shrink -->
<div class="flex">
  <div class="flex-1">Grows</div>
  <div class="flex-none">Fixed</div>
</div>
```

### Grid

```html
<!-- Basic grid -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- Responsive columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Item</div>
</div>

<!-- Column span -->
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-2">Spans 2 columns</div>
  <div>1 column</div>
</div>

<!-- Row span -->
<div class="grid grid-rows-3 gap-4">
  <div class="row-span-2">Spans 2 rows</div>
  <div>1 row</div>
</div>

<!-- Auto-fit columns -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
  <div>Auto-sizing items</div>
</div>
```

### Position

```html
<!-- Static (default) -->
<div class="static">Static</div>

<!-- Relative -->
<div class="relative top-4 left-4">Relative</div>

<!-- Absolute -->
<div class="relative">
  <div class="absolute top-0 right-0">Absolute</div>
</div>

<!-- Fixed -->
<div class="fixed bottom-4 right-4">Fixed</div>

<!-- Sticky -->
<div class="sticky top-0">Sticky header</div>

<!-- Inset -->
<div class="absolute inset-0">Full coverage</div>
<div class="absolute inset-x-0 top-0">Top bar</div>
<div class="absolute inset-y-0 right-0">Right sidebar</div>
```

---

## Spacing

### Padding & Margin

```html
<!-- All sides -->
<div class="p-4">Padding all sides</div>
<div class="m-4">Margin all sides</div>

<!-- Specific sides -->
<div class="pt-4">Padding top</div>
<div class="pr-4">Padding right</div>
<div class="pb-4">Padding bottom</div>
<div class="pl-4">Padding left</div>

<!-- Horizontal/Vertical -->
<div class="px-4">Padding horizontal</div>
<div class="py-4">Padding vertical</div>
<div class="mx-auto">Margin horizontal auto (center)</div>

<!-- Negative margin -->
<div class="-mt-4">Negative margin top</div>

<!-- Space between -->
<div class="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

---

## Typography

### Font Family

```html
<p class="font-sans">Sans-serif</p>
<p class="font-serif">Serif</p>
<p class="font-mono">Monospace</p>
```

### Font Size

```html
<p class="text-xs">Extra small</p>
<p class="text-sm">Small</p>
<p class="text-base">Base</p>
<p class="text-lg">Large</p>
<p class="text-xl">Extra large</p>
<p class="text-2xl">2xl</p>
<p class="text-3xl">3xl</p>
<p class="text-4xl">4xl</p>
<p class="text-5xl">5xl</p>
<p class="text-6xl">6xl</p>
```

### Font Weight

```html
<p class="font-thin">Thin (100)</p>
<p class="font-extralight">Extra light (200)</p>
<p class="font-light">Light (300)</p>
<p class="font-normal">Normal (400)</p>
<p class="font-medium">Medium (500)</p>
<p class="font-semibold">Semibold (600)</p>
<p class="font-bold">Bold (700)</p>
<p class="font-extrabold">Extra bold (800)</p>
<p class="font-black">Black (900)</p>
```

### Text Alignment & Decoration

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>
<p class="text-justify">Justified</p>

<p class="underline">Underlined</p>
<p class="line-through">Strikethrough</p>
<p class="no-underline">No underline</p>

<p class="uppercase">UPPERCASE</p>
<p class="lowercase">lowercase</p>
<p class="capitalize">Capitalize Each Word</p>
```

### Line Height & Letter Spacing

```html
<p class="leading-none">No line height</p>
<p class="leading-tight">Tight line height</p>
<p class="leading-normal">Normal line height</p>
<p class="leading-relaxed">Relaxed line height</p>
<p class="leading-loose">Loose line height</p>

<p class="tracking-tighter">Tighter spacing</p>
<p class="tracking-tight">Tight spacing</p>
<p class="tracking-normal">Normal spacing</p>
<p class="tracking-wide">Wide spacing</p>
<p class="tracking-wider">Wider spacing</p>
<p class="tracking-widest">Widest spacing</p>
```

---

## Colors

### Text Color

```html
<p class="text-black">Black text</p>
<p class="text-white">White text</p>
<p class="text-gray-500">Gray text</p>
<p class="text-red-500">Red text</p>
<p class="text-blue-500">Blue text</p>
<p class="text-green-500">Green text</p>
<p class="text-yellow-500">Yellow text</p>
<p class="text-purple-500">Purple text</p>
<p class="text-pink-500">Pink text</p>
```

### Background Color

```html
<div class="bg-white">White background</div>
<div class="bg-gray-100">Light gray</div>
<div class="bg-blue-500">Blue background</div>
<div class="bg-gradient-to-r from-blue-500 to-purple-500">Gradient</div>
```

### Border Color

```html
<div class="border border-gray-300">Gray border</div>
<div class="border-2 border-blue-500">Blue border</div>
```

### Opacity

```html
<div class="bg-blue-500 opacity-50">50% opacity</div>
<div class="bg-blue-500/50">50% opacity (modern)</div>
<div class="text-black/75">75% text opacity</div>
```

---

## Borders & Shadows

### Border Width

```html
<div class="border">1px border</div>
<div class="border-2">2px border</div>
<div class="border-4">4px border</div>
<div class="border-8">8px border</div>

<!-- Specific sides -->
<div class="border-t">Top border</div>
<div class="border-r">Right border</div>
<div class="border-b">Bottom border</div>
<div class="border-l">Left border</div>
```

### Border Radius

```html
<div class="rounded">Small radius</div>
<div class="rounded-md">Medium radius</div>
<div class="rounded-lg">Large radius</div>
<div class="rounded-xl">Extra large radius</div>
<div class="rounded-2xl">2xl radius</div>
<div class="rounded-full">Full circle</div>

<!-- Specific corners -->
<div class="rounded-t-lg">Top corners</div>
<div class="rounded-tl-lg">Top left corner</div>
```

### Box Shadow

```html
<div class="shadow-sm">Small shadow</div>
<div class="shadow">Default shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">Extra large shadow</div>
<div class="shadow-2xl">2xl shadow</div>
<div class="shadow-inner">Inner shadow</div>
<div class="shadow-none">No shadow</div>
```

---

## Responsive Design

### Breakpoints

```
sm: 640px   - Small devices
md: 768px   - Medium devices
lg: 1024px  - Large devices
xl: 1280px  - Extra large devices
2xl: 1536px - 2xl devices
```

### Mobile-First Approach

```html
<!-- Stack on mobile, row on desktop -->
<div class="flex flex-col md:flex-row">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Different sizes -->
<div class="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<!-- Hide/show at breakpoints -->
<div class="hidden md:block">Visible on medium+</div>
<div class="block md:hidden">Visible on mobile only</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div>Item</div>
</div>

<!-- Responsive padding -->
<div class="p-4 md:p-8 lg:p-12">
  Responsive padding
</div>
```

---

## Interactive States

### Hover

```html
<button class="bg-blue-500 hover:bg-blue-700">
  Hover me
</button>

<div class="text-gray-700 hover:text-blue-500">
  Hover text
</div>

<div class="scale-100 hover:scale-110 transition">
  Scale on hover
</div>
```

### Focus

```html
<input class="border focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />

<button class="focus:outline-none focus:ring-4 focus:ring-blue-300">
  Focus ring
</button>
```

### Active

```html
<button class="bg-blue-500 active:bg-blue-800">
  Click me
</button>
```

### Disabled

```html
<button class="bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed" disabled>
  Disabled
</button>
```

### Group Hover

```html
<div class="group">
  <img class="group-hover:opacity-75" />
  <p class="opacity-0 group-hover:opacity-100">
    Appears on hover
  </p>
</div>
```

---

## Transitions & Animations

### Transitions

```html
<button class="transition duration-300 ease-in-out hover:scale-110">
  Smooth transition
</button>

<div class="transition-all duration-500">
  Transition all properties
</div>

<div class="transition-colors duration-200">
  Transition colors only
</div>

<div class="transition-transform duration-300">
  Transition transform only
</div>
```

### Transform

```html
<!-- Scale -->
<div class="scale-50">50% scale</div>
<div class="scale-100">Normal scale</div>
<div class="scale-150">150% scale</div>

<!-- Rotate -->
<div class="rotate-45">45 degrees</div>
<div class="rotate-90">90 degrees</div>
<div class="-rotate-45">-45 degrees</div>

<!-- Translate -->
<div class="translate-x-4">Move right</div>
<div class="translate-y-4">Move down</div>
<div class="-translate-x-1/2">Move left 50%</div>

<!-- Skew -->
<div class="skew-x-12">Skew X</div>
<div class="skew-y-6">Skew Y</div>
```

### Animations

```html
<div class="animate-spin">Spinning</div>
<div class="animate-ping">Pinging</div>
<div class="animate-pulse">Pulsing</div>
<div class="animate-bounce">Bouncing</div>
```

---

## Forms

### Input Fields

```html
<input 
  type="text"
  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter text"
/>

<!-- With label -->
<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    Email
  </label>
  <input 
    type="email"
    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
  />
</div>

<!-- With error -->
<div class="space-y-2">
  <input 
    type="text"
    class="w-full px-4 py-2 border border-red-500 rounded-lg"
  />
  <p class="text-sm text-red-500">This field is required</p>
</div>
```

### Buttons

```html
<!-- Primary button -->
<button class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
  Primary
</button>

<!-- Secondary button -->
<button class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
  Secondary
</button>

<!-- Outline button -->
<button class="px-6 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition">
  Outline
</button>

<!-- Icon button -->
<button class="p-2 rounded-full hover:bg-gray-100 transition">
  <svg class="w-6 h-6">...</svg>
</button>

<!-- Button sizes -->
<button class="px-3 py-1 text-sm">Small</button>
<button class="px-4 py-2">Medium</button>
<button class="px-6 py-3 text-lg">Large</button>
```

### Select & Textarea

```html
<select class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<textarea 
  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
  rows="4"
></textarea>
```

### Checkbox & Radio

```html
<label class="flex items-center space-x-2">
  <input type="checkbox" class="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500" />
  <span>Accept terms</span>
</label>

<label class="flex items-center space-x-2">
  <input type="radio" name="option" class="w-4 h-4 text-blue-500 focus:ring-2 focus:ring-blue-500" />
  <span>Option 1</span>
</label>
```


---

## Component Patterns

### Card

```html
<div class="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
  <img class="w-full" src="image.jpg" alt="Card image" />
  <div class="px-6 py-4">
    <h2 class="font-bold text-xl mb-2">Card Title</h2>
    <p class="text-gray-700 text-base">
      Card description goes here.
    </p>
  </div>
  <div class="px-6 py-4">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
      #tag
    </span>
  </div>
</div>
```

### Modal

```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Modal Title</h2>
      <button class="text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6">×</svg>
      </button>
    </div>
    <p class="text-gray-700 mb-6">Modal content</p>
    <div class="flex justify-end space-x-4">
      <button class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
        Cancel
      </button>
      <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Navigation Bar

```html
<nav class="bg-white shadow-lg">
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <div class="flex items-center">
        <a href="#" class="text-xl font-bold text-gray-800">Logo</a>
      </div>
      <div class="hidden md:flex space-x-8">
        <a href="#" class="text-gray-700 hover:text-blue-500 transition">Home</a>
        <a href="#" class="text-gray-700 hover:text-blue-500 transition">About</a>
        <a href="#" class="text-gray-700 hover:text-blue-500 transition">Services</a>
        <a href="#" class="text-gray-700 hover:text-blue-500 transition">Contact</a>
      </div>
      <button class="md:hidden">
        <svg class="w-6 h-6">☰</svg>
      </button>
    </div>
  </div>
</nav>
```

### Hero Section

```html
<section class="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
  <div class="max-w-7xl mx-auto px-4 text-center">
    <h1 class="text-5xl md:text-6xl font-bold mb-6">
      Welcome to Our Site
    </h1>
    <p class="text-xl md:text-2xl mb-8 text-blue-100">
      Build amazing things with TailwindCSS
    </p>
    <div class="flex justify-center space-x-4">
      <button class="px-8 py-3 bg-white text-blue-500 rounded-lg font-semibold hover:bg-gray-100 transition">
        Get Started
      </button>
      <button class="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-500 transition">
        Learn More
      </button>
    </div>
  </div>
</section>
```

### Alert/Notification

```html
<!-- Success -->
<div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
  <p class="font-bold">Success</p>
  <p>Your changes have been saved.</p>
</div>

<!-- Error -->
<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
  <p class="font-bold">Error</p>
  <p>Something went wrong.</p>
</div>

<!-- Warning -->
<div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded" role="alert">
  <p class="font-bold">Warning</p>
  <p>Please review your input.</p>
</div>

<!-- Info -->
<div class="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded" role="alert">
  <p class="font-bold">Info</p>
  <p>New updates available.</p>
</div>
```

### Badge

```html
<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
  Badge
</span>

<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Active
</span>

<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
  Inactive
</span>
```

### Dropdown Menu

```html
<div class="relative inline-block">
  <button class="px-4 py-2 bg-white border rounded-lg flex items-center space-x-2">
    <span>Menu</span>
    <svg class="w-4 h-4">▼</svg>
  </button>
  <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
    <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</a>
    <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Settings</a>
    <a href="#" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</a>
  </div>
</div>
```

### Tabs

```html
<div class="w-full">
  <div class="flex border-b">
    <button class="px-4 py-2 text-blue-500 border-b-2 border-blue-500 font-medium">
      Tab 1
    </button>
    <button class="px-4 py-2 text-gray-500 hover:text-gray-700">
      Tab 2
    </button>
    <button class="px-4 py-2 text-gray-500 hover:text-gray-700">
      Tab 3
    </button>
  </div>
  <div class="p-4">
    Tab content goes here
  </div>
</div>
```

### Breadcrumb

```html
<nav class="flex" aria-label="Breadcrumb">
  <ol class="inline-flex items-center space-x-1 md:space-x-3">
    <li class="inline-flex items-center">
      <a href="#" class="text-gray-700 hover:text-blue-500">Home</a>
    </li>
    <li>
      <div class="flex items-center">
        <span class="mx-2 text-gray-400">/</span>
        <a href="#" class="text-gray-700 hover:text-blue-500">Category</a>
      </div>
    </li>
    <li>
      <div class="flex items-center">
        <span class="mx-2 text-gray-400">/</span>
        <span class="text-gray-500">Current Page</span>
      </div>
    </li>
  </ol>
</nav>
```

### Pagination

```html
<div class="flex items-center justify-center space-x-2">
  <button class="px-3 py-1 border rounded hover:bg-gray-100">Previous</button>
  <button class="px-3 py-1 bg-blue-500 text-white rounded">1</button>
  <button class="px-3 py-1 border rounded hover:bg-gray-100">2</button>
  <button class="px-3 py-1 border rounded hover:bg-gray-100">3</button>
  <button class="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
</div>
```

### Progress Bar

```html
<div class="w-full bg-gray-200 rounded-full h-2.5">
  <div class="bg-blue-500 h-2.5 rounded-full" style="width: 45%"></div>
</div>

<!-- With label -->
<div class="w-full">
  <div class="flex justify-between mb-1">
    <span class="text-sm font-medium text-gray-700">Progress</span>
    <span class="text-sm font-medium text-gray-700">45%</span>
  </div>
  <div class="w-full bg-gray-200 rounded-full h-2.5">
    <div class="bg-blue-500 h-2.5 rounded-full" style="width: 45%"></div>
  </div>
</div>
```

### Skeleton Loader

```html
<div class="animate-pulse">
  <div class="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
  <div class="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
  <div class="h-4 bg-gray-300 rounded w-5/6"></div>
</div>
```

### Avatar

```html
<!-- Image avatar -->
<img class="w-10 h-10 rounded-full" src="avatar.jpg" alt="Avatar" />

<!-- With status indicator -->
<div class="relative">
  <img class="w-10 h-10 rounded-full" src="avatar.jpg" alt="Avatar" />
  <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
</div>

<!-- Initials avatar -->
<div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
  AB
</div>

<!-- Avatar group -->
<div class="flex -space-x-2">
  <img class="w-10 h-10 rounded-full border-2 border-white" src="avatar1.jpg" />
  <img class="w-10 h-10 rounded-full border-2 border-white" src="avatar2.jpg" />
  <img class="w-10 h-10 rounded-full border-2 border-white" src="avatar3.jpg" />
</div>
```

---

## Advanced Techniques

### Dark Mode

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}
```

```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <h1 class="text-2xl">Dark mode support</h1>
</div>

<button class="bg-blue-500 dark:bg-blue-700">
  Button
</button>
```

### Custom Colors

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
        brand: '#ff6b6b',
      }
    }
  }
}
```

```html
<div class="bg-primary-500 text-brand">Custom colors</div>
```

### Custom Spacing

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      }
    }
  }
}
```

### Custom Fonts

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      }
    }
  }
}
```

```html
<h1 class="font-display">Display Font</h1>
<p class="font-body">Body Font</p>
```

### Custom Breakpoints

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    }
  }
}
```

### Arbitrary Values

```html
<div class="w-[137px]">Custom width</div>
<div class="top-[117px]">Custom position</div>
<div class="bg-[#1da1f2]">Custom color</div>
<div class="text-[14px]">Custom font size</div>
<div class="grid-cols-[200px_1fr_1fr]">Custom grid</div>
```

### @apply Directive

```css
/* styles.css */
@layer components {
  .btn-primary {
    @apply px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-lg p-6;
  }
  
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }
}
```

```html
<button class="btn-primary">Click me</button>
<div class="card">Card content</div>
<input class="input-field" />
```

### Plugins

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ]
}
```

---

## UI/UX Best Practices

### 1. Consistent Spacing

```html
<!-- Use consistent spacing scale -->
<div class="space-y-4">
  <div class="p-4">Section 1</div>
  <div class="p-4">Section 2</div>
  <div class="p-4">Section 3</div>
</div>
```

### 2. Visual Hierarchy

```html
<article class="space-y-4">
  <h1 class="text-4xl font-bold text-gray-900">Main Title</h1>
  <h2 class="text-2xl font-semibold text-gray-800">Subtitle</h2>
  <p class="text-base text-gray-600 leading-relaxed">Body text</p>
  <p class="text-sm text-gray-500">Secondary text</p>
</article>
```

### 3. Color Contrast

```html
<!-- Good contrast -->
<div class="bg-blue-600 text-white">High contrast</div>
<div class="bg-gray-100 text-gray-900">Good readability</div>

<!-- Avoid low contrast -->
<!-- <div class="bg-gray-200 text-gray-300">Poor contrast</div> -->
```

### 4. Whitespace

```html
<section class="py-16 px-4">
  <div class="max-w-4xl mx-auto space-y-8">
    <h2 class="text-3xl font-bold mb-6">Section Title</h2>
    <p class="text-lg leading-relaxed">
      Proper whitespace improves readability
    </p>
  </div>
</section>
```

### 5. Responsive Images

```html
<img 
  class="w-full h-auto object-cover rounded-lg"
  src="image.jpg"
  alt="Description"
/>

<!-- Aspect ratio -->
<div class="aspect-w-16 aspect-h-9">
  <img class="object-cover" src="image.jpg" />
</div>
```

### 6. Focus States

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded focus:outline-none focus:ring-4 focus:ring-blue-300">
  Accessible Button
</button>

<input class="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
```

### 7. Loading States

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed" disabled>
  <svg class="animate-spin h-5 w-5 mr-2 inline-block" viewBox="0 0 24 24">
    <!-- spinner icon -->
  </svg>
  Loading...
</button>
```

### 8. Empty States

```html
<div class="flex flex-col items-center justify-center py-12 text-center">
  <svg class="w-16 h-16 text-gray-400 mb-4"><!-- icon --></svg>
  <h3 class="text-lg font-medium text-gray-900 mb-2">No items found</h3>
  <p class="text-gray-500 mb-4">Get started by creating a new item</p>
  <button class="px-4 py-2 bg-blue-500 text-white rounded">
    Create Item
  </button>
</div>
```

### 9. Micro-interactions

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded transform transition hover:scale-105 active:scale-95">
  Interactive Button
</button>

<div class="group cursor-pointer">
  <img class="transition-transform group-hover:scale-110" src="image.jpg" />
  <p class="transition-colors group-hover:text-blue-500">Hover me</p>
</div>
```

### 10. Accessibility

```html
<!-- Semantic HTML -->
<nav aria-label="Main navigation">
  <ul class="flex space-x-4">
    <li><a href="#" class="text-gray-700 hover:text-blue-500">Home</a></li>
  </ul>
</nav>

<!-- ARIA labels -->
<button aria-label="Close modal" class="p-2">
  <svg class="w-6 h-6">×</svg>
</button>

<!-- Skip to content -->
<a href="#main-content" class="sr-only focus:not-sr-only">
  Skip to content
</a>
```

---

## Real-World Examples

### Landing Page

```html
<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
      <div class="text-2xl font-bold text-blue-600">Brand</div>
      <div class="hidden md:flex space-x-8">
        <a href="#" class="text-gray-700 hover:text-blue-600">Features</a>
        <a href="#" class="text-gray-700 hover:text-blue-600">Pricing</a>
        <a href="#" class="text-gray-700 hover:text-blue-600">About</a>
      </div>
      <button class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Sign Up
      </button>
    </nav>
  </header>

  <!-- Hero -->
  <section class="max-w-7xl mx-auto px-4 py-20 text-center">
    <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
      Build Something Amazing
    </h1>
    <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
      The fastest way to build modern web applications
    </p>
    <div class="flex justify-center space-x-4">
      <button class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Get Started
      </button>
      <button class="px-8 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition">
        Learn More
      </button>
    </div>
  </section>

  <!-- Features -->
  <section class="max-w-7xl mx-auto px-4 py-20">
    <h2 class="text-3xl font-bold text-center mb-12">Features</h2>
    <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-blue-600"><!-- icon --></svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Fast</h3>
        <p class="text-gray-600">Lightning fast performance</p>
      </div>
      <!-- More feature cards -->
    </div>
  </section>
</div>
```

### Dashboard

```html
<div class="flex h-screen bg-gray-100">
  <!-- Sidebar -->
  <aside class="w-64 bg-white shadow-lg">
    <div class="p-4">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
    </div>
    <nav class="mt-4">
      <a href="#" class="flex items-center px-4 py-3 bg-blue-50 text-blue-600 border-r-4 border-blue-600">
        <svg class="w-5 h-5 mr-3"><!-- icon --></svg>
        Overview
      </a>
      <a href="#" class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50">
        <svg class="w-5 h-5 mr-3"><!-- icon --></svg>
        Analytics
      </a>
    </nav>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 overflow-y-auto">
    <header class="bg-white shadow-sm">
      <div class="flex justify-between items-center px-8 py-4">
        <h2 class="text-2xl font-semibold">Overview</h2>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg">
          New Report
        </button>
      </div>
    </header>

    <div class="p-8">
      <!-- Stats -->
      <div class="grid md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <p class="text-gray-500 text-sm">Total Users</p>
          <p class="text-3xl font-bold mt-2">1,234</p>
          <p class="text-green-500 text-sm mt-2">↑ 12% from last month</p>
        </div>
        <!-- More stat cards -->
      </div>

      <!-- Chart -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Revenue</h3>
        <div class="h-64 bg-gray-100 rounded"></div>
      </div>
    </div>
  </main>
</div>
```

### E-commerce Product Card

```html
<div class="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden group">
  <div class="relative overflow-hidden">
    <img 
      class="w-full h-64 object-cover transform transition group-hover:scale-110" 
      src="product.jpg" 
      alt="Product"
    />
    <div class="absolute top-4 right-4">
      <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
        -20%
      </span>
    </div>
    <button class="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition">
      <svg class="w-6 h-6 text-red-500">♥</svg>
    </button>
  </div>
  
  <div class="p-6">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm text-gray-500">Category</span>
      <div class="flex items-center">
        <svg class="w-4 h-4 text-yellow-400">★</svg>
        <span class="ml-1 text-sm text-gray-600">4.5</span>
      </div>
    </div>
    
    <h3 class="text-xl font-semibold text-gray-800 mb-2">Product Name</h3>
    <p class="text-gray-600 text-sm mb-4">Short product description</p>
    
    <div class="flex items-center justify-between">
      <div>
        <span class="text-2xl font-bold text-gray-900">$79.99</span>
        <span class="text-sm text-gray-500 line-through ml-2">$99.99</span>
      </div>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Add to Cart
      </button>
    </div>
  </div>
</div>
```

---

## Performance Tips

1. **Purge Unused CSS**: Tailwind automatically removes unused styles in production
2. **Use JIT Mode**: Just-In-Time mode generates styles on-demand
3. **Minimize Custom CSS**: Leverage Tailwind utilities instead
4. **Optimize Images**: Use proper sizing and lazy loading
5. **Enable Build Cache**: Faster subsequent builds

---

## Common Mistakes to Avoid

1. **Over-nesting**: Keep HTML structure simple
2. **Inconsistent Spacing**: Use the spacing scale consistently
3. **Ignoring Responsive Design**: Always test on multiple screen sizes
4. **Poor Color Contrast**: Ensure accessibility
5. **Not Using Components**: Extract repeated patterns
6. **Inline Styles**: Use Tailwind classes instead
7. **Forgetting Dark Mode**: Consider dark mode from the start
8. **Accessibility**: Always include proper ARIA labels and semantic HTML

---

## Resources

- [Official Documentation](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com) - Premium components
- [Headless UI](https://headlessui.com) - Unstyled components
- [Tailwind Play](https://play.tailwindcss.com) - Online playground
- [Tailwind Toolbox](https://www.tailwindtoolbox.com) - Free templates
- [Awesome Tailwind](https://github.com/aniftyco/awesome-tailwindcss) - Curated resources

---

## Quick Reference

```bash
# Common Patterns
flex items-center justify-center    # Center content
grid grid-cols-3 gap-4              # 3-column grid
w-full max-w-7xl mx-auto px-4      # Centered container
hover:bg-blue-700 transition        # Smooth hover effect
focus:ring-2 focus:ring-blue-500   # Focus state
md:flex-row flex-col                # Responsive direction
```

This guide covers everything from basics to professional-level UI/UX design with TailwindCSS. Practice building real components and you'll master it quickly!
