# Berglunds Leads - Google Sheets Template

Copy this structure into a new Google Sheet named `Berglunds Leads`.

## Sheet Name: `Sheet1` (or rename to `Leads`)

### Column Headers (Row 1)
```csv
timestamp,name,phone,email,postal_code,project_type,description,source,retell_call_id,status
```

### Column Descriptions
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `timestamp` | datetime | Yes | ISO 8601 format: `2025-01-15T14:30:00+01:00` |
| `name` | text | Yes | Customer full name |
| `phone` | text | Yes | E.164 format: `+46701234567` |
| `email` | text | Yes | Customer email address |
| `postal_code` | text | Yes | Swedish format: `831 40` |
| `project_type` | text | Yes | One of: `takbyten`, `badrumsrenovering`, `nybyggnation`, `ombyggnation`, `snickeriarbeten`, `other` |
| `description` | text | No | Brief project description from user |
| `source` | enum | Yes | `form` or `chat` (which UI path was used) |
| `retell_call_id` | text | No | Populated after Retell call completes |
| `status` | enum | Yes | `new`, `contacted`, `quoted`, `closed` |

### Example Row
```csv
2025-01-15T14:30:00+01:00,Anna Andersson,+46701234567,anna@email.se,831 40,takbyten,"Takläcka på södra sidan, vill ha offert på reparation",form,,new
```

### Formatting Tips
1. **Freeze Row 1**: View → Freeze → 1 row
2. **Data Validation for `project_type`**:
   - Data → Data validation → Criteria: List of items
   - Values: `takbyten,badrumsrenovering,nybyggnation,ombyggnation,snickeriarbeten,other`
3. **Data Validation for `source`**:
   - Values: `form,chat`
4. **Data Validation for `status`**:
   - Values: `new,contacted,quoted,closed`
5. **Conditional Formatting for `status`**:
   - `new` → Yellow background
   - `contacted` → Blue background
   - `quoted` → Green background
   - `closed` → Gray background

### n8n Webhook Payload Format
When forwarding to n8n, use this JSON structure:
```json
{
  "timestamp": "2025-01-15T14:30:00+01:00",
  "name": "Anna Andersson",
  "phone": "+46701234567",
  "email": "anna@email.se",
  "postal_code": "831 40",
  "project_type": "takbyten",
  "description": "Takläcka på södra sidan",
  "source": "form",
  "agent_id": "agent_2cddb47efe7325ad729c41f6d2"
}
```

### Post-Call Update Format (Retell → n8n → Sheets)
When Retell call completes, update the row with:
```json
{
  "retell_call_id": "call_xxxxx",
  "status": "contacted",
  "transcript_summary": "Customer confirmed project scope, available next Tuesday",
  "extracted_budget": "50000-100000",
  "extracted_timeline": "Q1 2025"
}
```
