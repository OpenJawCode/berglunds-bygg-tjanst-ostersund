# Berglunds Byggtjänst — Agent Notes

## Project
Next.js 14 static site for Swedish construction company. Static export to `dist/`.

## Quick Commands
```bash
npm run dev          # Dev server
npm run build        # Static export to dist/
npm run type-check   # TypeScript check
```

## Critical Conventions

### Colors (Tailwind)
- **Brand cyan**: `brand` / `brand-500` (#00B8D4) — primary CTA, accents
- **Never use** `primary` — deprecated, use `brand` instead
- Background: `background-light` (#F8F6F3)
- Text: `text` (#1A1A1A), `text-muted` (#6B6B6B)

### Navigation Behavior
- **At top**: transparent dark (`bg-white/[0.07]`), **white text**
- **Scrolled >80px**: solid white (`bg-white/95`), **black text** via `isScrolled` state
- Logo: `/logo.svg` with conditional `brightness-0` (scrolled) vs `brightness-0 invert` (top)

### Animations (GSAP)
- GSAP + ScrollTrigger already configured
- Use `@/lib/animations/gsap` for utilities
- **Always** kill ScrollTrigger instances on unmount to prevent memory leaks
- Page transitions handled by `PageTransition` component

### Static Export Constraints
- `output: 'export'` in `next.config.mjs`
- `images.unoptimized: true` — no next/image optimization
- All dynamic routes use `generateStaticParams()`

## File Patterns
- Components: `src/components/{layout,sections,ui,animations}/`
- Page sections: `src/components/sections/{Hero,Services,...}.tsx`
- Constants: `src/lib/constants.ts` — services, nav, site config
- Utils: `src/lib/utils.ts` — `cn()` helper only

## API Routes (Optional)
- `/api/chat` — Gemini Flash chatbot
- `/api/quote` — Quote form submission
- Both require `OPENROUTER_API_KEY` env var

## Node Version
`.nvmrc` pins 20.9.0+
