# Trip Companion Web App - Implementation Plan

## 4-Week MVP Timeline

---

## 🎯 Quick Summary

**Timeline**: 4 weeks (28 days)  
**Approach**: MVP-focused, core features only  
**Tech Stack**: Next.js + PostgreSQL + Socket.io + Cloudinary  
**Deployment**: Vercel (frontend) + Railway/Render (Socket.io server)

### Week-by-Week Breakdown

- **Week 1**: Setup + Authentication + User Profiles
- **Week 2**: Trip Creation + Browsing + Discovery
- **Week 3**: Bookmarking + Join Requests + Notifications
- **Week 4**: Real-time Chat + Polish + Deployment

### Core MVP Features

✅ User authentication  
✅ Trip creation with mood board images  
✅ Trip browsing and filtering  
✅ Bookmarking  
✅ Join requests (individual only)  
✅ Approve/reject workflow  
✅ Real-time trip group chat  
✅ In-app notifications

### Deferred Features

❌ Groups functionality  
❌ Direct messaging  
❌ Logistics coordination  
❌ Advanced search  
❌ Email notifications

---

## 1. Project Overview

A social platform where individuals and groups can:

- **Post planned trips** with details, dates, budget, and mood boards
- **Discover compatible travel companions** through browsing and filtering
- **Connect and coordinate** via real-time messaging
- **Manage trip logistics** collaboratively

---

## 2. Requirements Analysis

### Core Entities

1. **Users** (Individuals & Groups)

   - Profile management
   - Authentication & authorization
   - Preferences & travel history

2. **Trips**

   - Location/destination
   - Dates (tentative/final)
   - Budget range
   - Group size (required vs current)
   - Existing attendees
   - Mood board images
   - Trip details/description
   - Status (draft, open, full, completed)

3. **Trip Interactions**

   - Bookmarking
   - Join requests (individual/group)
   - Approval/rejection workflow
   - Attendee management

4. **Communication**

   - Real-time chat (trip-specific or direct messages)
   - Notifications
   - Trip updates/announcements

5. **Logistics Coordination**
   - Shared itineraries
   - Expense tracking
   - Task assignments
   - Document sharing

---

## 3. Recommended Tech Stack (Simplified for 4-Week MVP)

### Frontend

- **Framework**: Next.js 14+ (App Router) with TypeScript
  - API routes for backend (no separate server needed)
  - Built-in image optimization
- **UI Library**: Tailwind CSS + shadcn/ui (pre-built components)
- **State Management**: React Query (TanStack Query) for server state
- **Real-time**: Socket.io-client (simplified implementation)
- **Forms**: React Hook Form + Zod validation
- **File Upload**: Cloudinary (free tier sufficient for MVP)

### Backend

- **Runtime**: Next.js API Routes (no separate Express server)
- **Database**: PostgreSQL (Supabase free tier or Neon)
- **ORM**: Prisma (type-safe, easy migrations)
- **Real-time**: Socket.io (simple server setup)
- **Authentication**: NextAuth.js (simplified, email/password only)
- **File Storage**: Cloudinary (free tier)

### Infrastructure & DevOps

- **Hosting**: Vercel (free tier - handles Next.js perfectly)
- **Database Hosting**: Supabase (free tier) or Neon (free tier)
- **Real-time Server**: Railway or Render (free tier) for Socket.io

### Deferred Services (Post-MVP)

- Redis (not needed for MVP)
- Advanced search (use basic PostgreSQL search)
- Email notifications (in-app only for MVP)
- Maps integration (text-based location for MVP)

---

## 4. Database Schema Overview (MVP - Simplified)

### Core Tables (MVP Only)

```sql
Users
- id, email, password_hash, name, avatar_url, bio, created_at, updated_at

Trips
- id, owner_id, title, description, destination (text)
- start_date, end_date, is_tentative (boolean)
- budget_min, budget_max
- required_group_size, current_group_size
- status: 'draft' | 'open' | 'full' | 'completed'
- created_at, updated_at

Trip_Images (Mood Board)
- id, trip_id, image_url, order_index, created_at

Trip_Attendees
- id, trip_id, user_id
- status: 'pending' | 'approved' | 'rejected'
- requested_at, responded_at
- role: 'owner' | 'attendee'

Trip_Bookmarks
- id, trip_id, user_id, created_at

Chat_Rooms
- id, trip_id, created_at

Chat_Messages
- id, room_id, sender_id, content, created_at

Notifications
- id, user_id, type, reference_id, message, read, created_at
```

### Deferred Tables (Post-MVP)

- Groups (simplify to individuals only for MVP)
- Join_Requests (merged into Trip_Attendees)
- Direct messages (trip chat only for MVP)
- Logistics tables (deferred)

---

## 5. 4-Week Implementation Plan

### **Week 1: Foundation & Authentication**

**Goal**: Get the project running with user authentication

#### Day 1-2: Project Setup

- Initialize Next.js 14 project with TypeScript
- Set up Tailwind CSS + shadcn/ui components
- Configure Prisma with PostgreSQL (Supabase/Neon)
- Set up development environment
- Deploy database and get connection string

#### Day 3-4: Authentication

- Set up NextAuth.js (email/password only - no OAuth for MVP)
- Create login/register pages
- User session management
- Protected routes middleware
- Basic user model in Prisma

#### Day 5-7: User Profiles

- User profile page (view/edit)
- Avatar upload (Cloudinary integration)
- Basic dashboard layout
- Navigation component

**Week 1 Deliverable**: Users can register, login, and manage basic profiles

---

### **Week 2: Trip Creation & Discovery**

**Goal**: Core trip functionality - create, view, browse

#### Day 8-10: Trip Creation

- Trip creation form (all core fields)
- Image upload for mood board (Cloudinary)
- Prisma schema for Trips and Trip_Images
- Trip creation API endpoint
- Form validation (React Hook Form + Zod)
- Success/error handling

#### Day 11-12: Trip Display

- Trip detail page
- Trip listing page (grid/list view)
- Image gallery component
- Trip card component
- Basic responsive design

#### Day 13-14: Trip Discovery

- Browse all trips page
- Basic filtering (destination text search, date range, budget range)
- Simple search bar
- Pagination (if needed)
- Sort by date/created

**Week 2 Deliverable**: Users can create trips with mood boards and browse/discover trips

---

### **Week 3: Social Features & Join Requests**

**Goal**: Users can interact with trips and request to join

#### Day 15-16: Bookmarking

- Bookmark/unbookmark functionality
- Bookmarked trips page
- Bookmark count display
- Prisma schema for Trip_Bookmarks

#### Day 17-19: Join Requests

- Request to join button/flow
- Trip owner dashboard (view pending requests)
- Approve/reject requests
- Attendee list display on trip page
- Update trip current_group_size
- Prisma schema for Trip_Attendees

#### Day 20-21: Notifications (Basic)

- In-app notification system
- Notification model in Prisma
- Notification badge/indicator
- Notification list page
- Mark as read functionality
- Trigger notifications for: join requests, approvals, rejections

**Week 3 Deliverable**: Users can bookmark trips, request to join, and receive notifications

---

### **Week 4: Real-time Chat & Polish**

**Goal**: Basic chat functionality and final polish

#### Day 22-24: Real-time Chat (Simplified)

- Set up Socket.io server (simple Express server or Next.js API route)
- Chat room creation (one per trip)
- Real-time messaging (basic - no typing indicators, read receipts)
- Message history persistence
- Chat UI component
- Prisma schema for Chat_Rooms and Chat_Messages
- Only trip group chat (no direct messages for MVP)

#### Day 25-26: Polish & Bug Fixes

- Loading states throughout app
- Error boundaries and error handling
- Responsive design improvements (mobile)
- Form validation improvements
- UI/UX refinements
- Basic accessibility improvements

#### Day 27-28: Deployment & Final Testing

- Deploy to Vercel
- Deploy Socket.io server (Railway/Render)
- Environment variables setup
- Test all core flows end-to-end
- Fix critical bugs
- Prepare demo data if needed

**Week 4 Deliverable**: Fully functional MVP with chat, deployed and ready for demo

---

## 6. Feature Prioritization (MVP vs Post-MVP)

### ✅ **Included in 4-Week MVP**

- User authentication (email/password)
- User profiles with avatars
- Trip creation (all core fields)
- Mood board images
- Trip browsing and basic filtering
- Bookmarking
- Join requests (individual only)
- Approve/reject workflow
- Basic in-app notifications
- Trip group chat (real-time)
- Responsive design

### ❌ **Deferred to Post-MVP**

- Groups functionality (individuals only for MVP)
- Direct messaging (trip chat only)
- Advanced search/filtering
- Email notifications
- Logistics coordination (itinerary, expenses, tasks)
- Map integration
- Social media sharing
- Trip recommendations
- Advanced chat features (typing indicators, read receipts)
- Payment integration
- Reviews/ratings

### 🎯 **MVP Success Criteria**

- Users can create accounts and profiles
- Users can post trips with images
- Users can browse and filter trips
- Users can bookmark trips
- Users can request to join trips
- Trip owners can approve/reject requests
- Trip attendees can chat in real-time
- Users receive notifications for key events
- App is responsive and deployed

---

## 7. Key Technical Decisions (MVP-Focused)

### Authentication Strategy

- **NextAuth.js**: Simple email/password authentication
- **Session Management**: JWT tokens (no database sessions for MVP)
- **Password Security**: Built-in bcrypt hashing via NextAuth
- **No OAuth**: Defer social login to post-MVP for speed

### Real-time Architecture (Simplified)

- **Socket.io**: Basic WebSocket setup
- **Room Management**: One room per trip (simple)
- **Message Persistence**: Store messages in PostgreSQL
- **No Redis**: Single server instance sufficient for MVP
- **Deferred**: Typing indicators, read receipts, online status

### Image Handling

- **Cloudinary**: Free tier (25GB storage, 25GB bandwidth)
- **Simple Upload**: Direct upload from frontend
- **Basic Optimization**: Cloudinary auto-optimization
- **No Advanced Formats**: Standard JPG/PNG for MVP

### Database Design

- **PostgreSQL**: Supabase or Neon free tier
- **Prisma**: Type-safe ORM, easy migrations
- **Basic Indexing**: Index on foreign keys and frequently queried fields
- **No Full-Text Search**: Simple LIKE queries for MVP

### State Management

- **Server State**: React Query (TanStack Query) for all API calls
- **Client State**: React useState/useReducer (no Zustand needed for MVP)
- **Form State**: React Hook Form + Zod

### Deployment Strategy

- **Vercel**: Free tier for Next.js app (automatic deployments)
- **Railway/Render**: Free tier for Socket.io server
- **Database**: Supabase or Neon (both have free tiers)
- **No CI/CD**: Manual deployments acceptable for MVP

---

## 8. Security Considerations (MVP Minimum)

1. **Authentication**: NextAuth.js handles password hashing and JWT tokens
2. **Authorization**: Basic checks (owner can edit/delete, attendees can chat)
3. **Input Validation**: Zod validation on all forms and API routes
4. **File Uploads**: Cloudinary handles validation, set size limits (5MB per image)
5. **API Security**: Basic CORS setup, validate user sessions
6. **SQL Injection**: Prisma ORM prevents SQL injection
7. **XSS**: React automatically escapes, sanitize user-generated content
8. **Deferred**: Rate limiting, advanced security headers (add post-MVP)

---

## 9. Scalability Considerations (Post-MVP)

**For MVP**: Focus on functionality, not scale

- Single database instance is fine
- No caching needed
- Single Socket.io server sufficient
- Vercel handles frontend scaling automatically

**Post-MVP Scaling**:

1. Database: Connection pooling, read replicas
2. Caching: Redis for frequently accessed data
3. CDN: Already handled by Cloudinary and Vercel
4. Load Balancing: Multiple Socket.io instances with Redis adapter
5. Search: Upgrade to Algolia/Elasticsearch if needed

---

## 10. Success Metrics (Post-Launch)

**MVP Launch Metrics**:

- Can users successfully create accounts? ✅
- Can users post trips with images? ✅
- Can users browse and find trips? ✅
- Can users request to join trips? ✅
- Can trip owners approve/reject requests? ✅
- Does real-time chat work? ✅
- Is the app responsive on mobile? ✅

**Post-Launch Analytics** (if time permits):

- User registration rate
- Trips created per week
- Join request acceptance rate
- Active chat rooms
- User retention

---

## 11. Daily Time Estimates

**Assumptions**:

- Full-time work (6-8 hours/day)
- Some prior Next.js/React experience
- Focus on speed over perfection

**Week 1**: ~35-40 hours
**Week 2**: ~35-40 hours  
**Week 3**: ~35-40 hours
**Week 4**: ~35-40 hours

**Total**: ~140-160 hours over 4 weeks

---

## 12. Risk Mitigation

### Potential Risks & Solutions

1. **Risk**: Real-time chat takes too long

   - **Mitigation**: Use a simple Socket.io setup, defer advanced features

2. **Risk**: Image upload complexity

   - **Mitigation**: Use Cloudinary's simple upload widget, limit to 3-5 images per trip

3. **Risk**: Database schema changes

   - **Mitigation**: Use Prisma migrations, plan schema early in Week 1

4. **Risk**: Deployment issues

   - **Mitigation**: Deploy early (end of Week 1), test deployment process

5. **Risk**: Feature creep
   - **Mitigation**: Strictly follow MVP feature list, defer everything else

---

## 13. Next Steps

1. ✅ **Review Plan**: Confirm this 4-week plan works for you
2. **Set Up Repository**: Initialize Git, create project structure
3. **Environment Setup**:
   - Create Supabase/Neon database
   - Set up Cloudinary account
   - Create Vercel account
4. **Quick Design**: Sketch key pages (or use shadcn/ui components as-is)
5. **Begin Week 1**: Start with project setup and authentication

---

## Notes

- **Timeline**: 4 weeks total (28 days)
- **Team**: Assumes 1 developer working full-time
- **Approach**: MVP-first, defer nice-to-have features
- **Quality**: Functional over perfect - polish only in Week 4
- **Testing**: Manual testing throughout, no automated tests for MVP
- **Documentation**: Code comments and basic README only
- **Flexibility**: If behind schedule, cut chat features or simplify further
