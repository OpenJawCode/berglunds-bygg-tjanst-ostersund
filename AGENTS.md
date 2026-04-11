# AGENTS.md — Berglunds Byggtjänst Östersund
> **Director**: Abdulrahman · **Agency**: Prism Byrå · **Stack**: Next.js 14 · Tailwind v4 · GSAP · Framer Motion · TypeScript

---

## ⚠️ HARD RULES — NEVER VIOLATE

1. `postcss.config.js` — **never regenerate** (Tailwind v4 Netlify kill)
2. `@theme {}` — **never replace with `:root {}`**
3. `<form>` HTML — **never use in React** → controlled state + onClick only
4. API keys — **never hardcode** → `.env.local` always
5. Fonts — **never use** Inter, Roboto, Arial, system-ui → Cinzel + Plus Jakarta Sans
6. Phase gates — **never advance** without director approval where marked
7. Language — **always Swedish** for all UI copy, meta, alt text, schema

---

## 🎨 BRAND — READ FROM FILE

> Full tokens, hex values, logo paths, typography spec:
> **`/brand/brand-tokens.json`** + **`/brand/brand-guidelines.md`**

Quick reference only:
- Primary cyan: `#00B8D4` (brand / brand-500)
- Backgrounds: `#0d1117` → `#111820` → `#080d12`
- Text: `#e8e4dc` (primary) · `#c8bfa8` (secondary)
- Fonts: `Cinzel` (headings) · `Plus Jakarta Sans` (body)
- Logo full: `/brand/logo-horizontal.png`
- Logo mark: `/brand/logo-monogram.png`
- **Never use** `primary` class — deprecated, use `brand`

### ⚠️ Color Rule on Light Backgrounds
`bg-background-light` (#F8F6F3) = light cream → **must use `text-text` (dark)**
White text on light bg = invisible. This is the #1 recurring bug.

---

## 🗂️ FILE ROUTING

When working on a task, **read the relevant file first** — don't guess from memory.

| Task | Read This File First |
|---|---|
| Colors / tokens | `/brand/brand-tokens.json` |
| Brand guidelines | `/brand/brand-guidelines.md` |
| Design direction | `/brand/design-dna.md` |
| Typography | `/brand/typography-spec.md` |
| Sitemap / pages | `/docs/sitemap.md` |
| Component list | `/docs/component-inventory.md` |
| RAG agent config | `/docs/rag-agent-spec.md` |
| Animation system | `/src/animations/constants.ts` + `/src/animations/index.ts` |
| Nav behavior | `/src/components/layout/Navigation.tsx` |
| Services data | `/src/lib/constants.ts` |
| Env vars needed | `/.env.example` |
| Deploy checklist | `/docs/deployment-checklist.md` |

---

## 🧰 SKILL ROUTING

### Always Active
`frontend-design` · `uiux-promax` · `taste-skill` · `spec-ops`

### Auto-Trigger by Context

| Working on | Load Skill |
|---|---|
| `.tsx` `.jsx` component | `frontend-design` + `uiux-promax` |
| Brand/token files | `taste-skill` |
| `AGENTS.md` / `.md` docs | `spec-ops` |
| `/src/animations/` any file | `motion-system` |
| `/api/chat` `/api/quote` routes | `rag-agent` |
| `embeddings.ts` `pinecone.ts` | `google-embedding` |
| `verify-build.sh` / Lighthouse | `performance-audit` |
| Screenshot / visual QA | `screenshot-agent` |
| Debug / refactor task | `verification-agent` |

---

## 🔧 MCP TOOLS — 21st.dev Magic

**Purpose**: Generate initial component scaffolds only. Always apply brand overrides after.
**Config**: `~/.opencode/config.json` → see `/docs/mcp-setup.md` for full config

**When to use**: Call 21st-magic for initial generation. Never for logic, routing, or data layers.

**Prompt templates per component** → see `/docs/component-inventory.md` for exact prompts

**Post-generation brand overrides — always apply**:
- Replace all fonts → Cinzel (headings) + Plus Jakarta Sans (body)
- Replace all colors → `/brand/brand-tokens.json`
- Remove all light-mode assumptions
- Verify no `<form>` elements exist

---

## 🚦 PHASE GATES

| Phase | Task | Proceed? |
|---|---|---|
| 0 | Extraction — screenshot, scrape, brand DNA | ✅ auto |
| 1 | Planning doc → `project-plan.md` | ❌ director approval |
| 2 | Scaffold — file tree, tokens, config | ✅ auto after Phase 1 |
| 3 | Build — components + pages | ✅ verify gate per component |
| 4 | RAG integration | ❌ director approval |
| 5 | Performance audit + mobile QA | ✅ auto |
| 6 | Deploy | ❌ director approval |

---

## ✅ VERIFICATION — MANDATORY AFTER EVERY CHANGE

```bash
# Before AND after every change
python3 .claude/scripts/visual-regression.py --audit

# Full viewport audit
bash .claude/scripts/screenshot-audit.sh http://localhost:3000 1280

# After build
npm run build && npm run type-check
```

Visual checklist — check all before committing:
- [ ] Nav visible on all pages (desktop + mobile)
- [ ] No white text on light backgrounds
- [ ] Hero sections readable + contrast passing
- [ ] Logo renders correctly in nav
- [ ] CTA buttons visible + clickable
- [ ] Footer renders correctly

---

## 🎬 ANIMATION SYSTEM

> Full spec, easing constants, component list:
> **`/src/animations/constants.ts`** + **`/src/animations/index.ts`**

Quick reference:
- Scroll animations: GSAP ScrollTrigger → see `/src/animations/scroll/`
- Page transitions: Framer Motion `AnimatePresence` mode `wait` → see `/src/animations/page-transitions/`
- Micro interactions: → see `/src/animations/micro/`
- **Always kill** ScrollTrigger instances on unmount
- **Disable all GSAP** below 768px — use CSS fallbacks

### Nav Behavior
- Transparent dark at top → solid compact at `scrollY > 80`
- At top: white text · Scrolled: dark text via `isScrolled` state
- Logo: `brightness-0 invert` (top) → `brightness-0` (scrolled)
- Full nav spec → read `/src/components/layout/Navigation.tsx`

---

## 🖼️ SERVICE SUBPAGE IMAGES

> Full image map with Unsplash sources:
> **`/docs/sitemap.md`**

Rule: `/tjanster/takbyten` only uses `/brand/takarbeten-hero.jpg` (original client photo — keep).
All other subpages use Unsplash. Never reuse the same image across subpages.

---

## 🤖 RAG AGENT (Multimodal)

> Full spec, model config, Pinecone setup, env vars:
> **`/docs/rag-agent-spec.md`**

Quick reference:
- Chat: Gemini Flash via OpenRouter → `OPENROUTER_API_KEY`
- Multimodal chat endpoint: `/api/chat/multimodal`
- Image upload endpoint: `/api/upload-image` (Vercel Blob storage)
- Embeddings: Gemini Embedding 2 (multimodal) → `GOOGLE_EMBEDDING_API_KEY` (separate — not OpenRouter)
- Vector: Pinecone serverless → `PINECONE_API_KEY`
- Image storage: Vercel Blob → `BLOB_READ_WRITE_TOKEN`
- Emails: Resend → `RESEND_API_KEY`
- Seed projects: `/src/lib/seed-projects.ts` (10 demo projects)
- Ingestion: `npx tsx src/scripts/ingest-seed-projects.ts`
- Fallback: keyword matching when Pinecone is unavailable

---

## ⚡ PERFORMANCE BUDGET

| Metric | Target |
|---|---|
| LCP | ≤ 2.0s |
| INP | ≤ 100ms |
| CLS | ≤ 0.05 |
| JS bundle | ≤ 150kb gzipped |

> Static export constraints: `output: 'export'` · `images.unoptimized: true` · all dynamic routes need `generateStaticParams()`

---

## 🐛 KNOWN PITFALLS

> Full breakdown with prevention steps:
> **`/docs/deployment-checklist.md`**

Top 5 from previous Prism Byrå builds:
1. Missing `postcss.config.js` → Tailwind v4 breaks on Netlify
2. `@theme {}` swapped to `:root {}` → tokens break silently
3. Google Embedding 2 not on OpenRouter → needs separate key
4. GSAP ScrollTrigger on mobile → disable below 768px or perf dies
5. `next/font` not preloading Cinzel → FOUT on first load

---

## 🗣️ COMMUNICATION

- **Ambiguous task?** Stop and ask. Do not guess and proceed.
- **Two valid approaches?** Present both with tradeoffs. Let director decide.
- **Phase gate reached?** Present output summary. Wait for explicit "proceed".
- **Commit format**: `feat(nav): add compact scroll` · `fix(tokens): correct cyan hex`

---

*Stack: Next.js 14 App Router · Tailwind v4 · GSAP · Framer Motion · TypeScript · Pinecone · Gemini Flash*
*Node: ≥20.9.0 (`.nvmrc`) · Build: `npm run dev` · Export: `npm run build` → `dist/`*