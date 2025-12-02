# Contributing to Student Productivity Tracker

Thank you for your interest in contributing to the Student Productivity Tracker project! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and professional in all interactions with other contributors and maintainers.

## Getting Started

### Prerequisites
- Node.js v14+
- npm v6+
- Git
- Basic knowledge of JavaScript and Express.js

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/student-productivity-tracker.git
   cd student-productivity-tracker
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/student-productivity-tracker.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Making Changes

### Code Style Guidelines

- Follow JavaScript ES6+ standards
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use consistent indentation (2 spaces)

### Commit Messages

- Use clear, descriptive commit messages
- Start with an action verb (Add, Fix, Update, Remove, etc.)
- Keep messages concise but informative
- Reference issue numbers when applicable

Examples:
```
Add LeetCode stats caching
Fix mobile usage calculation bug
Update API documentation
Remove deprecated endpoints
```

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Test both success and error scenarios

```bash
npm test
```

## Pull Request Process

### Before Submitting

1. **Update your fork with latest changes**
   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Check code style**
   ```bash
   npm run lint
   ```

4. **Build if applicable**
   ```bash
   npm run build
   ```

### Creating a Pull Request

1. **Push your branch to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Go to GitHub and create a Pull Request**
   - Provide a clear title
   - Write a detailed description
   - Reference any related issues
   - Include screenshots for UI changes

3. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Related Issues
   Closes #123

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Changes Made
   - Change 1
   - Change 2

   ## Testing
   How to test the changes

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Comments added for complex code
   - [ ] Tests added/updated
   - [ ] Documentation updated
   ```

## Areas to Contribute

### 🐛 Bug Reports
- Check if issue already exists
- Provide clear description
- Include steps to reproduce
- Share error messages and logs

### ✨ Feature Requests
- Describe the feature clearly
- Explain the use case
- Suggest implementation approach
- Discuss potential impact

### 📚 Documentation
- Fix typos and grammar
- Improve clarity
- Add examples
- Update outdated information

### 💻 Code Improvements
- Refactoring
- Performance optimization
- Security enhancements
- Code cleanup

### 🧪 Testing
- Write unit tests
- Write integration tests
- Test edge cases
- Improve test coverage

## Project Structure

```
├── controllers/     - Business logic
├── routes/          - API routes
├── models/          - Database schemas
├── middleware/      - Express middleware
├── utils/           - Utility functions
├── tests/           - Test files (to be created)
└── public/          - Static files
```

## Key Files to Understand

- **server.js** - Main server entry point
- **package.json** - Dependencies and scripts
- **routes/** - API endpoint definitions
- **controllers/** - Request handlers

## Common Tasks

### Adding a New API Endpoint

1. Create route in `routes/new-feature.js`
2. Create controller in `controllers/new-feature.js`
3. Add validation in `middleware/validation.js`
4. Update documentation in README.md
5. Add tests
6. Update API endpoints list

### Adding a New Database Model

1. Create model in `models/NewModel.js`
2. Define schema and validations
3. Add CRUD operations
4. Create controller methods
5. Create routes
6. Document endpoints

### Fixing a Bug

1. Create issue if not already reported
2. Create branch: `git checkout -b fix/bug-description`
3. Fix the bug
4. Add tests to prevent regression
5. Create PR referencing the issue

## Reporting Issues

### Bug Reports
Include:
- Clear description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages/logs
- Node.js and npm versions
- Operating system

### Feature Requests
Include:
- Clear description
- Use case
- Proposed implementation
- Potential challenges
- Mock-ups (if applicable)

## Development Tips

### Debugging
```bash
# Run with debugging enabled
DEBUG=* npm start

# Use Chrome DevTools
node --inspect server.js
```

### Database Testing
```bash
# Use test database
NODE_ENV=test npm test
```

### Git Workflow
```bash
# Stay updated with upstream
git fetch upstream
git rebase upstream/master

# Clean up local branches
git branch -d branch-name

# Interactive rebase for clean history
git rebase -i upstream/master
```

## Code Review Process

- Be open to feedback
- Discuss suggestions respectfully
- Request clarification if needed
- Make requested changes
- Re-request review after changes

## Merging

Pull requests will be merged when:
- ✅ All tests pass
- ✅ Code review approved
- ✅ No merge conflicts
- ✅ Documentation updated
- ✅ Changes follow guidelines

## Questions?

- Open a discussion on GitHub
- Check existing issues
- Review documentation
- Email maintainers

## License

By contributing, you agree that your contributions will be licensed under the project's license.

---

Thank you for contributing to make Student Productivity Tracker better! 🎉
