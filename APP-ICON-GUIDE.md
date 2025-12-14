# App Icon Design Guide

## Kitchen Companion - Icon Requirements & Recommendations

### Icon Design Concept

**Brand Identity:**
- Name: Kitchen Companion
- Theme: Cooking, AI assistance, meal planning
- Colors: Orange (#ff6b35), Green (#5fb360), Warm tones
- Style: Modern, friendly, approachable

**Recommended Icon Concepts:**

1. **Chef Hat + AI Spark** (Recommended)
   - Simple chef's hat outline
   - Small sparkle/star accent (AI element)
   - Clean, recognizable at small sizes
   - Works well on all backgrounds

2. **Cooking Pot + Steam**
   - Stylized pot/pan
   - Steam rising (could include spark)
   - Warm, inviting feel

3. **Fork + Spoon Crossed**
   - Classic utensils
   - Modern, minimal design
   - Add small AI element (sparkle)

**Design Principles:**
- ✅ Simple and recognizable at small sizes (down to 29x29pt)
- ✅ No text (should work without words)
- ✅ Bold, clear shapes
- ✅ Distinctive silhouette
- ✅ Looks good on light and dark backgrounds
- ❌ Avoid gradients (can look muddy at small sizes)
- ❌ Avoid too many details
- ❌ Avoid thin lines (won't scale well)

### iOS Icon Specifications

**Required Sizes** (all PNG, no transparency):

| Size | Usage | Filename |
|------|-------|----------|
| 1024x1024 | App Store | AppIcon-1024.png |
| 180x180 | iPhone @3x | AppIcon-60@3x.png |
| 120x120 | iPhone @2x | AppIcon-60@2x.png |
| 167x167 | iPad Pro @2x | AppIcon-83.5@2x.png |
| 152x152 | iPad @2x | AppIcon-76@2x.png |
| 76x76 | iPad | AppIcon-76.png |
| 120x120 | Notification @3x | AppIcon-40@3x.png |
| 80x80 | Notification @2x | AppIcon-40@2x.png |
| 87x87 | Settings @3x | AppIcon-29@3x.png |
| 58x58 | Settings @2x | AppIcon-29@2x.png |
| 40x40 | Notification | AppIcon-20@2x.png |
| 29x29 | Settings | AppIcon-29.png |

**Technical Requirements:**
- Format: PNG
- Color Space: sRGB or Display P3
- No alpha channel (no transparency)
- No rounded corners (iOS adds them automatically)
- 72 DPI minimum

**Where to place:**
`ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Android Icon Specifications

**Adaptive Icon** (Recommended for Android 8.0+):

Android uses a two-layer system:
1. **Foreground** - Your main icon (with safe zone)
2. **Background** - Solid color or simple pattern

**Required Files:**

| Density | Size | Folder |
|---------|------|--------|
| mdpi | 48x48 | mipmap-mdpi |
| hdpi | 72x72 | mipmap-hdpi |
| xhdpi | 96x96 | mipmap-xhdpi |
| xxhdpi | 144x144 | mipmap-xxhdpi |
| xxxhdpi | 192x192 | mipmap-xxxhdpi |

**Adaptive Icon Layers** (in `mipmap-anydpi-v26/`):
- `ic_launcher_foreground.xml` - Foreground layer (108x108dp with 72x72dp safe zone)
- `ic_launcher_background.xml` - Background layer (solid color or vector)

**Technical Requirements:**
- Format: PNG with alpha channel (transparency OK)
- Safe zone: Keep important elements within 66dp circle (center)
- Background: Can be solid color (#ff6b35 recommended)
- Test on circular, squircle, rounded square masks

**Where to place:**
`android/app/src/main/res/mipmap-*/`

### Design Tools & Resources

**Recommended Tools:**

1. **Figma** (Free, web-based)
   - Template: https://www.figma.com/community/file/1234567890/app-icon-template
   - Export all sizes easily

2. **Sketch** (Mac only, paid)
   - Built-in iOS icon template

3. **Adobe Illustrator** (Paid)
   - Vector-based, scales perfectly

4. **Free Online Tools:**
   - [appicon.co](https://appicon.co) - Generate all sizes from one image
   - [makeappicon.com](https://makeappicon.com) - iOS + Android icon generator
   - [easyappicon.com](https://easyappicon.com) - Quick icon generation

**Asset Generation Services:**
- **[Figma Icon Template](https://www.figma.com/community)** - Search "app icon"
- **[AppIconizer](https://appicon.co)** - Upload 1024x1024, get all sizes

### Kitchen Companion Icon Mockup

**Suggested Design:**

```
┌─────────────────┐
│                 │
│    ┌───┐        │  Chef hat (white/cream)
│   /     \       │  With AI sparkle (orange)
│  │  ★   │      │  Background: Gradient (orange to coral)
│  │      │      │  or solid orange (#ff6b35)
│   \     /       │
│    └───┘        │
│                 │
└─────────────────┘
```

**Color Palette:**
- Primary: #ff6b35 (Orange - warm, appetizing)
- Secondary: #5fb360 (Green - fresh, healthy)
- Accent: #ffffff (White - clean, simple)
- Background: Gradient from #ff6b35 to #ff8c5a

**Icon Variants to Test:**
1. Orange background + white chef hat + orange sparkle
2. White background + orange chef hat + green accent
3. Gradient background (orange→coral) + white hat

### Step-by-Step Icon Creation

#### Option 1: Design in Figma (Recommended)

1. **Create New File**
   - Go to Figma (free account)
   - Create 1024x1024 frame
   - Design your icon

2. **Design Guidelines**
   - Keep important elements in center 80%
   - Test at 29x29 (smallest size)
   - Use bold, simple shapes
   - Limit to 2-3 colors

3. **Export**
   - Select frame
   - Export as PNG
   - 1024x1024 at @1x

4. **Generate All Sizes**
   - Upload to appicon.co
   - Download iOS + Android asset packs
   - Extract to project folders

#### Option 2: Use Icon Generator Service

1. **Create Master Icon**
   - Any tool (Canva, Photoshop, etc.)
   - Export 1024x1024 PNG
   - No transparency for iOS
   - With transparency for Android

2. **Generate Assets**
   - Go to [makeappicon.com](https://makeappicon.com)
   - Upload 1024x1024 image
   - Download iOS + Android packs

3. **Install Assets**
   - iOS: Replace contents in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Android: Replace in `android/app/src/main/res/mipmap-*/`

### Testing Your Icon

**iOS Testing:**
1. Open Xcode
2. Navigate to Assets.xcassets → AppIcon
3. Verify all sizes are filled
4. Build and run on simulator
5. Check home screen appearance

**Android Testing:**
1. Open Android Studio
2. Navigate to res/mipmap folders
3. Verify all densities present
4. Build and run on emulator
5. Check launcher appearance
6. Test with different launcher themes (circular, squircle, etc.)

**Real Device Testing:**
- Install on physical device
- View on home screen
- Check in app drawer
- Verify visibility at different sizes
- Test on light/dark mode

### Quick Start: Free Icon Template

**If you need a quick placeholder:**

1. Use Canva (free):
   - Search "app icon" template
   - Customize with your colors (#ff6b35)
   - Add chef hat icon or cooking emoji
   - Download as PNG 1024x1024

2. Generate sizes:
   - Upload to appicon.co
   - Download both platforms
   - Replace in project

### Brand Consistency Checklist

- [ ] Icon uses brand colors (#ff6b35, #5fb360)
- [ ] Matches app theme and purpose
- [ ] Recognizable at small sizes (29x29)
- [ ] Distinctive from competitors
- [ ] Works on light and dark backgrounds
- [ ] No text (icon only)
- [ ] Simple, memorable design
- [ ] Professional quality

### Next Steps

After creating your icon:
1. Replace placeholder icons in Xcode
2. Replace placeholder icons in Android Studio
3. Test on simulators/emulators
4. Get feedback from users
5. Iterate if needed

---

**Current Placeholders:**
- iOS: Default Capacitor icon (blue/white)
- Android: Default Capacitor icon

**Goal:**
- Branded Kitchen Companion icon
- Recognizable, professional
- App store ready

**Need Help?**
- Hire a designer on Fiverr ($25-100)
- Use 99designs for icon contest ($299+)
- DIY with Figma + templates (free)

---

**Status**: Ready to design! 🎨
**Recommended**: Create in Figma, generate with appicon.co
**Timeline**: 2-4 hours for design + generation
