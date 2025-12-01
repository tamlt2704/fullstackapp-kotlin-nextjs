---
title: "shadcn/ui Complete Guide: Build a Task Management App from Scratch"
date: "2024-01-25"
category: "Frontend Development"
tags: ["shadcn/ui", "React", "Next.js", "Tailwind CSS", "UI Components"]
---

# shadcn/ui Complete Guide: Build a Task Management App

## Table of Contents
1. [Introduction](#introduction)
2. [Setup from Scratch](#setup)
3. [Basic Components](#basic-components)
4. [Building the App](#building-app)
5. [Advanced Features](#advanced-features)
6. [State Management](#state-management)
7. [Complete Application](#complete-app)

## Introduction

**What is shadcn/ui?**
- Not a component library, but a collection of reusable components
- Copy-paste components into your project
- Built with Radix UI and Tailwind CSS
- Fully customizable and accessible
- No package dependencies

**Why shadcn/ui?**
- Own the code (no black box)
- Highly customizable
- Beautiful default styling
- TypeScript support
- Accessible by default

## Setup from Scratch

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest task-manager
# ✔ TypeScript? Yes
# ✔ ESLint? Yes
# ✔ Tailwind CSS? Yes
# ✔ src/ directory? No
# ✔ App Router? Yes
# ✔ Import alias? Yes (@/*)

cd task-manager
```

### Step 2: Initialize shadcn/ui

```bash
npx shadcn-ui@latest init

# ✔ Style: Default
# ✔ Base color: Slate
# ✔ CSS variables: Yes
```

This creates:
- `components/ui/` folder
- `lib/utils.ts` for utility functions
- Updates `tailwind.config.ts`
- Updates `globals.css`

### Step 3: Install Components

```bash
# Install components we'll use
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add avatar
```

## Basic Components

### Button Component

```tsx
import { Button } from '@/components/ui/button'

export default function ButtonExample() {
  return (
    <div className="flex gap-4">
      {/* Variants */}
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>

      {/* Sizes */}
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🔥</Button>

      {/* States */}
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  )
}
```

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function CardExample() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with any elements</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  )
}
```

### Input & Form Components

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function FormExample() {
  return (
    <form className="space-y-4 w-[350px]">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
      </div>
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  )
}
```

### Dialog Component

```tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function DialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## Building the App

### Step 1: Define Types

**types/task.ts:**
```ts
export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Step 2: Create Task Card Component

**components/task-card.tsx:**
```tsx
'use client'

import { Task } from '@/types/task'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreVertical, Trash2, Edit, CheckCircle } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Task['status']) => void
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  }

  const statusColors = {
    'todo': 'bg-gray-500',
    'in-progress': 'bg-orange-500',
    'done': 'bg-green-500',
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <div className="flex gap-2">
              <Badge className={statusColors[task.status]}>
                {task.status}
              </Badge>
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'done')}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Done
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{task.description}</CardDescription>
      </CardContent>
      {task.dueDate && (
        <CardFooter className="text-sm text-muted-foreground">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </CardFooter>
      )}
    </Card>
  )
}
```

### Step 3: Create Task Dialog

**components/task-dialog.tsx:**
```tsx
'use client'

import { useState, useEffect } from 'react'
import { Task, TaskStatus, TaskPriority } from '@/types/task'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  task?: Task
}

export function TaskDialog({ open, onOpenChange, onSave, task }: TaskDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setStatus(task.status)
      setPriority(task.priority)
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
    } else {
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('medium')
      setDueDate('')
    }
  }, [task, open])

  const handleSave = () => {
    onSave({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {task ? 'Update' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Step 4: Create Main Page

**app/page.tsx:**
```tsx
'use client'

import { useState } from 'react'
import { Task } from '@/types/task'
import { TaskCard } from '@/components/task-card'
import { TaskDialog } from '@/components/task-dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTasks([...tasks, newTask])
  }

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return
    
    setTasks(tasks.map(t => 
      t.id === editingTask.id 
        ? { ...taskData, id: t.id, createdAt: t.createdAt, updatedAt: new Date() }
        : t
    ))
    setEditingTask(undefined)
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const handleStatusChange = (id: string, status: Task['status']) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status, updatedAt: new Date() } : t
    ))
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const filterTasks = (status?: Task['status']) => {
    return status ? tasks.filter(t => t.status === status) : tasks
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Task Manager</h1>
            <p className="text-muted-foreground mt-2">
              Manage your tasks efficiently
            </p>
          </div>
          <Button onClick={() => {
            setEditingTask(undefined)
            setDialogOpen(true)
          }}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="todo">
              To Do ({filterTasks('todo').length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress ({filterTasks('in-progress').length})
            </TabsTrigger>
            <TabsTrigger value="done">
              Done ({filterTasks('done').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="todo" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterTasks('todo').map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterTasks('in-progress').map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="done" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterTasks('done').map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          task={editingTask}
        />
      </div>
    </div>
  )
}
```

## Advanced Features

### Add Toast Notifications

**Install toast:**
```bash
npx shadcn-ui@latest add toast
```

**components/ui/use-toast.ts** (auto-generated)

**Update app/layout.tsx:**
```tsx
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

**Use in page.tsx:**
```tsx
import { useToast } from '@/components/ui/use-toast'

export default function Home() {
  const { toast } = useToast()

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTasks([...tasks, newTask])
    
    toast({
      title: 'Task created',
      description: `"${taskData.title}" has been added to your tasks.`,
    })
  }

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id)
    setTasks(tasks.filter(t => t.id !== id))
    
    toast({
      title: 'Task deleted',
      description: `"${task?.title}" has been removed.`,
      variant: 'destructive',
    })
  }
}
```

### Add Search & Filter

**components/task-filters.tsx:**
```tsx
'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

interface TaskFiltersProps {
  search: string
  onSearchChange: (search: string) => void
  priority: string
  onPriorityChange: (priority: string) => void
}

export function TaskFilters({ search, onSearchChange, priority, onPriorityChange }: TaskFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
```

**Update page.tsx:**
```tsx
const [search, setSearch] = useState('')
const [priorityFilter, setPriorityFilter] = useState('all')

const filterTasks = (status?: Task['status']) => {
  let filtered = status ? tasks.filter(t => t.status === status) : tasks
  
  if (search) {
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  if (priorityFilter !== 'all') {
    filtered = filtered.filter(t => t.priority === priorityFilter)
  }
  
  return filtered
}

// Add before tabs
<TaskFilters
  search={search}
  onSearchChange={setSearch}
  priority={priorityFilter}
  onPriorityChange={setPriorityFilter}
/>
```

## State Management

### Add LocalStorage Persistence

**hooks/use-local-storage.ts:**
```ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.error(error)
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}
```

**Update page.tsx:**
```tsx
import { useLocalStorage } from '@/hooks/use-local-storage'

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [])
  // Rest of the code remains the same
}
```

### Add Context for Global State

**context/task-context.tsx:**
```tsx
'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Task } from '@/types/task'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useToast } from '@/components/ui/use-toast'

interface TaskContextType {
  tasks: Task[]
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTaskById: (id: string) => Task | undefined
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [])
  const { toast } = useToast()

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTasks([...tasks, newTask])
    toast({
      title: 'Task created',
      description: `"${taskData.title}" has been added.`,
    })
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
    ))
    toast({
      title: 'Task updated',
      description: 'Your changes have been saved.',
    })
  }

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id)
    setTasks(tasks.filter(t => t.id !== id))
    toast({
      title: 'Task deleted',
      description: `"${task?.title}" has been removed.`,
      variant: 'destructive',
    })
  }

  const getTaskById = (id: string) => tasks.find(t => t.id === id)

  return (
    <TaskContext.Provider value={{ tasks, createTask, updateTask, deleteTask, getTaskById }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider')
  }
  return context
}
```

**Update app/layout.tsx:**
```tsx
import { TaskProvider } from '@/context/task-context'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TaskProvider>
          {children}
        </TaskProvider>
        <Toaster />
      </body>
    </html>
  )
}
```

**Simplified page.tsx:**
```tsx
'use client'

import { useTasks } from '@/context/task-context'

export default function Home() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  // Much simpler component now!
}
```

## Complete Application

### Add Statistics Dashboard

**components/task-stats.tsx:**
```tsx
'use client'

import { Task } from '@/types/task'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react'

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  }

  const cards = [
    { title: 'Total Tasks', value: stats.total, icon: ListTodo, color: 'text-blue-600' },
    { title: 'To Do', value: stats.todo, icon: Clock, color: 'text-gray-600' },
    { title: 'In Progress', value: stats.inProgress, icon: AlertCircle, color: 'text-orange-600' },
    { title: 'Completed', value: stats.done, icon: CheckCircle2, color: 'text-green-600' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

### Add Drag and Drop

**Install dnd-kit:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**components/kanban-board.tsx:**
```tsx
'use client'

import { Task, TaskStatus } from '@/types/task'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { TaskCard } from './task-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface KanbanBoardProps {
  tasks: Task[]
  onStatusChange: (id: string, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function KanbanBoard({ tasks, onStatusChange, onEdit, onDelete }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const columns: { status: TaskStatus; title: string }[] = [
    { status: 'todo', title: 'To Do' },
    { status: 'in-progress', title: 'In Progress' },
    { status: 'done', title: 'Done' },
  ]

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string
      const newStatus = over.id as TaskStatus
      onStatusChange(taskId, newStatus)
    }
    
    setActiveId(null)
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Card key={column.status}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {column.title}
                <span className="text-sm font-normal text-muted-foreground">
                  {tasks.filter(t => t.status === column.status).length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SortableContext
                items={tasks.filter(t => t.status === column.status).map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {tasks
                    .filter(t => t.status === column.status)
                    .map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                      />
                    ))}
                </div>
              </SortableContext>
            </CardContent>
          </Card>
        ))}
      </div>
    </DndContext>
  )
}
```

### Add Dark Mode

**Install next-themes:**
```bash
npm install next-themes
```

**components/theme-provider.tsx:**
```tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**components/theme-toggle.tsx:**
```tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Update app/layout.tsx:**
```tsx
import { ThemeProvider } from '@/components/theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TaskProvider>
            {children}
          </TaskProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Final Complete Page

**app/page.tsx:**
```tsx
'use client'

import { useState } from 'react'
import { useTasks } from '@/context/task-context'
import { Task } from '@/types/task'
import { TaskCard } from '@/components/task-card'
import { TaskDialog } from '@/components/task-dialog'
import { TaskStats } from '@/components/task-stats'
import { TaskFilters } from '@/components/task-filters'
import { KanbanBoard } from '@/components/kanban-board'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, LayoutGrid, List } from 'lucide-react'

export default function Home() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [view, setView] = useState<'list' | 'kanban'>('list')

  const handleSave = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
    } else {
      createTask(taskData)
    }
    setEditingTask(undefined)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleStatusChange = (id: string, status: Task['status']) => {
    updateTask(id, { status })
  }

  const filterTasks = (status?: Task['status']) => {
    let filtered = status ? tasks.filter(t => t.status === status) : tasks
    
    if (search) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter)
    }
    
    return filtered
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold">Task Manager</h1>
            <p className="text-muted-foreground mt-2">
              Manage your tasks efficiently
            </p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setView(view === 'list' ? 'kanban' : 'list')}
            >
              {view === 'list' ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </Button>
            <Button onClick={() => {
              setEditingTask(undefined)
              setDialogOpen(true)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <TaskStats tasks={tasks} />

        {/* Filters */}
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
        />

        {/* Content */}
        {view === 'kanban' ? (
          <KanbanBoard
            tasks={filterTasks()}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={deleteTask}
          />
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">
                All ({filterTasks().length})
              </TabsTrigger>
              <TabsTrigger value="todo">
                To Do ({filterTasks('todo').length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress ({filterTasks('in-progress').length})
              </TabsTrigger>
              <TabsTrigger value="done">
                Done ({filterTasks('done').length})
              </TabsTrigger>
            </TabsList>

            {['all', 'todo', 'in-progress', 'done'].map((status) => (
              <TabsContent key={status} value={status} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filterTasks(status === 'all' ? undefined : status as Task['status']).map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEdit}
                      onDelete={deleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
                {filterTasks(status === 'all' ? undefined : status as Task['status']).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No tasks found
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Dialog */}
        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
          task={editingTask}
        />
      </div>
    </div>
  )
}
```

## Summary

**What We Built:**
- ✅ Complete task management application
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Task filtering and search
- ✅ Multiple views (List and Kanban)
- ✅ Statistics dashboard
- ✅ Dark mode support
- ✅ LocalStorage persistence
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Accessible components

**shadcn/ui Components Used:**
- Button, Card, Input, Label, Textarea
- Dialog, Select, Badge, Tabs
- Dropdown Menu, Toast, Avatar
- All fully customizable

**Key Features:**
- **No dependencies**: Own all component code
- **Accessible**: Built with Radix UI primitives
- **Customizable**: Modify any component
- **Type-safe**: Full TypeScript support
- **Responsive**: Mobile-first design
- **Dark mode**: Built-in theme support

**Project Structure:**
```
task-manager/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── task-card.tsx
│   ├── task-dialog.tsx
│   ├── task-stats.tsx
│   ├── task-filters.tsx
│   ├── kanban-board.tsx
│   └── theme-toggle.tsx
├── context/
│   └── task-context.tsx
├── hooks/
│   └── use-local-storage.ts
├── types/
│   └── task.ts
└── lib/
    └── utils.ts
```

**Next Steps:**
- Add backend API integration
- Implement user authentication
- Add task categories/tags
- Export/import tasks
- Add task comments
- Implement task reminders
- Add file attachments
- Create task templates

**Best Practices:**
- Use TypeScript for type safety
- Implement proper error handling
- Add loading states
- Optimize performance with React.memo
- Use proper accessibility attributes
- Test components thoroughly
- Follow consistent naming conventions
- Document complex logic
