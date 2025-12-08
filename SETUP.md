# Quick Setup Guide

## What You Need

1. **Node.js** (version 20+)
2. **PostgreSQL Database** (Supabase recommended - free tier available)
3. **Cloudinary Account** (free tier available at cloudinary.com)

## Setup Commands

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables template
cp env.example .env

# 3. Edit .env file with your credentials
# - DATABASE_URL from your PostgreSQL/Supabase
# - NEXTAUTH_SECRET: generate with: openssl rand -base64 32
# - Cloudinary credentials from cloudinary.com dashboard

# 4. Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# 5. Start the development server
npm run dev
```

## Getting Your Credentials

### Database (Supabase)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the "Connection string" (URI format)
5. Paste as `DATABASE_URL` in `.env`

### Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. From your dashboard, copy:
   - Cloud name → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

### Auth Secret
Generate a secure random string:
```bash
openssl rand -base64 32
```
Paste the output as `NEXTAUTH_SECRET` in `.env`

## Troubleshooting

### "Prisma Client not found"
```bash
npx prisma generate
```

### "Can't reach database server"
- Check your `DATABASE_URL` is correct
- Make sure your database is running
- For Supabase, check your project isn't paused

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Images not uploading
- Verify all three Cloudinary environment variables are set
- Check your Cloudinary dashboard for errors
- Make sure your upload preset is set to "unsigned" (if using unsigned uploads)

## Access the App

After setup, visit:
- **App**: http://localhost:3000
- **Database Studio**: Run `npx prisma studio` → http://localhost:5555

## Next Steps

1. Register a new account at http://localhost:3000/auth/register
2. Complete your profile
3. Start creating trips!


