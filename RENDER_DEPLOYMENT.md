# 🚀 Deploy to Render - Trip Companion

## Why Render?

Your app uses a custom Node.js server with Socket.io, which requires a traditional hosting environment. Vercel doesn't support custom servers (even on Pro), so **Render is the perfect choice**.

---

## 📋 Quick Deployment Steps

### Step 1: Prepare Your App

No changes needed! Your app is already configured correctly with:

- ✅ Custom server (`server.js`)
- ✅ Socket.io integration
- ✅ Production build script
- ✅ Start script for production

### Step 2: Push to GitHub

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 3: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub
4. Authorize Render to access your repositories

### Step 4: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your repository: `Trips`
3. Configure the service:

| Setting            | Value                                                 |
| ------------------ | ----------------------------------------------------- |
| **Name**           | `trip-companion` (or your choice)                     |
| **Environment**    | `Node`                                                |
| **Region**         | Choose closest to you                                 |
| **Branch**         | `main`                                                |
| **Root Directory** | Leave empty                                           |
| **Build Command**  | `npm install && npx prisma generate && npm run build` |
| **Start Command**  | `npm start`                                           |
| **Plan**           | Select **Free**                                       |

### Step 5: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

#### Database (Using Your Supabase):

```bash
DATABASE_URL=<your-database-url>
```

#### Authentication:

```bash
# Generate this with: openssl rand -base64 32
NEXTAUTH_SECRET=<your-generated-secret>

# These will be updated after first deploy
NEXTAUTH_URL=https://trip-companion.onrender.com
NEXT_PUBLIC_APP_URL=https://trip-companion.onrender.com
```

#### Cloudinary:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

#### Node Environment:

```bash
NODE_ENV=production
```

### Step 6: Deploy!

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Generate Prisma client
   - Build Next.js
   - Run database migrations (via `vercel-build` script)
   - Start your server
3. First deploy takes 3-5 minutes

### Step 7: Get Your URL

After deployment completes:

1. You'll see your app URL (e.g., `https://trip-companion.onrender.com`)
2. **Copy this URL**

### Step 8: Update Environment Variables

1. Go to **"Environment"** tab
2. Update these variables with your actual URL:
   ```bash
   NEXTAUTH_URL=https://trip-companion.onrender.com
   NEXT_PUBLIC_APP_URL=https://trip-companion.onrender.com
   ```
3. Click **"Save Changes"**
4. Render will automatically redeploy

---

## ✅ Verification

Once deployed, test these features:

### Authentication:

- [ ] Register new account
- [ ] Log in
- [ ] Log out

### Profile:

- [ ] Upload avatar
- [ ] Edit profile
- [ ] View profile

### Trips:

- [ ] Create trip with images
- [ ] Browse trips
- [ ] Edit trip
- [ ] Delete trip

### Social Features:

- [ ] Bookmark a trip
- [ ] Request to join
- [ ] Approve/reject requests
- [ ] View notifications

### Real-time Chat (Most Important):

- [ ] Open a trip chat
- [ ] Send messages
- [ ] See online users
- [ ] Test with multiple browser tabs
- [ ] Verify typing indicators work

---

## 🔧 Troubleshooting

### Issue: Build Failed

**Check**:

1. Render logs for specific error
2. Make sure all dependencies are in `package.json`
3. Verify Prisma schema is valid

**Fix**:

```bash
# Test build locally first
npm install
npm run build
```

### Issue: Database Connection Failed

**Check**:

1. DATABASE_URL is correct
2. Password doesn't have special characters that need escaping
3. Using "Transaction" mode connection string from Supabase

**Fix**:

- Verify Supabase database is accessible
- Check if IP restrictions are enabled (Render IPs vary)

### Issue: Socket.io Not Connecting

**Check**:

1. `NEXT_PUBLIC_APP_URL` matches your Render URL
2. No trailing slash in URL
3. Server logs show Socket.io is running

**Fix**:

```bash
# In Render dashboard, check logs for:
# "> Socket.io server is running"
```

### Issue: NextAuth Session Issues

**Check**:

1. `NEXTAUTH_SECRET` is set
2. `NEXTAUTH_URL` matches your Render URL exactly
3. No trailing slash

**Fix**:

- Clear browser cookies
- Regenerate NEXTAUTH_SECRET
- Redeploy

---

## 💰 Free Tier Limits

### What You Get Free:

- ✅ 750 hours/month (enough for 24/7 if only app)
- ✅ 512 MB RAM
- ✅ Shared CPU
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Unlimited bandwidth

### Trade-offs:

- ⏱️ **Sleeps after 15 min of inactivity**
- 🐌 **30 second cold start** when waking up
- 🔄 **Automatic wake on request**

### If You Need Always-On:

- Upgrade to **Starter plan**: $7/month
- No sleep, faster performance
- Priority support

---

## 🎯 Using Render's PostgreSQL (Optional)

If you want to consolidate everything on Render:

### Create Postgres Database:

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Name: `trip-companion-db`
3. Region: Same as your web service
4. Plan: **Free**
5. Click **"Create Database"**

### Connect to Your Web Service:

1. Copy the **Internal Database URL**
2. Go to your Web Service → **Environment**
3. Update `DATABASE_URL` with the new URL
4. Save and redeploy

### Benefits:

- Faster connection (same region)
- Free 90 days, then $7/month (still cheaper than many alternatives)
- Automatic backups
- Easy scaling

---

## 🚨 Important Notes

### 1. Socket.io Configuration

Your app is already configured correctly! The Socket.io server automatically uses the same URL as your Render deployment.

### 2. Environment Variables

Make sure **all** environment variables are set before first deploy. Missing variables will cause build failures.

### 3. Database Migrations

The `vercel-build` script in your `package.json` automatically runs migrations:

```json
"vercel-build": "prisma generate && prisma migrate deploy && next build"
```

### 4. Custom Domain (Optional)

1. In Render: **Settings** → **Custom Domain**
2. Add your domain
3. Update DNS records (provided by Render)
4. Update environment variables with new domain
5. Redeploy

---

## 📊 Monitoring

### Check Logs:

1. Go to your Web Service
2. Click **"Logs"** tab
3. See real-time logs
4. Filter by severity

### Check Metrics:

1. Click **"Metrics"** tab
2. View:
   - Memory usage
   - CPU usage
   - Response times
   - Request counts

---

## 🎉 Success!

Once deployed, your app is live at:

```
https://trip-companion.onrender.com
```

Share it with friends, test all features, and enjoy your fully-functional trip planning app! 🌍✈️

---

## 🆘 Need Help?

- **Render Docs**: [docs.render.com](https://docs.render.com)
- **Render Community**: [community.render.com](https://community.render.com)
- **Your App Docs**: See `DEPLOYMENT.md` for general deployment info

---

**Happy Deploying!** 🚀
