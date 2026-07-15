# 🏢 Sarai Ecosystem - DOST Region 1 Digital Workplace

> Digitalize the DOST team through a full-fledged workplace portal for file transactions, DTS, attendance tracking, and announcements.

- start at components/Sarai-portal.tsx is the landing page

**Status:** 🟢 Production Live | **URL:** https://sarai-ecosystem.vercel.app

**Commission:** DOST Region 1  
**Built in:** 80 hours (2 weeks)  
**Tech Stack:** Next.js 16, React 19, PostgreSQL, TypeScript, Tailwind CSS

---

## 📋 Features

### ✅ Phase 1: Complete
- **User Authentication** - Secure login/signup with JWT
- **Role-Based Access** - Staff, Admin, SuperAdmin dashboards
- **Document Tracking (DTS)** - Track document status and approvals
- **Attendance Monitoring** - Record and view attendance
- **Announcements** - Share important updates with staff
- **Admin Controls** - Manage users and system settings
- **Production Deployment** - Auto-deploying with Vercel

### 🚀 Phase 2-4: Roadmap
See [ROADMAP.md](ROADMAP.md) for planned features (file uploads, email notifications, 2FA, analytics, etc.)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (via Neon)
- Git

### Local Development

1. **Clone repository**
   ```bash
   git clone https://github.com/enricocancino-multiverse/sarai-ecosystem.git
   cd sarai-ecosystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local`** (ask team lead for values)
   ```
   DATABASE_URL=postgresql://user:password@host/dbname
   JWT_SECRET=your-secret-key-here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Login with test credentials**
   - Email: `admin@dost.gov.ph`
   - Password: `password123`

### Build for Production
```bash
npm run build
npm start
```

---

## 📦 Project Structure

```
src/
├── app/                    # Pages and routes
│   ├── api/               # REST API endpoints
│   │   └── auth/          # Authentication
│   └── components/        # Reusable components
├── lib/                   # Core utilities
│   ├── db.ts             # Database connection
│   ├── auth.ts           # Authentication logic
│   └── session.ts        # Session management
└── db/
    └── setup.sql         # Database schema
```

See [DEVELOPER.md](DEVELOPER.md) for detailed architecture guide.

---

## 🌐 Deployment

### Live URL
**https://sarai-ecosystem.vercel.app**

### Infrastructure
- **App Hosting:** Vercel
- **Database:** PostgreSQL (Neon)
- **Repository:** GitHub
- **Auto-deployment:** Enabled on main branch

### Deploy Changes
```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel automatically deploys (2-3 min)
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide and troubleshooting.

---

## 🔐 Test Accounts

All passwords are `password123`

| Role | Email | Access |
|------|-------|--------|
| SuperAdmin | `superadmin@dost.gov.ph` | Full system access |
| Admin | `admin@dost.gov.ph` | Admin dashboard + user management |
| Staff | `staff@dost.gov.ph` | Staff portal only |

---

## 📚 Documentation

- **[DEVELOPER.md](DEVELOPER.md)** - Code architecture, adding features, API routes
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Infrastructure setup, deployment process, troubleshooting
- **[ROADMAP.md](ROADMAP.md)** - Future features, phase planning, improvement ideas

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 19 + Next.js 16 | Modern, fast, TypeScript support |
| Styling | Tailwind CSS 4 | Responsive, utility-first |
| Backend | Next.js API Routes | Serverless, no extra infra |
| Database | PostgreSQL + Neon | Reliable, scalable, free tier |
| Auth | JWT + bcryptjs | Stateless, secure password hashing |
| Type Safety | TypeScript | Catch errors at build time |

---

## ⚡ Performance & Monitoring

- **Uptime:** Target 99.9% (managed by Vercel)
- **Database Backups:** Automatic via Neon
- **Page Load Time:** < 2 seconds
- **Scalability:** Auto-scales on Vercel

Monitor at:
- Vercel Dashboard: https://vercel.com/dashboard
- Neon Console: https://console.neon.tech

---

## 🔒 Security

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens with expiration
- ✅ HTTPS only
- ✅ Input validation on backend
- ✅ Role-based access control
- ✅ Environment variables for secrets
- ✅ No secrets committed to Git

---

## 📞 Support & Contributing

### Reporting Issues
1. Check existing issues on GitHub
2. Create issue with:
   - Description of problem
   - Steps to reproduce
   - Error message/screenshot
   - Environment (dev/prod)

### Contributing
1. Create branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with clear message
4. Push and create Pull Request
5. Wait for code review

---

## 📈 Project Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Build Time | < 5min | ✅ 5s (Turbopack) |
| Page Load | < 2s | ✅ ~1s |
| Uptime | 99.9% | ✅ Vercel managed |
| Test Coverage | > 80% | 🚧 In progress |
| Users | Unlimited | ✅ Scales automatically |

---

## 📋 Checklist for New Team Members

- [ ] Clone repo and run locally
- [ ] Add DATABASE_URL and JWT_SECRET to .env.local
- [ ] Test login with all 3 roles
- [ ] Read DEVELOPER.md
- [ ] Read DEPLOYMENT.md
- [ ] Set up Git commits hooks
- [ ] Get added to GitHub organization
- [ ] Get added to Vercel account
- [ ] Get added to Neon console

---

## 🎯 Next Steps

1. **Week 1:** Stabilize current features, train team
2. **Week 2-3:** Begin Phase 2 improvements (file uploads, email)
3. **Week 4+:** Scale based on ROADMAP.md

See [ROADMAP.md](ROADMAP.md) for detailed planning.

---

## 📝 License

Private repository for DOST Region 1

---

## 🙌 Credits

- Built for: DOST Region 1
- Built with: Next.js, React, TypeScript, Tailwind CSS
- Hosted on: Vercel + Neon
- Repository: [GitHub](https://github.com/enricocancino-multiverse/sarai-ecosystem)

---

**Happy coding! 🚀**

*Last Updated: July 13, 2026*
