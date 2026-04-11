# Bug Log — Berglunds Byggtjänst

## 2026-04-11

### Bug: Wrong options in StepDetails Timeline section
**File:** `src/components/global/lead-qualification/StepDetails.tsx`
**Line:** ~209
**Issue:** Timeline section was rendering `PROPERTY_OWNER_OPTIONS` instead of `TIMELINE_OPTIONS`. This caused the question "Tidsplan" to show property ownership options like "Ja, jag äger fastigheten" instead of timeline options like "Så snart som möjligt".
**Root cause:** Copy-paste error when writing the component - wrong variable used in the map.
**Fix:** Changed `PROPERTY_OWNER_OPTIONS.map` to `TIMELINE_OPTIONS.map` in the Timeline section's expanded content.
**Status:** Fixed ✅