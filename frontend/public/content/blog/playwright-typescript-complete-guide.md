---
title: "Playwright with TypeScript: Complete Guide from Beginner to Professional"
date: "2024-01-20"
category: "Testing & Automation"
tags: ["Playwright", "TypeScript", "Testing", "Web Scraping", "E2E Testing"]
---

# Playwright with TypeScript: Complete Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Setup & Installation](#setup)
3. [Basic Testing](#basic-testing)
4. [Intermediate Testing](#intermediate-testing)
5. [Advanced Testing Patterns](#advanced-testing)
6. [Web Scraping Basics](#scraping-basics)
7. [Advanced Scraping](#advanced-scraping)
8. [Professional Patterns](#professional-patterns)

## Introduction

Playwright is a modern end-to-end testing framework supporting Chromium, Firefox, and WebKit with a single API.

**Key Features:**
- Auto-wait for elements
- Network interception
- Mobile emulation
- Parallel execution
- Video/screenshot capture
- Cross-browser support

## Setup & Installation

```bash
npm init playwright@latest
# Select TypeScript, tests folder, GitHub Actions

# Manual setup
npm install -D @playwright/test
npx playwright install
```

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

## Basic Testing

### First Test

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Home/);
});

test('button click', async ({ page }) => {
  await page.goto('/');
  await page.click('button#submit');
  await expect(page.locator('.success')).toBeVisible();
});
```

### Locators

```typescript
// Best practices - use role, text, test-id
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByText('Welcome').click();
await page.getByTestId('login-button').click();
await page.getByLabel('Email').fill('user@test.com');
await page.getByPlaceholder('Enter password').fill('pass123');

// CSS/XPath (avoid when possible)
await page.locator('button.primary').click();
await page.locator('//button[@id="submit"]').click();

// Chaining
await page.locator('.card').filter({ hasText: 'Product' }).click();
```

### Assertions

```typescript
// Visibility
await expect(page.locator('.alert')).toBeVisible();
await expect(page.locator('.spinner')).toBeHidden();

// Text content
await expect(page.locator('h1')).toHaveText('Dashboard');
await expect(page.locator('.error')).toContainText('Invalid');

// Attributes
await expect(page.locator('input')).toHaveAttribute('type', 'email');
await expect(page.locator('button')).toBeDisabled();

// Count
await expect(page.locator('.item')).toHaveCount(5);

// URL
await expect(page).toHaveURL(/dashboard/);
```

## Intermediate Testing

### Page Object Model

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async getErrorMessage() {
    return this.page.locator('.error').textContent();
  }
}

// tests/login.spec.ts
test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@test.com', 'password123');
  await expect(page).toHaveURL('/dashboard');
});
```

### Fixtures

```typescript
// fixtures/auth.ts
import { test as base } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@test.com');
    await page.fill('[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    await use(page);
  },
});

// Usage
test('admin dashboard', async ({ authenticatedPage }) => {
  await expect(authenticatedPage.locator('h1')).toHaveText('Admin Panel');
});
```

### API Testing

```typescript
test('API endpoint', async ({ request }) => {
  const response = await request.get('/api/users');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.users).toHaveLength(10);
});

test('POST request', async ({ request }) => {
  const response = await request.post('/api/users', {
    data: { name: 'John', email: 'john@test.com' }
  });
  expect(response.status()).toBe(201);
});

// Combine API + UI
test('create user via API, verify in UI', async ({ page, request }) => {
  await request.post('/api/users', {
    data: { name: 'Jane', email: 'jane@test.com' }
  });
  
  await page.goto('/users');
  await expect(page.getByText('jane@test.com')).toBeVisible();
});
```

### Network Interception

```typescript
test('mock API response', async ({ page }) => {
  await page.route('**/api/products', route => {
    route.fulfill({
      status: 200,
      body: JSON.stringify([
        { id: 1, name: 'Product 1', price: 100 }
      ])
    });
  });
  
  await page.goto('/products');
  await expect(page.getByText('Product 1')).toBeVisible();
});

test('block images', async ({ page }) => {
  await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
  await page.goto('/gallery');
});

test('modify request', async ({ page }) => {
  await page.route('**/api/data', route => {
    const headers = route.request().headers();
    route.continue({ headers: { ...headers, 'X-Custom': 'value' } });
  });
});
```

## Advanced Testing Patterns

### Parallel Execution

```typescript
test.describe.configure({ mode: 'parallel' });

test.describe('product tests', () => {
  test('test 1', async ({ page }) => { /* ... */ });
  test('test 2', async ({ page }) => { /* ... */ });
  test('test 3', async ({ page }) => { /* ... */ });
});

// Serial execution
test.describe.configure({ mode: 'serial' });
test.describe('checkout flow', () => {
  test('add to cart', async ({ page }) => { /* ... */ });
  test('proceed to checkout', async ({ page }) => { /* ... */ });
});
```

### Test Hooks

```typescript
test.beforeAll(async ({ browser }) => {
  // Setup database
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    await page.screenshot({ path: `failure-${testInfo.title}.png` });
  }
});

test.afterAll(async () => {
  // Cleanup
});
```

### Mobile Testing

```typescript
import { devices } from '@playwright/test';

test.use(devices['iPhone 13']);

test('mobile view', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.mobile-menu')).toBeVisible();
});

// Custom viewport
test.use({ viewport: { width: 375, height: 667 } });
```

### Visual Regression

```typescript
test('visual comparison', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});

test('element screenshot', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.product-card').first();
  await expect(card).toHaveScreenshot('product-card.png');
});
```

### File Upload/Download

```typescript
test('file upload', async ({ page }) => {
  await page.goto('/upload');
  await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');
  await page.click('button[type="submit"]');
});

test('file download', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.click('a#download-link');
  const download = await downloadPromise;
  await download.saveAs('/path/to/save/' + download.suggestedFilename());
});
```

## Web Scraping Basics

### Simple Scraping

```typescript
import { chromium } from '@playwright/test';

async function scrapeProducts() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://example.com/products');
  
  const products = await page.$$eval('.product', elements =>
    elements.map(el => ({
      name: el.querySelector('h3')?.textContent?.trim(),
      price: el.querySelector('.price')?.textContent?.trim(),
      image: el.querySelector('img')?.getAttribute('src')
    }))
  );
  
  await browser.close();
  return products;
}
```

### Pagination

```typescript
async function scrapeAllPages() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const allData: any[] = [];
  
  await page.goto('https://example.com/products');
  
  while (true) {
    const items = await page.$$eval('.item', els =>
      els.map(el => ({ title: el.textContent?.trim() }))
    );
    allData.push(...items);
    
    const nextButton = page.locator('a.next');
    if (await nextButton.count() === 0) break;
    
    await nextButton.click();
    await page.waitForLoadState('networkidle');
  }
  
  await browser.close();
  return allData;
}
```

### Infinite Scroll

```typescript
async function scrapeInfiniteScroll() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://example.com/feed');
  
  let previousHeight = 0;
  while (true) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    const currentHeight = await page.evaluate(() => document.body.scrollHeight);
    if (currentHeight === previousHeight) break;
    previousHeight = currentHeight;
  }
  
  const items = await page.$$eval('.post', els =>
    els.map(el => ({ content: el.textContent?.trim() }))
  );
  
  await browser.close();
  return items;
}
```

### Wait Strategies

```typescript
// Wait for selector
await page.waitForSelector('.content', { state: 'visible' });

// Wait for network
await page.waitForLoadState('networkidle');

// Wait for function
await page.waitForFunction(() => document.querySelectorAll('.item').length > 10);

// Wait for response
await page.waitForResponse(resp => resp.url().includes('/api/data'));

// Custom timeout
await page.waitForSelector('.slow-element', { timeout: 30000 });
```

## Advanced Scraping

### Authentication

```typescript
async function scrapeWithAuth() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Login
  await page.goto('https://example.com/login');
  await page.fill('[name="username"]', 'user');
  await page.fill('[name="password"]', 'pass');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  
  // Save auth state
  await context.storageState({ path: 'auth.json' });
  
  // Scrape protected content
  await page.goto('https://example.com/protected');
  const data = await page.textContent('.data');
  
  await browser.close();
  return data;
}

// Reuse auth state
async function scrapeWithSavedAuth() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'auth.json' });
  const page = await context.newPage();
  
  await page.goto('https://example.com/protected');
  // Already authenticated
}
```

### Proxy & Headers

```typescript
const browser = await chromium.launch({
  proxy: {
    server: 'http://proxy.example.com:8080',
    username: 'user',
    password: 'pass'
  }
});

const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  extraHTTPHeaders: {
    'Accept-Language': 'en-US,en;q=0.9',
    'X-Custom-Header': 'value'
  }
});
```

### Rate Limiting

```typescript
class RateLimitedScraper {
  private delay = 1000;
  
  async scrapeWithDelay(urls: string[]) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const results = [];
    
    for (const url of urls) {
      await page.goto(url);
      const data = await page.textContent('.content');
      results.push(data);
      
      await page.waitForTimeout(this.delay);
    }
    
    await browser.close();
    return results;
  }
}
```

### Concurrent Scraping

```typescript
async function scrapeConcurrent(urls: string[]) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  const scrapeUrl = async (url: string) => {
    const page = await context.newPage();
    await page.goto(url);
    const data = await page.textContent('.content');
    await page.close();
    return { url, data };
  };
  
  const results = await Promise.all(urls.map(scrapeUrl));
  await browser.close();
  return results;
}
```

### Dynamic Content

```typescript
async function scrapeDynamicContent() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://example.com');
  
  // Click to reveal content
  await page.click('button.load-more');
  await page.waitForSelector('.new-content');
  
  // Handle dropdowns
  await page.selectOption('select#category', 'electronics');
  await page.waitForLoadState('networkidle');
  
  // Handle modals
  await page.click('button.open-modal');
  await page.waitForSelector('.modal', { state: 'visible' });
  const modalText = await page.textContent('.modal .content');
  
  await browser.close();
  return modalText;
}
```

### Extract Structured Data

```typescript
interface Product {
  name: string;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
}

async function scrapeStructuredData(): Promise<Product[]> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://example.com/products');
  
  const products = await page.$$eval('.product-card', cards =>
    cards.map(card => {
      const name = card.querySelector('h3')?.textContent?.trim() || '';
      const priceText = card.querySelector('.price')?.textContent?.trim() || '0';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      const ratingText = card.querySelector('.rating')?.textContent?.trim() || '0';
      const rating = parseFloat(ratingText);
      const reviewsText = card.querySelector('.reviews')?.textContent?.trim() || '0';
      const reviews = parseInt(reviewsText.replace(/[^0-9]/g, ''));
      const inStock = !card.querySelector('.out-of-stock');
      
      return { name, price, rating, reviews, inStock };
    })
  );
  
  await browser.close();
  return products;
}
```

## Professional Patterns

### Scraper Class

```typescript
class WebScraper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  
  async init(options?: { headless?: boolean; proxy?: string }) {
    this.browser = await chromium.launch({ 
      headless: options?.headless ?? true 
    });
    this.context = await this.browser.newContext();
  }
  
  async scrape<T>(url: string, extractor: (page: Page) => Promise<T>): Promise<T> {
    if (!this.context) throw new Error('Scraper not initialized');
    
    const page = await this.context.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      return await extractor(page);
    } finally {
      await page.close();
    }
  }
  
  async close() {
    await this.context?.close();
    await this.browser?.close();
  }
}

// Usage
const scraper = new WebScraper();
await scraper.init();

const products = await scraper.scrape('https://example.com/products', async (page) => {
  return page.$$eval('.product', els =>
    els.map(el => ({ name: el.textContent?.trim() }))
  );
});

await scraper.close();
```

### Error Handling & Retry

```typescript
async function scrapeWithRetry<T>(
  url: string,
  extractor: (page: Page) => Promise<T>,
  maxRetries = 3
): Promise<T> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.goto(url, { timeout: 30000 });
      const result = await extractor(page);
      await browser.close();
      return result;
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) {
        await browser.close();
        throw error;
      }
      await page.waitForTimeout(2000 * (i + 1));
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

### Data Pipeline

```typescript
interface ScraperPipeline<T> {
  fetch: (page: Page) => Promise<any>;
  transform: (raw: any) => T;
  validate: (data: T) => boolean;
  save: (data: T) => Promise<void>;
}

async function runPipeline<T>(url: string, pipeline: ScraperPipeline<T>) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(url);
  
  const raw = await pipeline.fetch(page);
  const transformed = pipeline.transform(raw);
  
  if (pipeline.validate(transformed)) {
    await pipeline.save(transformed);
  }
  
  await browser.close();
}

// Usage
await runPipeline('https://example.com', {
  fetch: async (page) => page.$$eval('.item', els => els.map(el => el.textContent)),
  transform: (raw) => raw.map((text: string) => ({ title: text.trim() })),
  validate: (data) => data.length > 0,
  save: async (data) => console.log('Saved:', data)
});
```

### Performance Optimization

```typescript
// Block unnecessary resources
async function optimizedScraper() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  await context.route('**/*.{png,jpg,jpeg,gif,svg,css,woff,woff2}', route => route.abort());
  
  const page = await context.newPage();
  await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
  
  const data = await page.textContent('.content');
  await browser.close();
  return data;
}

// Reuse browser context
class ContextPool {
  private contexts: BrowserContext[] = [];
  
  async getContext(browser: Browser): Promise<BrowserContext> {
    if (this.contexts.length === 0) {
      return browser.newContext();
    }
    return this.contexts.pop()!;
  }
  
  releaseContext(context: BrowserContext) {
    this.contexts.push(context);
  }
}
```

### Testing Best Practices

```typescript
// Use test.step for better reporting
test('complex flow', async ({ page }) => {
  await test.step('Navigate to page', async () => {
    await page.goto('/');
  });
  
  await test.step('Fill form', async () => {
    await page.fill('[name="email"]', 'test@example.com');
  });
  
  await test.step('Submit and verify', async () => {
    await page.click('button[type="submit"]');
    await expect(page.locator('.success')).toBeVisible();
  });
});

// Custom matchers
expect.extend({
  async toHaveValidationError(locator: Locator, message: string) {
    const error = locator.locator('.error');
    const text = await error.textContent();
    return {
      pass: text === message,
      message: () => `Expected validation error "${message}", got "${text}"`
    };
  }
});

// Soft assertions
test('multiple checks', async ({ page }) => {
  await page.goto('/');
  await expect.soft(page.locator('h1')).toHaveText('Title');
  await expect.soft(page.locator('.subtitle')).toBeVisible();
  await expect.soft(page.locator('footer')).toContainText('2024');
  // All assertions run even if one fails
});
```

### CI/CD Integration

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Summary

**Testing Progression:**
1. Basic: Locators, assertions, simple flows
2. Intermediate: POM, fixtures, API testing, network mocking
3. Advanced: Parallel execution, visual regression, mobile testing
4. Professional: Custom fixtures, CI/CD, performance optimization

**Scraping Progression:**
1. Basic: Simple extraction, pagination, infinite scroll
2. Intermediate: Authentication, wait strategies, dynamic content
3. Advanced: Concurrent scraping, rate limiting, structured data
4. Professional: Scraper classes, error handling, data pipelines

**Key Principles:**
- Use auto-waiting (avoid manual waits)
- Prefer user-facing locators (role, text, label)
- Implement Page Object Model for maintainability
- Handle errors and retries gracefully
- Respect rate limits and robots.txt
- Block unnecessary resources for performance
- Use fixtures for test setup
- Run tests in parallel when possible
