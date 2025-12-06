# 🚀 Deployment Guide - Trip Companion App

This guide will walk you through deploying your Trip Companion app to production.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ All code committed to a Git repository (GitHub, GitLab, or Bitbucket)
- ✅ A Vercel account (free tier available at [vercel.com](https://vercel.com))
- ✅ A production PostgreSQL database (see options below)
- ✅ A Cloudinary account for image uploads
- ✅ All environment variables ready

---

## 🗄️ Step 1: Set Up Production Database

### Option A: Neon (Recommended)

**Why**: Free tier, serverless PostgreSQL, excellent for Next.js

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Create a new database named `trips_production`
4. Copy the connection string (looks like: `postgresql://user:pass@host.neon.tech/trips_production`)
5. Save this as your `DATABASE_URL`

### Option B: Supabase

**Why**: Free tier, includes auth features, good dashboard

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (Transaction mode)
5. Replace `[YOUR-PASSWORD]` with your actual password
6. Save this as your `DATABASE_URL`

### Option C: Railway

**Why**: Easy deployment, generous free tier

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add a PostgreSQL database
4. Copy the connection string from the "Connect" tab
5. Save this as your `DATABASE_URL`

### Option D: Vercel Postgres

**Why**: Integrated with Vercel, simple setup

1. In your Vercel project dashboard
2. Go to Storage → Create Database → Postgres
3. Follow the setup wizard
4. Connection string will be automatically added to your environment variables

---

## ☁️ Step 2: Prepare Cloudinary

1. Log in to [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy these values:
   - **Cloud Name**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key**: `CLOUDINARY_API_KEY`
   - **API Secret**: `CLOUDINARY_API_SECRET`

**Optional**: Create a separate folder for production uploads:

- Go to Media Library → Create folder → `trips-production`

---

## 🔐 Step 3: Generate Secrets

### Generate NEXTAUTH_SECRET

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output and save it as your `NEXTAUTH_SECRET`.

---

## 🚀 Step 4: Deploy to Vercel

### 4.1 Push Code to GitHub

```bash
# If not already initialized
git init
git add .
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 4.2 Import Project to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

### 4.3 Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset**: Next.js
- **Build Command**: `npm run vercel-build` (or leave default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (or `yarn install`)

### 4.4 Add Environment Variables

In the Vercel project settings, add these environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host/database

# NextAuth
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# App URL
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

**Important**:

- Replace `your-app-name.vercel.app` with your actual Vercel domain
- If using a custom domain, use that instead

### 4.5 Deploy

Click "Deploy" and wait for the build to complete (usually 2-5 minutes).

---

## 🔧 Step 5: Run Database Migrations

After your first deployment:

1. Go to your Vercel project dashboard
2. Click on "Deployments"
3. Click on the latest deployment
4. Click "..." menu → "Redeploy"
5. Check "Use existing Build Cache" is OFF
6. Click "Redeploy"

The `vercel-build` script in `package.json` will automatically run migrations:

```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

**Alternative**: Run migrations manually from your local machine:

```bash
# Set DATABASE_URL to your production database
DATABASE_URL="your-production-database-url" npx prisma migrate deploy
```

---

## ✅ Step 6: Verify Deployment

### Test These Features:

1. **Authentication**:

   - Register a new account
   - Log in
   - Log out

2. **Profile**:

   - Upload avatar (test Cloudinary)
   - Edit profile
   - View profile

3. **Trips**:

   - Create a trip
   - Upload mood board images (test Cloudinary)
   - Browse trips
   - Edit trip
   - Delete trip

4. **Social Features**:

   - Bookmark a trip
   - Request to join a trip
   - Approve/reject requests (with another account)
   - View notifications

5. **Chat** (Most Important):
   - Open a trip you're approved for
   - Send messages
   - Test with multiple users
   - Verify real-time updates

### Check for Errors:

1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Test on mobile device

---

## 🌐 Step 7: Custom Domain (Optional)

### Add Custom Domain to Vercel:

1. Go to your Vercel project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `trips.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)

### Update Environment Variables:

After adding custom domain, update:

```bash
NEXTAUTH_URL=https://trips.yourdomain.com
NEXT_PUBLIC_APP_URL=https://trips.yourdomain.com
```

Then redeploy.

---

## 🔍 Step 8: Monitor & Debug

### Vercel Logs

View real-time logs:

1. Go to your Vercel project
2. Click "Deployments"
3. Click on a deployment
4. Click "View Function Logs"

### Common Issues & Solutions

#### Issue: "Invalid session token"

**Solution**:

- Verify `NEXTAUTH_SECRET` is set correctly
- Verify `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

#### Issue: "Database connection failed"

**Solution**:

- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- For Supabase: Use "Transaction" mode connection string
- For Neon: Enable "Pooling" if needed

#### Issue: "Cloudinary upload failed"

**Solution**:

- Verify all three Cloudinary env vars are set
- Check API key has upload permissions
- Verify cloud name is correct (no spaces)

#### Issue: "Socket.io not connecting"

**Solution**:

- Vercel doesn't support WebSockets on Hobby plan
- Consider using Vercel Pro or deploy Socket.io separately
- Alternative: Deploy backend to Railway/Render

#### Issue: "Build failed"

**Solution**:

- Check Vercel build logs for specific error
- Verify all dependencies are in `package.json`
- Run `npm run build` locally to test
- Check TypeScript errors with `npm run lint`

---

## 🎯 Socket.io Deployment (Important!)

### ⚠️ Vercel Limitation

Vercel's Hobby (free) plan **does not support WebSockets**, which Socket.io requires for real-time chat.

### Solution Options:

#### Option A: Upgrade to Vercel Pro

- Cost: $20/month
- Enables WebSocket support
- Simplest solution

#### Option B: Deploy Socket.io Backend Separately

**Deploy to Railway** (Recommended):

1. Create a new Railway project
2. Create a `backend` folder in your repo:

```
backend/
├── server.js (your Socket.io server)
├── package.json
└── .env
```

3. Deploy to Railway:

   - Connect GitHub repo
   - Set root directory to `backend`
   - Add environment variables
   - Deploy

4. Update frontend Socket.io connection:

```typescript
// lib/socket-context.tsx
const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000"
);
```

5. Add to environment variables:

```bash
NEXT_PUBLIC_SOCKET_URL=https://your-app.railway.app
```

#### Option C: Use Alternative Real-time Service

- **Pusher**: Managed WebSocket service
- **Ably**: Real-time messaging platform
- **Firebase**: Real-time database

---

## 📊 Performance Optimization

### Already Implemented:

- ✅ Next.js Image optimization
- ✅ Server-side rendering
- ✅ Database query optimization with indexes
- ✅ Cloudinary image CDN

### Additional Optimizations:

1. **Enable Vercel Analytics**:

   - Go to project → Analytics
   - Enable Web Analytics (free)

2. **Add Caching Headers**:

   - Already handled by Next.js

3. **Monitor Bundle Size**:

   ```bash
   npm run build
   # Check output for bundle sizes
   ```

4. **Database Connection Pooling**:
   - For Neon: Enable pooling in connection string
   - For Supabase: Use "Transaction" mode

---

## 🔒 Security Checklist

Before going live:

- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] `.env` file is in `.gitignore`
- [ ] All API routes verify authentication
- [ ] Database credentials are secure
- [ ] Cloudinary API secret is not exposed
- [ ] CORS is properly configured
- [ ] Rate limiting is considered (future enhancement)
- [ ] Input validation is in place (Zod schemas)

---

## 📱 Testing Checklist

Test on multiple devices:

- [ ] Desktop Chrome
- [ ] Desktop Safari/Firefox
- [ ] Mobile iOS Safari
- [ ] Mobile Android Chrome
- [ ] Tablet (iPad/Android)

Test all features:

- [ ] Registration/Login
- [ ] Profile editing with avatar upload
- [ ] Trip creation with image uploads
- [ ] Trip browsing and filtering
- [ ] Bookmarking
- [ ] Join requests
- [ ] Notifications
- [ ] Chat (if WebSockets enabled)
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling

---

## 🎉 Post-Deployment

### Share Your App:

1. **Create Demo Accounts**:

   - Register 2-3 test accounts
   - Create sample trips
   - Add sample data

2. **Take Screenshots**:

   - Homepage
   - Trip browsing
   - Trip detail
   - Chat interface
   - Mobile views

3. **Write README**:

   - Add deployment URL
   - Add screenshots
   - Add feature list
   - Add tech stack

4. **Share**:
   - Add to portfolio
   - Share on LinkedIn
   - Share on Twitter/X
   - Post on Reddit (r/webdev, r/SideProject)

### Monitor Usage:

- Check Vercel Analytics
- Monitor error logs
- Watch database usage
- Track Cloudinary bandwidth

---

## 🆘 Getting Help

### Resources:

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Socket.io Docs**: [socket.io/docs](https://socket.io/docs)

### Community:

- Vercel Discord
- Next.js GitHub Discussions
- Stack Overflow

---

## 🎯 Quick Reference

### Environment Variables Summary:

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com (if separate)
```

### Useful Commands:

```bash
# Build locally
npm run build

# Start production server locally
npm start

# Run migrations
npx prisma migrate deploy

# View database
npx prisma studio

# Check migration status
npx prisma migrate status

# Generate Prisma client
npx prisma generate
```

---

## ✅ Deployment Complete!

Congratulations! Your Trip Companion app is now live! 🎉

**Next Steps**:

1. Test all features thoroughly
2. Invite friends to test
3. Gather feedback
4. Iterate and improve
5. Share your success!

---

**Need help?** Feel free to ask questions or report issues!

**Happy deploying!** 🚀✨
