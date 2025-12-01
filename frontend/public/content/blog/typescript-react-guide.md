# TypeScript & React: Complete Guide

A comprehensive guide to building type-safe React applications with TypeScript.

---

## Why TypeScript with React?

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Autocomplete, refactoring, navigation
- **Self-Documenting**: Types serve as inline documentation
- **Scalability**: Easier to maintain large codebases
- **Refactoring Confidence**: Change code without breaking things

---

## Setup

### Create React App with TypeScript
```bash
npx create-react-app my-app --template typescript
```

### Next.js with TypeScript
```bash
npx create-next-app@latest my-app --typescript
```

### Vite with TypeScript
```bash
npm create vite@latest my-app -- --template react-ts
```

---

## Component Types

### Function Components

```typescript
// Basic function component
const Greeting: React.FC = () => {
  return <h1>Hello World</h1>;
};

// With props (recommended approach)
interface GreetingProps {
  name: string;
  age?: number; // optional
}

const Greeting = ({ name, age }: GreetingProps) => {
  return (
    <div>
      <h1>Hello {name}</h1>
      {age && <p>Age: {age}</p>}
    </div>
  );
};

// With children
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return <div className={className}>{children}</div>;
};
```

### Props with Default Values

```typescript
interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button = ({ 
  text, 
  variant = 'primary', 
  disabled = false 
}: ButtonProps) => {
  return (
    <button className={variant} disabled={disabled}>
      {text}
    </button>
  );
};
```

### Props with Event Handlers

```typescript
interface FormProps {
  onSubmit: (data: FormData) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Form = ({ onSubmit, onChange, onClick }: FormProps) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(new FormData(e.currentTarget));
    }}>
      <input onChange={onChange} />
      <button onClick={onClick}>Submit</button>
    </form>
  );
};
```

---

## Hooks with TypeScript

### useState

```typescript
// Primitive types (inferred)
const [count, setCount] = useState(0);
const [name, setName] = useState('');

// Explicit typing
const [count, setCount] = useState<number>(0);

// Object state
interface User {
  id: number;
  name: string;
  email: string;
}

const [user, setUser] = useState<User | null>(null);

// Array state
const [items, setItems] = useState<string[]>([]);
const [users, setUsers] = useState<User[]>([]);

// Union types
type Status = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<Status>('idle');
```

### useEffect

```typescript
// Basic effect
useEffect(() => {
  console.log('Component mounted');
  
  return () => {
    console.log('Cleanup');
  };
}, []);

// With async operations
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/users');
    const data: User[] = await response.json();
    setUsers(data);
  };
  
  fetchData();
}, []);

// With dependencies
useEffect(() => {
  if (userId) {
    fetchUser(userId);
  }
}, [userId]);
```

### useRef

```typescript
// DOM element ref
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

// Mutable value ref
const countRef = useRef<number>(0);

const increment = () => {
  countRef.current += 1;
};

// Timer ref
const timerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  timerRef.current = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
}, []);
```

### useContext

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Usage
const ThemedButton = () => {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
};
```

### useReducer

```typescript
interface State {
  count: number;
  error: string | null;
}

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_ERROR'; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: 0 };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0, error: null });
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
};
```

### Custom Hooks

```typescript
// Fetch hook
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}

// Usage
const UserProfile = ({ userId }: { userId: number }) => {
  const { data, loading, error } = useFetch<User>(`/api/users/${userId}`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;
  
  return <div>{data.name}</div>;
};

// Local storage hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  
  const setStoredValue = (newValue: T | ((val: T) => T)) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };
  
  return [value, setStoredValue] as const;
}
```

---

## Event Handling

### Common Event Types

```typescript
// Mouse events
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.clientX, e.clientY);
};

const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

// Keyboard events
const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    console.log('Enter pressed');
  }
};

// Form events
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  console.log(e.target.value);
};

// Focus events
const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  console.log('Input focused');
};

// Drag events
const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
  console.log('Dragging');
};
```

---

## Advanced Patterns

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>
```

### Render Props

```typescript
interface MouseTrackerProps {
  render: (position: { x: number; y: number }) => React.ReactNode;
}

const MouseTracker = ({ render }: MouseTrackerProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };
  
  return (
    <div onMouseMove={handleMouseMove}>
      {render(position)}
    </div>
  );
};

// Usage
<MouseTracker
  render={({ x, y }) => (
    <p>Mouse at ({x}, {y})</p>
  )}
/>
```

### Higher-Order Components (HOC)

```typescript
interface WithLoadingProps {
  loading: boolean;
}

function withLoading<P extends object>(
  Component: React.ComponentType<P>
) {
  return (props: P & WithLoadingProps) => {
    const { loading, ...rest } = props;
    
    if (loading) {
      return <div>Loading...</div>;
    }
    
    return <Component {...(rest as P)} />;
  };
}

// Usage
interface UserListProps {
  users: User[];
}

const UserList = ({ users }: UserListProps) => (
  <ul>
    {users.map(user => <li key={user.id}>{user.name}</li>)}
  </ul>
);

const UserListWithLoading = withLoading(UserList);

<UserListWithLoading loading={false} users={users} />
```

### Compound Components

```typescript
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: React.ReactNode;
  defaultTab: string;
}

const Tabs = ({ children, defaultTab }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: React.ReactNode;
}

const TabList = ({ children }: TabListProps) => (
  <div className="tab-list">{children}</div>
);

interface TabProps {
  value: string;
  children: React.ReactNode;
}

const Tab = ({ value, children }: TabProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');
  
  const { activeTab, setActiveTab } = context;
  
  return (
    <button
      className={activeTab === value ? 'active' : ''}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
}

const TabPanel = ({ value, children }: TabPanelProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');
  
  const { activeTab } = context;
  
  if (activeTab !== value) return null;
  
  return <div className="tab-panel">{children}</div>;
};

// Usage
<Tabs defaultTab="home">
  <TabList>
    <Tab value="home">Home</Tab>
    <Tab value="profile">Profile</Tab>
  </TabList>
  <TabPanel value="home">Home Content</TabPanel>
  <TabPanel value="profile">Profile Content</TabPanel>
</Tabs>
```

---

## Forms with TypeScript

### Controlled Components

```typescript
interface FormData {
  username: string;
  email: string;
  age: number;
  terms: boolean;
}

const SignupForm = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    age: 0,
    terms: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
      />
      <input
        name="terms"
        type="checkbox"
        checked={formData.terms}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Form Validation

```typescript
interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

const LoginForm = () => {
  const [values, setValues] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!values.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!values.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!values.password) {
      newErrors.password = 'Password is required';
    } else if (values.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form is valid', values);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={values.username}
          onChange={(e) => setValues({ ...values, username: e.target.value })}
        />
        {errors.username && <span>{errors.username}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

---

## API Integration

### Fetch with TypeScript

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  
  const data: ApiResponse<User> = await response.json();
  return data.data;
}

// With error handling
const UserProfile = ({ userId }: { userId: number }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;
  
  return <div>{user.name}</div>;
};
```

### Axios with TypeScript

```typescript
import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// GET request
async function getUsers(): Promise<User[]> {
  const response: AxiosResponse<User[]> = await api.get('/users');
  return response.data;
}

// POST request
async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const response: AxiosResponse<User> = await api.post('/users', user);
  return response.data;
}

// PUT request
async function updateUser(id: number, user: Partial<User>): Promise<User> {
  const response: AxiosResponse<User> = await api.put(`/users/${id}`, user);
  return response.data;
}

// DELETE request
async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
```

---

## State Management

### Context + Reducer Pattern

```typescript
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'ADD_NOTIFICATION'; payload: Notification };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light',
    notifications: []
  });
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
```

---

## TypeScript Utility Types

### Built-in Utilities

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - all properties optional
type PartialUser = Partial<User>;
const updateUser = (id: number, updates: Partial<User>) => {};

// Required - all properties required
type RequiredUser = Required<User>;

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - exclude specific properties
type UserWithoutId = Omit<User, 'id'>;
const createUser = (user: Omit<User, 'id'>) => {};

// Record - create object type
type UserRoles = Record<number, 'admin' | 'user' | 'guest'>;
const roles: UserRoles = { 1: 'admin', 2: 'user' };

// Readonly - immutable properties
type ReadonlyUser = Readonly<User>;

// ReturnType - extract return type
function getUser() {
  return { id: 1, name: 'Alice' };
}
type UserType = ReturnType<typeof getUser>;

// Parameters - extract parameter types
function createPost(title: string, content: string) {}
type CreatePostParams = Parameters<typeof createPost>;
```

### Custom Utility Types

```typescript
// Make specific properties optional
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type UserWithOptionalEmail = Optional<User, 'email'>;

// Make specific properties required
type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Nullable type
type Nullable<T> = T | null;
type NullableUser = Nullable<User>;

// Deep Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

---

## Best Practices

### 1. Prefer Interfaces for Props

```typescript
// ✅ Good
interface ButtonProps {
  text: string;
  onClick: () => void;
}

// ❌ Avoid (unless you need union types)
type ButtonProps = {
  text: string;
  onClick: () => void;
};
```

### 2. Use Discriminated Unions

```typescript
type LoadingState = { status: 'loading' };
type SuccessState = { status: 'success'; data: User };
type ErrorState = { status: 'error'; error: string };

type State = LoadingState | SuccessState | ErrorState;

const Component = ({ state }: { state: State }) => {
  switch (state.status) {
    case 'loading':
      return <div>Loading...</div>;
    case 'success':
      return <div>{state.data.name}</div>;
    case 'error':
      return <div>{state.error}</div>;
  }
};
```

### 3. Avoid Any

```typescript
// ❌ Bad
const handleData = (data: any) => {};

// ✅ Good
const handleData = (data: unknown) => {
  if (typeof data === 'string') {
    console.log(data.toUpperCase());
  }
};
```

### 4. Use Const Assertions

```typescript
// ✅ Good - readonly tuple
const colors = ['red', 'blue', 'green'] as const;
type Color = typeof colors[number]; // 'red' | 'blue' | 'green'

// ✅ Good - readonly object
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const;
```

### 5. Type Component Props Properly

```typescript
// ✅ Good - explicit props
interface Props {
  title: string;
  children: React.ReactNode;
}

const Component = ({ title, children }: Props) => (
  <div>
    <h1>{title}</h1>
    {children}
  </div>
);

// ✅ Good - with HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
}

const Button = ({ variant, ...props }: ButtonProps) => (
  <button className={variant} {...props} />
);
```

---

## Common Pitfalls

### 1. Optional Chaining

```typescript
// ✅ Good
const userName = user?.name ?? 'Guest';

// ❌ Bad
const userName = user && user.name ? user.name : 'Guest';
```

### 2. Type Guards

```typescript
interface Dog {
  bark: () => void;
}

interface Cat {
  meow: () => void;
}

// ✅ Good - type guard
function isDog(animal: Dog | Cat): animal is Dog {
  return (animal as Dog).bark !== undefined;
}

const makeSound = (animal: Dog | Cat) => {
  if (isDog(animal)) {
    animal.bark();
  } else {
    animal.meow();
  }
};
```

### 3. Avoid Type Assertions

```typescript
// ❌ Bad
const user = data as User;

// ✅ Good - validate first
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}

if (isUser(data)) {
  console.log(data.name);
}
```

---

## Testing with TypeScript

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

interface CounterProps {
  initialCount?: number;
}

const Counter = ({ initialCount = 0 }: CounterProps) => {
  const [count, setCount] = useState(initialCount);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

describe('Counter', () => {
  it('renders with initial count', () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });
  
  it('increments count on button click', () => {
    render(<Counter />);
    const button = screen.getByText('Increment');
    fireEvent.click(button);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });
});
```

---

## Performance Optimization

### useMemo & useCallback

```typescript
interface Props {
  items: Item[];
  filter: string;
}

const ItemList = ({ items, filter }: Props) => {
  // Memoize expensive computation
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  // Memoize callback
  const handleClick = useCallback((id: number) => {
    console.log('Clicked:', id);
  }, []);
  
  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
};
```

### React.memo

```typescript
interface ItemProps {
  item: Item;
  onDelete: (id: number) => void;
}

const Item = React.memo(({ item, onDelete }: ItemProps) => {
  return (
    <div>
      <span>{item.name}</span>
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  );
});
```

---

This guide covers the essential TypeScript patterns and best practices for React development. Master these concepts to build robust, type-safe applications!
