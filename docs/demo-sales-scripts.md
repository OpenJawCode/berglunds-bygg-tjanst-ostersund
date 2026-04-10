# Berglunds Byggtjänst — Demo & Sales Scripts

## 🎬 Owner Demo Script (5 min walkthrough)

### Opening (30 sec)
> "Hej [Namn], jag har byggt en ny funktion som gör det mycket enklare för potentiella kunder att komma i kontakt med er – och som automatiskt samlar in all info ni behöver för att följa upp."

### Show Floating Button (1 min)
1. Öppna https://berglunds-bygg-tjanst-ostersund.vercel.app
2. Peeka på cyan-knappen nere till höger: **"Få en offert"**
3. Förklara:
   > "Den här knappen syns på ALLA sidor. Kunden klickar – och får två val:"

### Show Modal Choices (1 min)
1. Klicka på knappen → modal öppnas
2. Visa de två korten:
   - 📝 **Snabbt formulär**: "Fyll i 3 fält på 30 sekunder"
   - 💬 **AI-chatt**: "Prata med vår AI-assistent"
3. Förklara:
   > "Vissa kunder föredrar att fylla i ett formulär. Andra vill chatta först. Vi möter båda."

### Demo Form Flow (1.5 min)
1. Välj "Snabbt formulär"
2. Gå igenom stegen:
   - Steg 1: Välj tjänst + postnummer
   - Steg 2: Namn, e-post, telefon (visa auto-format: `070-123 45 67` → `+46701234567`)
   - Steg 3: Sammanfattning + GDPR-checkbox
3. Klicka "Skicka förfrågan"
4. Visa success-meddelande:
   > "Kunden får ett mail inom 15 sekunder. Och – här kommer det smarta: er AI-assistent ringer upp inom 2 minuter för att samla mer detaljer."

### Demo Chat Flow (1 min)
1. Gå tillbaka, välj "AI-chatt"
2. Visa chattgränssnittet
3. Skriv ett testmeddelande: "Hej, jag behöver hjälp med takläcka"
4. Visa hur AI:n svarar och börjar samla info
5. När tillräcklig info finns → visa "Få offert & bli uppringd"-knappen
6. Förklara:
   > "AI:n extraherar namn, telefon, projekttyp automatiskt. När kunden klickar på knappen – samma flöde som formuläret: mail + uppringning."

### Backend Overview (30 sec)
> "All data går till er Google Sheet 'Berglunds Leads' via n8n. Där ser ni:
> - Tidstämpel, kontaktinfo, projekttyp
> - Källa: 'form' eller 'chat'
> - Status: 'new' → 'contacted' → 'quoted'
> - Efter samtalet: transcript + extraherad info från AI-samtalet"

### Closing Ask (30 sec)
> "Vad tycker du? Vill du att vi:
> 1. Sätter upp Google Sheet + n8n-workflow nu?
> 2. Testar med 5 riktiga leads först?
> 3. Justerar något i flödet innan vi lanserar?"

---

## 📞 Cold Calling Script (Retell AI Agent — Inbound/Outbound)

### Opening (Inbound)
```
Agent: "Hej, Berglunds Byggtjänst, [namn] här – hur kan jag hjälpa dig idag?"
```

### Opening (Outbound — after form/chat submit)
```
Agent: "Hej [customer_name], det är [namn] från Berglunds i Östersund. 
Jag ringer angående ditt intresse för [customer_issue] – har du en stund?"
```

### Qualification Questions (ask 2-3 max)
```
1. "Vilken typ av jobb tänker du på? Tak, badrum, tillbyggnad, eller något annat?"
2. "Var ligger objektet? Gatuadress och postnummer tack."
3. "När skulle du vilja att vi tittar på det? Vi har tider [nästa vecka/om två veckor]."
4. (Optional) "Har du en ungefärlig budget i åtanke?"
```

### ROT-Avdrag Mention (when relevant)
```
"Bara så du vet – vi hjälper dig med ROT-avdraget! Du får 30% tillbaka på arbetskostnaden, 
upp till 50 000 kr per person och år. Vi sköter allt pappersarbete."
```

### Booking Confirmation
```
"Perfekt. Jag har bokat in ett besök [dag] kl [tid] på [adress]. 
Du får en bekräftelse på SMS med en kalenderlänk. 
Något mer jag kan hjälpa till med innan vi ses?"
```

### Objection Handling

**"Jag vill tänka på det"**
```
"Självklart, det är ett stort beslut. Jag skickar en kort sammanfattning på mail 
med våra vanligaste priser och vad som ingår. När passar det att jag hör av mig igen?"
```

**"Priset?"**
```
"Vi ger alltid en kostnadsfri offert efter ett kort besök – då ser vi exakt vad som 
behövs och kan ge dig ett fast pris. Inga dolda kostnader, lovar."
```

**"Jag pratar med min partner först"**
```
"Bra idé. Vill du att jag skickar offerten till er båda på mail? 
Och när tror du att ni kan bestämma er? Jag kan följa upp då."
```

### Handoff to Human
```
"Självklart, jag kopplar dig direkt till [mänsklig säljare] som kan svara på 
mer specifika frågor. Ett ögonblick..."
```

### Closing (All Calls)
```
"Stort tack för att du hörde av dig, [namn]! Vi hör av oss inom 24 timmar 
för att bekräfta. Ha en fin dag i Östersund!"
```

---

## 🎯 Closing Sales Script (After Prospect is Booked)

### Pre-Call Prep (Agent checks Google Sheets)
- [ ] Name, phone, project_type, postal_code
- [ ] Source: form/chat
- [ ] Any notes from initial submission
- [ ] Previous interactions? (lookup_customer)

### Opening (Booked Prospect Call)
```
"Hej [namn], det är [namn] från Berglunds. 
Jag ringer för att bekräfta vårt besök [dag] kl [tid] på [adress]. 
Stämmer det fortfarande?"
```

### Value Reinforcement
```
"Bara så du vet vad som händer nästa steg:
1. Vi kommer ut, tittar på projektet och ställer några korta frågor
2. Inom 24 timmar får du en skriftlig offert med fast pris
3. Ingen köptvång – du bestämmer i din egen takt
4. Och som sagt: vi hjälper dig med hela ROT-ansökan"
```

### Upsell Opportunity (if relevant)
```
"Många som gör [project_type] passar också på att [related service]. 
Är det något du funderat på? Vi kan titta på det samtidigt om du vill."
```

### Confirm Next Steps
```
"Perfekt. Då ses vi [dag] kl [tid]. 
Du får ett SMS med bekräftelse och min direktnummer om du behöver ändra något. 
Några frågor innan vi avslutar?"
```

### Post-Call Action (Agent triggers save_variables)
```json
{
  "status": "contacted",
  "next_action": "site_visit_scheduled",
  "visit_date": "2025-01-20",
  "notes": "Customer confirmed, interested in [upsell]",
  "follow_up_date": "2025-01-21"
}
```

---

## 🔑 Key Phrases to Remember (Swedish)

| Situation | Phrase |
|-----------|--------|
| Warm opener | "Hej [namn], det är [namn] från Berglunds i Östersund…" |
| Local trust | "Vi jobbar här i Jämtland och känner området väl" |
| ROT mention | "30% tillbaka på arbetskostnaden – vi sköter pappersarbetet" |
| Price objection | "Fast pris efter besök – inga dolda kostnader" |
| Booking confirm | "Du får SMS-bekräftelse med kalenderlänk" |
| Soft close | "Något mer jag kan hjälpa till med innan vi ses?" |
| Handoff | "Jag kopplar dig till [namn] som kan svara på det" |
| Final close | "Tack [namn] – vi hörs inom 24 timmar. Ha en fin dag!" |

---

*Last updated: 2025-01-15*  
*Use with Retell AI agent_2cddb47efe7325ad729c41f6d2*
