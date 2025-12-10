# Deployment Guide - TerraMates

Complete deployment instructions for getting TerraMates app live in production.

---

## Table of Contents

1. [Deploy to Render ](#option-1-deploy-to-render)
2. [Database Setup](#database-setup)
3. [Cloudinary Setup](#cloudinary-setup)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment](#post-deployment)

---

## Deploy to Render

### Step 1: Push to GitHub

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub
4. Authorize Render to access your repositories

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your repository
3. Configure settings:

| Setting           | Value                                                 |
| ----------------- | ----------------------------------------------------- |
| **Name**          | `terramates`                                          |
| **Environment**   | `Node`                                                |
| **Branch**        | `main`                                                |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npm start`                                           |
| **Plan**          | Select **Free**                                       |

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**:

```bash
# Database (Use Transaction mode from Supabase)
DATABASE_URL=postgresql://user:pass@host:6543/database?pgbouncer=true
DATABASE_URL_UNPOOLED=postgresql://user:pass@host:5432/database

# Auth (generate secret with: openssl rand -base64 32)
AUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://terramates.onrender.com

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App URL
NEXT_PUBLIC_APP_URL=https://terramates.onrender.com

# Node Environment
NODE_ENV=production
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for first deploy
3. Get your URL (e.g., `https://terramates.onrender.com`)

### Step 6: Update URLs

After first deploy, update these environment variables with your actual Render URL:

```bash
NEXTAUTH_URL=https://your-app.onrender.com
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
```

Click **"Save Changes"** - Render will automatically redeploy.

---

## Database Setup

### Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get **both** connection strings from Settings → Database:

**For `DATABASE_URL` (Pooled - Port 6543):**

- Go to **Connection string** → **Session mode** or **Transaction mode**
- This uses connection pooling (port 6543)
- Used for runtime database queries

**For `DATABASE_URL_UNPOOLED` (Direct - Port 5432):**

- Go to **Connection string** → **Direct connection**
- This is a direct connection (port 5432)
- Required for Prisma migrations during deployment

**Important:** Render/production needs both URLs for migrations to work!

---

## Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up / Log in
3. Dashboard → Copy:
   - Cloud Name → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

---

## Environment Variables

### Required Variables

```bash
# Database (Required)
DATABASE_URL="postgresql://user:pass@host:6543/database?pgbouncer=true"  # Pooled connection
DATABASE_URL_UNPOOLED="postgresql://user:pass@host:5432/database"  # Direct connection for migrations

# NextAuth (Required)
AUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.com"

# Cloudinary (Required)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App URL (Required)
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Node Environment
NODE_ENV="production"
```

### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy output and use as `AUTH_SECRET`.

---

## Post-Deployment

Check logs for:

```
✓ Compiled successfully
✓ Database migrations applied
✓ Ready on http://...
✓ Socket.io server is running
```

---

## Deployment Checklist

Before deploying:

- [ ] All code committed to GitHub
- [ ] Database set up and accessible
- [ ] Cloudinary account configured
- [ ] Environment variables ready
- [ ] Local build successful (`npm run build`)
- [ ] All features tested locally
- [ ] `.env.example` updated
- [ ] Prisma migrations applied

After deploying:

- [ ] Build successful
- [ ] Database migrations ran
- [ ] All environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] All features tested in production
- [ ] Chat working correctly
- [ ] Images uploading successfully

---

## Common Issues & Solutions

| Issue                         | Solution                                                       |
| ----------------------------- | -------------------------------------------------------------- |
| Build hangs at migrate deploy | Add `DATABASE_URL_UNPOOLED` with direct connection (port 5432) |
| Build timeout                 | Increase build timeout or optimize dependencies                |
| Out of memory                 | Upgrade to paid plan or optimize code                          |
| Slow cold starts              | Upgrade to always-on plan                                      |
| Database connection timeout   | Check both pooled and direct URLs are correct                  |
| Prisma migration errors       | Ensure `directUrl` is set in schema.prisma                     |
| Image 413 error               | Reduce image size before upload                                |
| Chat not connecting           | Check Socket.io server logs                                    |

---

## Success!

Once deployed, your app is live! 🎉

Share your deployment URL:

- **Render**: `https://terramates.onrender.com`
