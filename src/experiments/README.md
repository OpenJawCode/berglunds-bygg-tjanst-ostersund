## ✅ Sandbox Complete & Optimized

Created `/src/experiments/` with production-ready background components:

### 🎨 Background Components (6 total)

| Component | Best For | Animation | Performance |
|-----------|----------|-----------|-------------|
| **BlueprintGrid** | Om oss hero | GSAP parallax + float | ✅ CSS fallback |
| **TextureReveal** | Om oss values | Scroll-triggered reveal | ✅ Static texture mobile |
| **FloatingElements** | Om oss dark section | Multi-layer parallax | ✅ Disabled <768px |
| **RippleEffect** | Kontakt hero | GSAP scale + opacity | ✅ CSS keyframes fallback |
| **Particles** | Dark sections | Canvas animation | ✅ Static dots fallback |
| **DepthLayers** | Any dark section | Layered scroll parallax | ✅ Simplified mobile |

### 🔧 Key Optimizations Applied

1. **Brand tokens**: Primary `#00B8D4` (cyan), Accent `#008A9C` (teal)
2. **GSAP cleanup**: `gsap.context()` + `revert()` on unmount
3. **Mobile-first**: All heavy animations disabled <768px per AGENTS.md
4. **Accessibility**: `prefers-reduced-motion` respected everywhere
5. **Performance**: 
   - `will-change: transform` on animated elements
   - `pointer-events: none` on background layers
   - Canvas particles use requestAnimationFrame with cleanup
6. **Type safety**: Full TypeScript interfaces, no `any`

### 🧪 How to Test

```bash
# Start dev server
npm run dev

# Visit test pages:
http://localhost:3000/experiments/om-oss
http://localhost:3000/experiments/kontakt

# Use floating "Test Backgrounds" selector at bottom to switch effects
```

### 📁 File Structure
```
src/experiments/
├── backgrounds/
│   ├── blueprint-grid/       # Grid + floating tools
│   ├── texture-reveal/       # Material textures
│   ├── floating-elements/    # Geometric parallax
│   ├── ripple-effect/        # Center ripple animation
│   ├── particles/           # Canvas dust particles
│   ├── depth-layers/        # Multi-layer gradients
│   └── index.ts             # Barrel export
├── pages/
│   ├── om-oss-test.tsx      # Toggle UI + sections
│   └── kontakt-test.tsx     # Toggle UI + sections
├── lib/
│   └── experiment-utils.ts  # Shared helpers
├── package.json
└── README.md
```

### 🚀 Next Steps

1. **Preview**: Visit `/experiments/om-oss` and toggle backgrounds
2. **Select winner**: Pick 1-2 effects per page section
3. **Promote to production**: Move chosen components to `/src/components/backgrounds/`
4. **Integrate**: Import into `om-oss/page.tsx` and `kontakt/page.tsx`

### ⚠️ Production Checklist (before promoting)

- [ ] Verify LCP < 2.0s with Lighthouse
- [ ] Test on mobile (animations disabled <768px)
- [ ] Confirm `prefers-reduced-motion` works
- [ ] Run `python3 .claude/scripts/visual-regression.py --audit`
- [ ] Update AGENTS.md if adding new component patterns

Need me to promote a specific component to production now? Just say which one. 🎯
