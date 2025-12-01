---
title: "Git - Complete Guide from Beginner to Professional"
date: "2024-12-13"
category: "Development Tools"
tags: ["Git", "Version Control", "DevOps", "Collaboration", "Best Practices"]
---

# Git - Complete Guide

## Overview

**Git** is a distributed version control system for tracking changes in source code. Essential for modern software development and team collaboration.

### Key Features
- **Distributed**: Every developer has full history
- **Branching**: Lightweight and fast branches
- **Staging Area**: Control what gets committed
- **Speed**: Fast operations on local repository
- **Open Source**: Free and widely adopted

---

## Getting Started

### 1. Installation and Setup

```bash
# Install Git
# macOS: brew install git
# Ubuntu: sudo apt-get install git
# Windows: Download from git-scm.com

# Configure user
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Configure editor
git config --global core.editor "code --wait"  # VS Code
git config --global core.editor "vim"          # Vim

# View configuration
git config --list
git config user.name
```

### 2. First Repository

```bash
# Create new repository
mkdir my-project
cd my-project
git init

# Clone existing repository
git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git my-folder

# Check status
git status
```

### 3. Basic Workflow

```bash
# Create a file
echo "# My Project" > README.md

# Check status
git status

# Add to staging area
git add README.md
git add .                    # Add all files
git add *.js                 # Add all JS files
git add src/                 # Add directory

# Commit changes
git commit -m "Initial commit"
git commit -m "Add feature" -m "Detailed description"

# View history
git log
git log --oneline
git log --graph --oneline --all
```

---

## Core Concepts

### 1. Working Directory, Staging, Repository

```bash
# Working Directory -> Staging Area -> Repository

# Modify file
echo "New content" >> file.txt

# Check what changed
git diff                     # Working vs Staging
git diff --staged            # Staging vs Repository
git diff HEAD                # Working vs Repository

# Add to staging
git add file.txt

# Unstage
git restore --staged file.txt
git reset HEAD file.txt      # Old way

# Discard changes in working directory
git restore file.txt
git checkout -- file.txt     # Old way

# Remove file
git rm file.txt              # Remove and stage
git rm --cached file.txt     # Remove from Git, keep file

# Move/rename file
git mv old.txt new.txt
```

### 2. Commit History

```bash
# View commits
git log
git log --oneline
git log --graph --decorate --all
git log -p                   # Show diffs
git log -3                   # Last 3 commits
git log --since="2 weeks ago"
git log --author="John"
git log --grep="bug"
git log file.txt             # Commits affecting file

# Show commit details
git show HEAD
git show abc123
git show HEAD~2              # 2 commits before HEAD

# Search in history
git log -S "function_name"   # Find when text was added/removed
git log -G "regex"           # Find by regex

# Blame - who changed what
git blame file.txt
git blame -L 10,20 file.txt  # Lines 10-20
```

### 3. Branching

```bash
# List branches
git branch
git branch -a                # Include remote branches
git branch -v                # Show last commit

# Create branch
git branch feature-login
git checkout -b feature-login  # Create and switch
git switch -c feature-login    # New way

# Switch branch
git checkout feature-login
git switch feature-login       # New way

# Rename branch
git branch -m old-name new-name
git branch -m new-name         # Rename current branch

# Delete branch
git branch -d feature-login    # Safe delete
git branch -D feature-login    # Force delete

# Merge branch
git checkout main
git merge feature-login

# Delete remote branch
git push origin --delete feature-login
```

---

## Remote Repositories

### 1. Working with Remotes

```bash
# View remotes
git remote
git remote -v

# Add remote
git remote add origin https://github.com/user/repo.git

# Change remote URL
git remote set-url origin https://github.com/user/new-repo.git

# Remove remote
git remote remove origin

# Fetch from remote
git fetch origin
git fetch --all

# Pull from remote
git pull origin main
git pull                     # From tracked branch

# Push to remote
git push origin main
git push -u origin main      # Set upstream
git push                     # To tracked branch

# Push all branches
git push --all origin

# Push tags
git push --tags
```

### 2. Tracking Branches

```bash
# Create tracking branch
git checkout -b feature origin/feature
git checkout --track origin/feature

# Set upstream for existing branch
git branch -u origin/main
git push -u origin main

# View tracking branches
git branch -vv

# Prune deleted remote branches
git fetch --prune
git remote prune origin
```

---

## Advanced Operations

### 1. Rebasing

```bash
# Rebase current branch onto main
git checkout feature
git rebase main

# Interactive rebase
git rebase -i HEAD~3         # Last 3 commits
git rebase -i main

# During rebase
git rebase --continue        # After resolving conflicts
git rebase --skip            # Skip current commit
git rebase --abort           # Cancel rebase

# Rebase options in interactive mode:
# pick   - use commit
# reword - use commit, edit message
# edit   - use commit, stop for amending
# squash - combine with previous commit
# fixup  - like squash, discard message
# drop   - remove commit
```

### 2. Cherry-pick

```bash
# Apply specific commit to current branch
git cherry-pick abc123

# Cherry-pick multiple commits
git cherry-pick abc123 def456

# Cherry-pick without committing
git cherry-pick -n abc123

# Cherry-pick range
git cherry-pick abc123..def456
```

### 3. Stashing

```bash
# Stash changes
git stash
git stash save "Work in progress"

# List stashes
git stash list

# Apply stash
git stash apply              # Keep stash
git stash pop                # Apply and remove
git stash apply stash@{2}    # Apply specific stash

# Show stash contents
git stash show
git stash show -p stash@{0}

# Drop stash
git stash drop stash@{0}
git stash clear              # Remove all stashes

# Create branch from stash
git stash branch feature-branch stash@{0}
```

### 4. Reset and Revert

```bash
# Reset (changes history)
git reset --soft HEAD~1      # Undo commit, keep changes staged
git reset --mixed HEAD~1     # Undo commit, unstage changes
git reset --hard HEAD~1      # Undo commit, discard changes

# Reset to specific commit
git reset --hard abc123

# Revert (creates new commit)
git revert HEAD              # Revert last commit
git revert abc123            # Revert specific commit
git revert abc123..def456    # Revert range

# Revert merge commit
git revert -m 1 abc123
```

### 5. Tags

```bash
# List tags
git tag
git tag -l "v1.*"

# Create lightweight tag
git tag v1.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Tag specific commit
git tag -a v1.0.0 abc123 -m "Version 1.0.0"

# Show tag
git show v1.0.0

# Push tags
git push origin v1.0.0
git push --tags

# Delete tag
git tag -d v1.0.0
git push origin --delete v1.0.0

# Checkout tag
git checkout v1.0.0
```

---

## Real-World Scenarios

### 1. Feature Branch Workflow

```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/user-authentication

# Work on feature
git add .
git commit -m "Add login form"
git commit -m "Add authentication logic"

# Keep feature branch updated
git checkout main
git pull origin main
git checkout feature/user-authentication
git rebase main              # Or: git merge main

# Push feature branch
git push -u origin feature/user-authentication

# Create pull request on GitHub/GitLab
# After PR approved and merged
git checkout main
git pull origin main
git branch -d feature/user-authentication
```

### 2. Hotfix Workflow

```bash
# Critical bug in production
git checkout main
git pull origin main
git checkout -b hotfix/security-patch

# Fix the bug
git add .
git commit -m "Fix security vulnerability"

# Test the fix
# Push and deploy
git push -u origin hotfix/security-patch

# Merge to main
git checkout main
git merge hotfix/security-patch
git push origin main

# Merge to develop (if using gitflow)
git checkout develop
git merge hotfix/security-patch
git push origin develop

# Clean up
git branch -d hotfix/security-patch
git push origin --delete hotfix/security-patch
```

### 3. Resolving Merge Conflicts

```bash
# Attempt merge
git merge feature-branch
# CONFLICT (content): Merge conflict in file.txt

# Check conflicted files
git status

# Open file.txt and resolve conflicts
# <<<<<<< HEAD
# Current branch content
# =======
# Incoming branch content
# >>>>>>> feature-branch

# After resolving
git add file.txt
git commit -m "Resolve merge conflicts"

# Or abort merge
git merge --abort

# Use merge tool
git mergetool
```

### 4. Undoing Mistakes

```bash
# Scenario 1: Wrong commit message
git commit --amend -m "Correct message"

# Scenario 2: Forgot to add file
git add forgotten-file.txt
git commit --amend --no-edit

# Scenario 3: Committed to wrong branch
git checkout correct-branch
git cherry-pick abc123
git checkout wrong-branch
git reset --hard HEAD~1

# Scenario 4: Pushed wrong commit
git revert abc123
git push origin main

# Scenario 5: Need to undo last push (dangerous!)
git reset --hard HEAD~1
git push --force origin main  # Use with caution!

# Scenario 6: Recover deleted branch
git reflog
git checkout -b recovered-branch abc123

# Scenario 7: Recover deleted commits
git reflog
git cherry-pick abc123
```

### 5. Cleaning Up History

```bash
# Interactive rebase to clean up commits
git rebase -i HEAD~5

# Example: Squash commits
# pick abc123 Add feature
# squash def456 Fix typo
# squash ghi789 Fix another typo
# pick jkl012 Add tests

# Clean up local branches
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# Remove untracked files
git clean -n                 # Dry run
git clean -f                 # Remove files
git clean -fd                # Remove files and directories
git clean -fX                # Remove ignored files
git clean -fx                # Remove all untracked files
```

### 6. Working with Large Files

```bash
# Git LFS (Large File Storage)
git lfs install

# Track large files
git lfs track "*.psd"
git lfs track "*.mp4"

# Add .gitattributes
git add .gitattributes

# Normal git workflow
git add large-file.psd
git commit -m "Add design file"
git push origin main

# List tracked files
git lfs ls-files

# Fetch LFS files
git lfs fetch
git lfs pull
```

### 7. Bisect - Find Bug Introduction

```bash
# Start bisect
git bisect start
git bisect bad               # Current commit is bad
git bisect good abc123       # Known good commit

# Git checks out middle commit
# Test the code
git bisect good              # If works
git bisect bad               # If broken

# Repeat until found
# Git will identify the problematic commit

# Automate with script
git bisect run ./test.sh

# End bisect
git bisect reset
```

### 8. Submodules

```bash
# Add submodule
git submodule add https://github.com/user/lib.git libs/lib

# Clone repo with submodules
git clone --recursive https://github.com/user/repo.git

# Initialize submodules after clone
git submodule init
git submodule update

# Update submodules
git submodule update --remote

# Remove submodule
git submodule deinit libs/lib
git rm libs/lib
rm -rf .git/modules/libs/lib
```

---

## Team Collaboration

### 1. Pull Request Workflow

```bash
# Fork repository on GitHub
# Clone your fork
git clone https://github.com/your-username/repo.git
cd repo

# Add upstream remote
git remote add upstream https://github.com/original-owner/repo.git

# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to your fork
git push origin feature/new-feature

# Create pull request on GitHub

# Keep fork updated
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### 2. Code Review Process

```bash
# Fetch PR branch
git fetch origin pull/123/head:pr-123
git checkout pr-123

# Review changes
git diff main...pr-123
git log main..pr-123

# Test locally
# Run tests, check functionality

# Request changes or approve
# After approval, merge on GitHub

# Or merge locally
git checkout main
git merge --no-ff pr-123
git push origin main
```

### 3. Handling Multiple Remotes

```bash
# Add multiple remotes
git remote add origin https://github.com/user/repo.git
git remote add backup https://gitlab.com/user/repo.git
git remote add upstream https://github.com/original/repo.git

# Fetch from all remotes
git fetch --all

# Push to multiple remotes
git push origin main
git push backup main

# Set up push to multiple remotes
git remote set-url --add --push origin https://github.com/user/repo.git
git remote set-url --add --push origin https://gitlab.com/user/repo.git
git push origin main  # Pushes to both
```

---

## Git Workflows

### 1. Gitflow

```bash
# Main branches: main, develop

# Start feature
git checkout develop
git checkout -b feature/new-feature

# Finish feature
git checkout develop
git merge --no-ff feature/new-feature
git branch -d feature/new-feature
git push origin develop

# Start release
git checkout develop
git checkout -b release/1.0.0
# Bump version, fix bugs

# Finish release
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Version 1.0.0"
git checkout develop
git merge --no-ff release/1.0.0
git branch -d release/1.0.0

# Hotfix
git checkout main
git checkout -b hotfix/1.0.1
# Fix bug
git checkout main
git merge --no-ff hotfix/1.0.1
git tag -a v1.0.1 -m "Version 1.0.1"
git checkout develop
git merge --no-ff hotfix/1.0.1
git branch -d hotfix/1.0.1
```

### 2. GitHub Flow

```bash
# Simple workflow: main branch + feature branches

# Create feature branch
git checkout -b feature/add-login

# Make changes
git add .
git commit -m "Add login feature"

# Push and create PR
git push -u origin feature/add-login

# After PR approved
git checkout main
git pull origin main
git branch -d feature/add-login
```

### 3. Trunk-Based Development

```bash
# Everyone commits to main (or trunk)
# Short-lived feature branches (< 1 day)

git checkout main
git pull origin main
git checkout -b feature/quick-fix

# Make small change
git add .
git commit -m "Quick fix"

# Immediately merge
git checkout main
git merge feature/quick-fix
git push origin main
git branch -d feature/quick-fix
```

---

## Advanced Tips

### 1. Aliases

```bash
# Create aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual 'log --graph --oneline --all'
git config --global alias.amend 'commit --amend --no-edit'

# Use aliases
git co main
git br -a
git visual
```

### 2. Hooks

```bash
# Pre-commit hook (.git/hooks/pre-commit)
#!/bin/bash
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed. Commit aborted."
    exit 1
fi

# Pre-push hook (.git/hooks/pre-push)
#!/bin/bash
npm run lint
if [ $? -ne 0 ]; then
    echo "Linting failed. Push aborted."
    exit 1
fi

# Make executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push

# Use Husky for shared hooks
npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npm test"
```

### 3. .gitignore

```bash
# .gitignore file
node_modules/
*.log
.env
.DS_Store
build/
dist/
*.class
target/
.idea/
*.iml

# Ignore all except
*.log
!important.log

# Global gitignore
git config --global core.excludesfile ~/.gitignore_global

# Check if file is ignored
git check-ignore -v file.txt

# Force add ignored file
git add -f file.txt
```

### 4. Git Attributes

```bash
# .gitattributes file

# Line endings
* text=auto
*.sh text eol=lf
*.bat text eol=crlf

# Binary files
*.png binary
*.jpg binary

# Diff for specific files
*.json diff=json
*.md diff=markdown

# Merge strategies
database.xml merge=ours
```

### 5. Performance Tips

```bash
# Shallow clone (faster)
git clone --depth 1 https://github.com/user/repo.git

# Partial clone
git clone --filter=blob:none https://github.com/user/repo.git

# Sparse checkout
git clone --no-checkout https://github.com/user/repo.git
cd repo
git sparse-checkout init --cone
git sparse-checkout set src/main

# Garbage collection
git gc
git gc --aggressive

# Prune old objects
git prune

# Optimize repository
git repack -a -d --depth=250 --window=250
```

---

## Troubleshooting

### 1. Common Issues

```bash
# Detached HEAD state
git checkout main

# Merge conflicts
git status
# Resolve conflicts
git add .
git commit

# Accidentally committed sensitive data
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/file" \
  --prune-empty --tag-name-filter cat -- --all

# Or use BFG Repo-Cleaner
bfg --delete-files sensitive.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Corrupted repository
git fsck
git reflog
git reset --hard abc123

# Large repository
git gc --aggressive
git repack -a -d --depth=250 --window=250
```

### 2. Recovery

```bash
# Recover deleted branch
git reflog
git checkout -b recovered-branch abc123

# Recover deleted commits
git reflog
git cherry-pick abc123

# Recover from hard reset
git reflog
git reset --hard HEAD@{1}

# Recover deleted stash
git fsck --unreachable | grep commit
git show abc123
git stash apply abc123
```

---

## Best Practices

### 1. Commit Messages

```bash
# Good commit message format
# <type>(<scope>): <subject>
# 
# <body>
# 
# <footer>

# Examples:
feat(auth): add login functionality

fix(api): resolve null pointer exception in user service

docs(readme): update installation instructions

refactor(database): optimize query performance

test(user): add unit tests for user service

# Types: feat, fix, docs, style, refactor, test, chore
```

### 2. Branching Strategy

```bash
# Branch naming conventions
feature/user-authentication
bugfix/login-error
hotfix/security-patch
release/v1.0.0
docs/api-documentation

# Keep branches short-lived
# Merge frequently
# Delete merged branches
```

### 3. Security

```bash
# Never commit secrets
# Use environment variables
# Add .env to .gitignore

# Sign commits
git config --global user.signingkey YOUR_GPG_KEY
git config --global commit.gpgsign true
git commit -S -m "Signed commit"

# Verify signatures
git log --show-signature
```

---

## Resources

### Official
- [Git Documentation](https://git-scm.com/doc)
- [Pro Git Book](https://git-scm.com/book)
- [Git Reference](https://git-scm.com/docs)

### Tools
- [GitHub](https://github.com)
- [GitLab](https://gitlab.com)
- [Bitbucket](https://bitbucket.org)
- [GitKraken](https://www.gitkraken.com)
- [SourceTree](https://www.sourcetreeapp.com)

### Learning
- [Learn Git Branching](https://learngitbranching.js.org)
- [Git Immersion](http://gitimmersion.com)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)

---

## Congratulations!

You now master:
✅ Git fundamentals
✅ Branching and merging
✅ Remote repositories
✅ Advanced operations
✅ Real-world scenarios
✅ Team collaboration
✅ Git workflows
✅ Best practices

**Version control like a pro!**

---

*"Git is not just a tool, it's a time machine for your code."*

*Happy Coding! 🚀*
