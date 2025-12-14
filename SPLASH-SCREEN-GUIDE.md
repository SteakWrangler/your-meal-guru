# Splash Screen Design Guide

## Kitchen Companion - Splash Screen Requirements

### What is a Splash Screen?

The splash screen appears briefly (1-2 seconds) when users launch your app. It should:
- Reinforce brand identity
- Provide visual feedback that app is loading
- Be simple and fast to display
- Match your app's aesthetic

### Design Concept for Kitchen Companion

**Recommended Design:**
```
┌─────────────────────┐
│                     │
│                     │
│      [LOGO/ICON]    │  Your app icon or logo
│                     │
│   Kitchen Companion │  App name (optional)
│                     │
│                     │
└─────────────────────┘
```

**Style Options:**

1. **Minimal** (Recommended)
   - Solid background (#ff6b35 or white)
   - App icon centered
   - App name below (optional)
   - Clean, fast loading

2. **Branded**
   - Background with subtle pattern
   - Larger logo/wordmark
   - Tagline: "Your AI Cooking Assistant"

3. **Gradient**
   - Gradient background (orange → coral)
   - White icon + text
   - Modern, eye-catching

### iOS Splash Screen (Launch Screen)

**iOS uses Storyboard-based launch screens:**

Location: `ios/App/App/Base.lproj/LaunchScreen.storyboard`

**Current Default:**
- Capacitor provides a basic launch screen
- Shows app name centered
- White background

**Customization Options:**

#### Option 1: Update Existing Storyboard (Code)
Modify the storyboard file to:
- Change background color
- Add your logo image
- Adjust text styling

#### Option 2: Replace with Image (Simple)
1. Create splash image: 2732x2732 (max iPad size)
2. Add to Assets.xcassets
3. Reference in storyboard

**Required Sizes (if using images):**

| Device | Size (points) | @3x Size (pixels) |
|--------|---------------|-------------------|
| iPhone 14 Pro Max | 430x932 | 1290x2796 |
| iPhone 14 Pro | 393x852 | 1179x2556 |
| iPhone 14 Plus | 428x926 | 1284x2778 |
| iPhone 14 | 390x844 | 1170x2532 |
| iPhone SE | 375x667 | 1125x2001 |
| iPad Pro 12.9" | 1024x1366 | 2048x2732 |

**iOS Guidelines:**
- No text that requires localization
- No content that changes
- No startup tips or ads
- Keep it simple and static

### Android Splash Screen

**Android uses drawable resources:**

Location: `android/app/src/main/res/drawable-*/splash.png`

**Current Default:**
- Capacitor blue splash screen
- Centered logo
- White background

**Required Densities:**

| Density | Size | Folder |
|---------|------|--------|
| ldpi | 200x320 | drawable-ldpi |
| mdpi | 320x480 | drawable-mdpi |
| hdpi | 480x800 | drawable-hdpi |
| xhdpi | 720x1280 | drawable-xhdpi |
| xxhdpi | 1080x1920 | drawable-xxhdpi |
| xxxhdpi | 1440x2560 | drawable-xxxhdpi |

**Also need:**
- `drawable-land-*/splash.png` - Landscape versions
- `drawable/splash.xml` - Vector drawable (optional)

**Android 12+ Splash Screen API:**
Since Android 12, there's a new splash screen system:
- Location: `res/values/styles.xml`
- Uses adaptive icon
- Background color
- Icon in center
- Animated by system

### Design Specifications

**Recommended Splash Design:**

```
Background: #ff6b35 (brand orange) or #ffffff (white)
Logo: App icon or wordmark
Size: Centered, 25% of screen height
Text: "Kitchen Companion" (optional)
Font: Same as app (Inter, SF Pro, Roboto)
Color: White on orange, or orange on white
```

**Safe Zones:**
- Keep content in center 75% of screen
- Account for notches, rounded corners
- Test on multiple device sizes

### Creating Splash Screens

#### Option 1: Simple Solid Color (Easiest)

**iOS (LaunchScreen.storyboard):**
1. Open in Xcode
2. Select View
3. Set background color to #ff6b35
4. Center app name label
5. Done!

**Android (styles.xml):**
```xml
<style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
    <item name="android:background">@color/splash_background</item>
</style>
```

Add to `colors.xml`:
```xml
<color name="splash_background">#ff6b35</color>
```

#### Option 2: With Logo Image

**Steps:**
1. Design splash in Figma/Photoshop
2. Export at required sizes
3. Add to Assets (iOS) or drawable folders (Android)
4. Update storyboard/styles to reference images

**Free Tools:**
- [appicon.co](https://appicon.co) - Also generates splash screens
- [apetools.webprofusion.com](https://apetools.webprofusion.com) - Splash generator

#### Option 3: Use Capacitor Asset Generator (Recommended!)

Install Capacitor Assets:
```bash
npm install @capacitor/assets --save-dev
```

Create `assets/splash.png` (2732x2732):
```bash
# Generate all splash screens automatically
npx capacitor-assets generate --splash assets/splash.png
```

This creates all sizes for both platforms!

### Kitchen Companion Splash Design Template

**Figma Template Spec:**

```
Canvas: 2732x2732 (iPad Pro max size)

Background:
- Color: #ff6b35 or white
- Style: Solid or subtle gradient

Logo/Icon:
- Position: Center
- Size: 512x512
- Content: App icon or wordmark
- Color: White (on orange) or orange (on white)

Text (optional):
- "Kitchen Companion"
- Font: Bold, clean sans-serif
- Size: 48pt
- Position: Below logo (100px spacing)
- Color: Match logo color

Spacing:
- Top margin: 866px
- Logo: 512x512
- Gap: 100px
- Text: 48pt height
- Bottom margin: 866px
```

### Configuration in capacitor.config.ts

Already configured! Your current settings:
```typescript
SplashScreen: {
  launchShowDuration: 2000,      // Show for 2 seconds
  backgroundColor: "#ffffff",     // White background
  showSpinner: false,            // No loading spinner
}
```

**To update splash color:**
```typescript
SplashScreen: {
  launchShowDuration: 2000,
  backgroundColor: "#ff6b35",    // Change to brand orange
  showSpinner: false,
}
```

### Step-by-Step Implementation

#### Quick Start (Solid Color):

1. **Update capacitor.config.ts:**
```typescript
backgroundColor: "#ff6b35"  // Your brand color
```

2. **iOS (LaunchScreen.storyboard):**
   - Open in Xcode
   - Select background view
   - Change color to #ff6b35

3. **Android (styles.xml):**
   - Add color to `res/values/colors.xml`
   - Reference in splash style

4. **Rebuild:**
```bash
npm run build:ios
npm run build:android
```

#### With Custom Image:

1. **Design splash screen** (2732x2732)
   - Use Figma template above
   - Export as PNG

2. **Generate all sizes:**
```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate --splash path/to/splash.png
```

3. **iOS Storyboard:** Update to use new image
4. **Android:** Images auto-placed in drawable folders

5. **Test:**
```bash
npm run cap:run:ios
npm run cap:run:android
```

### Testing

**iOS:**
1. Clean build in Xcode
2. Run on simulator
3. Watch for splash on launch
4. Should show for 2 seconds

**Android:**
1. Clean build in Android Studio
2. Run on emulator
3. Launch app
4. Verify splash appearance

**Checklist:**
- [ ] Splash shows immediately on launch
- [ ] Displays for 2 seconds
- [ ] Transitions smoothly to app
- [ ] Colors match brand
- [ ] Logo/text centered
- [ ] Looks good on all device sizes
- [ ] No pixelation or stretching

### Common Issues

**iOS splash not showing:**
- Clean build folder in Xcode
- Delete app from simulator
- Reinstall

**Android splash not updating:**
- Clean project in Android Studio
- Invalidate caches and restart
- Delete and reinstall app

**Wrong colors:**
- Check capacitor.config.ts
- Verify color codes (hex format)
- Rebuild and sync

### Professional Touch

**Recommendations:**
1. Match your app icon colors
2. Keep it simple (less is more)
3. No animations (system handles transitions)
4. Test on multiple device sizes
5. Ensure brand consistency

**Avoid:**
- Complex designs (slow to load)
- Too much text
- Detailed graphics
- Startup tips (goes against guidelines)

### Asset Checklist

- [ ] iOS LaunchScreen.storyboard configured
- [ ] Android splash.png in all densities
- [ ] Colors match brand (#ff6b35)
- [ ] Logo/icon centered and clear
- [ ] Tested on iOS simulators
- [ ] Tested on Android emulators
- [ ] Duration set correctly (2000ms)
- [ ] Smooth transition to app

---

**Current Status**: Using Capacitor defaults
**Next Step**: Update to branded splash screen
**Time Estimate**: 1-2 hours

**Quick Win**: Just change backgroundColor to #ff6b35 in capacitor.config.ts!
