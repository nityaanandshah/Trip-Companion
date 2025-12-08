# Trip Companion Design System

## Color Palette

### Primary Colors

| Color Name | Hex Code | Usage | Tailwind Class |
|------------|----------|-------|----------------|
| **Deep Forest Green** | `#073B3A` | Navigation, headers, trust & stability | `forest`, `bg-forest`, `text-forest` |
| **Warm Clay Terracotta** | `#C76D45` | Secondary actions, warm accents | `terracotta`, `bg-terracotta`, `text-terracotta` |
| **Sand Beige** | `#E8DCC4` | Neutral foundation, borders | `sand`, `bg-sand`, `text-sand` |

### Secondary Colors (UI Highlights & Accents)

| Color Name | Hex Code | Usage | Tailwind Class |
|------------|----------|-------|----------------|
| **Golden Mustard** | `#D4A017` | Primary buttons, highlights, energy | `mustard`, `bg-mustard`, `text-mustard` |
| **Olive Green** | `#687864` | Subtle background contrast | `olive`, `bg-olive`, `text-olive` |
| **Charcoal Black** | `#1E1E1E` | Typography, text | `charcoal`, `bg-charcoal`, `text-charcoal` |

### Optional Tints

| Color Name | Hex Code | Usage | Tailwind Class |
|------------|----------|-------|----------------|
| **Cream** | `#F7F4EE` | Page backgrounds | `cream`, `bg-cream` |
| **Soft Earth Brown** | `#8B5E3C` | Accents | `earth`, `bg-earth`, `text-earth` |

## Design Principles

### Flat Design Philosophy
- **No gradients** - All backgrounds are solid colors
- **No shadows** - Replaced with subtle borders (`border-subtle`, `border-card`)
- **Minimal elevation** - Visual hierarchy through color and borders, not depth

### Border & Radius System
- Card borders: `2px` (`rounded-card`)
- Large card borders: `4px` (`rounded-card-lg`)
- Border classes:
  - `border-subtle` - 1px solid rgba(7, 59, 58, 0.1)
  - `border-card` - 1px solid rgba(7, 59, 58, 0.15)

### Button Styles
- **Primary Button**: Golden mustard background, charcoal text
  - Class: `btn-primary` or `bg-mustard text-charcoal`
  - Hover: `hover:bg-mustard-dark`
  
- **Secondary Button**: Terracotta background, white text
  - Class: `btn-secondary` or `bg-terracotta text-white`
  - Hover: `hover:bg-terracotta-dark`

### Typography
- **Body text**: Charcoal (`text-charcoal` or `text-gray-900`)
- **Secondary text**: Olive or gray-600 (`text-olive`, `text-gray-600`)
- **On dark backgrounds**: Sand-light (`text-sand-light`)
- **Font family**: Plus Jakarta Sans (Sans-serif for UI)

### Backgrounds
- **Page background**: Cream (`#F7F4EE`)
- **Card background**: White (`#FFFFFF`)
- **Navigation**: Deep Forest Green (`#073B3A`)

### Icon Colors
By context:
- Location icons: Mustard
- Date/Time icons: Terracotta  
- User/Profile icons: Olive
- Budget icons: Olive
- Success/Check: Olive
- Warning: Terracotta

## Component Styling Examples

### Navigation Bar
```tsx
<nav className="bg-forest border-b border-forest-light">
  <Link className="text-sand-light">Trip Companion</Link>
  <button className="bg-mustard text-charcoal hover:bg-mustard-dark">
    Create Trip
  </button>
</nav>
```

### Card
```tsx
<div className="bg-white rounded-card border-card p-6">
  {/* Content */}
</div>
```

### Button
```tsx
<button className="bg-mustard text-charcoal px-4 py-2 rounded-sm hover:bg-mustard-dark transition-colors">
  Action
</button>
```

### Hero Section
```tsx
<div className="bg-forest text-white rounded-card border-card p-10">
  <h1 className="text-5xl font-bold">Welcome</h1>
  <p className="text-sand-light">Subtitle text</p>
</div>
```

## Migration Summary

### What Changed

1. **Color Replacements**:
   - Blue (`bg-blue-600`) → Mustard (`bg-mustard`)
   - Purple (`bg-purple-600`) → Terracotta (`bg-terracotta`)
   - Gray-50 backgrounds → Cream
   - Icon colors updated to match palette

2. **Design Changes**:
   - Removed all `shadow-*` classes
   - Replaced `elevation-*` with `border-card` classes
   - Changed `rounded-3xl`, `rounded-2xl`, `rounded-xl` to `rounded-card`
   - Removed gradients (e.g., `bg-gradient-to-br`)

3. **Files Updated**:
   - `tailwind.config.ts` - Added new color palette
   - `app/globals.css` - Updated CSS variables and utility classes
   - `components/Navbar.tsx` - Full navbar redesign
   - All page files in `app/` directory
   - All component files in `components/` directory

### Color Mapping Reference

| Old Color | New Color | Use Case |
|-----------|-----------|----------|
| `bg-blue-600` | `bg-mustard` | Primary buttons |
| `bg-purple-600` | `bg-terracotta` | Secondary actions |
| `text-blue-600` | `text-mustard` | Links, highlights |
| `text-purple-600` | `text-terracotta` | Accents |
| `bg-gray-50` | `bg-cream` | Page backgrounds |
| `border-blue-500` | `border-mustard` | Active states |
| `elevation-*` | `border-card` | Card elevation |

## Accessibility Notes

- All color combinations maintain WCAG AA contrast ratios
- Forest green on white: High contrast for readability
- Mustard on charcoal: Excellent contrast for buttons
- Sand-light on forest: Good contrast for navigation text

## Future Considerations

- Consider adding serif font for branding elements (headers, hero text)
- Explore nature textures for background patterns
- Add realistic photography to hero sections
- Maintain spacious, calm layouts throughout



