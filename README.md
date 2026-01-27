# 💼 Jobbmatchning - Intern Jobblistning

En modern, responsiv webbapp för att lista och matcha lediga tjänster internt på företaget.

## ✨ Funktioner

- 🔐 **Lösenordsskydd** - Säker åtkomst för behöriga användare
- 📱 **Responsiv design** - Fungerar perfekt på desktop, surfplatta och mobil
- 🔍 **Sökfunktion** - Filtrera jobb i realtid
- ✉️ **Kontaktformulär** - Maila ansvarig matchare direkt
- 📊 **Jobbhantering** - Lägg till och ta bort jobb enkelt
- 🎨 **Modern UI** - Professionell design med gradients och animationer

## 🚀 Kom igång

### 1. Installation

```bash
# Installera dependencies
npm install
```

### 2. Konfigurera lösenord

Öppna `src/App.jsx` och hitta rad ~71:

```javascript
const validPasswords = ['test', 'demo123', 'matchning2026'];
```

**Ändra till era egna lösenord!**

### 3. Kör lokalt

```bash
# Starta development server
npm run dev
```

Öppna [http://localhost:5173](http://localhost:5173) i webbläsaren.

### 4. Testa appen

- Logga in med ett av lösenorden
- Lägg till ett testjobb
- Testa sökfunktionen
- Kontrollera att det fungerar på mobil (öppna DevTools → Mobile view)

## 📦 Deployment till Vercel

### Snabbstart med Vercel

1. **Installera Vercel CLI**
```bash
npm install -g vercel
```

2. **Logga in**
```bash
vercel login
```

3. **Deploya**
```bash
npm run build
vercel --prod
```

4. **Eller använd Vercel Dashboard:**
   - Gå till [vercel.com](https://vercel.com)
   - "Add New" → "Project"
   - Importera ditt GitHub repo
   - Klicka "Deploy"

### Via GitHub + Vercel (Rekommenderat)

1. **Push till GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DITT-USERNAME/jobbmatchning.git
git push -u origin main
```

2. **Koppla till Vercel:**
   - Gå till [vercel.com/new](https://vercel.com/new)
   - Välj ditt GitHub repo
   - Klicka "Deploy"
   - Vercel deployas automatiskt vid varje push!

## 🔧 Teknisk Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Storage:** localStorage (för denna version)
- **Hosting:** Vercel (rekommenderat)

## 📝 Nuvarande Begränsningar (localStorage)

⚠️ **VIKTIGT:** Denna version använder localStorage vilket betyder:

- ✅ Perfekt för testning och demo
- ❌ Data delas INTE mellan användare
- ❌ Data försvinner om användaren rensar browser cache
- ❌ Fungerar inte för produktion med flera användare

### För produktion med delad databas:

Se `UPGRADE-GUIDE.md` för instruktioner om hur du uppgraderar till Supabase för riktig databas-funktionalitet.

## 🎨 Anpassa Design

### Färgschema

I `src/App.jsx`, sök efter dessa för att ändra färger:

```javascript
// Gradient bakgrunder
from-blue-600 to-purple-600

// Primärfärger
bg-blue-600
text-blue-600
```

### Fonter

Ändra i `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=DITT-FONT&display=swap');
```

## 🔐 Säkerhet

### För produktion:

1. **Byt lösenord:** Använd starka, unika lösenord
2. **HTTPS only:** Vercel ger automatiskt SSL
3. **Environment Variables:** För känslig data (när du uppgraderar till Supabase)

### Frontend-lösenord är INTE 100% säkert

- Tekniskt kunniga kan se lösenorden i koden
- Okej för intern användning bland kollegor
- För högre säkerhet: Uppgradera till backend-autentisering

## 📱 Browser Support

- ✅ Chrome (senaste 2 versionerna)
- ✅ Firefox (senaste 2 versionerna)
- ✅ Safari (senaste 2 versionerna)
- ✅ Edge (senaste 2 versionerna)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 🐛 Felsökning

### Appen startar inte

```bash
# Ta bort node_modules och installera om
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Jobb visas inte efter refresh

- Detta är förväntat beteende med localStorage
- Varje användare ser endast sina egna jobb
- För delad data: Uppgradera till Supabase

### Build errors

```bash
# Kontrollera Node version (behöver 18+)
node --version

# Uppdatera dependencies
npm update
```

## 📚 Nästa Steg

1. ✅ Testa lokalt
2. ✅ Deploya till Vercel
3. ✅ Dela URL med teamet
4. 📖 Läs `UPGRADE-GUIDE.md` för Supabase-integration

## 💬 Support

Vid problem:
1. Kolla console i webbläsaren (F12)
2. Läs felsökningsguiden ovan
3. Kontakta utvecklaren

## 📄 Licens

Intern användning endast.

---

**Byggt med ❤️ för effektiv jobbmatchning**
