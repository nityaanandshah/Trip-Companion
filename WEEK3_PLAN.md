# 🚀 Week 3: Social Features & Join Requests

**Timeline**: Days 15-21 (7 days)  
**Goal**: Enable users to bookmark trips, request to join, and receive notifications

---

## 🎯 Week 3 Overview

By the end of Week 3, users will be able to:

- ✅ Bookmark/unbookmark trips they're interested in
- ✅ View all their bookmarked trips in one place
- ✅ Request to join trips created by others
- ✅ Approve or reject join requests (trip owners)
- ✅ See list of trip attendees
- ✅ Receive in-app notifications for key events
- ✅ View and manage notifications
- ✅ Mark notifications as read

---

## 📅 Days 15-16: Bookmarking System

### What We'll Build:

#### 1. Bookmark Functionality

**Features**:

- Bookmark button on trip cards (browse page)
- Bookmark button on trip detail page
- Toggle bookmark/unbookmark
- Visual feedback (filled/outlined heart icon)
- Update bookmark count in real-time
- Optimistic UI updates

**Technical**:

- Use existing `TripBookmark` model from Prisma schema
- Client-side state management
- API endpoints for bookmark actions

#### 2. Bookmarked Trips Page (`/bookmarks`)

**Features**:

- Grid view of all bookmarked trips
- Same trip card design as browse page
- Remove bookmark functionality
- Empty state with CTA to browse trips
- Filter options (optional):
  - By destination
  - By upcoming dates
  - By status (open/full)

**UI/UX**:

- Same layout as "My Trips" page
- Clear visual indication these are bookmarks
- Quick actions: View trip, Remove bookmark

#### 3. API Endpoints

- `POST /api/trips/[id]/bookmark` - Toggle bookmark
- `GET /api/bookmarks` - Get user's bookmarks (already have page at `/bookmarks`)

### Implementation Order:

**Day 15** (4-5 hours):

1. Create bookmark API endpoints
2. Add bookmark button to trip cards
3. Add bookmark button to trip detail page
4. Implement toggle functionality
5. Update UI with bookmark state

**Day 16** (3-4 hours):

1. Build bookmarked trips page
2. Display bookmarked trips grid
3. Add remove bookmark functionality
4. Create empty state
5. Test all bookmark features

---

## 📅 Days 17-19: Join Request System

### What We'll Build:

#### 1. Request to Join Flow

**Features**:

- "Request to Join" button on trip detail page
- Only show if:
  - User is not the owner
  - User hasn't already requested
  - Trip status is "open"
  - Trip has available spots
- Confirmation message after request
- Button states: Request / Pending / Joined
- Show current request status

**Technical**:

- Use `TripAttendee` model
- Status: 'pending' | 'approved' | 'rejected'
- Role: 'owner' | 'attendee'
- Track requested_at, responded_at timestamps

#### 2. Trip Owner Dashboard

**Page**: `/trips/[id]` (enhanced)
**Features** (for trip owners):

- "Join Requests" section
- List of pending requests with user info
- Approve/Reject buttons
- Show requester's profile (name, avatar)
- Show request date
- Counter badge: "3 pending requests"
- Quick actions for each request

**UI Design**:

- Clear separation from trip details
- Pending requests at top
- Approved attendees below
- Rejected requests hidden (or archived view)

#### 3. Attendee List Display

**On trip detail page**:

- "Trip Members" section
- Show all approved attendees
- Display: avatar, name
- Show owner with badge
- Current count: "3/5 people going"
- Update when requests approved

#### 4. Request Status Management

**What happens when**:

- **Request sent**: Status = 'pending', notification to owner
- **Request approved**:
  - Status = 'approved'
  - Increment `currentGroupSize`
  - Notification to requester
  - Check if trip is now full → update status to 'full'
- **Request rejected**:
  - Status = 'rejected'
  - Notification to requester
  - Don't show in UI

#### 5. API Endpoints

- `POST /api/trips/[id]/join-request` - Request to join
- `GET /api/trips/[id]/join-request` - Get user's request status
- `GET /api/trips/[id]/attendees` - Get all attendees (pending + approved)
- `PUT /api/trips/[id]/attendees/[attendeeId]` - Approve/reject request
- `DELETE /api/trips/[id]/attendees/[attendeeId]` - Cancel request / remove attendee

### Implementation Order:

**Day 17** (5-6 hours):

1. Create join request API endpoints
2. Add "Request to Join" button to trip detail page
3. Implement request creation
4. Show request status (pending/approved)
5. Test request flow

**Day 18** (4-5 hours):

1. Build join requests section for trip owners
2. Display pending requests list
3. Add approve/reject buttons
4. Update trip currentGroupSize
5. Handle trip status changes (open → full)
6. Test owner approval flow

**Day 19** (3-4 hours):

1. Display attendee list on trip detail page
2. Show trip members with avatars
3. Add owner badge
4. Test complete flow (request → approve → attendee list)
5. Edge case testing (full trips, duplicate requests)

---

## 📅 Days 20-21: Notification System

### What We'll Build:

#### 1. Notification Model (Already in Schema!)

```prisma
model Notification {
  id          String   @id @default(cuid())
  userId      String
  type        String   // 'join_request', 'request_approved', 'request_rejected'
  referenceId String?  // Trip ID or Request ID
  message     String
  read        Boolean  @default(false)
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### 2. Notification Types

- **join_request**: "John Doe wants to join your trip to Bali"
- **request_approved**: "Your request to join 'Backpacking through Europe' was approved!"
- **request_rejected**: "Your request to join 'Beach trip to Hawaii' was declined"

#### 3. Notification Badge (Navbar)

**Features**:

- Bell icon in navbar
- Badge with unread count
- Red dot if unread notifications
- Click to go to notifications page
- Update count in real-time

#### 4. Notifications Page (`/notifications`)

**Features**:

- List of all notifications (newest first)
- Group by: Today, Yesterday, This Week, Older
- Show notification icon based on type
- Message text
- Timestamp (relative: "2 hours ago")
- Link to relevant trip
- "Mark all as read" button
- Individual "Mark as read" on click
- Delete notification option
- Empty state: "No notifications yet"

**UI Design**:

- Unread: bold text, blue background
- Read: normal text, white background
- Click notification → mark as read + navigate to trip

#### 5. Notification Creation (Server-side)

**Trigger notifications when**:

- Someone requests to join your trip
- Your join request is approved
- Your join request is rejected

**Helper function** (`lib/notifications.ts`):

```typescript
async function createNotification({
  userId: string,
  type: string,
  referenceId: string,
  message: string,
}) {
  // Create notification in database
  // Could add push notification later
}
```

#### 6. API Endpoints

- `GET /api/notifications` - Get user's notifications
- `PUT /api/notifications/[id]` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/[id]` - Delete notification

### Implementation Order:

**Day 20** (5-6 hours):

1. Create notification helper functions
2. Create notification API endpoints
3. Trigger notifications on join request
4. Trigger notifications on approve/reject
5. Build notifications page
6. Display notification list
7. Implement mark as read

**Day 21** (3-4 hours):

1. Add notification badge to navbar
2. Show unread count
3. Update count dynamically
4. Add "Mark all as read" functionality
5. Test all notification flows
6. Polish UI/UX

---

## 🎨 UI Components to Build

### New Components:

1. **BookmarkButton** - Reusable bookmark toggle
2. **JoinRequestCard** - Display pending request with actions
3. **AttendeeList** - Show trip members
4. **NotificationBadge** - Bell icon with count
5. **NotificationItem** - Single notification in list

### Enhanced Components:

1. **TripCard** - Add bookmark button
2. **TripDetail** - Add join request section, attendee list
3. **Navbar** - Add notification badge

---

## 🗄️ Database Queries

### New Queries:

1. Find user's bookmarks with trip details
2. Find pending join requests for a trip
3. Find trip attendees (approved)
4. Count unread notifications
5. Find notifications for user
6. Toggle bookmark (create/delete)
7. Update attendee status (approve/reject)
8. Mark notification as read

---

## 🚀 Implementation Strategy

### Keep It Simple:

- Basic notification system (no real-time WebSockets yet)
- Polling for notification count (every 30 seconds)
- Simple in-app notifications only (no email/push)
- Basic approval flow (no messaging between users)
- No group join requests (individuals only)

### Focus on Core Features:

- Bookmark/unbookmark works reliably
- Join request flow is clear
- Notification system is functional
- UI is clean and intuitive

### Polish Later:

- Real-time notifications (Week 4 with chat)
- Email notifications (post-MVP)
- Rich notification content (post-MVP)
- Notification preferences (post-MVP)

---

## ✅ Week 3 Success Criteria

By end of Week 3, you should be able to:

- [ ] Bookmark any trip
- [ ] View all bookmarked trips
- [ ] Remove bookmarks
- [ ] Request to join any open trip
- [ ] See request status (pending/approved)
- [ ] Approve/reject join requests as trip owner
- [ ] See list of trip attendees
- [ ] Trip automatically becomes "full" when spots filled
- [ ] Receive notifications for join requests
- [ ] Receive notifications for request responses
- [ ] View all notifications
- [ ] Mark notifications as read
- [ ] See unread notification count in navbar

---

## 🎯 Week 3 Deliverables

### Pages:

- `/bookmarks` - Enhanced bookmarked trips page ✅ (placeholder exists)
- `/notifications` - Enhanced notifications page ✅ (placeholder exists)
- `/trips/[id]` - Enhanced with join requests and attendees

### API Routes:

- `POST /api/trips/[id]/bookmark` - Bookmark trip
- `GET /api/bookmarks` - Get bookmarked trips
- `POST /api/trips/[id]/join-request` - Request to join
- `GET /api/trips/[id]/attendees` - Get attendees
- `PUT /api/trips/[id]/attendees/[id]` - Approve/reject
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/[id]` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/[id]` - Delete notification

### Components:

- BookmarkButton
- JoinRequestCard
- AttendeeList
- NotificationBadge
- NotificationItem

### Helper Functions:

- `lib/notifications.ts` - Notification helpers

---

## 💡 Week 3 Tips

### Database Considerations:

- Use transactions for approve/reject (update attendee + increment count)
- Check for duplicate bookmarks before creating
- Check for duplicate join requests
- Validate trip has available spots before approving

### UI/UX:

- Clear visual feedback for all actions
- Disable buttons while loading
- Show success/error messages
- Use optimistic UI updates where possible
- Handle edge cases gracefully (trip full, already requested)

### Testing:

- Test with multiple users
- Test race conditions (simultaneous approvals)
- Test trip becoming full
- Test notification creation
- Test edge cases

---

## 📊 Time Estimates

**Day 15**: 4-5 hours (Bookmarking backend)  
**Day 16**: 3-4 hours (Bookmarked trips page)  
**Day 17**: 5-6 hours (Join request system)  
**Day 18**: 4-5 hours (Approval flow)  
**Day 19**: 3-4 hours (Attendee list + testing)  
**Day 20**: 5-6 hours (Notifications)  
**Day 21**: 3-4 hours (Notification UI + polish)

**Total**: ~30-38 hours over 7 days (4-5 hours/day)

---

## 🎊 Ready to Start Week 3?

Week 3 is where your app becomes truly social! Users will be able to save trips they like, request to join trips, and stay updated with notifications.

**Next**: Let's start with the bookmarking system!

Let's do this! 🚀

---

## 📚 Resources

- Prisma docs: [Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- Next.js docs: [API Routes](https://nextjs.org/docs/api-routes/introduction)
- React docs: [Optimistic Updates](https://react.dev/reference/react/useOptimistic)

---

**Ready when you are!** 🎯
