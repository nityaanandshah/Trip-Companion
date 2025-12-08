# 🌍 Trip Companion - Find Your Travel Buddies

A social platform to find and connect with compatible travel companions for your trips.

## 🎯 Project Status

**Current Phase**: ✅ Week 1 Complete - Authentication & User Profiles  
**Next Phase**: Week 2 - Trip Creation & Discovery  
**Overall Progress**: 25% (Week 1 of 4 complete)

---

## ✨ Features Implemented

### ✅ Week 1: Authentication & User Profiles (COMPLETE)

- **User Authentication**

  - Email/password registration with validation
  - Secure login with bcrypt password hashing
  - JWT session management with NextAuth.js
  - Protected routes and middleware
  - Sign out functionality

- **User Profiles**

  - View profile page with stats
  - Edit profile page
  - Avatar upload (Cloudinary integration)
  - Bio field (500 character limit)
  - Member since date display

- **Dashboard**

  - Personalized welcome message
  - Trip stats (trips created, joined, bookmarks)
  - Quick action buttons
  - Recent activity feed
  - Responsive navigation

- **Navigation**
  - Professional navbar with user menu
  - Mobile-responsive design
  - All navigation links functional
  - User avatar display in menu

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.19+, 22.12+, or 24.0+
- **PostgreSQL** database (Supabase recommended)
- **Cloudinary** account (for image uploads)
- **npm** or **yarn** package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Trips
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (copy from `env.example`):

   ```bash
   cp env.example .env
   ```

   Then fill in your values:

   ```bash
   # Database (Required) - Get from Supabase or your PostgreSQL provider
   DATABASE_URL="postgresql://user:password@host:5432/database"

   # Auth (Required) - Generate a secure secret
   NEXTAUTH_SECRET="your-secret-key"  # Generate: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"

   # Cloudinary (Required) - Get from cloudinary.com
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"

   # Socket.io (Optional - defaults to localhost:3000)
   NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations to create database tables
   npx prisma migrate dev

   # (Optional) View your database in Prisma Studio
   npx prisma studio
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

### Useful Commands

```bash
# Development
npm run dev              # Start development server with Socket.io
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema changes without migrations
npm run db:migrate       # Create and run a new migration
npm run db:studio        # Open Prisma Studio

# Linting
npm run lint             # Run ESLint
```

---

## 📁 Project Structure

```
Trips/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── user/                 # User management endpoints
│   ├── auth/                     # Auth pages (login, register)
│   ├── dashboard/                # Dashboard page
│   ├── profile/                  # Profile pages (view, edit)
│   ├── trips/                    # Trip pages (placeholder for Week 2)
│   ├── bookmarks/                # Bookmarks page (placeholder for Week 3)
│   ├── notifications/            # Notifications page (placeholder for Week 3)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── Navbar.tsx                # Navigation component
│   └── providers/                # Context providers
├── lib/                          # Utilities and configurations
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client
│   └── utils.ts                  # Utility functions
├── prisma/                       # Database schema and migrations
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration history
└── public/                       # Static assets
```

---

## Database Schema

### Implemented Tables:

- **users** - User accounts and profiles
- **trips** - Trip posts (ready for Week 2)
- **trip_images** - Mood board images (ready for Week 2)
- **trip_attendees** - Join requests (ready for Week 3)
- **trip_bookmarks** - Saved trips (ready for Week 3)
- **chat_rooms** - Trip group chats (ready for Week 4)
- **chat_messages** - Chat messages (ready for Week 4)
- **notifications** - In-app notifications (ready for Week 3)

---

## Tech Stack

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Query (planned)
- **Forms**: React Hook Form (planned)

### Backend

- **Runtime**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **File Storage**: Cloudinary

### Development

- **Package Manager**: Yarn
- **Linting**: ESLint
- **Type Checking**: TypeScript

---

## Roadmap

### Week 1: Authentication & User Profiles (COMPLETE)

- User registration and login
- Profile management
- Avatar uploads
- Dashboard

### Week 2: Trip Creation & Discovery (Next)

- Trip creation form
- Mood board images
- Trip display pages
- Browse and filter trips

### Week 3: Social Features

- Bookmark trips
- Join requests
- Approve/reject workflow
- In-app notifications

### Week 4: Real-time Chat & Deployment

- Trip group chat
- Real-time messaging
- Polish and bug fixes
- Deploy to production

---

## Deployment

**Planned Deployment Stack:**

- **Frontend**: Vercel (free tier)
- **Database**: Supabase (free tier)
- **Images**: Cloudinary (free tier)
- **Socket.io**: Railway/Render (Week 4)

---

## 🤝 Contributing

This is a learning project following a 4-week MVP timeline.

---

## Built with:

- Next.js 14
- NextAuth.js v5
- Prisma ORM
- Tailwind CSS
- Cloudinary
- Supabase

---
