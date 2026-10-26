# Styling Conventions & Tailwind CSS

## 1. Styling Principles

The School ERP frontend uses **Tailwind CSS v3** as its primary styling engine.

### Core Rules

1. **Utility-First**: Apply styles directly using Tailwind utility classes. Avoid writing custom raw CSS in `.css` files unless defining design system custom properties or keyframe animations.
2. **Merging Class Names with `cn()`**: Always use the `@/lib/utils` `cn()` helper (`clsx` + `tailwind-merge`) when composing conditional or dynamic classes to prevent specificity collisions:
   ```tsx
   import { cn } from '@/lib/utils';

   <div
     className={cn(
       'p-4 text-slate-800 bg-white rounded-lg',
       isActive && 'ring-2 ring-indigo-500',
       className
     )}
   />;
   ```
3. **No Inline `style={{ ... }}`**: Do not write inline styles for layout or colors. Use inline styles exclusively for dynamic runtime values (e.g., coordinates in a canvas or exact drag-and-drop offsets).
4. **Design Tokens**: Standardize colors on Tailwind slate/indigo palettes:
   - Primary Interactive: `indigo-600` / `hover:bg-indigo-700`
   - Backgrounds: `bg-slate-50` (page), `bg-white` (surfaces/cards)
   - Borders: `border-slate-200`
   - Typography: `text-slate-900` (headings), `text-slate-600` (body), `text-slate-400` (subtle)
   - Status Indicators:
     - Success: `emerald-600`, `bg-emerald-50`, `border-emerald-200`
     - Warning: `amber-600`, `bg-amber-50`, `border-amber-200`
     - Danger/Error: `rose-600`, `bg-rose-50`, `border-rose-200`
     - Info: `blue-600`, `bg-blue-50`, `border-blue-200`

---

## 2. Responsive Design Standards

Always design mobile-first:

- Base: Mobile (< 640px)
- `sm:` Small tablets (>= 640px)
- `md:` Tablets & small laptops (>= 768px)
- `lg:` Laptops (>= 1024px)
- `xl:` Desktops (>= 1280px)
- `2xl:` High-res monitors (>= 1536px)
