# Mobile App Testing Checklist

## Pre-Testing Setup

### iOS (Xcode)
```bash
npm run cap:open:ios
```
1. Wait for Xcode to open
2. Select a simulator (iPhone 15 recommended)
3. Click Run button (▶) or press `Cmd + R`

### Android (Android Studio)
```bash
npm run cap:open:android
```
1. Wait for Gradle sync to complete
2. Create/select an emulator (Tools → Device Manager if needed)
3. Click Run button (▶)

---

## Testing Checklist

### ✅ Basic Functionality

#### Homepage
- [ ] App launches without errors
- [ ] All 9 feature cards display correctly
- [ ] Navigation buttons work
- [ ] Buttons provide haptic feedback (light tap sensation)

#### Navigation
- [ ] Can navigate to all pages
- [ ] Back button works
- [ ] Safe areas respected (no content under notch)

### ✅ Theme & Status Bar

#### Light Mode
- [ ] Status bar has dark text (iOS)
- [ ] Status bar has light background (Android)
- [ ] UI looks correct

#### Dark Mode
- [ ] Toggle dark mode from homepage
- [ ] Status bar has light text (iOS)
- [ ] Status bar has dark background (Android)
- [ ] UI looks correct
- [ ] Status bar updates immediately when theme changes

### ✅ Camera/Photo Upload

#### Ingredients Page (What Can I Make?)
1. Navigate to Ingredients page
2. Click "Upload Photo" button
3. **iOS Expected**:
   - [ ] Action sheet appears
   - [ ] "Take Photo" option present
   - [ ] "Choose from Library" option present
   - [ ] Can select either option
4. **Android Expected**:
   - [ ] Native picker appears
   - [ ] Can choose camera or gallery
   - [ ] Can select photos

**Note**: Actual image processing requires backend, just verify the picker works!

### ✅ Share Functionality

#### Recipe Sharing (Instructions Page)
1. Generate a recipe (e.g., "chicken tikka masala")
2. Wait for recipe to load
3. Look for Share button next to Print button
4. Click Share button
5. **iOS Expected**:
   - [ ] Native iOS share sheet appears
   - [ ] Can see options: Messages, Mail, AirDrop, etc.
   - [ ] Success haptic feedback when sharing
6. **Android Expected**:
   - [ ] Native Android share sheet appears
   - [ ] Can see options: WhatsApp, Gmail, etc.
   - [ ] Success haptic feedback when sharing

#### Meal Plan Sharing (Planning Page)
1. Generate a meal plan
2. Wait for plan to load
3. Click Share button
4. Verify share sheet appears (same as above)

### ✅ Haptic Feedback

Test on **physical device only** (simulators don't have haptics):

#### Button Interactions
- [ ] Light haptic on any button tap
- [ ] Feels natural and responsive

#### Success Actions
- [ ] Success haptic when sharing completes
- [ ] Stronger than button tap

#### Error Actions
- [ ] Error haptic when action fails (try sharing with airplane mode on)
- [ ] Different pattern from success

### ✅ Network Detection & Offline Mode

#### Going Offline
1. Turn on Airplane Mode on device/simulator
2. **Expected**:
   - [ ] Yellow warning banner appears at top
   - [ ] Shows "You're offline" message
   - [ ] Previously loaded content still visible

#### Coming Back Online
1. Turn off Airplane Mode
2. **Expected**:
   - [ ] Offline banner disappears
   - [ ] App continues to work normally

### ✅ All 9 Features

Test each feature to ensure mobile compatibility:

1. **Home Page**
   - [ ] Displays correctly
   - [ ] All cards clickable

2. **What Can I Make? (Ingredients)**
   - [ ] Photo upload works (see above)
   - [ ] Manual ingredient input works
   - [ ] Recipe generation works
   - [ ] Buttons have haptic feedback

3. **Recipe Instructions**
   - [ ] Generates recipes
   - [ ] Standard/From Scratch toggle works
   - [ ] Share button works
   - [ ] Print button works
   - [ ] Chat section works

4. **Meal Suggestions**
   - [ ] Generates suggestions
   - [ ] Displays correctly
   - [ ] Chat works

5. **Recreate Dishes**
   - [ ] Input works
   - [ ] Generates recreation guide
   - [ ] Chat works

6. **Enhance Your Dish**
   - [ ] Input works
   - [ ] Generates enhancements
   - [ ] Chat works

7. **Meal Planning**
   - [ ] Form inputs work (number of people, preferences)
   - [ ] Generates meal plan
   - [ ] Meal cards display correctly
   - [ ] Share button works
   - [ ] Print button works
   - [ ] Chat works

8. **Diet Guide**
   - [ ] Input works
   - [ ] Generates diet guide
   - [ ] Chat works

9. **What Am I Missing? (Nutrition Analysis)**
   - [ ] Input works
   - [ ] Analyzes nutrition
   - [ ] Chat works

10. **Calorie Estimator**
    - [ ] Input works
    - [ ] Estimates calories
    - [ ] Displays nutrition breakdown
    - [ ] Chat works

### ✅ Chat Functionality

Test on any page with chat:
- [ ] Can type messages
- [ ] Keyboard appears/disappears correctly
- [ ] Keyboard doesn't cover input
- [ ] Messages send successfully
- [ ] Responses display correctly
- [ ] Keyboard dismiss works (scroll or tap outside)

### ✅ UI/UX Mobile-Specific

#### Safe Areas
- [ ] Content not hidden by notch (iPhone X+)
- [ ] Content not hidden by home indicator
- [ ] Proper padding on all sides

#### Touch Targets
- [ ] All buttons easy to tap (minimum 44x44pt)
- [ ] No accidental taps
- [ ] Links and buttons distinguishable

#### Scrolling
- [ ] Smooth scrolling
- [ ] No overscroll bounce issues
- [ ] Scroll works in all pages

#### Typography
- [ ] Text readable at default size
- [ ] Line spacing appropriate
- [ ] Contrast sufficient

### ✅ Performance

#### Load Times
- [ ] App launches within 3 seconds
- [ ] Splash screen shows briefly (2 seconds)
- [ ] Pages load quickly
- [ ] No lag when navigating

#### Memory
- [ ] No crashes during testing
- [ ] Smooth performance throughout

---

## Common Issues & Fixes

### App won't build in Xcode
**Fix**:
```bash
cd ios/App
pod install
```
Then rebuild in Xcode

### App won't build in Android Studio
**Fix**:
- File → Invalidate Caches / Restart
- Tools → SDK Manager → Update Android SDK
- Delete `android/.gradle/` folder and rebuild

### Changes not showing
**Fix**:
```bash
npm run build
npm run cap:sync
```
Then Clean Build in Xcode/Android Studio

### Haptics not working
**Note**: Haptics only work on physical devices, not simulators

### Share button not appearing
**Check**: Is the feature fully loaded? Share button only appears after content is generated.

### Status bar not changing colors
**iOS**: Should change text color (dark/light)
**Android**: Should change background color

---

## Reporting Issues

If you find issues, note:
1. Platform (iOS/Android)
2. Device/simulator model
3. Steps to reproduce
4. Expected vs actual behavior
5. Screenshots if applicable

---

## Success Criteria

The app is ready to proceed if:
- [x] Builds successfully on both platforms
- [ ] All navigation works
- [ ] Status bar syncs with theme
- [ ] Buttons provide haptic feedback
- [ ] Photo picker opens (Ingredients page)
- [ ] Share functionality works
- [ ] Offline banner shows/hides correctly
- [ ] All 9 features functional
- [ ] No crashes or critical bugs

---

**Next Steps After Testing**:
- Note any issues found
- Decide if Phase 3 optimizations are needed
- Consider branded assets (icons, splash screens)
- Plan for app store submission
