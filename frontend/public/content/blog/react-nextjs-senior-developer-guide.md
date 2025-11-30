---
title: "React & Next.js Senior Developer Complete Guide"
date: "2024-12-05"
category: "Frontend"
tags: ["React", "Next.js", "Senior Developer", "Interview", "JavaScript"]
---

# React & Next.js Senior Developer Complete Guide

*Published on December 5, 2024*

## 1. JavaScript Fundamentals for React

### Core Concepts Every Senior Developer Must Know

#### ES6+ Features
```javascript
// Destructuring
const { name, age } = user;
const [first, second, ...rest] = array;

// Spread/Rest operators
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, newProp: 'value' };

// Template literals
const message = `Hello ${name}, you are ${age} years old`;

// Arrow functions
const add = (a, b) => a + b;
const multiply = (a, b) => {
  return a * b;
};
```

#### Closures and Scope
```javascript
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

#### Promises and Async/Await
```javascript
// Promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('Data'), 1000);
  });
};

// Async/Await
const getData = async () => {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error(error);
  }
};
```

### Q&A: JavaScript Fundamentals

**Q1: What's the difference between `let`, `const`, and `var`?**
A: `var` is function-scoped and hoisted; `let` and `const` are block-scoped. `const` cannot be reassigned but objects/arrays can be mutated.

**Q2: Explain event loop and call stack.**
A: Call stack executes synchronous code. Event loop moves callbacks from task queue to call stack when stack is empty.

**Q3: What's the difference between `==` and `===`?**
A: `==` performs type coercion; `===` checks both value and type without coercion.

**Q4: How does `this` work in JavaScript?**
A: `this` depends on how function is called: method call (object), regular call (global/undefined), arrow functions (lexical binding).

**Q5: What are higher-order functions?**
A: Functions that take other functions as arguments or return functions. Examples: `map`, `filter`, `reduce`.

## 2. React Core Concepts

### Component Fundamentals

#### Functional vs Class Components
```javascript
// Functional Component (Modern)
const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    console.log('Component mounted or updated');
  }, [user]);
  
  return (
    <div>
      <h1>{user.name}</h1>
      {isEditing && <EditForm user={user} />}
    </div>
  );
};

// Class Component (Legacy)
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false };
  }
  
  componentDidMount() {
    console.log('Component mounted');
  }
  
  render() {
    return (
      <div>
        <h1>{this.props.user.name}</h1>
      </div>
    );
  }
}
```

#### Props and State
```javascript
// Props (immutable data from parent)
const Button = ({ onClick, children, variant = 'primary' }) => (
  <button className={`btn btn-${variant}`} onClick={onClick}>
    {children}
  </button>
);

// State (mutable component data)
const Counter = () => {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(prev => prev + 1);
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  );
};
```

### React Hooks Deep Dive

#### useState
```javascript
// Basic usage
const [state, setState] = useState(initialValue);

// Functional updates
const [count, setCount] = useState(0);
setCount(prevCount => prevCount + 1);

// Object state
const [user, setUser] = useState({ name: '', email: '' });
setUser(prev => ({ ...prev, name: 'John' }));

// Lazy initialization
const [expensiveValue, setExpensiveValue] = useState(() => {
  return computeExpensiveValue();
});
```

#### useEffect
```javascript
// Component lifecycle
useEffect(() => {
  // componentDidMount + componentDidUpdate
  console.log('Component mounted or updated');
  
  return () => {
    // componentWillUnmount
    console.log('Cleanup');
  };
}, []); // Empty dependency array = mount/unmount only

// Conditional effects
useEffect(() => {
  fetchUserData(userId);
}, [userId]); // Only run when userId changes

// Multiple effects
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);

useEffect(() => {
  const timer = setInterval(() => {
    setTime(new Date());
  }, 1000);
  
  return () => clearInterval(timer);
}, []);
```

#### useContext
```javascript
// Create context
const ThemeContext = createContext();

// Provider
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Consumer
const ThemedButton = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button 
      className={`btn-${theme}`}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      Toggle Theme
    </button>
  );
};
```

#### useReducer
```javascript
const initialState = { count: 0, loading: false };

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'setLoading':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <span>{state.count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
};
```

#### Custom Hooks
```javascript
// Custom hook for API calls
const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
};

// Usage
const UserList = () => {
  const { data: users, loading, error } = useApi('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

### Q&A: React Core

**Q1: What's the difference between controlled and uncontrolled components?**
A: Controlled components have their state managed by React (value prop). Uncontrolled components manage their own state internally.

**Q2: When should you use useCallback and useMemo?**
A: `useCallback` memoizes functions to prevent unnecessary re-renders. `useMemo` memoizes expensive calculations. Use when child components depend on these values.

**Q3: What's the difference between useEffect and useLayoutEffect?**
A: `useEffect` runs after DOM mutations (asynchronous). `useLayoutEffect` runs synchronously after DOM mutations but before browser paint.

**Q4: How do you prevent unnecessary re-renders?**
A: Use `React.memo`, `useCallback`, `useMemo`, proper key props, and avoid creating objects/functions in render.

**Q5: What's the purpose of keys in React lists?**
A: Keys help React identify which items have changed, been added, or removed, enabling efficient DOM updates.

## 3. Advanced React Patterns

### Higher-Order Components (HOCs)
```javascript
const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user } = useContext(AuthContext);
    
    if (!user) {
      return <LoginForm />;
    }
    
    return <WrappedComponent {...props} user={user} />;
  };
};

// Usage
const ProtectedDashboard = withAuth(Dashboard);
```

### Render Props
```javascript
const DataFetcher = ({ url, render }) => {
  const { data, loading, error } = useApi(url);
  
  return render({ data, loading, error });
};

// Usage
<DataFetcher 
  url="/api/users" 
  render={({ data, loading, error }) => (
    loading ? <Spinner /> : <UserList users={data} />
  )}
/>
```

### Compound Components
```javascript
const Tabs = ({ children, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

const TabList = ({ children }) => (
  <div className="tab-list">{children}</div>
);

const Tab = ({ index, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button 
      className={activeTab === index ? 'active' : ''}
      onClick={() => setActiveTab(index)}
    >
      {children}
    </button>
  );
};

// Usage
<Tabs defaultTab={0}>
  <TabList>
    <Tab index={0}>Tab 1</Tab>
    <Tab index={1}>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel index={0}>Content 1</TabPanel>
    <TabPanel index={1}>Content 2</TabPanel>
  </TabPanels>
</Tabs>
```

### Error Boundaries
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Q&A: Advanced Patterns

**Q1: When should you use HOCs vs custom hooks?**
A: Custom hooks for stateful logic reuse; HOCs for component enhancement and conditional rendering.

**Q2: What's the difference between React.memo and useMemo?**
A: `React.memo` memoizes entire component; `useMemo` memoizes specific values/calculations.

**Q3: How do you handle errors in React applications?**
A: Error boundaries for component errors, try-catch for async operations, and proper error states in components.

**Q4: What's prop drilling and how do you solve it?**
A: Passing props through multiple component levels. Solve with Context API, state management libraries, or component composition.

**Q5: When should you use useReducer instead of useState?**
A: Complex state logic, multiple state values that depend on each other, or when next state depends on previous state.

## 4. Next.js Fundamentals

### App Router vs Pages Router

#### App Router (Next.js 13+)
```javascript
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// app/page.js
export default function HomePage() {
  return <h1>Welcome to Next.js 13+</h1>;
}

// app/blog/[slug]/page.js
export default function BlogPost({ params }) {
  return <h1>Post: {params.slug}</h1>;
}

// app/api/users/route.js
export async function GET() {
  const users = await fetchUsers();
  return Response.json(users);
}
```

#### Pages Router (Legacy)
```javascript
// pages/_app.js
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// pages/index.js
export default function HomePage() {
  return <h1>Welcome to Next.js</h1>;
}

// pages/blog/[slug].js
export default function BlogPost({ post }) {
  return <h1>{post.title}</h1>;
}

export async function getStaticProps({ params }) {
  const post = await fetchPost(params.slug);
  return { props: { post } };
}
```

### Rendering Methods

#### Static Site Generation (SSG)
```javascript
// Generate at build time
export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const post = await fetchPost(params.slug);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

#### Server-Side Rendering (SSR)
```javascript
// app/users/page.js
export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await fetchUsers(); // Runs on each request
  
  return (
    <div>
      <h1>Users</h1>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

#### Incremental Static Regeneration (ISR)
```javascript
// Revalidate every 60 seconds
export const revalidate = 60;

export default async function ProductsPage() {
  const products = await fetchProducts();
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

#### Client-Side Rendering (CSR)
```javascript
'use client';

import { useState, useEffect } from 'react';

export default function ClientComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  if (!data) return <div>Loading...</div>;
  
  return <div>{data.message}</div>;
}
```

### Data Fetching Patterns

#### Server Components
```javascript
// Runs on server, can access databases directly
export default async function ServerComponent() {
  const data = await db.query('SELECT * FROM users');
  
  return (
    <div>
      {data.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

#### Client Components
```javascript
'use client';

export default function ClientComponent() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

### Q&A: Next.js Fundamentals

**Q1: What's the difference between SSG, SSR, and CSR?**
A: SSG generates at build time, SSR renders on each request, CSR renders in browser. Choose based on data freshness needs.

**Q2: When should you use Server Components vs Client Components?**
A: Server Components for data fetching and SEO; Client Components for interactivity and browser APIs.

**Q3: What's the benefit of ISR?**
A: Combines benefits of SSG (fast) and SSR (fresh data) by regenerating pages in background.

**Q4: How does Next.js handle routing?**
A: File-based routing where folder structure determines routes. App router uses folders, pages router uses files.

**Q5: What's the difference between getStaticProps and getServerSideProps?**
A: `getStaticProps` runs at build time (SSG); `getServerSideProps` runs on each request (SSR).

## 5. Performance Optimization

### React Performance

#### Memoization
```javascript
// React.memo for components
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  return (
    <div>
      {data.map(item => (
        <ComplexItem key={item.id} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
});

// useMemo for expensive calculations
const ExpensiveCalculation = ({ items }) => {
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.value * item.multiplier, 0);
  }, [items]);
  
  return <div>Total: {expensiveValue}</div>;
};

// useCallback for stable function references
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback((id) => {
    console.log('Clicked item:', id);
  }, []);
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ChildComponent onClick={handleClick} />
    </div>
  );
};
```

#### Code Splitting
```javascript
// Dynamic imports
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}

// Route-based splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

#### Virtual Scrolling
```javascript
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### Next.js Performance

#### Image Optimization
```javascript
import Image from 'next/image';

export default function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority // Load immediately
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

#### Font Optimization
```javascript
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

#### Bundle Analysis
```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
});
```

### Q&A: Performance

**Q1: What causes unnecessary re-renders in React?**
A: Creating new objects/functions in render, missing dependencies in useEffect, not using React.memo properly.

**Q2: How do you measure React performance?**
A: React DevTools Profiler, Chrome DevTools, Web Vitals, Lighthouse, and performance.mark() API.

**Q3: What's the difference between lazy loading and code splitting?**
A: Code splitting divides bundle into chunks; lazy loading loads components/resources only when needed.

**Q4: How does Next.js optimize images automatically?**
A: Automatic WebP/AVIF conversion, responsive images, lazy loading, and blur placeholders.

**Q5: What are the Core Web Vitals?**
A: LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift) - key user experience metrics.

## 6. State Management

### Context API
```javascript
// Complex state with useReducer
const AppContext = createContext();

const initialState = {
  user: null,
  theme: 'light',
  notifications: [],
  loading: false,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload] 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  const actions = {
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
    addNotification: (notification) => 
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
    setLoading: (loading) => 
      dispatch({ type: 'SET_LOADING', payload: loading }),
  };
  
  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};
```

### Zustand (Lightweight State Management)
```javascript
import { create } from 'zustand';

const useStore = create((set, get) => ({
  // State
  count: 0,
  user: null,
  todos: [],
  
  // Actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  
  setUser: (user) => set({ user }),
  
  addTodo: (todo) => set((state) => ({
    todos: [...state.todos, { id: Date.now(), ...todo }]
  })),
  
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  
  // Computed values
  completedTodos: () => get().todos.filter(todo => todo.completed),
}));

// Usage
const TodoList = () => {
  const { todos, addTodo, toggleTodo } = useStore();
  
  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id} onClick={() => toggleTodo(todo.id)}>
          {todo.text} {todo.completed ? '✓' : '○'}
        </div>
      ))}
    </div>
  );
};
```

### Redux Toolkit (Complex Applications)
```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';

// Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1; // Immer makes this immutable
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

// Component
const Counter = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
};
```

### Q&A: State Management

**Q1: When should you use Context vs external state management?**
A: Context for simple, infrequent updates; external libraries for complex state, frequent updates, or time-travel debugging.

**Q2: What's the difference between Zustand and Redux?**
A: Zustand is simpler with less boilerplate; Redux has more features, middleware ecosystem, and DevTools.

**Q3: How do you prevent Context re-render issues?**
A: Split contexts by concern, memoize context values, use multiple providers, or consider external state management.

**Q4: What's the flux pattern?**
A: Unidirectional data flow: Actions → Dispatcher → Store → View. Redux implements this pattern.

**Q5: When should you lift state up?**
A: When multiple components need to share state or when child components need to communicate with each other.

## 7. Testing

### Unit Testing with Jest and React Testing Library
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter Component', () => {
  test('renders initial count', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });
  
  test('increments count when button clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    const button = screen.getByRole('button', { name: /increment/i });
    await user.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
  
  test('calls onCountChange when count updates', async () => {
    const mockOnCountChange = jest.fn();
    const user = userEvent.setup();
    
    render(<Counter onCountChange={mockOnCountChange} />);
    
    await user.click(screen.getByRole('button', { name: /increment/i }));
    
    expect(mockOnCountChange).toHaveBeenCalledWith(1);
  });
});
```

### Testing Hooks
```javascript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter Hook', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });
  
  test('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  test('should reset count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(5);
  });
});
```

### Integration Testing
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { UserProfile } from './UserProfile';

// Mock API
const server = setupServer(
  rest.get('/api/user/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: req.params.id,
        name: 'John Doe',
        email: 'john@example.com',
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays user profile after loading', async () => {
  render(<UserProfile userId="123" />);
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  expect(screen.getByText('john@example.com')).toBeInTheDocument();
});
```

### E2E Testing with Playwright
```javascript
import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText('Welcome');
  });
  
  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="email"]', 'invalid@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });
});
```

### Q&A: Testing

**Q1: What's the difference between unit, integration, and E2E tests?**
A: Unit tests individual components; integration tests component interactions; E2E tests complete user workflows.

**Q2: When should you use getByRole vs getByTestId?**
A: `getByRole` for accessibility and semantic queries; `getByTestId` when no semantic alternative exists.

**Q3: How do you test async operations?**
A: Use `waitFor`, `findBy` queries, or `act` for state updates. Mock external dependencies.

**Q4: What's the testing pyramid?**
A: Many unit tests (fast, cheap), some integration tests (medium), few E2E tests (slow, expensive).

**Q5: How do you test custom hooks?**
A: Use `renderHook` from React Testing Library and `act` for state changes.

## 8. Senior Developer Skills

### Architecture and Design Patterns

#### Component Composition
```javascript
// Instead of prop drilling
const BadExample = () => {
  const [user, setUser] = useState(null);
  
  return (
    <Header user={user} />
    <Main user={user} />
    <Footer user={user} />
  );
};

// Use composition
const GoodExample = () => {
  const [user, setUser] = useState(null);
  
  return (
    <UserProvider user={user}>
      <Header />
      <Main />
      <Footer />
    </UserProvider>
  );
};
```

#### Dependency Injection
```javascript
// Service layer
class ApiService {
  constructor(baseURL, httpClient = fetch) {
    this.baseURL = baseURL;
    this.httpClient = httpClient;
  }
  
  async getUsers() {
    const response = await this.httpClient(`${this.baseURL}/users`);
    return response.json();
  }
}

// Hook with dependency injection
const useApiService = () => {
  const apiService = useMemo(() => 
    new ApiService(process.env.NEXT_PUBLIC_API_URL), []
  );
  
  return apiService;
};
```

#### Error Handling Strategy
```javascript
// Global error handler
const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  
  const addError = useCallback((error) => {
    const errorId = Date.now();
    setErrors(prev => [...prev, { id: errorId, ...error }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setErrors(prev => prev.filter(e => e.id !== errorId));
    }, 5000);
  }, []);
  
  const removeError = useCallback((id) => {
    setErrors(prev => prev.filter(e => e.id !== id));
  }, []);
  
  return (
    <ErrorContext.Provider value={{ errors, addError, removeError }}>
      {children}
      <ErrorDisplay errors={errors} onRemove={removeError} />
    </ErrorContext.Provider>
  );
};

// Error boundary with retry
class RetryErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  handleRetry = () => {
    this.setState(prev => ({
      hasError: false,
      retryCount: prev.retryCount + 1
    }));
  };
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={this.handleRetry}>
            Retry ({this.state.retryCount}/3)
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Code Quality and Best Practices

#### TypeScript Integration
```typescript
// Proper typing
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

// Generic hook
function useApi<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const result: ApiResponse<T> = await response.json();
      
      if (result.status === 'success') {
        setData(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, loading, error, refetch: fetchData };
}

// Component with proper typing
interface UserListProps {
  users: User[];
  onUserSelect: (user: User) => void;
  className?: string;
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  onUserSelect, 
  className 
}) => {
  return (
    <div className={className}>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onClick={() => onUserSelect(user)} 
        />
      ))}
    </div>
  );
};
```

#### Performance Monitoring
```javascript
// Performance monitoring hook
const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // More than one frame
        console.warn(`${componentName} took ${renderTime}ms to render`);
      }
    };
  });
};

// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const trackWebVitals = () => {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
};
```

### Q&A: Senior Developer Skills

**Q1: How do you handle technical debt in React applications?**
A: Regular refactoring, code reviews, automated testing, linting rules, and gradual migration strategies.

**Q2: What's your approach to component API design?**
A: Clear prop interfaces, composition over inheritance, consistent naming, proper TypeScript types, and good defaults.

**Q3: How do you ensure code quality in a team?**
A: Code reviews, automated testing, linting/formatting tools, documentation, and established coding standards.

**Q4: What's your strategy for handling breaking changes?**
A: Gradual migration, feature flags, backward compatibility layers, clear communication, and comprehensive testing.

**Q5: How do you mentor junior developers?**
A: Code reviews with explanations, pair programming, sharing resources, setting clear expectations, and providing constructive feedback.

## 9. Interview Preparation

### Common Technical Questions

#### React Fundamentals
**Q: Explain the React component lifecycle.**
A: Mounting (constructor, render, componentDidMount), Updating (render, componentDidUpdate), Unmounting (componentWillUnmount). In hooks: useEffect handles all lifecycle phases.

**Q: What's the difference between state and props?**
A: Props are immutable data passed from parent; state is mutable data managed within component. Props flow down, events flow up.

**Q: How does React's reconciliation work?**
A: React compares virtual DOM trees, identifies differences, and updates only changed DOM nodes. Uses keys for efficient list updates.

#### Advanced React
**Q: Explain React Fiber.**
A: React's reconciliation engine that enables incremental rendering, priority-based updates, and better user experience through time-slicing.

**Q: What are React Portals and when would you use them?**
A: Render children into DOM nodes outside parent component tree. Used for modals, tooltips, and overlays.

**Q: How do you optimize React performance?**
A: Memoization (React.memo, useMemo, useCallback), code splitting, virtual scrolling, proper key usage, and avoiding inline objects/functions.

#### Next.js Specific
**Q: Explain different rendering methods in Next.js.**
A: SSG (build time), SSR (request time), ISR (background regeneration), CSR (client-side). Choose based on data freshness and performance needs.

**Q: What's the difference between App Router and Pages Router?**
A: App Router (Next.js 13+) uses folder-based routing with layouts and server components. Pages Router uses file-based routing with traditional React components.

### System Design Questions

#### Design a Social Media Feed
```
Requirements:
- Display posts from followed users
- Real-time updates
- Infinite scrolling
- Like/comment functionality

Architecture:
1. Component Structure:
   - FeedContainer (data fetching)
   - PostList (virtual scrolling)
   - PostItem (individual posts)
   - InteractionBar (like/comment)

2. State Management:
   - Posts: Zustand/Redux for global state
   - UI state: Local component state
   - Real-time: WebSocket connection

3. Performance:
   - Virtual scrolling for large lists
   - Image lazy loading
   - Optimistic updates for interactions
   - Caching with React Query/SWR

4. Data Flow:
   - Server Components for initial data
   - Client Components for interactions
   - WebSocket for real-time updates
```

#### Design a Dashboard Application
```
Requirements:
- Multiple widgets
- Drag-and-drop layout
- Real-time data updates
- Customizable themes

Architecture:
1. Layout System:
   - Grid-based layout engine
   - Drag-and-drop with react-dnd
   - Responsive breakpoints

2. Widget System:
   - Plugin architecture
   - Lazy-loaded widgets
   - Standardized widget API

3. State Management:
   - Layout state: Local storage persistence
   - Widget data: Individual data fetching
   - Theme: Context API

4. Performance:
   - Code splitting by widget
   - Memoized expensive calculations
   - Debounced layout updates
```

### Behavioral Questions

**Q: Describe a challenging technical problem you solved.**
Structure: Situation, Task, Action, Result (STAR method)
- Explain the problem clearly
- Describe your approach and reasoning
- Mention alternatives considered
- Quantify the impact

**Q: How do you stay updated with React/frontend trends?**
- Official documentation and blogs
- Community resources (Twitter, Reddit, Discord)
- Conferences and meetups
- Open source contributions
- Experimentation with new features

**Q: Describe a time you had to refactor legacy code.**
- Assessment of current state
- Planning migration strategy
- Risk mitigation approaches
- Team communication
- Measuring success

### Code Review Scenarios

#### Review This Component
```javascript
// Problematic code
const UserList = ({ users }) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  useEffect(() => {
    setFilteredUsers(users.filter(user => user.active));
  }, [users]);
  
  return (
    <div>
      {filteredUsers.map((user, index) => (
        <div key={index} onClick={() => console.log(user)}>
          {user.name}
        </div>
      ))}
    </div>
  );
};
```

**Issues to identify:**
1. Using array index as key (should use user.id)
2. Unnecessary state for derived data (use useMemo)
3. Console.log in production code
4. Missing prop validation/TypeScript
5. No error handling for missing data

**Improved version:**
```javascript
const UserList = ({ users = [] }) => {
  const activeUsers = useMemo(() => 
    users.filter(user => user?.active), [users]
  );
  
  const handleUserClick = useCallback((user) => {
    // Proper event handling
    onUserSelect?.(user);
  }, [onUserSelect]);
  
  return (
    <div>
      {activeUsers.map(user => (
        <div 
          key={user.id} 
          onClick={() => handleUserClick(user)}
          role="button"
          tabIndex={0}
        >
          {user.name}
        </div>
      ))}
    </div>
  );
};
```

### Q&A: Interview Preparation

**Q1: How do you prepare for technical interviews?**
A: Practice coding problems, review fundamentals, build projects, mock interviews, and study system design patterns.

**Q2: What questions should you ask the interviewer?**
A: Team structure, tech stack, development process, growth opportunities, company culture, and technical challenges.

**Q3: How do you handle whiteboard coding?**
A: Think out loud, ask clarifying questions, start with simple solution, optimize iteratively, and test with examples.

**Q4: What's your approach to system design interviews?**
A: Clarify requirements, estimate scale, design high-level architecture, dive into components, discuss trade-offs.

**Q5: How do you demonstrate senior-level thinking?**
A: Consider trade-offs, think about maintainability, discuss performance implications, and show architectural awareness.

## 10. Career Development Path

### Junior to Mid-Level (1-3 years)
- **Master React fundamentals**: Components, hooks, state management
- **Learn modern JavaScript**: ES6+, async/await, modules
- **Understand build tools**: Webpack, Vite, bundling concepts
- **Practice testing**: Unit tests, integration tests
- **Version control**: Git workflows, branching strategies

### Mid-Level to Senior (3-5 years)
- **Advanced React patterns**: HOCs, render props, compound components
- **Performance optimization**: Profiling, memoization, code splitting
- **State management**: Context, Redux, Zustand
- **TypeScript proficiency**: Advanced types, generics
- **Architecture decisions**: Component design, folder structure

### Senior to Lead (5+ years)
- **System design**: Scalable architectures, microservices
- **Team leadership**: Mentoring, code reviews, technical decisions
- **Cross-functional collaboration**: Product, design, backend teams
- **Technology evaluation**: Choosing tools, migration strategies
- **Performance monitoring**: Metrics, optimization strategies

### Continuous Learning Areas
- **New React features**: Concurrent features, Suspense, Server Components
- **Web standards**: Web APIs, performance APIs, accessibility
- **Build tools**: Next.js updates, Vite, Turbopack
- **Testing strategies**: E2E testing, visual regression testing
- **DevOps basics**: CI/CD, deployment strategies, monitoring

### Building Your Portfolio
- **Open source contributions**: Bug fixes, feature additions, documentation
- **Personal projects**: Showcase different skills and technologies
- **Technical writing**: Blog posts, tutorials, documentation
- **Speaking**: Meetups, conferences, internal presentations
- **Mentoring**: Help junior developers, contribute to community

---

*This comprehensive guide covers everything needed to become a senior React/Next.js developer. Focus on understanding concepts deeply, practice regularly, and stay curious about new developments in the ecosystem.*