# Project Status — Berglunds Byggtjänst Östersund

## ✅ Completed Features

### Phase 1: UI/UX
- [x] GlobalQuoteLauncher floating button + modal
- [x] QuoteWizard multi-step form
- [x] QuoteChat with RAG AI assistant
- [x] ServiceSelect with SVG icons (no emojis)
- [x] ImageUpload component with camera support
- [x] Haptic feedback for mobile

### Phase 2: RAG Backend
- [x] Pinecone client setup
- [x] Gemini Embedding 2 multimodal integration
- [x] Project similarity search
- [x] /api/chat/multimodal endpoint
- [x] /api/upload-image endpoint with Vercel Blob
- [x] Seed project ingestion script

### Phase 3: Lead Qualification
- [x] StepContact: name/phone/email + honeypot
- [x] StepServices: multi-select with follow-up questions
- [x] StepDetails: budget, timeline, property ownership
- [x] StepImage: optional image upload (after qualification)
- [x] LeadScoring: HOT (≥25pts), WARM (15-24), COLD (5-14), BLOCKED (<5)
- [x] GlobalQuoteLauncher integration

---

## 🔑 Required API Keys

Add these to **Vercel Environment Variables** (not client-side):

```bash
# Gemini (via Google Cloud Console)
GOOGLE_EMBEDDING_API_KEY=AIza...  # For embeddings
OPENROUTER_API_KEY=sk-or-...     # For chat (uses Gemini Flash via OpenRouter)

# Pinecone (vector database)
PINECONE_API_KEY=pcsk_...

# Vercel Blob (image storage)
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Optional: Resend (emails)
RESEND_API_KEY=re_...

# Site URL
NEXT_PUBLIC_SITE_URL=https://berglundsbyggtjanst.se
```

---

## 🎯 Lead Flow

```
User clicks "Få en offert" → Choice screen
                ↓
    ┌───────────┴───────────┐
    ↓                       ↓
Snabbt formulär        AI-chatt
    ↓                       ↓
Step 1: Contact      Chat with AI
(name, phone)             ↓
    ↓                  Collects info
Step 2: Services      auto-trigger
(primary + optional)     lead submission
    ↓
Step 3: Details
(budget, timeline,
 property owner)
    ↓
Step 4: Image (opt)
    ↓
Scoring → Route
    ↓
┌─────┬─────┬─────┐
↓     ↓     ↓     ↓
HOT  WARM  COLD BLOCKED
(25+) (15- (5-14) (<5)
      24)
    ↓     ↓     ↓
Phone CTA Callback 24h  Message
```

**HOT leads** see: "Ring oss nu: 070-321 88 27"  
**WARM** → callback in 2 min  
**COLD** → response in 24h

---

## 🔌 External Integrations (Future)

### Google Sheets CRM
- Client creates Google Sheet in their account
- Share with service account OR use n8n Google Sheets node
- **No cost** - uses client's existing Google account

### n8n Workflow
- Webhook receives lead data
- Append to Google Sheet
- (Optional) Send email via Resend
- (Optional) Trigger Retell AI call

### Resend (Emails)
- Client pays ($19/month for 3000 emails)
- Send confirmation emails to leads

---

## 📋 Pending from Client

- [ ] Provide Google Cloud Project with Gemini API enabled
- [ ] Create Google Sheet for lead tracking (or we create template)
- [ ] Approve n8n workflow structure
- [ ] Set up Resend account (optional, for emails)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js 14                       │
│                  (Static Export)                    │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   /api/quote    /api/chat/     /api/upload-
                  multimodal      image
        ↓              ↓              ↓
        └──────────────┴──────────────┘
                       ↓
              n8n Webhook
                       ↓
        ┌──────────────┴──────────────┐
        ↓              ↓              ↓
   Google Sheets    Resend        Retell AI
   (CRM)            (Email)       (Voice)
```

---

*Last updated: 2026-04-11*
*Owner: Prism Byrå / OpenJaw AI*