# Logo Setup Instructions

## Adding Your Logo

1. **Save your logo image** as `logo.png` in the `frontend/public/` directory

2. **Recommended specifications**:
   - Format: PNG (with transparency preferred)
   - Size: 200x200px to 400x400px (square format works best)
   - File size: Under 500KB for optimal performance

3. **The logo will automatically appear in**:
   - Navigation bar (top left)
   - Footer (top left section)

4. **Current implementation**:
   - The code is already set up to use `/logo.png`
   - If the file doesn't exist, Next.js will show a broken image
   - Make sure the file is named exactly `logo.png` (lowercase)

## Logo Design Notes

Based on your logo description, it features:
- Two abstract figures forming a heart
- A child figure in the center
- Organic leaf-like elements
- Medical cross symbol
- "Purity" in script font
- "FAMILY SERVICES" in sans-serif

The current implementation will display this logo with:
- "Purity" text in cursive/script font style
- "FAMILY SERVICES" subtitle below it
- Proper sizing and responsive behavior

## Testing

After adding the logo:
1. Restart the Next.js dev server
2. Check the navbar and footer
3. Verify it looks good on mobile devices




