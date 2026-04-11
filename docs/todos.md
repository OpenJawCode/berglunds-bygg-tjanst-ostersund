# Todos — Berglunds Byggtjänst

## ✅ Completed (Ready)

### Core Features
- [x] GlobalQuoteLauncher component with modal
- [x] QuoteWizard multi-step form
- [x] QuoteChat RAG AI UI
- [x] Lead Qualification Pipeline (4 steps + scoring)
- [x] Image upload with validation
- [x] Phone number formatting (E.164)
- [x] Honeypot spam protection

### Backend
- [x] /api/quote → n8n webhook
- [x] /api/chat/multimodal → RAG + Gemini
- [x] /api/upload-image → Vercel Blob + Gemini Vision
- [x] Pinecone client + embeddings
- [x] Seed projects for similarity search

### Code Quality
- [x] Build passes
- [x] TypeScript checks pass
- [x] Code review fixes applied

---

## 🚧 Waiting on Client

### Google Cloud Setup (REQUIRED)
The client needs to create/configure their Google Cloud Project:

1. **Go to Google Cloud Console** (console.cloud.google.com)
2. **Create or select project** for Berglunds
3. **Enable APIs:**
   - Gemini API (for embeddings + chat)
   - (Optional) Cloud Storage API
4. **Create API Key:**
   - Credentials → API Keys → Create
   - **Restriction:** Set to HTTP referer: `berglundsbyggtjanst.se`
5. **Copy key** → Give to us for Vercel env vars

### Google Sheets (Future - Optional)
- Client creates their own Google Sheet
- Share with our email OR use n8n with OAuth
- No cost - their existing account

### Resend (Future - Optional)
- For transactional emails
- Client signs up at resend.com ($19/mo)
- We configure the emails

---

## 📋 Next Steps After Client Provides Keys

1. Add API keys to Vercel
2. Run seed ingestion script
3. Test end-to-end flow
4. Set up n8n workflow (we build, client hosts)
5. Optional: Add Resend emails

---

## 🔐 Security Notes

- All API keys stored in Vercel (server-side only)
- No client-side secrets exposed
- Honeypot field catches bots
- Input validation on all forms

---

*Last updated: 2026-04-11*
*Status: Awaiting Google Cloud API keys from client*