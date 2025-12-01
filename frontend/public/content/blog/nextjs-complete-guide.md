# Next.js Complete Guide - Beginner to Professional

A comprehensive guide to mastering Next.js with real-world examples and best practices.

---

## What is Next.js?

Next.js is a React framework for building full-stack web applications with:
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- File-based routing
- Image optimization
- Built-in CSS support

---

## Installation & Setup

### Create New Project

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

### Project Structure

```
my-app/
├── app/              # App Router (Next.js 13+)
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── api/          # API routes
├── public/           # Static files
├── components/       # React components
├── lib/              # Utility functions
└── next.config.js    # Next.js config
```

---

## Routing

### File-Based Routing

```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── blog/
│   ├── page.tsx          → /blog
│   └── [slug]/
│       └── page.tsx      → /blog/:slug
└── dashboard/
    ├── layout.tsx
    └── page.tsx          → /dashboard
```

### Basic Page

```typescript
// app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js</h1>
    </main>
  );
}
```

### Dynamic Routes

```typescript
// app/blog/[slug]/page.tsx
interface PageProps {
  params: { slug: string };
}

export default function BlogPost({ params }: PageProps) {
  return <h1>Post: {params.slug}</h1>;
}

// Generate static paths
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

### Catch-All Routes

```typescript
// app/docs/[...slug]/page.tsx
interface PageProps {
  params: { slug: string[] };
}

export default function Docs({ params }: PageProps) {
  // /docs/a/b/c → params.slug = ['a', 'b', 'c']
  return <div>{params.slug.join('/')}</div>;
}
```

### Route Groups

```
app/
├── (marketing)/
│   ├── about/page.tsx    → /about
│   └── contact/page.tsx  → /contact
└── (shop)/
    ├── products/page.tsx → /products
    └── cart/page.tsx     → /cart
```

---

## Layouts

### Root Layout

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>Header</header>
        {children}
        <footer>Footer</footer>
      </body>
    </html>
  );
}
```

### Nested Layouts

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <main>{children}</main>
    </div>
  );
}
```

### Templates

```typescript
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

---

## Data Fetching

### Server Components (Default)

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store', // Dynamic
  });
  return res.json();
}

export default async function Posts() {
  const posts = await getPosts();
  
  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Caching Strategies

```typescript
// No caching (always fresh)
fetch(url, { cache: 'no-store' });

// Cache forever
fetch(url, { cache: 'force-cache' });

// Revalidate every 60 seconds
fetch(url, { next: { revalidate: 60 } });

// Revalidate on-demand
fetch(url, { next: { tags: ['posts'] } });
```

### Client Components

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function ClientPosts() {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts);
  }, []);
  
  return (
    <ul>
      {posts.map((post: any) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Parallel Data Fetching

```typescript
async function getUser() {
  const res = await fetch('https://api.example.com/user');
  return res.json();
}

async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function Dashboard() {
  // Fetch in parallel
  const [user, posts] = await Promise.all([
    getUser(),
    getPosts(),
  ]);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## API Routes

### Basic API Route

```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello World' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ data: body });
}
```

### Dynamic API Routes

```typescript
// app/api/posts/[id]/route.ts
interface Context {
  params: { id: string };
}

export async function GET(request: Request, { params }: Context) {
  const post = await getPost(params.id);
  return NextResponse.json(post);
}

export async function DELETE(request: Request, { params }: Context) {
  await deletePost(params.id);
  return NextResponse.json({ success: true });
}
```

### Request & Response

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Query params
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  
  // Headers
  const token = request.headers.get('authorization');
  
  // Cookies
  const session = request.cookies.get('session');
  
  return NextResponse.json({ query, token, session });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Set headers
  const response = NextResponse.json({ success: true });
  response.headers.set('X-Custom-Header', 'value');
  
  // Set cookies
  response.cookies.set('session', 'token', {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  
  return response;
}
```

---

## Real-World Example: Blog Platform

### Database Schema

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

```prisma
// prisma/schema.prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model User {
  id    String @id @default(cuid())
  email String @unique
  name  String
  posts Post[]
}
```

### Blog List Page

```typescript
// app/blog/page.tsx
import Link from 'next/link';
import prisma from '@/lib/db';

async function getPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function BlogPage() {
  const posts = await getPosts();
  
  return (
    <div>
      <h1>Blog Posts</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <article key={post.id} className="border p-4 rounded">
            <Link href={`/blog/${post.id}`}>
              <h2 className="text-2xl font-bold">{post.title}</h2>
            </Link>
            <p className="text-gray-600">By {post.author.name}</p>
            <p className="mt-2">{post.content.substring(0, 150)}...</p>
          </article>
        ))}
      </div>
    </div>
  );
}
```

### Blog Post Page

```typescript
// app/blog/[id]/page.tsx
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';

async function getPost(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  });
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: post.title,
    description: post.content.substring(0, 160),
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  
  if (!post) notFound();
  
  return (
    <article>
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p className="text-gray-600 mt-2">
        By {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-8 prose">{post.content}</div>
    </article>
  );
}
```

### Create Post API

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { title, content, authorId } = await request.json();
    
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
```

### Create Post Form

```typescript
// app/blog/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
      authorId: 'user-id', // Get from session
    };
    
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (res.ok) {
      router.push('/blog');
      router.refresh();
    }
    
    setLoading(false);
  }
  
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          name="title"
          required
          className="w-full border p-2 rounded"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Content</label>
        <textarea
          name="content"
          required
          rows={10}
          className="w-full border p-2 rounded"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

---

## Real-World Example: E-commerce Store

### Product List

```typescript
// app/products/page.tsx
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={300}
              className="w-full"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-lg text-blue-600">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

### Shopping Cart

```typescript
// app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);
  
  const updateQuantity = (id: string, quantity: number) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };
  
  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 border p-4 rounded">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, +e.target.value)}
                      className="w-20 border p-1"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="w-full mt-4 bg-blue-500 text-white py-3 rounded">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

---

## Authentication

### NextAuth.js Setup

```bash
npm install next-auth
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate credentials
        const user = await validateUser(credentials);
        if (user) return user;
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

### Protected Route

```typescript
// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
    </div>
  );
}
```

### Login Component

```typescript
// app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',
    });
  }
  
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Sign In
        </button>
      </form>
      
      <div className="mt-4">
        <button
          onClick={() => signIn('github')}
          className="w-full border py-2 rounded"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
```

---

## Image Optimization

```typescript
import Image from 'next/image';

export default function Gallery() {
  return (
    <div>
      {/* Local image */}
      <Image
        src="/hero.jpg"
        alt="Hero"
        width={1200}
        height={600}
        priority
      />
      
      {/* Remote image */}
      <Image
        src="https://example.com/image.jpg"
        alt="Remote"
        width={800}
        height={400}
        loading="lazy"
      />
      
      {/* Fill container */}
      <div className="relative w-full h-96">
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
      </div>
      
      {/* Responsive */}
      <Image
        src="/responsive.jpg"
        alt="Responsive"
        width={800}
        height={600}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
```

---

## Metadata & SEO

```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'My awesome app',
  keywords: ['Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'My App',
    description: 'My awesome app',
    url: 'https://myapp.com',
    siteName: 'My App',
    images: [
      {
        url: 'https://myapp.com/og.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My App',
    description: 'My awesome app',
    images: ['https://myapp.com/og.jpg'],
  },
};
```

### Dynamic Metadata

```typescript
// app/blog/[id]/page.tsx
export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}
```

---

## Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check authentication
  const token = request.cookies.get('token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Add custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'value');
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

---

## Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_API_URL="https://api.example.com"
SECRET_KEY="your-secret-key"
```

```typescript
// Access in server components
const dbUrl = process.env.DATABASE_URL;

// Access in client components (must start with NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## Performance Optimization

### Lazy Loading

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR for this component
});

export default function Page() {
  return <HeavyComponent />;
}
```

### Streaming & Suspense

```typescript
import { Suspense } from 'react';

async function SlowComponent() {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return <div>Loaded!</div>;
}

export default function Page() {
  return (
    <div>
      <h1>Page Title</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Build Configuration

```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  images: {
    domains: ['example.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};
```

---

## Best Practices

1. **Use Server Components by default** - Only use 'use client' when needed
2. **Optimize images** - Always use next/image
3. **Implement proper caching** - Use revalidate strategies
4. **Handle errors** - Use error.tsx and not-found.tsx
5. **Type safety** - Use TypeScript throughout
6. **SEO optimization** - Implement proper metadata
7. **Performance monitoring** - Use Next.js Analytics
8. **Security** - Validate inputs, use environment variables

---

This guide covers essential Next.js concepts with real-world examples. Master these patterns to build production-ready applications!
