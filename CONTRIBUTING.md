# Contributing Guide

Thank you for contributing to Sarai Ecosystem! This guide will help you understand how to work on the project and contribute effectively.

---

## 📋 Before You Start

1. Read [README.md](README.md) - Overview and setup
2. Read [DEVELOPER.md](DEVELOPER.md) - Code architecture
3. Read [DEPLOYMENT.md](DEPLOYMENT.md) - How deployment works
4. Clone and run the project locally

---

## 🔄 Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/feature-name
# or
git checkout -b fix/bug-name
# or
git checkout -b docs/documentation-name
```

**Branch naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code cleanup
- `test/` - Tests

### 2. Make Your Changes

- Keep commits small and focused
- Write descriptive commit messages
- Test changes locally

```bash
git add .
git commit -m "Clear description of what changed"
```

### 3. Push to GitHub

```bash
git push origin feature/feature-name
```

### 4. Create Pull Request

- Go to GitHub repository
- Click "New Pull Request"
- Select your branch
- Fill in description
- Request review

### 5. Code Review & Merge

- Team lead reviews code
- Make requested changes if needed
- Once approved, merge to main
- Vercel auto-deploys!

---

## 💻 Development Guidelines

### Code Style

**TypeScript & React:**
```typescript
// ✅ Good - Type annotations
async function handleLogin(email: string, password: string): Promise<boolean> {
  // Implementation
  return true;
}

// ❌ Bad - No types
async function handleLogin(email, password) {
  return true;
}
```

**Component Structure:**
```typescript
// ✅ Good - Clear organization
export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    // Load data
  }, []);

  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// ❌ Bad - Confusing logic
export default function Dashboard() {
  // Mixed concerns
}
```

**CSS (Tailwind):**
```tsx
// ✅ Good - Tailwind classes
<button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
  Click Me
</button>

// ❌ Bad - Custom CSS mixed with Tailwind
<button style={{ background: 'green' }} className="p-2">
  Click Me
</button>
```

### File Naming

- **Components:** PascalCase (`UserDashboard.tsx`)
- **Pages:** lowercase with hyphens (`user-dashboard/page.tsx`)
- **API routes:** lowercase (`/api/users/[id]/route.ts`)
- **Utilities:** camelCase (`calculateTotal.ts`)

### Testing Checklist

Before pushing, verify:
- [ ] `npm run build` succeeds (no TypeScript errors)
- [ ] `npm run lint` passes
- [ ] Feature works locally
- [ ] No console errors
- [ ] Mobile responsive (if UI change)

---

## 🐛 Reporting Bugs

Found a bug? Create an issue with:

1. **Title:** Clear, specific description
2. **Description:** What went wrong
3. **Reproduction Steps:**
   ```
   1. Go to [page]
   2. Click [button]
   3. See error
   ```
4. **Expected vs Actual:**
   - Expected: Should show X
   - Actual: Shows Y
5. **Environment:**
   - Local dev / Production
   - Browser/device
   - Screenshots if helpful

---

## ✨ Feature Requests

Have an idea? Open an issue:

1. **Title:** "Feature: [What you want]"
2. **Description:** Why is this useful?
3. **Use Case:** When would someone need this?
4. **Proposed Solution:** How should it work?

---

## 📝 Writing Good Commit Messages

```
feature: add file upload to documents

- Add file picker component
- Store files on Vercel Blob
- Link files to document records
- Add download functionality

Closes #123
```

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feature` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `refactor` - Code cleanup
- `test` - Tests
- `chore` - Build/deps

---

## 🔐 Security Checklist

Before submitting, ensure:

- [ ] No passwords in code
- [ ] No API keys in code
- [ ] All sensitive data uses env variables
- [ ] Input validation on backend
- [ ] No secrets in commit history
- [ ] HTTPS only
- [ ] User permissions checked

---

## 📚 Code Review Checklist

When reviewing someone's PR:

- [ ] Code follows style guide
- [ ] All tests pass
- [ ] Build succeeds
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security concerns addressed
- [ ] Documentation updated

---

## 🚀 Deploying Your Changes

Once merged to `main`:

1. Vercel webhook triggers automatically
2. Build starts (watch at vercel.com/dashboard)
3. If build succeeds → Deployed to production
4. If build fails → Check logs and fix errors

**Monitor deployment:**
- Live at: https://sarai-ecosystem.vercel.app
- Logs: Vercel Dashboard → Deployments

---

## 🆘 Getting Help

- **Architecture questions?** → Read DEVELOPER.md
- **Deployment issues?** → Read DEPLOYMENT.md
- **Feature planning?** → Check ROADMAP.md
- **Stuck on code?** → Ask team in discussions
- **Found a bug?** → Create an issue with details

---

## 📦 Adding Dependencies

Before adding a new package:

1. Check if we already have it
2. Evaluate alternatives
3. Check bundle impact
4. Get team approval

```bash
npm install package-name
# Then commit
git add package.json package-lock.json
git commit -m "chore: add package-name for X reason"
```

---

## 🎯 Common Tasks

### Add a New API Endpoint

1. Create file: `src/app/api/feature/route.ts`
2. Export function matching HTTP method (GET, POST, etc.)
3. Use `lib/db.ts` for database queries
4. Return JSON response
5. Test with curl/Postman

### Add a New Page

1. Create folder: `src/app/new-page/`
2. Create file: `src/app/new-page/page.tsx`
3. Export React component
4. Add to navigation if needed
5. Test on mobile

### Add a Database Migration

1. Test change locally
2. Write SQL in `db/setup.sql` or create migration file
3. Run in Neon console
4. Test app still works
5. Document in commit message

### Update Environment Variables

1. Add to `.env.example`
2. Add to Vercel dashboard
3. Document in DEPLOYMENT.md
4. Commit changes

---

## 📊 Performance Guidelines

- Keep page load < 2 seconds
- Database queries < 100ms
- Use pagination for large lists
- Cache when appropriate
- Optimize images

---

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)

---

## 💬 Questions?

- Ask in GitHub discussions
- Message team lead
- Check existing documentation
- Review similar code in the repo

---

## Thank You! 🙏

Your contributions make Sarai Ecosystem better for DOST Region 1. Thank you for helping!

---

*Last Updated: July 13, 2026*
