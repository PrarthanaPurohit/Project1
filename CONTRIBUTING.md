# Contributing to MERN Showcase Platform

Thank you for your interest in contributing to the MERN Showcase Platform! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or insulting comments
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/mern-showcase-platform.git
   cd mern-showcase-platform
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/original-owner/mern-showcase-platform.git
   ```

4. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

5. **Configure environment:**
   - Copy `.env.example` to `.env` in both backend and frontend
   - Update with your local configuration

6. **Seed database:**
   ```bash
   cd backend
   npm run seed:samples
   ```

7. **Start development servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run backend tests
cd backend
npm test

# Test manually
# - Test affected features in browser
# - Test on different screen sizes
# - Test error cases
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

See [Commit Guidelines](#commit-guidelines) below.

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create Pull Request

- Go to GitHub and create a pull request
- Fill out the PR template
- Link related issues
- Request review

## Coding Standards

### JavaScript/TypeScript

**General:**
- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use async/await instead of callbacks

**Naming Conventions:**
- Variables and functions: `camelCase`
- Classes and components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `camelCase.js` or `PascalCase.tsx` for components

**Example:**
```javascript
// Good
const getUserData = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

// Bad
var get_user_data = function(user_id) {
  User.findById(user_id, function(err, user) {
    return user;
  });
};
```

### React Components

**Functional Components:**
```typescript
// Good
const ProjectCard = ({ project }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
    </div>
  );
};

export default ProjectCard;
```

**Component Organization:**
1. Imports
2. Type definitions (TypeScript)
3. Component definition
4. Hooks
5. Event handlers
6. Render logic
7. Export

### Backend Code

**Controller Pattern:**
```javascript
// Good
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**Error Handling:**
- Always use try-catch blocks
- Return consistent error responses
- Log errors appropriately

### CSS/Styling

- Use meaningful class names
- Follow BEM naming convention when applicable
- Keep styles modular and reusable
- Use CSS variables for colors and spacing
- Ensure responsive design

## Testing Guidelines

### Backend Tests

**Unit Tests:**
```javascript
describe('Project Controller', () => {
  test('should get all projects', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
```

**Test Coverage:**
- Write tests for new features
- Update tests when modifying existing features
- Aim for at least 70% code coverage
- Test both success and error cases

### Frontend Tests

Currently, frontend tests are not implemented. When adding tests:
- Use React Testing Library
- Test user interactions
- Test component rendering
- Test error states

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(admin): add project filtering functionality

Add ability to filter projects by date and status in admin panel.
Includes search input and filter dropdown components.

Closes #123

---

fix(api): resolve image upload error

Fix issue where large images caused upload to fail.
Increased max file size and improved error handling.

Fixes #456

---

docs: update API documentation

Add examples for all endpoints and improve error code descriptions.
```

### Commit Message Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line should be 50 characters or less
- Reference issues and pull requests when applicable
- Provide detailed description in body for complex changes

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow guidelines
- [ ] Branch is up to date with main

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. **Automated Checks:**
   - Tests must pass
   - Code must build successfully

2. **Code Review:**
   - At least one approval required
   - Address all review comments
   - Make requested changes

3. **Merge:**
   - Squash and merge (preferred)
   - Delete branch after merge

## Reporting Bugs

### Before Reporting

- Check existing issues to avoid duplicates
- Test with the latest version
- Gather relevant information

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 96, Firefox 95]
- Node.js version: [e.g., 18.0.0]
- MongoDB version: [e.g., 6.0]

## Additional Context
Any other relevant information
```

## Suggesting Enhancements

### Enhancement Template

```markdown
## Feature Description
Clear description of the proposed feature

## Problem It Solves
What problem does this feature address?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Mockups, examples, or references
```

## Development Tips

### Debugging

**Backend:**
```javascript
// Use console.log for quick debugging
console.log('Debug:', variable);

// Use debugger statement
debugger;

// Check logs
npm run dev  // Watch console output
```

**Frontend:**
```javascript
// React DevTools
// Install React DevTools browser extension

// Console logging
console.log('Component rendered:', props);

// Network tab
// Check API requests in browser DevTools
```

### Common Issues

**MongoDB Connection:**
```bash
# Ensure MongoDB is running
mongod

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/showcase
```

**Port Conflicts:**
```bash
# Change port in backend/.env
PORT=5001
```

**CORS Errors:**
```javascript
// Update CORS configuration in server.js
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

## Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues for similar questions

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing! 🎉
