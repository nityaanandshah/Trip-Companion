# 🚀 Week 2: Trip Creation & Discovery

**Timeline**: Days 8-14 (7 days)  
**Goal**: Users can create trips with images and browse/discover trips from others

---

## 🎯 Week 2 Overview

By the end of Week 2, users will be able to:
- ✅ Create trips with all details (destination, dates, budget, description)
- ✅ Upload mood board images (up to 5 images per trip)
- ✅ View beautiful trip detail pages with image galleries
- ✅ Browse all trips in a grid/list view
- ✅ Filter trips by destination, dates, and budget
- ✅ Search for specific trips
- ✅ See their own trips in "My Trips" page

---

## 📅 Days 8-10: Trip Creation Form

### What We'll Build:

#### 1. Trip Creation Page (`/trips/create`)
A comprehensive form with:
- **Trip Title** (required, 5-100 characters)
- **Destination** (required, text input)
- **Start Date & End Date** (date pickers)
- **Is Tentative?** (checkbox for flexible dates)
- **Budget Range** (min/max, optional)
- **Required Group Size** (how many people needed)
- **Description** (rich text area, 2000 characters max)
- **Mood Board Images** (upload up to 5 images)
- **Status** (draft/open)

#### 2. Image Upload Component
- Multiple image upload (drag & drop + click)
- Image preview with reordering
- Delete individual images
- Upload to Cloudinary (reuse avatar upload logic)
- Show upload progress

#### 3. Form Validation
- Client-side validation with React Hook Form + Zod
- Server-side validation
- Error messages for each field
- Success/error toast notifications

#### 4. API Endpoints
- `POST /api/trips` - Create new trip
- `POST /api/trips/upload-images` - Upload trip images
- `GET /api/trips/my-trips` - Get user's trips

### Technologies:
- **Form Handling**: React Hook Form + Zod
- **Date Picker**: Native HTML5 date inputs (simple for MVP)
- **Image Upload**: Cloudinary (same as avatars)
- **UI**: Tailwind CSS + custom components

---

## 📅 Days 11-12: Trip Display & Detail Pages

### What We'll Build:

#### 1. Trip Detail Page (`/trips/[id]`)
Beautiful trip page showing:
- Hero image (first mood board image)
- Image gallery (lightbox/carousel for all images)
- Trip information card:
  - Destination
  - Dates (with "Tentative" badge if applicable)
  - Budget range
  - Group size (current/required)
  - Owner info (avatar, name)
- Full description
- Action buttons:
  - "Bookmark" (Week 3)
  - "Request to Join" (Week 3)
  - "Edit" (if owner)
  - "Delete" (if owner)

#### 2. Trip Card Component
Reusable card for listing pages:
- Featured image (first mood board image)
- Trip title
- Destination
- Dates (compact format)
- Budget (if provided)
- Group size indicator
- Owner avatar
- Bookmark icon (Week 3)

#### 3. My Trips Page (`/trips/my-trips`)
- Grid of user's created trips
- Filter: All / Draft / Open / Full / Completed
- Edit/Delete quick actions
- Empty state with "Create your first trip" CTA

#### 4. API Endpoints
- `GET /api/trips/[id]` - Get single trip
- `GET /api/trips/my-trips` - Get user's trips
- `PUT /api/trips/[id]` - Update trip
- `DELETE /api/trips/[id]` - Delete trip

---

## 📅 Days 13-14: Browse, Filter & Search

### What We'll Build:

#### 1. Browse Trips Page (`/trips`)
Main discovery page:
- Grid/List view toggle
- All public trips (status = "open")
- Pagination (10-20 trips per page)
- Empty state if no trips

#### 2. Filter System
Sidebar or top filters:
- **Destination** (text search/filter)
- **Date Range** (start date - end date)
- **Budget Range** (min-max sliders)
- **Group Size** (minimum required)
- **Clear All Filters** button

#### 3. Search Bar
- Full-text search in:
  - Trip titles
  - Descriptions
  - Destinations
- Instant results as you type (debounced)
- Search suggestions

#### 4. Sort Options
- **Latest First** (newest trips)
- **Earliest Departure** (soonest trips)
- **Budget: Low to High**
- **Budget: High to Low**

#### 5. API Endpoints
- `GET /api/trips` - Get all trips with filters
  - Query params: destination, startDate, endDate, budgetMin, budgetMax, groupSize, search, sort, page

---

## 🗄️ Database Schema (Already Created!)

Your Prisma schema already has everything we need:

```prisma
model Trip {
  id                 String   @id @default(cuid())
  ownerId            String
  title              String
  description        String?
  destination        String
  startDate          DateTime
  endDate            DateTime
  isTentative        Boolean  @default(true)
  budgetMin          Int?
  budgetMax          Int?
  requiredGroupSize  Int      @default(1)
  currentGroupSize   Int      @default(1)
  status             String   @default("open") // draft, open, full, completed
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  owner      User          @relation("TripOwner", fields: [ownerId], references: [id])
  images     TripImage[]
  attendees  TripAttendee[]
  bookmarks  TripBookmark[]
  chatRoom   ChatRoom?
}

model TripImage {
  id        String   @id @default(cuid())
  tripId    String
  imageUrl  String
  orderIndex Int      @default(0)
  createdAt DateTime @default(now())

  trip Trip @relation(fields: [tripId], references: [id], onDelete: Cascade)
}
```

✅ **No migrations needed!** We already set this up in Week 1.

---

## 🎨 UI Components to Build

### New Components:
1. **TripForm** - Trip creation/edit form
2. **ImageUploader** - Multiple image upload with preview
3. **TripCard** - Reusable trip card for listings
4. **TripGallery** - Image gallery/carousel
5. **FilterSidebar** - Filter controls
6. **SearchBar** - Search input with suggestions
7. **EmptyState** - No trips found placeholder

### Reusable Patterns:
- Form inputs (text, date, number, textarea)
- Loading states
- Error states
- Success notifications

---

## 🚀 Implementation Order

### Day 8: Trip Creation Form (Backend + Frontend)
1. Create API routes for trip creation
2. Build trip creation form UI
3. Add form validation (Zod schemas)
4. Test basic trip creation

### Day 9: Image Upload for Trips
1. Adapt avatar upload for multiple images
2. Build image upload component with preview
3. Add drag & drop functionality
4. Test image uploads to Cloudinary

### Day 10: Polish Trip Creation
1. Add loading states and error handling
2. Success notifications
3. Redirect to trip detail page after creation
4. Test complete flow

### Day 11: Trip Detail Page
1. Create trip detail page
2. Build image gallery component
3. Display all trip information
4. Add edit/delete for owners

### Day 12: My Trips Page
1. Build My Trips page
2. Display user's trips in grid
3. Add quick actions (edit/delete)
4. Test trip management

### Day 13: Browse Page + Filters
1. Create browse trips page
2. Build filter sidebar
3. Implement filtering logic
4. Add pagination

### Day 14: Search + Polish
1. Add search functionality
2. Implement sorting
3. Polish UI/UX
4. Test all features
5. Bug fixes

---

## 📦 New Dependencies to Install

```bash
# Form handling and validation
yarn add react-hook-form zod @hookform/resolvers

# Date handling (optional, if needed)
yarn add date-fns

# Image carousel/lightbox (optional)
yarn add yet-another-react-lightbox
# OR build custom gallery (simpler for MVP)
```

---

## ✅ Week 2 Success Criteria

By end of Week 2, you should be able to:
- [ ] Create a new trip with all details
- [ ] Upload 1-5 mood board images
- [ ] View the trip on a beautiful detail page
- [ ] See all your trips on "My Trips" page
- [ ] Edit your own trips
- [ ] Delete your own trips
- [ ] Browse all trips from all users
- [ ] Filter trips by destination, dates, budget
- [ ] Search for trips
- [ ] Sort trips by different criteria
- [ ] See responsive design on mobile

---

## 🎯 Week 2 Deliverables

### Pages:
- `/trips/create` - Trip creation form ✅
- `/trips/[id]` - Trip detail page ✅
- `/trips/my-trips` - User's trips ✅
- `/trips` - Browse all trips ✅

### API Routes:
- `POST /api/trips` - Create trip
- `GET /api/trips` - Get all trips (with filters)
- `GET /api/trips/[id]` - Get single trip
- `PUT /api/trips/[id]` - Update trip
- `DELETE /api/trips/[id]` - Delete trip
- `POST /api/trips/upload-images` - Upload trip images

### Components:
- TripForm
- ImageUploader
- TripCard
- TripGallery
- FilterSidebar
- SearchBar
- EmptyState

---

## 💡 Week 2 Tips

### Keep It Simple:
- Use native HTML5 date inputs (no fancy date picker needed for MVP)
- Basic image gallery (no need for complex carousel)
- Simple pagination (Previous/Next buttons)
- Basic search (LIKE queries in PostgreSQL)

### Reuse What You Built:
- Copy avatar upload logic for trip images
- Reuse form patterns from profile edit
- Use same Cloudinary setup
- Apply consistent styling

### Focus on Functionality:
- Make it work first, make it pretty later
- Test as you build
- Don't over-engineer
- Week 4 is for polish!

---

## 📊 Time Estimates

**Day 8**: 6-8 hours (Trip creation form)  
**Day 9**: 4-6 hours (Image uploads)  
**Day 10**: 3-4 hours (Polish + testing)  
**Day 11**: 5-7 hours (Trip detail page)  
**Day 12**: 4-5 hours (My Trips page)  
**Day 13**: 5-6 hours (Browse + filters)  
**Day 14**: 4-5 hours (Search + polish)

**Total**: ~35-45 hours over 7 days (5-6 hours/day)

---

## 🎊 Ready to Start?

Week 2 is where your app transforms from "user management" to "actual trip planning platform"!

**Next**: I'll start building the trip creation form and API routes.

Let's do this! 🚀

