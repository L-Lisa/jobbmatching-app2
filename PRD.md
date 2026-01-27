# Product Requirements Document (PRD)
## Jobbmatchning - Intern Jobblistningsapp

**Version:** 1.0  
**Datum:** 27 januari 2026  
**Status:** Production Ready (localStorage version)

---

## 1. Executive Summary

Jobbmatchning är en intern webbapplikation för att lista och matcha lediga tjänster bland kollegor. Appen möjliggör enkel publicering av jobbannonser och direktkontakt med ansvarig matchare via e-post.

### 1.1 Målgrupp
- **Primär:** Jobbcoacher och HR-personal som matchar kandidater
- **Sekundär:** Interna kandidater som söker nya roller

### 1.2 Affärsmål
- Centralisera jobblistningar på en plats
- Minska tidsåtgång för jobbmatchning
- Förbättra kommunikationen mellan matchare och kandidater
- Ge första intrycket av företagets professionalism

---

## 2. Scope

### 2.1 I Scope (v1.0)
✅ Lösenordsskyddad åtkomst  
✅ Lägg till jobbannonser  
✅ Visa jobbannonser i tabell (desktop) och kort (mobil)  
✅ Sökfunktion  
✅ Kontakta ansvarig matchare via mailto  
✅ Ta bort jobb (validerat via e-post)  
✅ Responsiv design  
✅ localStorage för datalagring  

### 2.2 Out of Scope (framtida versioner)
❌ Användarhantering med individuella konton  
❌ Notifikationer vid nya jobb  
❌ Ansökningshantering  
❌ Analytics och statistik  
❌ Multi-language support  
❌ Integration med ATS-system  
❌ Excel/CSV export  

---

## 3. Functional Requirements

### 3.1 Autentisering
**FR-1.1:** Användare måste ange lösenord för att komma åt appen  
**FR-1.2:** Lösenord valideras frontend (enkelt skydd)  
**FR-1.3:** Felmeddelande visas vid felaktigt lösenord  

### 3.2 Jobblistning
**FR-2.1:** Jobb visas sorterat efter nyaste först  
**FR-2.2:** Desktop: Tabell-layout med alla kolumner synliga  
**FR-2.3:** Mobil: Card-layout med viktigaste info synlig  
**FR-2.4:** Långa texter (>80 tecken desktop, >100 mobil) har "Visa mer" dropdown  

### 3.3 Lägg till jobb
**FR-3.1:** Formulär med följande fält:
- Yrke (obligatoriskt)
- Företag
- Omfattning
- Lön (obligatoriskt)
- Erfarenhet (obligatoriskt)
- Utbildning
- Övrigt (max 500 tecken)
- Ansvarig matchare e-post (obligatoriskt)

**FR-3.2:** Validering av obligatoriska fält  
**FR-3.3:** Felmeddelande: "Du verkar ha glömt något" vid tomt obligatoriskt fält  
**FR-3.4:** Success-notifikation efter lyckad submission  

### 3.4 Sökfunktion
**FR-4.1:** Sök i alla fält (yrke, företag, lön, erfarenhet, utbildning, omfattning)  
**FR-4.2:** Realtidsfiltrering (inget sök-klick behövs)  
**FR-4.3:** Case-insensitive sökning  
**FR-4.4:** Visar "Inga matchande jobb" vid 0 träffar  

### 3.5 Kontakta matchare
**FR-5.1:** Knapp "Kontakta Ansvarig Matchare" på varje jobb  
**FR-5.2:** Öppnar modal med textfält för meddelande  
**FR-5.3:** "Skicka meddelande" öppnar användarens e-postklient (mailto)  
**FR-5.4:** E-postadressen visas INTE publikt  

### 3.6 Ta bort jobb
**FR-6.1:** X-knapp på varje jobb  
**FR-6.2:** Prompt: "Ange din e-postadress för att ta bort detta jobb"  
**FR-6.3:** Validerar att e-postadressen matchar matchare-email  
**FR-6.4:** Tar bort jobbet vid korrekt e-post  

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Laddningstid: < 2 sekunder på 3G
- Sökrespons: < 100ms
- Smooth animationer (60fps)

### 4.2 Usability
- Intuitiv navigation
- Tydliga felmeddelanden
- Mobilanpassad touch-targets (min 44x44px)
- WCAG AA accessibility (mål)

### 4.3 Compatibility
- Desktop: Chrome, Firefox, Safari, Edge (senaste 2 versioner)
- Mobile: iOS Safari 14+, Chrome Android 90+
- Responsiv: 320px - 2560px viewport width

### 4.4 Security
- Frontend lösenordsskydd (basic)
- HTTPS enforced (via Vercel)
- E-postadresser ej synliga i UI
- XSS protection via React

---

## 5. User Stories

### US-1: Som jobbcoach vill jag snabbt kunna lägga till ett nytt jobb
**Acceptanskriterier:**
- Formulär öppnas med ett klick
- Tar < 60 sekunder att fylla i
- Bekräftelse visas efter submission
- Jobbet visas direkt i listan

### US-2: Som kandidat vill jag kunna söka efter jobb som matchar mina kompetenser
**Acceptanskriterier:**
- Sökfältet är lättillgängligt
- Filtrering sker i realtid
- Visar antal träffar
- Tydligt meddelande vid 0 träffar

### US-3: Som användare vill jag kunna kontakta ansvarig matchare utan att se deras e-post
**Acceptanskriterier:**
- Kontaktknapp på varje jobb
- Modal öppnas för meddelande
- E-postklient öppnas med förfylld info
- E-postadressen är aldrig synlig i UI

### US-4: Som matchare vill jag kunna ta bort mitt jobb när det är fyllt
**Acceptanskriterier:**
- Ta bort-knapp på mitt jobb
- Validering via min e-post
- Jobbet försvinner direkt efter removal
- Ingen kan ta bort mitt jobb utan min e-post

---

## 6. Data Model

### Job Object
```javascript
{
  id: string,           // "job:1706371200000"
  yrke: string,         // Required
  foretag: string,      // Optional
  omfattning: string,   // Optional
  lon: string,          // Required
  erfarenhet: string,   // Required
  utbildning: string,   // Optional
  ovrigt: string,       // Optional, max 500 chars
  matchareEmail: string, // Required, not displayed
  timestamp: number     // Unix timestamp
}
```

### Storage
- **localStorage** för v1.0
- Key format: `job:<timestamp>`
- Värden: JSON-stringified Job objects

---

## 7. UI/UX Specifications

### 7.1 Färgschema
- **Primär gradient:** Blue (#667eea) → Purple (#764ba2)
- **Accent:** Blue (#2563eb)
- **Success:** Green (#22c55e)
- **Error:** Red (#ef4444)
- **Neutral:** Gray scale (#f9fafb - #111827)

### 7.2 Typography
- **Font:** Plus Jakarta Sans
- **Headings:** 700-800 weight
- **Body:** 400-500 weight
- **Labels:** 600 weight

### 7.3 Komponenter
- **Buttons:** Rounded corners (12px), gradient background, hover lift effect
- **Cards:** White background, subtle shadow, hover elevation
- **Forms:** 2px borders, blue focus ring, red validation borders
- **Modal:** Centered overlay, blur backdrop, slide-up animation

---

## 8. Technical Architecture

### 8.1 Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)

### 8.2 Storage (v1.0)
- **Type:** Browser localStorage
- **Limitations:** 
  - No cross-device sync
  - Limited to ~5-10MB
  - User-specific (not shared)

### 8.3 Hosting
- **Platform:** Vercel
- **Domain:** Configured via Vercel dashboard
- **SSL:** Automatic via Vercel
- **CDN:** Global edge network

---

## 9. Deployment Plan

### Phase 1: Development & Testing (Dag 1)
- ✅ Setup lokal development environment
- ✅ Testa alla funktioner lokalt
- ✅ Mobile testing (DevTools)
- ✅ Cross-browser testing

### Phase 2: Staging Deploy (Dag 1)
- ✅ Deploy till Vercel staging
- ✅ Dela staging URL med testgrupp (2-3 personer)
- ✅ Samla feedback
- ✅ Fixa kritiska buggar

### Phase 3: Production Deploy (Dag 2)
- ✅ Deploy till production
- ✅ Dela URL + lösenord med hela teamet
- ✅ Monitor för fel första timmen
- ✅ Klar för användning!

---

## 10. Success Metrics

### Launch Metrics (Vecka 1)
- [ ] Minst 10 jobb publicerade
- [ ] Minst 5 användare har loggat in
- [ ] < 5 support-frågor
- [ ] 0 kritiska buggar

### Long-term Metrics (Månad 1)
- [ ] 30+ jobb publicerade totalt
- [ ] Genomsnittlig jobbtid < 7 dagar
- [ ] Minst 10 kontakter via "Kontakta matchare"
- [ ] 80%+ användarnöjdhet

---

## 11. Risks & Mitigation

### Risk 1: Data förloras (localStorage cleared)
**Sannolikhet:** Medium  
**Impact:** Hög  
**Mitigation:**
- Utbilda användare att inte rensa cache
- Planera uppgradering till Supabase (v2.0)
- Implementera backup-funktion

### Risk 2: Frontend-lösenord kringgås
**Sannolikhet:** Låg (kräver teknisk kunskap)  
**Impact:** Medium  
**Mitigation:**
- Acceptabel risk för intern användning
- Framtida: Backend autentisering

### Risk 3: Överbelastning av localStorage
**Sannolikhet:** Låg (få jobb förväntas)  
**Impact:** Medium  
**Mitigation:**
- Monitor antal jobb per användare
- Lägg till "rensa gamla jobb" funktion
- Uppgradera till Supabase vid behov

---

## 12. Future Roadmap

### v2.0 - Supabase Integration (Q2 2026)
- Shared database mellan användare
- Real-time updates
- Backup & restore
- Analytics dashboard

### v3.0 - Advanced Features (Q3 2026)
- Användarroller (Admin, Coach, Viewer)
- Notifikationer
- Ansökningshantering
- Integration med företagets ATS

### v4.0 - AI Features (Q4 2026)
- Automatisk matchning
- Kandidat-rekommendationer
- NLP-baserad sökning

---

## 13. Appendix

### A. Glossary
- **Matchare:** Person ansvarig för att fylla en tjänst
- **Kandidat:** Person som söker jobb
- **localStorage:** Browser storage API
- **Artifact:** Claude AI-genererad komponent

### B. References
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Vercel Docs: https://vercel.com/docs

---

**Dokument ägare:** Lisa (Jobbcoach)  
**Senast uppdaterad:** 27 januari 2026  
**Status:** Godkänt för implementation
