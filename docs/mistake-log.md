# Mistake Log — Berglunds Byggtjänst

## 2026-04-11

### Mistake: Duplicate questions in StepDetails
**What happened:** The StepDetails component had duplicate property ownership questions. Both the Timeline section and the Property Ownership section were displaying the same options.
**Why it happened:** When building StepDetails.tsx, the code for the Timeline section was copy-pasted from the Property section but the developer forgot to change the data source from `PROPERTY_OWNER_OPTIONS` to `TIMELINE_OPTIONS`.
**Lesson:** Always verify that data source matches the section header when copying code blocks. The UI showed "Tidsplan" but the options were about property ownership - this should have been caught in review.
**Prevention:** Add a code review checklist item: "Verify data source matches section label" for accordion/expandable sections.