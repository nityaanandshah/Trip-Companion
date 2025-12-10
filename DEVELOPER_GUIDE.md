# Developer Guide - TerraMates

Complete technical documentation for developers setting up and working with the TerraMates application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Tech Stack](#tech-stack)
3. [Quick Setup](#quick-setup)
4. [Environment Variables](#environment-variables)
5. [Development Commands](#development-commands)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: v20.19+, v22.12+, or v24.0+
- **npm** or **yarn**: Latest version
- **PostgreSQL**: Any recent version (or use cloud provider)
- **Git**: For version control

### Required Accounts

- **Supabase**: For PostgreSQL database (free tier available)
- **Cloudinary**: For image uploads and storage (free tier available)

---

## Tech Stack

### Frontend

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5.9.3
- **UI Framework**: React 19.2.0
- **Styling**: Tailwind CSS 4.1.17
- **Forms**: React Hook Form 7.68.0 + Zod 4.1.13

### Backend

- **Runtime**: Node.js with Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma 5.22.0
- **Authentication**: NextAuth.js 5.0.0-beta.30
- **Real-time**: Socket.io 4.8.1
- **File Storage**: Cloudinary

### Development

- **Package Manager**: npm/yarn
- **Linting**: ESLint
- **Type Checking**: TypeScript strict mode

---

## Quick Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd Trips
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` with your credentials (see [Environment Variables](#environment-variables) section below).

### 4. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev

# (Optional) View database
npx prisma studio
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Visit: **http://localhost:3000**

---

## Environment Variables

Create a `.env` file with these variables:

```bash
# Database (Required)
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth (Required)
AUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (Required)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App URL (Optional - defaults to localhost:3000)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

---

## Development Commands

```bash
# Start development server (with Socket.io)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Production build for Vercel
npm run vercel-build

# Database commands
npm run db:push          # Push schema without migration
npm run db:migrate       # Create and run migration
npx prisma studio        # Open database GUI

# Linting
npm run lint

# Generate Prisma client
npx prisma generate
```

---

## Troubleshooting

### Port 3000 already in use

```bash
lsof -ti:3000 | xargs kill -9
# or use different port
PORT=3001 npm run dev
```

### Prisma Client not found

```bash
npx prisma generate
```

### Database connection failed

- Check `DATABASE_URL` in `.env`
- Verify database is running
- For Supabase: check project isn't paused

### Images not uploading

- Verify all Cloudinary env vars are set
- Check API key permissions
- Verify cloud name is correct

### Socket.io not connecting

- Check `NEXT_PUBLIC_APP_URL` matches your URL
- Verify server is running (`npm run dev`)
- Check browser console for errors

### Build errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### TypeScript errors

```bash
# Regenerate types
npx prisma generate
npm run build
```

---

## Additional Resources

- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **NextAuth Docs**: [next-auth.js.org](https://next-auth.js.org)
- **Socket.io Docs**: [socket.io/docs](https://socket.io/docs)
- **Cloudinary Docs**: [cloudinary.com/documentation](https://cloudinary.com/documentation)

---
