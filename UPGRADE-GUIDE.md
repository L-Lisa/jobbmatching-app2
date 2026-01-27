# Upgrade Guide: localStorage → Supabase
## Från lokal storage till delad databas

**Tidsåtgång:** ~30-45 minuter  
**Svårighetsgrad:** Medel  
**Krav:** Supabase-konto (gratis)

---

## Varför uppgradera?

### Nuvarande begränsningar (localStorage):
❌ Varje användare ser BARA sina egna jobb  
❌ Data försvinner om användaren rensar cache  
❌ Ingen backup  
❌ Kan inte dela jobb mellan kollegor  

### Efter uppgradering (Supabase):
✅ ALLA användare ser SAMMA jobb  
✅ Data sparas säkert i molnet  
✅ Automatisk backup  
✅ Real-time uppdateringar  
✅ Gratis upp till 500MB databas  

---

## Steg-för-steg Guide

### 1. Skapa Supabase-projekt (5 min)

1. Gå till [supabase.com](https://supabase.com)
2. Klicka "Start your project"
3. Logga in med GitHub
4. "New project"
   - **Name:** jobbmatchning
   - **Database Password:** Välj ett starkt lösenord (spara det!)
   - **Region:** Europe West (Stockholm för Sverige)
5. Klicka "Create new project"
6. Vänta ~2 minuter medan projektet skapas

### 2. Skapa databas-tabell (5 min)

1. I Supabase dashboard → "SQL Editor"
2. Klicka "New query"
3. Klistra in denna SQL:

```sql
-- Skapa jobs-tabell
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  yrke TEXT NOT NULL,
  foretag TEXT,
  omfattning TEXT,
  lon TEXT NOT NULL,
  erfarenhet TEXT NOT NULL,
  utbildning TEXT,
  ovrigt TEXT,
  matchare_email TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aktivera Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Skapa policy: Alla kan läsa
CREATE POLICY "Alla kan läsa jobb" ON jobs
  FOR SELECT
  USING (true);

-- Skapa policy: Alla kan lägga till
CREATE POLICY "Alla kan lägga till jobb" ON jobs
  FOR INSERT
  WITH CHECK (true);

-- Skapa policy: Bara matchare kan ta bort sina egna jobb
CREATE POLICY "Matchare kan ta bort sina jobb" ON jobs
  FOR DELETE
  USING (matchare_email = auth.jwt() ->> 'email');

-- Index för snabbare sökning
CREATE INDEX jobs_timestamp_idx ON jobs(timestamp DESC);
CREATE INDEX jobs_yrke_idx ON jobs(yrke);
```

4. Klicka "Run"
5. Du ska se: "Success. No rows returned"

### 3. Hämta API-nycklar (2 min)

1. I Supabase dashboard → "Settings" → "API"
2. Kopiera:
   - **Project URL** (något som `https://xxx.supabase.co`)
   - **anon public key** (lång sträng)

### 4. Skapa .env-fil (2 min)

I projektets root, skapa `.env`:

```env
VITE_SUPABASE_URL=din-project-url-här
VITE_SUPABASE_ANON_KEY=din-anon-key-här
```

**OBS:** Lägg ALDRIG .env i Git! Den är redan i .gitignore.

### 5. Uppdatera koden (10 min)

#### A. Installera Supabase-klienten

```bash
npm install @supabase/supabase-js
```

#### B. Skapa Supabase-klient

Skapa `src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### C. Uppdatera App.jsx

**Hitta storage-adaptern (rad ~8):**

```javascript
// GAMMAL KOD (localStorage)
const storage = {
  async get(key) {
    const data = localStorage.getItem(key);
    return data ? { key, value: data } : null;
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value };
  },
  async delete(key) {
    localStorage.removeItem(key);
    return { key, deleted: true };
  },
  async list(prefix) {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix || ''));
    return { keys };
  }
};
```

**Ersätt med (Supabase):**

```javascript
import { supabase } from './lib/supabase'

// NY KOD (Supabase)
const storage = {
  async get(id) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { key: data.id, value: JSON.stringify(data) };
  },
  
  async set(id, value) {
    const job = JSON.parse(value);
    const { error } = await supabase
      .from('jobs')
      .upsert({
        id: job.id,
        yrke: job.yrke,
        foretag: job.foretag,
        omfattning: job.omfattning,
        lon: job.lon,
        erfarenhet: job.erfarenhet,
        utbildning: job.utbildning,
        ovrigt: job.ovrigt,
        matchare_email: job.matchareEmail,
        timestamp: job.timestamp
      });
    
    if (error) throw error;
    return { key: id, value };
  },
  
  async delete(id) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { key: id, deleted: true };
  },
  
  async list() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return { 
      keys: data.map(job => ({
        key: job.id,
        value: JSON.stringify(job)
      }))
    };
  }
};
```

#### D. Uppdatera loadJobs()

**Hitta loadJobs-funktionen (rad ~44):**

```javascript
// GAMMAL KOD
const loadJobs = async () => {
  try {
    const result = await storage.list('job:');
    if (result && result.keys) {
      const jobPromises = result.keys.map(async (key) => {
        const jobData = await storage.get(key);
        return jobData ? JSON.parse(jobData.value) : null;
      });
      const loadedJobs = (await Promise.all(jobPromises)).filter(Boolean);
      loadedJobs.sort((a, b) => b.timestamp - a.timestamp);
      setJobs(loadedJobs);
    }
  } catch (error) {
    console.error('Error loading jobs:', error);
  } finally {
    setIsLoading(false);
  }
};
```

**Ersätt med:**

```javascript
// NY KOD (enklare!)
const loadJobs = async () => {
  try {
    const result = await storage.list();
    const loadedJobs = result.keys.map(item => JSON.parse(item.value));
    setJobs(loadedJobs);
  } catch (error) {
    console.error('Error loading jobs:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### 6. Testa lokalt (5 min)

```bash
npm run dev
```

1. Logga in
2. Lägg till ett jobb
3. Öppna Supabase dashboard → "Table Editor" → "jobs"
4. Du ska se ditt jobb där!
5. Öppna appen i en annan webbläsare/incognito
6. Logga in → Du ska se samma jobb!

### 7. Deploya till Vercel (10 min)

#### A. Lägg till Environment Variables i Vercel

1. Gå till [vercel.com/dashboard](https://vercel.com/dashboard)
2. Välj ditt projekt
3. "Settings" → "Environment Variables"
4. Lägg till:
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** Din Supabase URL
   - **Environment:** Production, Preview, Development
   - Klicka "Save"
5. Upprepa för `VITE_SUPABASE_ANON_KEY`

#### B. Redeploya

```bash
git add .
git commit -m "Uppgradera till Supabase"
git push origin main
```

Vercel deployas automatiskt!

### 8. Verifiera produktion (5 min)

1. Öppna din live URL
2. Logga in
3. Lägg till ett jobb
4. Be en kollega öppna samma URL
5. De ska se ditt jobb direkt!

---

## Felsökning

### "Failed to connect to Supabase"

**Check:**
1. Är Environment Variables korrekt stavade?
   - Måste vara `VITE_SUPABASE_URL` (inte `SUPABASE_URL`)
2. Har du redeployat efter att lagt till env vars?
3. Är din Supabase-projekt aktivt? (Check dashboard)

### "Row Level Security policy violation"

**Fix:**
```sql
-- Kör i SQL Editor
ALTER TABLE jobs DISABLE ROW LEVEL SECURITY;
```

⚠️ **Säkerhetsvarning:** Detta tar bort RLS. Okej för intern användning, men INTE för public apps.

### Jobb sparas inte

**Check:**
1. Console i webbläsaren (F12) - vilka fel visas?
2. Supabase dashboard → "Logs" → Kolla errors
3. Är alla kolumner ifyllda korrekt?

---

## Kostnad

**Supabase Free Tier:**
- ✅ 500MB databas (≈10,000+ jobb)
- ✅ 2GB file storage
- ✅ 50,000 monthly active users
- ✅ 500MB edge functions

**För din användning:** HELT GRATIS! 🎉

---

## Nästa steg efter uppgradering

### Real-time Updates (Bonus)

Lägg till detta i App.jsx för att se nya jobb direkt utan refresh:

```javascript
useEffect(() => {
  // Subscribe till nya jobb
  const subscription = supabase
    .channel('jobs')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'jobs' },
      () => {
        loadJobs(); // Ladda om när nytt jobb läggs till
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

---

## Backup & Restore

### Exportera all data

```javascript
// Kör i browser console
const { data } = await supabase.from('jobs').select('*');
console.log(JSON.stringify(data, null, 2));
// Kopiera och spara till fil
```

### Återställa data

```javascript
// Kör i browser console
const backupData = [ /* din backup-data */ ];
await supabase.from('jobs').insert(backupData);
```

---

## Support

Vid problem:
1. Kolla Supabase docs: https://supabase.com/docs
2. Sök i Supabase Discord: https://discord.supabase.com
3. Kontakta utvecklaren

---

**Grattis! 🎉 Nu har du en production-ready app med riktig databas!**
