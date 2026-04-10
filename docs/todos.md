# Todos — Berglunds Byggtjänst

## 🚀 Immediate (Ready to Build)
- [x] Create GlobalQuoteLauncher component
- [x] Create QuoteWizard multi-step form
- [x] Create QuoteChat RAG UI
- [x] Update /api/quote to forward to n8n
- [x] Create phone-utils.ts for E.164 formatting
- [x] Create leads-sheet-template.md for Google Sheets structure
- [ ] Inject GlobalQuoteLauncher into layout.tsx
- [ ] Update /offert/ page to use shared QuoteWizard
- [ ] Test end-to-end flow with n8n webhook

## ⏳ Pending Client Approval
- [ ] Set up Resend API key for transactional emails
  - Sign up at https://resend.com
  - Verify domain: berglundsbyggtjanst.se
  - Add RESEND_API_KEY to .env.local
- [ ] Create Google Sheet "Berglunds Leads" with template structure
  - Share with service account for n8n access
  - Or use n8n Google Sheets node with OAuth
- [ ] Configure n8n workflow:
  - Webhook trigger: POST /webhook/bergunds-lead
  - Node 1: Append to Google Sheets
  - Node 2: Send email via Resend (15s delay)
  - Node 3: Trigger Retell outbound call with dynamic variables
  - Node 4: Handle post-call webhook to update Sheets
- [ ] Test Retell agent `agent_2cddb47efe7325ad729c41f6d2` with outbound flow
- [ ] Add rate limiting + spam protection to /api/quote

## 🔐 Security & Compliance
- [ ] Add GDPR consent checkbox to QuoteWizard
- [ ] Add privacy policy link in modal footer
- [ ] Sanitize all user inputs server-side
- [ ] Log API errors without exposing PII
- [ ] Add webhook signature verification for n8n ↔ Retell

## 🧪 Testing
- [ ] Unit tests for phone-utils.ts
- [ ] Integration test: form submit → n8n webhook → Sheets
- [ ] E2E test: QuoteChat → lead extraction → Retell trigger
- [ ] Mobile responsive test for modal on <768px
- [ ] Accessibility test: keyboard navigation, screen reader labels

## 📊 Analytics (Optional Later)
- [ ] Track modal open rate (floating button clicks)
- [ ] Track form vs chat conversion rate
- [ ] Track time-to-submit for wizard steps
- [ ] Add UTM parameters to lead source tracking

---
*Last updated: 2025-01-15*
*Owner approval needed for: Resend, Google Sheets, n8n workflow config*
