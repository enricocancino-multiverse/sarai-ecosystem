# Deployment & Infrastructure Guide

## Live Application
- **URL:** https://sarai-ecosystem.vercel.app
- **Environment:** Production
- **Last Deployed:** July 13, 2026

## Services Used

### 1. Vercel (App Hosting)
- **Purpose:** Hosts the Next.js application
- **Account:** enricocancino-multiverse
- **Auto-deployment:** Enabled on main branch pushes
- **Dashboard:** https://vercel.com/dashboard

**How auto-deployment works:**
1. Push code to GitHub main branch
2. Vercel detects the change (webhook)
3. Builds the app automatically (~2-3 min)
4. Deploys to production
5. Live site updates

### 2. Neon (PostgreSQL Database)
- **Purpose:** Stores all app data
- **Console:** https://console.neon.tech
- **Database Name:** sarai_ecosystem
- **Connection:** Uses DATABASE_URL env variable

**Accessing Neon:**
1. Go to https://console.neon.tech
2. Login with your account
3. Select the sarai-ecosystem project
4. Use SQL Editor for queries
5. View logs under "Monitoring"

### 3. GitHub (Code Repository)
- **Repo:** https://github.com/enricocancino-multiverse/sarai-ecosystem
- **Branch:** main (production)
- **Protection:** Ensure main branch only receives tested code

## Environment Variables

**Production (Vercel):**
- `DATABASE_URL` - Postgres connection string (from Neon)
- `JWT_SECRET` - Session token secret

**Local Development (.env.local):**
Create a `.env.local` file with the same variables for testing.

**NEVER commit .env to GitHub** ⚠️

## How to Make Changes

### 1. Local Development
```bash
# Clone repo
git clone https://github.com/enricocancino-multiverse/sarai-ecosystem.git
cd sarai-ecosystem

# Install dependencies
npm install

# Create .env.local (ask team lead for DATABASE_URL and JWT_SECRET)
# Run dev server
npm run dev
# Visit http://localhost:3000
```

### 2. Push to Production
```bash
# Make changes, test locally
git add .
git commit -m "Description of changes"
git push origin main
```

**Vercel automatically deploys** — no manual steps needed!

### 3. Check Deployment Status
- Go to Vercel dashboard
- Click on sarai-ecosystem project
- See deployment history and live logs

## Database Management

### View/Edit Database
1. Go to https://console.neon.tech
2. Open SQL Editor
3. Run queries to manage users, documents, etc.

### Backup Database
Neon automatically backs up data. To export:
1. Use pg_dump (PostgreSQL tool)
2. Or ask Neon support for manual backup

### Common Database Tasks

**Add a new user:**
```sql
INSERT INTO users (name, email, password_hash, is_admin, is_active) 
VALUES ('John Doe', 'john@dost.gov.ph', '<bcrypt_hash>', false, true);
```

**View all users:**
```sql
SELECT id, name, email, is_admin, created_at FROM users;
```

**Reset user password:**
```sql
UPDATE users SET password_hash = '<new_bcrypt_hash>' WHERE email = 'user@dost.gov.ph';
```

## Monitoring & Troubleshooting

### Check if Site is Down
1. Visit https://sarai-ecosystem.vercel.app
2. Go to Vercel dashboard → Deployments
3. Look for failed builds or errors
4. Check Neon console for database issues

### View Production Logs
- **Vercel logs:** Vercel dashboard → Logs tab
- **Database logs:** Neon console → Monitoring tab

### Common Issues

**"Server error during login"**
- Database is down or connection failed
- Check DATABASE_URL in Vercel env variables
- Verify Neon is running

**"Page not found" on new routes**
- Vercel deployment failed
- Check build logs in Vercel dashboard
- Check for TypeScript errors

**Slow performance**
- Check Neon database queries
- Review Vercel analytics
- Optimize API endpoints

## Disaster Recovery

### If Vercel Deployment Fails
1. Check build logs in Vercel dashboard
2. Revert last commit if needed: `git revert HEAD`
3. Push the revert: `git push origin main`
4. Vercel will auto-redeploy previous version

### If Database is Corrupted
1. Contact Neon support for backup restore
2. Or restore from backup if available
3. Restore database schema using db/setup.sql

## Cost Management

- **Vercel:** Free tier includes ~100GB bandwidth/month
- **Neon:** Free tier includes up to 3 projects, 512MB storage
- **GitHub:** Free for public/private repos

Monitor usage in dashboards to avoid unexpected charges.

## Team Handoff Checklist

- [ ] All team members have Vercel account access
- [ ] All team members have Neon console access
- [ ] All team members cloned GitHub repo locally
- [ ] .env.local files created on local machines
- [ ] `npm install` and `npm run dev` working for everyone
- [ ] Team understands git workflow (push to main = auto-deploy)
- [ ] Documentation reviewed by all
