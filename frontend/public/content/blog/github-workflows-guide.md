# GitHub Workflows - Complete CI/CD Guide

## Table of Contents
- [Introduction](#introduction)
- [Workflow Basics](#workflow-basics)
- [Next.js Production Build](#nextjs-production-build)
- [Kotlin Maven Full Stack](#kotlin-maven-full-stack)
- [Testing Strategies](#testing-strategies)
- [Advanced Workflows](#advanced-workflows)
- [Best Practices](#best-practices)

---

## Introduction

### What are GitHub Actions?

GitHub Actions is a CI/CD platform that automates build, test, and deployment pipelines directly in your repository.

**Key Concepts:**
- **Workflow**: Automated process defined in YAML
- **Event**: Trigger that starts a workflow (push, pull_request, schedule)
- **Job**: Set of steps executed on a runner
- **Step**: Individual task (action or shell command)
- **Runner**: Server that executes workflows

### Workflow File Structure

```yaml
name: Workflow Name
on: [push, pull_request]
jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: echo "Hello World"
```

---

## Workflow Basics

### Example 1: Hello World

**.github/workflows/hello.yml**
```yaml
name: Hello World
on: [push]
jobs:
  greet:
    runs-on: ubuntu-latest
    steps:
      - name: Say Hello
        run: echo "Hello, GitHub Actions!"
```

### Example 2: Multiple Jobs

**.github/workflows/multi-job.yml**
```yaml
name: Multiple Jobs
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: echo "Building..."
  
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: echo "Testing..."
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying..."
```

### Example 3: Matrix Strategy

**.github/workflows/matrix.yml**
```yaml
name: Matrix Build
on: [push]
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [16, 18, 20]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

### Example 4: Conditional Execution

**.github/workflows/conditional.yml**
```yaml
name: Conditional
on: [push, pull_request]
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to production"
  
  preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - run: echo "Creating preview"
```

---

## Next.js Production Build

### Basic Next.js Build

**.github/workflows/nextjs-basic.yml**
```yaml
name: Next.js Build
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

### Next.js with Testing

**.github/workflows/nextjs-test.yml**
```yaml
name: Next.js CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: nextjs-build
          path: .next/
```

### Next.js Deploy to Vercel

**.github/workflows/nextjs-vercel.yml**
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Next.js with Environment Variables

**.github/workflows/nextjs-env.yml**
```yaml
name: Next.js with Env
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Create .env file
        run: |
          echo "NEXT_PUBLIC_API_URL=${{ secrets.API_URL }}" >> .env.production
          echo "DATABASE_URL=${{ secrets.DATABASE_URL }}" >> .env.production
```

---

## Kotlin Maven Full Stack

### Basic Kotlin Maven Build

**.github/workflows/kotlin-basic.yml**
```yaml
name: Kotlin Maven Build
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-java@v3
        with:
          java-version: 17
          distribution: 'temurin'
          cache: 'maven'
      
      - name: Build with Maven
        run: mvn clean install -DskipTests
      
      - name: Run tests
        run: mvn test
```

### Kotlin Spring Boot with Tests

**.github/workflows/kotlin-spring.yml**
```yaml
name: Kotlin Spring Boot CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-java@v3
        with:
          java-version: 17
          distribution: 'temurin'
          cache: 'maven'
      
      - name: Run unit tests
        run: mvn test
      
      - name: Run integration tests
        run: mvn verify -P integration-tests
      
      - name: Generate test report
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Maven Tests
          path: target/surefire-reports/*.xml
          reporter: java-junit
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-java@v3
        with:
          java-version: 17
          distribution: 'temurin'
          cache: 'maven'
      
      - name: Build JAR
        run: mvn clean package -DskipTests
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: spring-boot-app
          path: target/*.jar
```

### Full Stack: Kotlin Backend + Next.js Frontend

**.github/workflows/fullstack.yml**
```yaml
name: Full Stack CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-java@v3
        with:
          java-version: 17
          distribution: 'temurin'
          cache: 'maven'
      
      - name: Test backend
        run: mvn test
        working-directory: ./backend
  
  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: npm ci
        working-directory: ./frontend
      
      - name: Test frontend
        run: npm test
        working-directory: ./frontend
  
  build:
    needs: [backend-test, frontend-test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-java@v3
        with:
          java-version: 17
          distribution: 'temurin'
          cache: 'maven'
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Build backend
        run: mvn clean package -DskipTests
        working-directory: ./backend
      
      - name: Build frontend
        run: |
          npm ci
          npm run build
        working-directory: ./frontend
      
      - name: Upload backend artifact
        uses: actions/upload-artifact@v3
        with:
          name: backend-jar
          path: backend/target/*.jar
      
      - name: Upload frontend artifact
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: frontend/.next/
```

### Kotlin with Docker

**.github/workflows/kotlin-docker.yml**
```yaml
name: Kotlin Docker Build
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-java@v3
        with:
          java-version: 17
          distribution: 'temurin'
          cache: 'maven'
      
      - name: Build with Maven
        run: mvn clean package -DskipTests
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: user/app:latest
```

---

## Testing Strategies

### Unit Tests

**.github/workflows/unit-tests.yml**
```yaml
name: Unit Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run test:unit
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Integration Tests

**.github/workflows/integration-tests.yml**
```yaml
name: Integration Tests
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-java@v3
        with:
          java-version: 17
          distribution: 'temurin'
      
      - name: Run integration tests
        run: mvn verify -P integration-tests
        env:
          DATABASE_URL: jdbc:postgresql://localhost:5432/test
          DATABASE_USER: postgres
          DATABASE_PASSWORD: postgres
```

### E2E Tests with Playwright

**.github/workflows/e2e-tests.yml**
```yaml
name: E2E Tests
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Performance Tests

**.github/workflows/performance.yml**
```yaml
name: Performance Tests
on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      - run: npm run build
      
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/about
          uploadArtifacts: true
```

---

## Advanced Workflows

### Monorepo with Caching

**.github/workflows/monorepo.yml**
```yaml
name: Monorepo CI
on: [push]

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      backend: ${{ steps.filter.outputs.backend }}
      frontend: ${{ steps.filter.outputs.frontend }}
    steps:
      - uses: actions/checkout@v3
      - uses: dorny/paths-filter@v2
        id: filter
        with:
          filters: |
            backend:
              - 'backend/**'
            frontend:
              - 'frontend/**'
  
  backend:
    needs: changes
    if: needs.changes.outputs.backend == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: 17
          distribution: 'temurin'
          cache: 'maven'
      - run: mvn test
        working-directory: ./backend
  
  frontend:
    needs: changes
    if: needs.changes.outputs.frontend == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
        working-directory: ./frontend
      - run: npm test
        working-directory: ./frontend
```

### Semantic Release

**.github/workflows/release.yml**
```yaml
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - run: npm ci
      
      - name: Semantic Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release
```

### Deploy to AWS

**.github/workflows/aws-deploy.yml**
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Build and push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
          docker build -t app .
          docker tag app:latest ${{ secrets.ECR_REGISTRY }}/app:latest
          docker push ${{ secrets.ECR_REGISTRY }}/app:latest
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster prod --service app --force-new-deployment
```

### Scheduled Workflows

**.github/workflows/scheduled.yml**
```yaml
name: Scheduled Tasks
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:  # Manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running cleanup"
  
  backup:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running backup"
```

---

## Best Practices

### Security

```yaml
name: Security Scan
on: [push]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      
      - name: Run Trivy
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
```

### Reusable Workflows

**.github/workflows/reusable-build.yml**
```yaml
name: Reusable Build
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci
      - run: npm run build
```

**Usage:**
```yaml
name: Main Workflow
on: [push]

jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml
    with:
      node-version: '18'
```

### Composite Actions

**.github/actions/setup-app/action.yml**
```yaml
name: Setup App
description: Setup Node and install dependencies

runs:
  using: composite
  steps:
    - uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
    - run: npm ci
      shell: bash
```

### Optimization

```yaml
name: Optimized Workflow
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Cache dependencies
      - uses: actions/cache@v3
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      
      # Parallel jobs
      - run: npm ci
      - run: npm run lint & npm run test & npm run build
```

---

## Summary

### Key Concepts
- Workflows automate CI/CD pipelines
- Jobs run in parallel, steps run sequentially
- Matrix strategies test multiple configurations
- Artifacts share data between jobs
- Secrets store sensitive data securely

### Common Patterns
- Build → Test → Deploy
- Monorepo with path filtering
- Multi-stage Docker builds
- Semantic versioning
- Scheduled maintenance

### Resources
- GitHub Actions Docs: https://docs.github.com/actions
- Marketplace: https://github.com/marketplace?type=actions
- Awesome Actions: https://github.com/sdras/awesome-actions

**Master GitHub Workflows for professional CI/CD!** 🚀
