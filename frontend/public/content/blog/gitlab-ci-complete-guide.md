# GitLab CI/CD - Complete Guide

## Table of Contents
- [Introduction](#introduction)
- [Pipeline Basics](#pipeline-basics)
- [Next.js Production Build](#nextjs-production-build)
- [Kotlin Maven Full Stack](#kotlin-maven-full-stack)
- [Testing Strategies](#testing-strategies)
- [Advanced Pipelines](#advanced-pipelines)
- [Best Practices](#best-practices)

---

## Introduction

### What is GitLab CI/CD?

GitLab CI/CD is a built-in continuous integration and deployment tool that automates your software development lifecycle.

**Key Concepts:**
- **Pipeline**: Collection of jobs organized in stages
- **Job**: Individual task (build, test, deploy)
- **Stage**: Group of jobs that run in parallel
- **Runner**: Agent that executes jobs
- **Artifact**: Files passed between jobs

### Pipeline File Structure

**.gitlab-ci.yml**
```yaml
stages:
  - build
  - test
  - deploy

build-job:
  stage: build
  script:
    - echo "Building..."

test-job:
  stage: test
  script:
    - echo "Testing..."
```

---

## Pipeline Basics

### Example 1: Hello World

**.gitlab-ci.yml**
```yaml
hello-job:
  script:
    - echo "Hello, GitLab CI!"
```

### Example 2: Multiple Stages

**.gitlab-ci.yml**
```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - echo "Building application"

test:
  stage: test
  script:
    - echo "Running tests"

deploy:
  stage: deploy
  script:
    - echo "Deploying to production"
```

### Example 3: Parallel Jobs

**.gitlab-ci.yml**
```yaml
stages:
  - test

unit-tests:
  stage: test
  script:
    - npm run test:unit

integration-tests:
  stage: test
  script:
    - npm run test:integration

e2e-tests:
  stage: test
  script:
    - npm run test:e2e
```

### Example 4: Conditional Execution

**.gitlab-ci.yml**
```yaml
deploy-production:
  stage: deploy
  script:
    - echo "Deploying to production"
  only:
    - main

deploy-staging:
  stage: deploy
  script:
    - echo "Deploying to staging"
  only:
    - develop

preview:
  stage: deploy
  script:
    - echo "Creating preview"
  only:
    - merge_requests
```

---

## Next.js Production Build

### Basic Next.js Build

**.gitlab-ci.yml**
```yaml
image: node:18

stages:
  - build
  - test

cache:
  paths:
    - node_modules/

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
    expire_in: 1 hour

lint:
  stage: test
  script:
    - npm ci
    - npm run lint
```

### Next.js with Testing

**.gitlab-ci.yml**
```yaml
image: node:18

stages:
  - install
  - test
  - build

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .npm/

install:
  stage: install
  script:
    - npm ci --cache .npm --prefer-offline

lint:
  stage: test
  needs: [install]
  script:
    - npm run lint

test:
  stage: test
  needs: [install]
  script:
    - npm test -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  needs: [lint, test]
  script:
    - npm run build
  artifacts:
    paths:
      - .next/
    expire_in: 1 week
```

### Next.js Deploy to Vercel

**.gitlab-ci.yml**
```yaml
image: node:18

stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/

deploy:
  stage: deploy
  script:
    - npm install -g vercel
    - vercel --prod --token=$VERCEL_TOKEN
  environment:
    name: production
    url: https://myapp.vercel.app
  only:
    - main
```

### Next.js with Environment Variables

**.gitlab-ci.yml**
```yaml
image: node:18

variables:
  NEXT_PUBLIC_API_URL: $API_URL

stages:
  - build

build:
  stage: build
  script:
    - echo "NEXT_PUBLIC_API_URL=$API_URL" >> .env.production
    - echo "DATABASE_URL=$DATABASE_URL" >> .env.production
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
      - .env.production
```

### Next.js with Docker

**.gitlab-ci.yml**
```yaml
image: docker:latest

services:
  - docker:dind

stages:
  - build
  - deploy

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest
  only:
    - main
```

---

## Kotlin Maven Full Stack

### Basic Kotlin Maven Build

**.gitlab-ci.yml**
```yaml
image: maven:3.8-openjdk-17

stages:
  - build
  - test

cache:
  paths:
    - .m2/repository

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=$CI_PROJECT_DIR/.m2/repository"

build:
  stage: build
  script:
    - mvn clean install -DskipTests

test:
  stage: test
  script:
    - mvn test
  artifacts:
    reports:
      junit:
        - target/surefire-reports/TEST-*.xml
```

### Kotlin Spring Boot with Tests

**.gitlab-ci.yml**
```yaml
image: maven:3.8-openjdk-17

stages:
  - test
  - build
  - package

cache:
  paths:
    - .m2/repository

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=$CI_PROJECT_DIR/.m2/repository"

unit-tests:
  stage: test
  script:
    - mvn test
  artifacts:
    reports:
      junit:
        - target/surefire-reports/TEST-*.xml
    paths:
      - target/surefire-reports/

integration-tests:
  stage: test
  script:
    - mvn verify -P integration-tests
  artifacts:
    reports:
      junit:
        - target/failsafe-reports/TEST-*.xml

build:
  stage: build
  needs: [unit-tests, integration-tests]
  script:
    - mvn clean package -DskipTests
  artifacts:
    paths:
      - target/*.jar
    expire_in: 1 week

docker-build:
  stage: package
  image: docker:latest
  services:
    - docker:dind
  needs: [build]
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

### Full Stack: Kotlin Backend + Next.js Frontend

**.gitlab-ci.yml**
```yaml
stages:
  - test
  - build
  - deploy

variables:
  MAVEN_OPTS: "-Dmaven.repo.local=$CI_PROJECT_DIR/.m2/repository"

# Backend Jobs
backend-test:
  image: maven:3.8-openjdk-17
  stage: test
  cache:
    paths:
      - .m2/repository
  script:
    - cd backend
    - mvn test
  artifacts:
    reports:
      junit:
        - backend/target/surefire-reports/TEST-*.xml

backend-build:
  image: maven:3.8-openjdk-17
  stage: build
  needs: [backend-test]
  cache:
    paths:
      - .m2/repository
  script:
    - cd backend
    - mvn clean package -DskipTests
  artifacts:
    paths:
      - backend/target/*.jar
    expire_in: 1 week

# Frontend Jobs
frontend-test:
  image: node:18
  stage: test
  cache:
    key: ${CI_COMMIT_REF_SLUG}-frontend
    paths:
      - frontend/node_modules/
  script:
    - cd frontend
    - npm ci
    - npm test

frontend-build:
  image: node:18
  stage: build
  needs: [frontend-test]
  cache:
    key: ${CI_COMMIT_REF_SLUG}-frontend
    paths:
      - frontend/node_modules/
  script:
    - cd frontend
    - npm ci
    - npm run build
  artifacts:
    paths:
      - frontend/.next/
    expire_in: 1 week

# Deploy
deploy:
  stage: deploy
  needs: [backend-build, frontend-build]
  script:
    - echo "Deploying full stack application"
  only:
    - main
```

### Kotlin with PostgreSQL

**.gitlab-ci.yml**
```yaml
image: maven:3.8-openjdk-17

services:
  - postgres:15

variables:
  POSTGRES_DB: testdb
  POSTGRES_USER: testuser
  POSTGRES_PASSWORD: testpass
  SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/testdb
  SPRING_DATASOURCE_USERNAME: testuser
  SPRING_DATASOURCE_PASSWORD: testpass

stages:
  - test

integration-tests:
  stage: test
  script:
    - mvn verify -P integration-tests
  artifacts:
    reports:
      junit:
        - target/failsafe-reports/TEST-*.xml
```

---

## Testing Strategies

### Unit Tests with Coverage

**.gitlab-ci.yml**
```yaml
image: node:18

stages:
  - test

unit-tests:
  stage: test
  script:
    - npm ci
    - npm run test:unit -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

### Integration Tests

**.gitlab-ci.yml**
```yaml
image: maven:3.8-openjdk-17

services:
  - postgres:15
  - redis:7

variables:
  POSTGRES_DB: testdb
  POSTGRES_USER: test
  POSTGRES_PASSWORD: test
  REDIS_HOST: redis

stages:
  - test

integration-tests:
  stage: test
  script:
    - mvn verify -P integration-tests
  artifacts:
    reports:
      junit:
        - target/failsafe-reports/TEST-*.xml
```

### E2E Tests with Playwright

**.gitlab-ci.yml**
```yaml
image: mcr.microsoft.com/playwright:v1.40.0-focal

stages:
  - test

e2e-tests:
  stage: test
  script:
    - npm ci
    - npx playwright install
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 1 week
```

### Performance Tests

**.gitlab-ci.yml**
```yaml
image: node:18

stages:
  - test

lighthouse:
  stage: test
  script:
    - npm ci
    - npm run build
    - npm install -g @lhci/cli
    - lhci autorun
  artifacts:
    paths:
      - .lighthouseci/
```

---

## Advanced Pipelines

### Monorepo with Rules

**.gitlab-ci.yml**
```yaml
stages:
  - test
  - build

backend-test:
  stage: test
  image: maven:3.8-openjdk-17
  script:
    - cd backend
    - mvn test
  rules:
    - changes:
        - backend/**/*

frontend-test:
  stage: test
  image: node:18
  script:
    - cd frontend
    - npm ci
    - npm test
  rules:
    - changes:
        - frontend/**/*

backend-build:
  stage: build
  image: maven:3.8-openjdk-17
  needs: [backend-test]
  script:
    - cd backend
    - mvn package -DskipTests
  rules:
    - changes:
        - backend/**/*

frontend-build:
  stage: build
  image: node:18
  needs: [frontend-test]
  script:
    - cd frontend
    - npm ci
    - npm run build
  rules:
    - changes:
        - frontend/**/*
```

### Multi-Environment Deployment

**.gitlab-ci.yml**
```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy-staging:
  stage: deploy
  script:
    - echo "Deploying to staging"
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy-production:
  stage: deploy
  script:
    - echo "Deploying to production"
  environment:
    name: production
    url: https://example.com
  when: manual
  only:
    - main
```

### Dynamic Child Pipelines

**.gitlab-ci.yml**
```yaml
generate-pipeline:
  stage: build
  script:
    - echo "stages:" > pipeline.yml
    - echo "  - test" >> pipeline.yml
    - echo "test-job:" >> pipeline.yml
    - echo "  stage: test" >> pipeline.yml
    - echo "  script:" >> pipeline.yml
    - echo "    - echo 'Testing'" >> pipeline.yml
  artifacts:
    paths:
      - pipeline.yml

trigger-pipeline:
  stage: deploy
  trigger:
    include:
      - artifact: pipeline.yml
        job: generate-pipeline
```

### Scheduled Pipelines

**.gitlab-ci.yml**
```yaml
cleanup:
  script:
    - echo "Running cleanup"
  only:
    - schedules

backup:
  script:
    - echo "Running backup"
  only:
    - schedules
  variables:
    BACKUP_TYPE: "full"
```

### Deploy to Kubernetes

**.gitlab-ci.yml**
```yaml
image: google/cloud-sdk:alpine

stages:
  - build
  - deploy

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - echo $KUBE_CONFIG | base64 -d > kubeconfig
    - export KUBECONFIG=kubeconfig
    - kubectl set image deployment/app app=$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - kubectl rollout status deployment/app
  environment:
    name: production
    kubernetes:
      namespace: production
  only:
    - main
```

---

## Best Practices

### Caching Strategy

**.gitlab-ci.yml**
```yaml
image: node:18

cache:
  key:
    files:
      - package-lock.json
  paths:
    - node_modules/
    - .npm/

before_script:
  - npm ci --cache .npm --prefer-offline

test:
  script:
    - npm test

build:
  script:
    - npm run build
```

### Artifacts Management

**.gitlab-ci.yml**
```yaml
build:
  script:
    - npm run build
  artifacts:
    name: "$CI_JOB_NAME-$CI_COMMIT_REF_NAME"
    paths:
      - dist/
    expire_in: 1 week
    reports:
      dotenv: build.env

test:
  script:
    - npm test
  artifacts:
    when: always
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

### Security Scanning

**.gitlab-ci.yml**
```yaml
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml
  - template: Security/Container-Scanning.gitlab-ci.yml

stages:
  - test
  - security

sast:
  stage: security

dependency_scanning:
  stage: security

container_scanning:
  stage: security
  variables:
    CS_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

### Reusable Configuration

**.gitlab-ci-templates.yml**
```yaml
.node-template:
  image: node:18
  cache:
    paths:
      - node_modules/
  before_script:
    - npm ci

.maven-template:
  image: maven:3.8-openjdk-17
  cache:
    paths:
      - .m2/repository
  variables:
    MAVEN_OPTS: "-Dmaven.repo.local=$CI_PROJECT_DIR/.m2/repository"
```

**.gitlab-ci.yml**
```yaml
include:
  - local: '.gitlab-ci-templates.yml'

test-frontend:
  extends: .node-template
  script:
    - npm test

test-backend:
  extends: .maven-template
  script:
    - mvn test
```

### Parallel Matrix

**.gitlab-ci.yml**
```yaml
test:
  parallel:
    matrix:
      - NODE_VERSION: ['16', '18', '20']
        OS: ['ubuntu', 'alpine']
  image: node:${NODE_VERSION}-${OS}
  script:
    - npm test
```

### Resource Optimization

**.gitlab-ci.yml**
```yaml
variables:
  GIT_DEPTH: 10
  GIT_STRATEGY: fetch

test:
  interruptible: true
  timeout: 10 minutes
  retry:
    max: 2
    when:
      - runner_system_failure
      - stuck_or_timeout_failure
  script:
    - npm test
```

---

## Summary

### Key Concepts
- Pipelines organize jobs into stages
- Jobs run in parallel within stages
- Artifacts pass data between jobs
- Cache speeds up repeated builds
- Rules control job execution

### GitLab vs GitHub Actions

| Feature | GitLab CI | GitHub Actions |
|---------|-----------|----------------|
| Config File | `.gitlab-ci.yml` | `.github/workflows/*.yml` |
| Execution Unit | Job | Step |
| Grouping | Stage | Job |
| Parallel Execution | Jobs in same stage | Jobs with no dependencies |
| Artifacts | Built-in | actions/upload-artifact |
| Cache | Built-in | actions/cache |
| Secrets | CI/CD Variables | Secrets |

### Common Patterns
- Build → Test → Deploy
- Monorepo with path rules
- Multi-environment deployments
- Scheduled maintenance
- Security scanning

### Resources
- GitLab CI Docs: https://docs.gitlab.com/ee/ci/
- CI/CD Templates: https://gitlab.com/gitlab-org/gitlab/-/tree/master/lib/gitlab/ci/templates
- GitLab CI Examples: https://docs.gitlab.com/ee/ci/examples/

**Master GitLab CI/CD for professional pipelines!** 🚀
