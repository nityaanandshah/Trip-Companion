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

- Node.js 20.19+, 22.12+, or 24.0+
- PostgreSQL database (Supabase recommended)
- Cloudinary account (optional for Week 1, required for Week 2)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd Trips
   yarn install
   ```

2. **Set up environment variables**
   
   Create `.env` and `.env.local` files:
   ```bash
   # Database (Required)
   DATABASE_URL="postgresql://user:password@host:5432/database"
   
   # Auth (Required)
   NEXTAUTH_SECRET="your-secret-key"  # Generate: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"
   
   # Cloudinary (Optional for now)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

3. **Run database migrations**
   ```bash
   yarn prisma generate
   yarn prisma migrate dev
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
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

## 🗄️ Database Schema

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

## 🛠️ Tech Stack

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

## 📚 Documentation

- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - What to do next
- **[WEEK1_COMPLETE.md](./WEEK1_COMPLETE.md)** - Week 1 summary
- **[CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)** - Image upload setup
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - Full 4-week plan
- **[SETUP_STATUS.md](./SETUP_STATUS.md)** - Original setup notes

---

## 🎯 Roadmap

### ✅ Week 1: Authentication & User Profiles (COMPLETE)
- User registration and login
- Profile management
- Avatar uploads
- Dashboard

### 📅 Week 2: Trip Creation & Discovery (Next)
- Trip creation form
- Mood board images
- Trip display pages
- Browse and filter trips

### 📅 Week 3: Social Features
- Bookmark trips
- Join requests
- Approve/reject workflow
- In-app notifications

### 📅 Week 4: Real-time Chat & Deployment
- Trip group chat
- Real-time messaging
- Polish and bug fixes
- Deploy to production

---

## 🧪 Testing

### Manual Testing Checklist

Week 1 Features:
- [ ] Register a new user
- [ ] Login with credentials
- [ ] View dashboard
- [ ] Navigate to profile
- [ ] Edit profile information
- [ ] Update bio
- [ ] Upload avatar (if Cloudinary configured)
- [ ] Test all navigation links
- [ ] Sign out
- [ ] Login again

---

## 🌐 Available Routes

### Public Routes
- `/` - Home page
- `/auth/login` - Login page
- `/auth/register` - Registration page

### Protected Routes (Require Login)
- `/dashboard` - User dashboard ✅
- `/profile` - View profile ✅
- `/profile/edit` - Edit profile ✅
- `/trips` - Browse trips (coming Week 2)
- `/trips/create` - Create trip (coming Week 2)
- `/trips/my-trips` - My trips (coming Week 2)
- `/bookmarks` - Bookmarked trips (coming Week 3)
- `/notifications` - Notifications (coming Week 3)

---

## 🚀 Deployment

**Planned Deployment Stack:**
- **Frontend**: Vercel (free tier)
- **Database**: Supabase (free tier)
- **Images**: Cloudinary (free tier)
- **Socket.io**: Railway/Render (Week 4)

---

## 📝 Environment Variables

### Required Now:
```bash
DATABASE_URL          # PostgreSQL connection string
NEXTAUTH_SECRET       # Random secret for JWT
NEXTAUTH_URL          # App URL (http://localhost:3000)
```

### Required for Image Uploads:
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME  # Cloudinary cloud name
CLOUDINARY_API_KEY                 # Cloudinary API key
CLOUDINARY_API_SECRET              # Cloudinary API secret
```

---

## 🤝 Contributing

This is a learning project following a 4-week MVP timeline. 

---

## 📄 License

ISC

---

## 🎉 Acknowledgments

Built with:
- Next.js 14
- NextAuth.js v5
- Prisma ORM
- Tailwind CSS
- Cloudinary
- Supabase

---

**Current Status**: Week 1 Complete! 🎊  
**Next Up**: Trip Creation & Discovery  
**Goal**: 4-Week MVP

Let's build something amazing! 🚀
