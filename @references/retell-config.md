# Retell AI Config — Berglunds Byggtjänst

## Agent Configuration
```json
{
  "agent_name": "Berglunds Telefonassistent",
  "agent_id": "ag_bergunds_ostersund_v1",
  "llm_id": "ll_retell_gemini_flash",
  "voice": {
    "voice_id": "en-US-LelandNeural",
    "language": "sv-SE",
    "speed": 1.0,
    "pitch": 0
  },
  "latency_target_ms": 1000,
  "temperature": 0.3
}
```

## Custom Functions

### 1. lookup_customer
```json
{
  "name": "lookup_customer",
  "description": "Look up customer by phone number in CRM",
  "parameters": {
    "phone_number": {
      "type": "string",
      "description": "Phone in E.164 format: +46701234567"
    }
  },
  "url": "https://abdulrahman-n8n.duckdns.org/webhook/retell-lookup",
  "method": "POST",
  "timeout_ms": 5000,
  "talk_during_execution": true,
  "response_schema": {
    "type": "object",
    "properties": {
      "found": { "type": "boolean" },
      "name": { "type": "string" },
      "address": { "type": "string" },
      "postal_code": { "type": "string" },
      "previous_projects": { "type": "array" }
    }
  }
}
```

### 2. save_variables
```json
{
  "name": "save_variables",
  "description": "Save collected customer data to CRM/Google Sheets",
  "parameters": {
    "phone": { "type": "string", "description": "E.164 format" },
    "name": { "type": "string" },
    "address": { "type": "string" },
    "postal_code": { "type": "string" },
    "project_type": { "type": "string" },
    "preferred_time": { "type": "string" },
    "notes": { "type": "string" },
    "lead_score": { "type": "string", "enum": ["hot", "warm", "cold"] }
  },
  "url": "https://abdulrahman-n8n.duckdns.org/webhook/retell-save",
  "method": "POST",
  "timeout_ms": 5000,
  "talk_during_execution": true
}
```

### 3. check_calendar_availability ⭐ NEW
```json
{
  "name": "check_calendar_availability",
  "description": "Check available time slots in Google Calendar for site visits",
  "parameters": {
    "date_range": {
      "type": "string",
      "description": "ISO date range: '2025-01-15/2025-01-22'"
    },
    "duration_minutes": {
      "type": "integer",
      "description": "Meeting duration in minutes (default: 30)"
    },
    "location": {
      "type": "string",
      "description": "Postal code or area for travel time calculation"
    }
  },
  "url": "https://abdulrahman-n8n.duckdns.org/webhook/retell-calendar-check",
  "method": "POST",
  "timeout_ms": 5000,
  "talk_during_execution": true,
  "response_schema": {
    "type": "object",
    "properties": {
      "available_slots": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "start": { "type": "string", "format": "date-time" },
            "end": { "type": "string", "format": "date-time" },
            "label": { "type": "string", "description": "Human readable: 'Tis 14 jan, 10:00'" }
          }
        }
      },
      "travel_note": { "type": "string" }
    }
  }
}
```

### 4. book_appointment ⭐ NEW
```json
{
  "name": "book_appointment",
  "description": "Create calendar event and send confirmation",
  "parameters": {
    "customer_name": { "type": "string" },
    "customer_phone": { "type": "string", "description": "E.164 format" },
    "customer_email": { "type": "string" },
    "start_time": { "type": "string", "format": "date-time" },
    "end_time": { "type": "string", "format": "date-time" },
    "location_address": { "type": "string" },
    "project_type": { "type": "string" },
    "notes": { "type": "string" }
  },
  "url": "https://abdulrahman-n8n.duckdns.org/webhook/retell-book-appointment",
  "method": "POST",
  "timeout_ms": 8000,
  "talk_during_execution": true,
  "response_schema": {
    "type": "object",
    "properties": {
      "success": { "type": "boolean" },
      "event_id": { "type": "string" },
      "confirmation_sent": { "type": "boolean" },
      "calendar_link": { "type": "string" }
    }
  }
}
```

## Dynamic Variables (for outbound calls)
```json
{
  "customer_name": "string",
  "customer_address": "string", 
  "customer_postal_code": "string",
  "customer_issue": "string",
  "customer_phone": "string (E.164)",
  "lead_source": "string",
  "preferred_contact_time": "string"
}
```

## Webhook Payload Format (n8n → Retell)
```json
{
  "agent_id": "ag_bergunds_ostersund_v1",
  "to_number": "+46701234567",
  "from_number": "+46XXXXXXXXX",
  "dynamic_variables": {
    "customer_name": "Anna Andersson",
    "customer_issue": "Takbyte intresse",
    "customer_postal_code": "831 40"
  },
  "metadata": {
    "campaign": "follow_up_q1",
    "priority": "high"
  }
}
```

## Post-Call Webhook (Retell → n8n)
```json
{
  "call_id": "call_xxx",
  "agent_id": "ag_bergunds_ostersund_v1",
  "end_reason": "user_hangup",
  "duration_seconds": 142,
  "transcript": "...",
  "extracted_variables": {
    "name": "Anna",
    "phone": "+46701234567",
    "project_type": "takbyte",
    "booking_confirmed": true,
    "appointment_time": "2025-01-20T10:00:00+01:00"
  },
  "recording_url": "https://..."
}
```

## Google Calendar Integration via n8n
1. **OAuth Setup**: Connect Google account in n8n → Google Calendar node
2. **Calendar ID**: Use primary or create "Berglunds Besök" calendar
3. **Travel Buffer**: Add 30-60 min buffer between appointments based on postal code distance
4. **Event Template**:
   ```
   Title: "Besök: {project_type} - {customer_name}"
   Location: "{address}, {postal_code}"
   Description: "Tel: {phone}\nNotering: {notes}\nKälla: Retell AI"
   ```
5. **Conflict Handling**: If slot taken, return next 3 available alternatives

## Testing Custom Functions
```bash
# Test lookup_customer
curl -X POST https://abdulrahman-n8n.duckdns.org/webhook/retell-lookup \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "+46701234567"}'

# Test check_calendar_availability  
curl -X POST https://abdulrahman-n8n.duckdns.org/webhook/retell-calendar-check \
  -H "Content-Type: application/json" \
  -d '{
    "date_range": "2025-01-15/2025-01-22",
    "duration_minutes": 30,
    "location": "831 40"
  }'

# Test book_appointment
curl -X POST https://abdulrahman-n8n.duckdns.org/webhook/retell-book-appointment \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Anna Andersson",
    "customer_phone": "+46701234567",
    "start_time": "2025-01-20T10:00:00+01:00",
    "end_time": "2025-01-20T10:30:00+01:00",
    "location_address": "Storgatan 12, 831 40 Östersund",
    "project_type": "takbyte"
  }'
```

## Troubleshooting
| Issue | Solution |
|-------|----------|
| Function timeout | Increase `timeout_ms` to 8000, optimize n8n workflow |
| Phone format error | Validate E.164 before sending: `+46` + 9 digits |
| Calendar auth fail | Refresh OAuth token in n8n, check Google API quotas |
| No available slots | Return fallback: "Vi kan ringa tillbaka med förslag" |
| Double booking | Add optimistic locking in n8n: check slot again before creating |

## Security
- All webhooks: Verify `x-retell-signature` header
- Rate limit: Max 10 calls/minute per agent
- PII: Never log full transcripts, hash phone numbers in logs
- Calendar: Use service account with read-only + create permissions only
