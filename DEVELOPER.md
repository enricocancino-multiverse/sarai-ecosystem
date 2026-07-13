# Developer Guide - Architecture & Code Structure

## Project Overview

**Sarai Ecosystem** is a Next.js 16 web application for DOST Region 1 that provides:
- Staff portals with dashboards
- Document tracking system (DTS)
- Attendance monitoring
- Announcements management
- Admin & SuperAdmin controls

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + Next.js 16 | UI components, pages |
| Styling | Tailwind CSS 4 | Responsive design |
| Backend | Next.js API Routes | REST API endpoints |
| Database | PostgreSQL (Neon) | Data persistence |
| Auth | JWT + bcryptjs | Session management |
| Type Safety | TypeScript | Type checking |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── api/                     # API endpoints
│   │   └── auth/                # Auth routes (login, signup, etc)
│   │   └── admin/               # Admin-only routes
│   ├── components/              # Reusable React components
│   │   ├── sarai-portal.tsx    # Main layout wrapper
│   │   ├── admin-dashboard/
│   │   ├── staff-dashboard/
│   │   └── superadmin-dashboard/
│   ├── global-login/            # Login page
│   ├── sarai-documents/         # Document tracking
│   ├── sarai-attendance/        # Attendance tracking
│   ├── sarai-achievements/      # Achievements
│   ├── modules/                 # Feature modules
│   └── announcements/           # Announcements page
├── lib/
│   ├── auth.ts                  # Authentication logic
│   ├── db.ts                    # Database connection
│   └── session.ts               # Session handling
└── db/
    └── setup.sql                # Database schema & initial data
```

## Key Files Explained

### 1. **lib/db.ts** - Database Connection
```typescript
// Connects to PostgreSQL via Neon
// Used by all API routes to query the database
```

### 2. **lib/auth.ts** - Authentication
```typescript
// Password hashing, user validation
// Used when users login/signup
```

### 3. **lib/session.ts** - Session Management
```typescript
// Creates JWT tokens for logged-in users
// Validates tokens on protected routes
```

### 4. **src/app/api/auth/** - Auth Endpoints
- `login/route.ts` - POST /api/auth/login
- `signup/route.ts` - POST /api/auth/signup
- `me/route.ts` - GET /api/auth/me (current user)
- `logout/route.ts` - POST /api/auth/logout

### 5. **src/app/components/** - UI Components
- Main layouts and dashboard components
- Reusable throughout the app

## Database Schema

### users table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  is_superadmin BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields:**
- `id` - Unique user identifier
- `email` - Login email (must be unique)
- `password_hash` - Bcrypt hashed password (NEVER store plain text)
- `is_admin` - Can access admin dashboard
- `is_superadmin` - Can access superadmin dashboard
- `is_active` - Account status
- `created_at` - Registration timestamp

## Common Tasks

### Adding a New API Endpoint

1. Create file: `src/app/api/[feature]/[action]/route.ts`
2. Export function matching HTTP method (GET, POST, etc.)

**Example - Add user endpoint:**
```typescript
// src/app/api/users/get/route.ts
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const result = await query("SELECT * FROM users WHERE is_active = true");
    return Response.json({ users: result.rows });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### Adding a New Page

1. Create folder: `src/app/[feature-name]/`
2. Create file: `src/app/[feature-name]/page.tsx`
3. Export React component

**Example - New Feature Page:**
```typescript
// src/app/new-feature/page.tsx
export default function NewFeaturePage() {
  return (
    <div>
      <h1>New Feature</h1>
      {/* Add content here */}
    </div>
  );
}
```

### Adding a New Database Table

1. Create migration or update `db/setup.sql`
2. Run in Neon SQL Editor
3. Update TypeScript types in your API routes

**Example:**
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT NOT NULL,
  status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Querying the Database

```typescript
import { query } from "@/lib/db";

// Simple query
const result = await query("SELECT * FROM users WHERE id = $1", [1]);

// Insert
await query(
  "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
  [name, email, hashPassword]
);

// Update
await query(
  "UPDATE users SET is_admin = true WHERE email = $1",
  [email]
);
```

## Authentication Flow

1. **Signup:** User enters email/password → Hashed with bcrypt → Stored in DB
2. **Login:** User enters email/password → Compared with hash → JWT token created → Stored in cookie
3. **Protected Routes:** Request includes JWT token → Verified → User can access route
4. **Logout:** Cookie cleared → Session ends

## Deployment Workflow

```
Code Changes
    ↓
git commit & git push to main
    ↓
GitHub notifies Vercel (webhook)
    ↓
Vercel runs: npm install && npm run build
    ↓
Build succeeds/fails (check dashboard)
    ↓
If success: Deploy to production
    ↓
Live at sarai-ecosystem.vercel.app (1-3 min)
```

## Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Token signing secret

**Optional:**
- `NODE_ENV` - Set to "production" on Vercel (auto)

## Testing Locally

```bash
# Start dev server
npm run dev

# Check for TypeScript errors
npm run lint

# Build for production (tests if build works)
npm run build

# Start production server
npm start
```

## Common Errors & Fixes

### "Cannot find module '@/lib/db'"
- Check import path is correct
- Verify file exists at `src/lib/db.ts`

### "Database connection failed"
- Verify DATABASE_URL in .env.local
- Check Neon console - is database running?
- Test connection: `psql $DATABASE_URL`

### "Unauthorized" on protected routes
- JWT token missing or expired
- Check cookie is being set on login
- Verify JWT_SECRET is same locally and in Vercel

### TypeScript errors on build
- Run `npm run lint` to see all errors
- Fix before pushing (build will fail otherwise)

## Performance Tips

1. **Database Queries** - Use indexed columns, avoid N+1 queries
2. **API Routes** - Cache responses when possible
3. **Components** - Use React.memo for expensive components
4. **Images** - Use Next.js Image component, not `<img>`
5. **CSS** - Tailwind removes unused styles automatically

## Security Checklist

- ✅ Never commit .env or secrets
- ✅ Always hash passwords (bcryptjs)
- ✅ Validate user input on backend
- ✅ Use HTTPS only (Vercel enforces)
- ✅ Set httpOnly cookies for tokens
- ✅ Verify JWT tokens on protected routes
- ✅ Check user roles before sensitive operations

## Next Steps for Improvements

See ROADMAP.md for planned features and improvements.
