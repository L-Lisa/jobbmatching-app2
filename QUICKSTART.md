# ⚡ Quickstart Guide
## Från Cursor till Live på 15 minuter

**För dig som vill komma igång SNABBT!**

---

## 📥 Steg 1: Öppna i Cursor (1 minut)

1. Öppna Cursor
2. File → Open Folder
3. Välj `jobbmatchning-app` mappen

---

## 🔧 Steg 2: Installera dependencies (2 minuter)

Öppna terminalen i Cursor (Ctrl+ö eller View → Terminal):

```bash
npm install
```

Vänta tills det är klart (kan ta 1-2 minuter).

---

## 🔐 Steg 3: Ändra lösenord (1 minut)

1. Öppna `src/App.jsx`
2. Hitta rad 71 (Ctrl+G → skriv 71)
3. Ändra lösenorden:

```javascript
const validPasswords = ['test', 'demo123', 'matchning2026'];
```

Till:

```javascript
const validPasswords = ['anna', 'erik', 'maria'];  // Era namn!
```

4. Spara (Ctrl+S)

---

## 🚀 Steg 4: Testa lokalt (2 minuter)

I terminalen:

```bash
npm run dev
```

1. Öppna länken som visas (typ `http://localhost:5173`)
2. Logga in med ett av dina lösenord
3. Lägg till ett testjobb
4. **Fungerar det?** → Fortsätt till Steg 5!
5. **Fungerar inte?** → Se "Felsökning" längst ner

---

## 📤 Steg 5: Pusha till GitHub (3 minuter)

### Om du INTE har GitHub repo än:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

Gå till [github.com/new](https://github.com/new):
- Repo name: `jobbmatchning`
- Private
- Create repository

Kopiera kommandona GitHub visar och kör i terminalen.

### Om du redan har ett repo:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

---

## 🌐 Steg 6: Deploya på Vercel (5 minuter)

### Första gången:

1. Gå till [vercel.com](https://vercel.com)
2. "Sign up" med GitHub
3. "Add New" → "Project"
4. Välj `jobbmatchning` repo
5. Klicka "Deploy"
6. Vänta 2 minuter ☕
7. **KLART!** Kopiera URL:en (typ `jobbmatchning.vercel.app`)

### Efterföljande deploys:

```bash
git add .
git commit -m "Uppdatering"
git push origin main
```

Vercel deployas automatiskt! ✨

---

## ✅ Steg 7: Dela med teamet

Skicka via mail/Teams/Slack:

```
Hej team!

Här är vår nya jobbmatchnings-app:
🔗 https://jobbmatchning.vercel.app

Lösenord: [ditt lösenord]

Använd den för att lista och hitta lediga tjänster!

/Lisa
```

---

## 🐛 Felsökning

### "npm: command not found"
→ Installera Node.js från [nodejs.org](https://nodejs.org)

### Appen startar inte lokalt
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Jobb syns inte efter refresh
→ Detta är normalt med localStorage! Varje användare ser bara sina egna jobb.  
→ För delad data: Följ `UPGRADE-GUIDE.md` för Supabase.

### Vercel deploy misslyckas
→ Kolla att du pushat till `main` branch (inte `master`):
```bash
git branch -M main
git push -u origin main
```

---

## 📚 Nästa steg

1. ✅ **Appen fungerar** → Kör den en vecka
2. 📊 **Vill ha delad databas?** → Läs `UPGRADE-GUIDE.md`
3. 🎨 **Vill ändra design?** → Kolla i `README.md`
4. 📖 **Vill förstå allt?** → Läs `PRD.md`

---

## 💬 Tips

- **Ändra lösenord:** Uppdatera `src/App.jsx` rad 71
- **Ändra färger:** Sök efter `from-blue-600` i `src/App.jsx`
- **Lägg till fält:** Kolla i `formData` state i `src/App.jsx`

---

**🎉 GRATTIS! Du har nu en fungerande jobbmatchnings-app!**

---

**Tog det längre än 15 minuter?**  
Första gången tar det lite längre. Nästa deploy tar <2 minuter! 💪
