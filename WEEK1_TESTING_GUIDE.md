# 🧪 Week 1 - Complete Testing Guide

## Test Data to Use

### Test Users to Create

Create these 3 test users to fully test the system:

#### User 1: Alice (Travel Enthusiast)

```
Name: Alice Johnson
Email: alice@example.com
Password: Test123!
Bio: Adventure seeker and mountain lover. Always planning the next hiking trip. Love exploring new cultures and cuisines.
```

#### User 2: Bob (Beach Lover)

```
Name: Bob Martinez
Email: bob@example.com
Password: Test123!
Bio: Beach bum at heart. Surfing, sunsets, and seafood. Looking for travel buddies to explore tropical destinations.
```

#### User 3: Carol (City Explorer)

```
Name: Carol Chen
Email: carol@example.com
Password: Test123!
Bio: Urban explorer and foodie. Museums by day, street food by night. Always ready for a spontaneous city adventure.
```

---

## 📋 Complete Testing Checklist

### Phase 1: Authentication Testing

#### Test 1.1: User Registration

- [ ] Go to http://localhost:3000/auth/register
- [ ] Register **Alice** with the data above
- [ ] **Verify**: You see a success message or redirect to login
- [ ] **Verify**: You can see Alice in the database (optional: `yarn prisma studio`)

#### Test 1.2: Login with New User

- [ ] Go to http://localhost:3000/auth/login
- [ ] Login as **Alice** (alice@example.com / Test123!)
- [ ] **Verify**: You're redirected to the dashboard
- [ ] **Verify**: You see "Welcome, Alice Johnson!" on dashboard

#### Test 1.3: Session Persistence

- [ ] While logged in as Alice, refresh the page (F5)
- [ ] **Verify**: You remain logged in
- [ ] Navigate to different pages (profile, dashboard)
- [ ] **Verify**: Session persists across pages

#### Test 1.4: Sign Out

- [ ] Click on Alice's avatar in the top-right navbar
- [ ] Click "Sign out"
- [ ] **Verify**: You're redirected to login page
- [ ] Try accessing http://localhost:3000/dashboard
- [ ] **Verify**: You're redirected to login (protected route works)

#### Test 1.5: Invalid Login

- [ ] Try logging in with wrong password: alice@example.com / WrongPass!
- [ ] **Verify**: You see an error message
- [ ] Try logging in with non-existent email: fake@example.com / Test123!
- [ ] **Verify**: You see an error message

#### Test 1.6: Register Other Users

- [ ] Log out (if logged in)
- [ ] Register **Bob** with his data above
- [ ] Register **Carol** with her data above
- [ ] **Verify**: All 3 users can be created successfully

---

### Phase 2: Profile Testing

#### Test 2.1: View Profile

- [ ] Login as **Alice**
- [ ] Click "Your Profile" in the navbar dropdown
- [ ] **Verify**: You see Alice's name
- [ ] **Verify**: You see alice@example.com
- [ ] **Verify**: You see "Member since December 3, 2025" (or current date)
- [ ] **Verify**: You see the bio if you added one
- [ ] **Verify**: Activity stats show 0 for everything

#### Test 2.2: Edit Profile - Name and Bio

- [ ] Click "Edit Profile" button
- [ ] Change name to: **Alice J. Johnson**
- [ ] Update bio to Alice's bio from test data above
- [ ] Click "Save Changes"
- [ ] **Verify**: You see "Profile updated successfully!" message
- [ ] **Verify**: You're redirected to profile page
- [ ] **Verify**: New name and bio are displayed

#### Test 2.3: Avatar Upload

- [ ] Go to profile edit page
- [ ] Click "Change Avatar"
- [ ] Select an image from your computer (under 5MB)
- [ ] Wait for upload
- [ ] **Verify**: You see "Avatar uploaded successfully!" message
- [ ] **Verify**: Avatar preview updates immediately
- [ ] Click "Save Changes"
- [ ] Go to profile page
- [ ] **Verify**: Avatar is displayed on profile
- [ ] Go to dashboard
- [ ] **Verify**: Avatar appears in navbar (top-right)

#### Test 2.4: Bio Character Limit

- [ ] Go to profile edit page
- [ ] Try typing a very long bio (more than 500 characters)
- [ ] **Verify**: Character counter shows current count
- [ ] **Verify**: Bio is limited to 500 characters

#### Test 2.5: Avatar Remove

- [ ] Go to profile edit page
- [ ] If you have an avatar, click "Remove" button
- [ ] **Verify**: Avatar preview returns to initials
- [ ] Click "Save Changes"
- [ ] **Verify**: Profile shows initials instead of avatar

---

### Phase 3: Navigation Testing

#### Test 3.1: Navbar Links (Desktop)

Login as Alice and test all navbar links:

- [ ] Click "Dashboard" in navbar
  - **Verify**: Goes to /dashboard
- [ ] Click "Browse Trips" in navbar
  - **Verify**: Goes to /trips (shows "Coming Soon" page)
- [ ] Click "My Trips" in navbar
  - **Verify**: Goes to /trips/my-trips (shows placeholder)
- [ ] Click "Bookmarks" in navbar
  - **Verify**: Goes to /bookmarks (shows placeholder)
- [ ] Click avatar dropdown → "Your Profile"
  - **Verify**: Goes to /profile
- [ ] Click avatar dropdown → "My Trips"
  - **Verify**: Goes to /trips/my-trips
- [ ] Click avatar dropdown → "Notifications"
  - **Verify**: Goes to /notifications (shows placeholder)

#### Test 3.2: Dashboard Links

From the dashboard, test all clickable links:

- [ ] Click "Create your first trip →" (in My Trips card)
  - **Verify**: Goes to /trips/create
- [ ] Click "Browse trips →" (in Bookmarks card)
  - **Verify**: Goes to /trips
- [ ] Click "Edit profile →" (in Profile card)
  - **Verify**: Goes to /profile/edit
- [ ] Click "Create New Trip" (Quick Actions)
  - **Verify**: Goes to /trips/create
- [ ] Click "Browse Trips" (Quick Actions)
  - **Verify**: Goes to /trips
- [ ] Click "View Notifications" (Quick Actions)
  - **Verify**: Goes to /notifications

#### Test 3.3: Mobile Navigation

Resize browser window to mobile size (< 640px width):

- [ ] **Verify**: Hamburger menu icon appears
- [ ] Click hamburger menu
- [ ] **Verify**: Mobile menu slides out
- [ ] **Verify**: All navigation links are visible
- [ ] Click "Dashboard"
  - **Verify**: Menu closes and navigates
- [ ] **Verify**: User info shows at bottom of mobile menu
- [ ] Click "Sign out" in mobile menu
  - **Verify**: Logs out successfully

---

### Phase 4: Multi-User Testing

#### Test 4.1: Switch Between Users

- [ ] Login as **Alice**
- [ ] Note the dashboard shows "Welcome, Alice J. Johnson!"
- [ ] Sign out
- [ ] Login as **Bob**
- [ ] **Verify**: Dashboard shows "Welcome, Bob Martinez!"
- [ ] Go to profile
- [ ] **Verify**: Shows Bob's email and info (not Alice's)
- [ ] Sign out
- [ ] Login as **Carol**
- [ ] **Verify**: Dashboard shows "Welcome, Carol Chen!"

#### Test 4.2: Upload Different Avatars

- [ ] Login as **Bob**
- [ ] Upload a different avatar
- [ ] **Verify**: Bob's avatar is different from Alice's
- [ ] Sign out
- [ ] Login as **Carol**
- [ ] Upload another different avatar
- [ ] **Verify**: Carol's avatar is unique
- [ ] Sign out and login as **Alice**
- [ ] **Verify**: Alice's original avatar is still there (unchanged)

#### Test 4.3: Profile Isolation

- [ ] Login as **Alice**
- [ ] Update bio to: "Alice's updated bio - Adventure time!"
- [ ] Sign out
- [ ] Login as **Bob**
- [ ] Check Bob's profile
- [ ] **Verify**: Bob's bio is different from Alice's
- [ ] **Verify**: Bob's profile doesn't show Alice's data

---

### Phase 5: UI/UX Testing

#### Test 5.1: Loading States

- [ ] Go to profile edit page
- [ ] Click "Change Avatar" and select an image
- [ ] **Verify**: Button shows "Uploading..." with spinner
- [ ] Wait for upload to complete
- [ ] Click "Save Changes"
- [ ] **Verify**: Button shows "Saving..." with spinner

#### Test 5.2: Error Handling

- [ ] Go to profile edit page
- [ ] Try uploading a file larger than 5MB
- [ ] **Verify**: You see an error message
- [ ] Try uploading a non-image file (e.g., .txt, .pdf)
- [ ] **Verify**: You see "Please upload an image file" error

#### Test 5.3: Form Validation

- [ ] Go to register page
- [ ] Try submitting with empty fields
- [ ] **Verify**: Form validation prevents submission
- [ ] Try password less than 6 characters
- [ ] **Verify**: Shows error about password length
- [ ] Try registering with Alice's email again
- [ ] **Verify**: Shows "User already exists" error

#### Test 5.4: Responsive Design

Test at different screen sizes:

- [ ] **Desktop (> 1024px)**
  - **Verify**: Dashboard shows 3 cards per row
  - **Verify**: Navbar shows all links horizontally
- [ ] **Tablet (768px - 1024px)**
  - **Verify**: Dashboard shows 2 cards per row
  - **Verify**: Navigation adjusts appropriately
- [ ] **Mobile (< 768px)**
  - **Verify**: Dashboard shows 1 card per column
  - **Verify**: Mobile menu (hamburger) appears
  - **Verify**: All text is readable
  - **Verify**: Buttons are easy to tap

---

### Phase 6: Browser Testing

Test in multiple browsers if possible:

#### Test 6.1: Chrome

- [ ] Login as Alice in Chrome
- [ ] Upload avatar
- [ ] **Verify**: Everything works

#### Test 6.2: Safari

- [ ] Login as Bob in Safari
- [ ] Upload avatar
- [ ] **Verify**: Everything works

#### Test 6.3: Firefox (Optional)

- [ ] Login as Carol in Firefox
- [ ] Upload avatar
- [ ] **Verify**: Everything works

---

### Phase 7: Database Verification

#### Test 7.1: Check Database with Prisma Studio

- [ ] Open terminal
- [ ] Run: `yarn prisma studio`
- [ ] Browser opens at http://localhost:5555
- [ ] Click on "users" table
- [ ] **Verify**: You see all 3 users (Alice, Bob, Carol)
- [ ] **Verify**: Passwords are hashed (not plain text)
- [ ] **Verify**: Avatar URLs point to Cloudinary (for users with avatars)
- [ ] **Verify**: Bios are saved correctly
- [ ] **Verify**: Created dates are correct

---

### Phase 8: Security Testing

#### Test 8.1: Protected Routes

- [ ] Make sure you're logged out
- [ ] Try accessing these URLs directly:
  - [ ] http://localhost:3000/dashboard
  - [ ] http://localhost:3000/profile
  - [ ] http://localhost:3000/profile/edit
- [ ] **Verify**: All redirect to login page

#### Test 8.2: Session Security

- [ ] Login as Alice
- [ ] Open browser DevTools (F12)
- [ ] Go to Application/Storage tab
- [ ] Look for cookies or session storage
- [ ] **Verify**: You DON'T see plain passwords stored
- [ ] **Verify**: Session token exists and is encrypted

#### Test 8.3: API Endpoints

- [ ] Login as Alice
- [ ] Open browser DevTools → Network tab
- [ ] Go to profile page
- [ ] Look at the API calls
- [ ] **Verify**: `/api/user/profile` returns 200 status
- [ ] **Verify**: Response includes Alice's data only
- [ ] Sign out and try accessing `/api/user/profile` directly
- [ ] **Verify**: Returns 401 Unauthorized

---

### Phase 9: Performance Testing

#### Test 9.1: Page Load Times

- [ ] Open DevTools → Network tab
- [ ] Reload dashboard page
- [ ] **Verify**: Page loads in under 2 seconds
- [ ] Check profile page
- [ ] **Verify**: Page loads quickly

#### Test 9.2: Image Upload Speed

- [ ] Upload a small avatar (< 1MB)
- [ ] Note the upload time
- [ ] **Verify**: Uploads in under 5 seconds
- [ ] Upload a larger avatar (2-3MB)
- [ ] **Verify**: Still uploads in reasonable time

---

### Phase 10: Edge Cases

#### Test 10.1: Long Names and Bios

- [ ] Login as Alice
- [ ] Edit profile
- [ ] Try name: "Alice-Marie Elizabeth Johnson-Smith"
- [ ] Try a bio with emojis: "I ❤️ travel! 🌍✈️🏖️"
- [ ] Save changes
- [ ] **Verify**: Everything displays correctly

#### Test 10.2: Special Characters

- [ ] Update bio with special characters: "Let's go! #TravelLife @2025"
- [ ] Save and view profile
- [ ] **Verify**: Special characters display correctly
- [ ] **Verify**: No weird encoding issues

#### Test 10.3: Rapid Navigation

- [ ] Quickly click between pages:
  - Dashboard → Profile → Edit → Dashboard → Profile
- [ ] **Verify**: No errors or crashes
- [ ] **Verify**: All pages load correctly

#### Test 10.4: Multiple Tabs

- [ ] Login as Alice in one tab
- [ ] Open new tab, login as Alice again
- [ ] Make changes in Tab 1 (edit profile)
- [ ] Refresh Tab 2
- [ ] **Verify**: Changes appear in Tab 2

---

## 🎯 Final Verification Checklist

After completing all tests:

- [ ] All 3 test users created successfully
- [ ] All users can login and logout
- [ ] Profiles can be viewed and edited
- [ ] Avatar uploads work for all users
- [ ] All navigation links work
- [ ] Mobile responsive design works
- [ ] No console errors in browser DevTools
- [ ] Database shows correct data
- [ ] Protected routes work (redirect when logged out)
- [ ] Sessions persist across page refreshes
- [ ] No security issues found

---

## 🐛 Common Issues & Fixes

### Issue: "Can't reach database"

**Fix**: Check that your `.env` has correct `DATABASE_URL`

### Issue: Avatar upload fails

**Fix**: Verify all 3 Cloudinary env variables are set and dev server restarted

### Issue: Profile changes don't save

**Fix**: Check browser console for errors, verify database connection

### Issue: Navbar looks broken on mobile

**Fix**: Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

---

## 📊 Test Results Summary

After completing all tests, fill this out:

**Total Tests**: 100+  
**Tests Passed**: **\_  
**Tests Failed**: \_**  
**Critical Issues Found**: **\_  
**Minor Issues Found**: \_**

**Overall Status**: [ ] READY FOR WEEK 2 / [ ] NEEDS FIXES

---

## ✅ Next Steps After Testing

Once all tests pass:

1. **Document any issues you found** (if any)
2. **Take screenshots** of key features working
3. **Commit your work** to Git (optional)
4. **Celebrate** - Week 1 is truly complete! 🎉
5. **Start Week 2** - Trip Creation & Discovery

---

**Good luck with testing!** Take your time and be thorough. This ensures your foundation is solid before building more features. 🚀
