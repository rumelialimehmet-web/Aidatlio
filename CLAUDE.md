# CLAUDE.md - AI Assistant Guide for Aidatlio

> **Last Updated**: 2025-11-14
> **Repository**: rumelialimehmet-web/Aidatlio

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Status](#repository-status)
3. [Development Workflow](#development-workflow)
4. [Branch Management](#branch-management)
5. [Codebase Structure](#codebase-structure)
6. [Development Conventions](#development-conventions)
7. [Testing Strategy](#testing-strategy)
8. [AI Assistant Guidelines](#ai-assistant-guidelines)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Aidatlio** is currently in its initial setup phase. This document serves as a comprehensive guide for AI assistants to understand the project structure, conventions, and workflows.

### Project Goals

- To be defined as development progresses

### Tech Stack

- To be determined based on initial implementation

---

## Repository Status

**Current State**: New repository - no code committed yet

This repository is in its initial phase. As development progresses, this document should be updated to reflect:
- Chosen technology stack
- Architecture decisions
- Key dependencies
- Project structure

---

## Development Workflow

### General Development Process

1. **Branch Creation**: Always create feature branches following the naming convention
2. **Development**: Make incremental changes with clear, focused commits
3. **Testing**: Ensure all tests pass before pushing
4. **Code Review**: Push changes for review before merging to main
5. **Documentation**: Update relevant documentation as code changes

### Git Workflow

```bash
# Start new feature
git checkout -b feature/your-feature-name

# Make changes, commit frequently
git add .
git commit -m "descriptive commit message"

# Push to remote
git push -u origin feature/your-feature-name
```

---

## Branch Management

### Branch Naming Conventions

- **Feature branches**: `feature/description` or `feat/description`
- **Bug fixes**: `fix/description` or `bugfix/description`
- **Hotfixes**: `hotfix/description`
- **Claude AI branches**: `claude/claude-md-{session-id}`
- **Documentation**: `docs/description`
- **Refactoring**: `refactor/description`

### Protected Branches

- **main/master**: Production-ready code
- Requires pull request review
- All tests must pass

### Claude-Specific Branch Requirements

When Claude AI is working on the codebase:
- All development occurs on branches starting with `claude/` and ending with the session ID
- Branch format: `claude/claude-md-{unique-session-id}`
- Always push to the designated branch using: `git push -u origin <branch-name>`
- Never push to main/master or other branches without explicit permission

---

## Codebase Structure

> **Note**: This section will be updated as the codebase develops

### Recommended Project Structure

```
Aidatlio/
├── .github/              # GitHub workflows and templates
├── docs/                 # Documentation
├── src/                  # Source code
│   ├── components/       # Reusable components
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   └── types/            # Type definitions
├── tests/                # Test files
├── scripts/              # Build and utility scripts
├── .gitignore           # Git ignore rules
├── README.md            # Project readme
├── CLAUDE.md            # This file
└── package.json         # Dependencies (if Node.js)
```

### Key Directories

To be defined based on chosen technology stack.

---

## Development Conventions

### Code Style

#### General Principles
- **Clarity over cleverness**: Write code that is easy to understand
- **Consistency**: Follow established patterns in the codebase
- **DRY (Don't Repeat Yourself)**: Extract common logic into reusable functions
- **SOLID principles**: Write maintainable, extensible code

#### Naming Conventions
- **Variables**: Use descriptive, camelCase names
- **Functions**: Use verb-noun combinations (e.g., `getUserData`, `validateInput`)
- **Classes**: Use PascalCase (e.g., `UserService`, `DataValidator`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`, `API_BASE_URL`)
- **Files**: Use kebab-case for file names (e.g., `user-service.js`, `data-validator.ts`)

#### Comments and Documentation
- Write self-documenting code when possible
- Use comments to explain **why**, not **what**
- Document complex algorithms or business logic
- Keep comments up-to-date with code changes

### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(auth): add user authentication flow

Implemented JWT-based authentication with refresh tokens.
Includes login, logout, and token refresh endpoints.

Closes #123
```

```
fix(api): resolve race condition in data fetch

Added proper locking mechanism to prevent concurrent
requests from causing data inconsistency.
```

---

## Testing Strategy

### Test Coverage Goals

- Aim for >80% code coverage
- 100% coverage for critical business logic
- All edge cases should have corresponding tests

### Testing Levels

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test interaction between modules
3. **End-to-End Tests**: Test complete user workflows
4. **Performance Tests**: Ensure code meets performance requirements

### Test Organization

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/            # End-to-end tests
└── fixtures/       # Test data and mocks
```

### Running Tests

```bash
# Run all tests
npm test  # or equivalent command

# Run specific test suite
npm test -- path/to/test

# Run with coverage
npm test -- --coverage
```

---

## AI Assistant Guidelines

### Code Quality Standards

When working as an AI assistant on this codebase:

1. **Security First**
   - Never introduce security vulnerabilities
   - Avoid: SQL injection, XSS, command injection, path traversal
   - Sanitize all user inputs
   - Use parameterized queries
   - Validate and escape data appropriately

2. **Error Handling**
   - Always handle errors gracefully
   - Provide meaningful error messages
   - Log errors appropriately for debugging
   - Never expose sensitive information in error messages

3. **Performance Considerations**
   - Optimize for readability first, performance second
   - Profile before optimizing
   - Avoid premature optimization
   - Consider scalability in design decisions

4. **Code Review Checklist**
   - Does the code work as intended?
   - Is it secure?
   - Is it testable?
   - Is it maintainable?
   - Does it follow project conventions?
   - Are there adequate tests?
   - Is documentation updated?

### Task Management

- Use the TodoWrite tool to track multi-step tasks
- Break complex tasks into smaller, manageable steps
- Mark tasks as completed immediately after finishing
- Keep only one task in_progress at a time

### Communication

- Be concise and clear
- Avoid unnecessary emojis unless requested
- Focus on technical accuracy
- Provide code references with line numbers: `file_path:line_number`

### Git Operations

- Always commit changes with descriptive messages
- Push to the correct branch (usually starts with `claude/`)
- Never force push to protected branches
- If push fails due to network errors, retry up to 4 times with exponential backoff

---

## Common Tasks

### Adding a New Feature

1. Create a feature branch
2. Implement the feature with tests
3. Update documentation
4. Commit changes with conventional commit messages
5. Push to remote branch
6. Create pull request

### Fixing a Bug

1. Create a bugfix branch
2. Write a failing test that reproduces the bug
3. Fix the bug
4. Verify the test passes
5. Commit and push changes

### Refactoring Code

1. Ensure existing tests pass
2. Make refactoring changes
3. Verify all tests still pass
4. Update documentation if necessary
5. Commit with `refactor:` prefix

### Updating Dependencies

1. Review changelog for breaking changes
2. Update dependency version
3. Run tests to verify compatibility
4. Update code if necessary
5. Document any breaking changes

---

## Troubleshooting

### Common Issues

#### Git Push Fails

```bash
# Retry with exponential backoff
git push -u origin <branch-name>

# If it continues to fail, check:
# - Branch name starts with 'claude/' and ends with session ID
# - You have proper permissions
# - Network connectivity is stable
```

#### Tests Failing

1. Check if dependencies are installed
2. Verify environment variables are set
3. Review test output for specific errors
4. Run tests in isolation to identify the issue

#### Build Errors

1. Clear build cache
2. Reinstall dependencies
3. Check for conflicting versions
4. Review error messages for specific issues

---

## Project Evolution

As this project develops, please update this document with:

- **Architecture Decisions**: Document key technical decisions
- **API Conventions**: REST/GraphQL conventions, endpoint naming
- **Database Schema**: Entity relationships and conventions
- **Deployment Process**: How code moves from development to production
- **Environment Variables**: Required configuration
- **External Dependencies**: Third-party services and APIs
- **Performance Benchmarks**: Expected performance metrics
- **Security Considerations**: Authentication, authorization, data protection

---

## Contributing

### For AI Assistants

When making changes to this repository:

1. Analyze the request thoroughly
2. Use appropriate tools (Glob, Grep, Read) to understand existing code
3. Make minimal, focused changes
4. Test your changes
5. Update documentation
6. Commit with clear messages
7. Push to the designated branch

### Documentation Updates

This CLAUDE.md file should be updated whenever:
- Project structure changes significantly
- New conventions are established
- Technology stack decisions are made
- Development workflow changes
- New tools or services are integrated

---

## Resources

### Helpful Commands

```bash
# View git status
git status

# View recent commits
git log --oneline -10

# View file changes
git diff

# List all branches
git branch -a

# Search for code
grep -r "search_term" src/

# Find files
find . -name "*.js" -type f
```

### Best Practices References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Git Flow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-14 | 1.0.0 | Initial CLAUDE.md creation for new repository |

---

**Note to AI Assistants**: This document is your primary reference for understanding this codebase. Always consult it before making significant changes. When the codebase evolves, update this document to reflect the current state of the project.
