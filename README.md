# Trip Companion Web App

A social platform where individuals can post planned trips and find compatible travel companions.

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary
- **Real-time**: Socket.io (to be added)

## Prerequisites

- Node.js 20.19+, 22.12+, or 24.0+ (required for Prisma)
- PostgreSQL database (Supabase or Neon recommended)
- Cloudinary account (free tier)
- Yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
yarn install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth
AUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Set Up Database

**Note**: Prisma requires Node.js 20.19+, 22.12+, or 24.0+. If you're using Node 21.x, you'll need to upgrade Node or use a workaround.

Once Node version is compatible:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 4. Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── ...                # Other pages
├── components/             # React components
├── lib/                   # Utility functions and configs
│   ├── auth.ts           # NextAuth configuration
│   └── prisma.ts         # Prisma client instance
├── prisma/                # Prisma schema and migrations
│   └── schema.prisma     # Database schema
└── public/                # Static assets
```

## Development Status

### Week 1: Foundation & Authentication (Current)
- [x] Project setup
- [x] Next.js configuration
- [x] Tailwind CSS setup
- [x] Prisma schema created
- [x] NextAuth.js setup
- [ ] Login/Register pages
- [ ] User profiles

### Week 2: Trip Creation & Discovery
- [ ] Trip creation form
- [ ] Image upload (Cloudinary)
- [ ] Trip browsing
- [ ] Basic filtering

### Week 3: Social Features
- [ ] Bookmarking
- [ ] Join requests
- [ ] Notifications

### Week 4: Real-time Chat & Polish
- [ ] Socket.io setup
- [ ] Real-time messaging
- [ ] Final polish & deployment

## Notes

- The Prisma schema is ready but requires compatible Node.js version
- NextAuth is configured but needs Prisma integration to be complete
- All database models are defined in `prisma/schema.prisma`

## License

ISC

