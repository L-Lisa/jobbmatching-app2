# 🚀 CURSOR SPEC: Jobbmatchning App (Production-Ready Build)

> **Kopiera denna spec till Cursor Composer och låt den bygga en production-ready app från grunden!**

---

## 🎯 MISSION

Bygg en **modern, production-ready** intern jobbmatchnings-app med React + Vite + Tailwind CSS.

**Unique Value:** Clean architecture, robust error handling, full accessibility, och redo för Supabase-uppgradering.

---

## 📊 QUICK REFERENCE

| Aspect | Details |
|--------|---------|
| **Tech Stack** | React 18, Vite 5, Tailwind CSS 3, Lucide Icons |
| **Data Storage** | localStorage (with upgrade path to Supabase) |
| **Styling** | Tailwind utility-first, Plus Jakarta Sans font |
| **Icons** | lucide-react |
| **Build Time** | ~30-45 min with Cursor Composer |
| **Code Quality** | Production-ready, modular, fully tested |

---

## 🏗️ ARCHITECTURE

```
src/
├── components/
│   ├── auth/LoginScreen.jsx
│   ├── jobs/
│   │   ├── JobForm.jsx
│   │   ├── JobList.jsx
│   │   ├── JobCard.jsx (mobile)
│   │   └── JobTable.jsx (desktop)
│   ├── modals/
│   │   ├── DeleteModal.jsx
│   │   └── ContactModal.jsx
│   └── ui/
│       ├── ErrorBoundary.jsx
│       ├── Success.jsx
│       └── Loading.jsx
├── hooks/
│   ├── useJobs.js
│   ├── useDebounce.js
│   └── useAuth.js
├── utils/
│   ├── storage.js
│   ├── validation.js
│   └── helpers.js
├── config/constants.js
├── App.jsx
└── main.jsx
```

---

## 🎨 DESIGN SYSTEM

### Colors
```javascript
primary: 'from-blue-600 to-purple-600' // gradient
success: 'green-500'
error: 'red-500'
background: 'from-slate-50 via-blue-50 to-indigo-50'
```

### Typography
- Font: **Plus Jakarta Sans** (add to index.html)
- Weights: 400 (normal), 600 (semi-bold), 700 (bold)

### Spacing
- Consistent: 4px base unit (Tailwind default)
- Borders: rounded-lg (8px), rounded-xl (12px), rounded-2xl (16px)

---

## ⚙️ CONFIGURATION

### `src/config/constants.js`
```javascript
export const CONFIG = {
  PASSWORDS: ['test', 'demo123', 'matchning2026'],
  TRUNCATE_LENGTH_DESKTOP: 80,
  TRUNCATE_LENGTH_MOBILE: 100,
  SUCCESS_DURATION: 3000,
  SEARCH_DEBOUNCE: 300,
  JOB_PREFIX: 'job:',
  MAX_OVRIGT_LENGTH: 500,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const INITIAL_FORM = {
  yrke: '', foretag: '', omfattning: '', lon: '',
  erfarenhet: '', utbildning: '', ovrigt: '', matchareEmail: ''
};

export const ERRORS = {
  STORAGE_UNAVAILABLE: 'localStorage är inte tillgängligt',
  STORAGE_FULL: 'Lagringsutrymme fullt. Ta bort några jobb.',
  INVALID_EMAIL: 'Ogiltig e-postadress',
  REQUIRED: 'Du verkar ha glömt något',
};
```

---

## 🔧 UTILITIES

### `src/utils/storage.js`
**Mission:** Wrap localStorage with bulletproof error handling

```javascript
const storage = {
  isAvailable() {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch { return false; }
  },

  async get(key) {
    if (!this.isAvailable()) throw new Error(ERRORS.STORAGE_UNAVAILABLE);
    const data = localStorage.getItem(key);
    return data ? { key, value: data } : null;
  },

  async set(key, value) {
    if (!this.isAvailable()) throw new Error(ERRORS.STORAGE_UNAVAILABLE);
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch (e) {
      if (e.name === 'QuotaExceededError') throw new Error(ERRORS.STORAGE_FULL);
      throw e;
    }
  },

  async delete(key) {
    if (!this.isAvailable()) throw new Error(ERRORS.STORAGE_UNAVAILABLE);
    localStorage.removeItem(key);
    return { key, deleted: true };
  },

  async list(prefix = '') {
    if (!this.isAvailable()) throw new Error(ERRORS.STORAGE_UNAVAILABLE);
    return { keys: Object.keys(localStorage).filter(k => k.startsWith(prefix)) };
  }
};
```

### `src/utils/validation.js`
```javascript
export const isValidEmail = (email) => CONFIG.EMAIL_REGEX.test(email.trim());
export const sanitize = (input) => String(input).trim();

export const validateJob = (data) => {
  const errors = {};
  if (!data.yrke.trim()) errors.yrke = ERRORS.REQUIRED;
  if (!data.lon.trim()) errors.lon = ERRORS.REQUIRED;
  if (!data.erfarenhet.trim()) errors.erfarenhet = ERRORS.REQUIRED;
  if (!data.matchareEmail.trim()) errors.matchareEmail = ERRORS.REQUIRED;
  else if (!isValidEmail(data.matchareEmail)) errors.matchareEmail = ERRORS.INVALID_EMAIL;
  if (data.ovrigt.length > CONFIG.MAX_OVRIGT_LENGTH) 
    errors.ovrigt = `Max ${CONFIG.MAX_OVRIGT_LENGTH} tecken`;
  return errors;
};
```

### `src/utils/helpers.js`
```javascript
export const safeJsonParse = (str) => {
  try { return JSON.parse(str); } 
  catch { return null; }
};

export const truncate = (text, max) => {
  if (!text || text.length <= max) return { text: text || '', needsExpand: false };
  return { text: text.substring(0, max) + '...', needsExpand: true };
};
```

---

## 🎣 HOOKS

### `src/hooks/useJobs.js`
```javascript
export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { keys } = await storage.list(CONFIG.JOB_PREFIX);
      const promises = keys.map(async (key) => {
        const data = await storage.get(key);
        return data ? safeJsonParse(data.value) : null;
      });
      const loaded = (await Promise.all(promises)).filter(Boolean);
      loaded.sort((a, b) => b.timestamp - a.timestamp);
      setJobs(loaded);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addJob = useCallback(async (data) => {
    const sanitized = Object.keys(data).reduce((acc, k) => {
      acc[k] = sanitize(data[k]);
      return acc;
    }, {});
    const job = { id: `${CONFIG.JOB_PREFIX}${Date.now()}`, ...sanitized, timestamp: Date.now() };
    try {
      await storage.set(job.id, JSON.stringify(job));
      await loadJobs();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, [loadJobs]);

  const deleteJob = useCallback(async (id) => {
    try {
      await storage.delete(id);
      await loadJobs();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, [loadJobs]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  return { jobs, isLoading, error, addJob, deleteJob };
};
```

### `src/hooks/useDebounce.js`
```javascript
export const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};
```

### `src/hooks/useAuth.js`
```javascript
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (password) => {
    const valid = CONFIG.PASSWORDS.includes(password.toLowerCase().trim());
    if (valid) setIsAuthenticated(true);
    return { success: valid };
  };

  return { isAuthenticated, login };
};
```

---

## 🧩 COMPONENTS

### Component Specs

#### `LoginScreen.jsx`
- **Purpose:** Password gate
- **Props:** `onLogin: (password) => void`
- **Features:** 
  - Gradient background
  - Password input (type="password")
  - Error message display
  - Enter key submits
  - Auto-focus password field
- **Accessibility:** Label (sr-only), aria-invalid, aria-describedby

#### `JobForm.jsx`
- **Purpose:** Add new job
- **Props:** `onSubmit: (data) => Promise, onCancel: () => void, isSubmitting: bool`
- **Fields:** yrke*, företag, omfattning, lön*, erfarenhet*, utbildning, övrigt (max 500), matchareEmail*
- **Features:**
  - Real-time validation
  - Character counter for övrigt
  - Loading state on submit
  - 2-column grid (desktop), single column (mobile)
- **Validation:** Required fields marked with *, email regex, max length

#### `JobList.jsx`
- **Purpose:** Display jobs
- **Props:** `jobs: [], searchQuery: string, isLoading: bool, error: string, onDelete: fn, onContact: fn`
- **Features:**
  - Empty states (no jobs, no results)
  - Loading spinner
  - Error display
  - Conditional render: table (desktop lg+) or cards (mobile)

#### `JobTable.jsx` (Desktop)
- **Purpose:** Table view
- **Props:** `jobs: [], onDelete: fn, onContact: fn`
- **Features:**
  - Sticky header
  - Alternating rows
  - Hover effects
  - Truncate text with expand/collapse button
  - Actions column (Kontakta, Ta bort buttons)

#### `JobCard.jsx` (Mobile)
- **Purpose:** Card view
- **Props:** `job: {}, onDelete: fn, onContact: fn`
- **Features:**
  - Card layout with shadow
  - Title prominent
  - Definition list for details
  - Full-width contact button
  - Delete button (top-right corner)

#### `DeleteModal.jsx`
- **Purpose:** Confirm delete with email
- **Props:** `isOpen: bool, onClose: fn, onConfirm: fn, matchareEmail: string`
- **Features:**
  - Email input with validation
  - Match against matchareEmail
  - Loading state during delete
  - Error messages
  - ESC to close, backdrop click to close

#### `ContactModal.jsx`
- **Purpose:** Send message via mailto
- **Props:** `isOpen: bool, onClose: fn, jobTitle: string, matchareEmail: string`
- **Features:**
  - Textarea for message
  - Disabled submit if empty
  - Opens mailto: link with subject and body
  - ESC to close

#### `ErrorBoundary.jsx`
- **Purpose:** Catch React errors
- **Type:** Class component
- **Features:**
  - getDerivedStateFromError
  - componentDidCatch (log to console)
  - Fallback UI with reload button

#### `Success.jsx`
- **Purpose:** Success notification
- **Props:** `message: string, onClose: fn`
- **Features:**
  - Green checkmark icon
  - Slide in from top-right
  - Auto-dismiss after 3s
  - role="alert"

#### `Loading.jsx`
- **Purpose:** Loading indicator
- **Props:** `message?: string`
- **Features:** Spinning Loader2 icon, optional message

---

## 🎯 MAIN APP

### `App.jsx` Structure

```javascript
function App() {
  const { isAuthenticated, login } = useAuth();
  const { jobs, isLoading, error, addJob, deleteJob } = useJobs();
  
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContact, setShowContact] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, CONFIG.SEARCH_DEBOUNCE);
  
  const filteredJobs = useMemo(() => {
    if (!debouncedSearch) return jobs;
    const lower = debouncedSearch.toLowerCase();
    return jobs.filter(j => 
      j.yrke?.toLowerCase().includes(lower) ||
      j.foretag?.toLowerCase().includes(lower) ||
      j.lon?.toLowerCase().includes(lower) ||
      j.erfarenhet?.toLowerCase().includes(lower) ||
      j.utbildning?.toLowerCase().includes(lower) ||
      j.omfattning?.toLowerCase().includes(lower) ||
      j.ovrigt?.toLowerCase().includes(lower)
    );
  }, [jobs, debouncedSearch]);

  const handleAddJob = async (data) => {
    const result = await addJob(data);
    if (result.success) {
      setShowForm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), CONFIG.SUCCESS_DURATION);
    } else {
      alert(result.error);
    }
  };

  if (!isAuthenticated) return <LoginScreen onLogin={login} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header jobCount={jobs.length} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && <ErrorMessage message={error} />}
        
        <div className="mb-8 flex gap-4">
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Stäng' : 'Lägg till jobb'}
          </button>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sök..."
          />
        </div>
        
        {showForm && (
          <JobForm 
            onSubmit={handleAddJob}
            onCancel={() => setShowForm(false)}
            isSubmitting={false}
          />
        )}
        
        <JobList
          jobs={filteredJobs}
          isLoading={isLoading}
          onDelete={(id, email) => setShowDelete({ id, email })}
          onContact={(id) => setShowContact(id)}
        />
      </main>
      
      {showDelete && (
        <DeleteModal
          isOpen={!!showDelete}
          onClose={() => setShowDelete(null)}
          onConfirm={async () => await deleteJob(showDelete.id)}
          matchareEmail={showDelete.email}
        />
      )}
      
      {showContact && (
        <ContactModal
          isOpen={!!showContact}
          onClose={() => setShowContact(null)}
          job={jobs.find(j => j.id === showContact)}
        />
      )}
      
      {showSuccess && <Success message="Jobbet har lagts till!" />}
    </div>
  );
}

export default () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
```

---

## ✅ REQUIREMENTS CHECKLIST

### Functionality
- [ ] Password authentication works
- [ ] Add job with validation
- [ ] Delete job with email confirmation
- [ ] Contact opens mailto
- [ ] Search filters jobs (debounced)
- [ ] Responsive (desktop table, mobile cards)

### Error Handling
- [ ] localStorage unavailable (private mode)
- [ ] localStorage full (QuotaExceededError)
- [ ] Invalid JSON parsing
- [ ] Form validation errors
- [ ] React errors (Error Boundary)

### Accessibility (WCAG AA)
- [ ] All inputs have labels
- [ ] aria-invalid on errors
- [ ] aria-describedby for hints
- [ ] role="alert" for messages
- [ ] Keyboard navigation (Tab, Enter, ESC)
- [ ] Focus management in modals
- [ ] Screen reader friendly

### Performance
- [ ] Debounced search
- [ ] useMemo for filtering
- [ ] useCallback for handlers
- [ ] No memory leaks (cleanup in useEffect)

### Code Quality
- [ ] No magic numbers (use CONFIG)
- [ ] No duplicate code (DRY)
- [ ] Modular components (<200 lines each)
- [ ] JSDoc comments on utilities
- [ ] Consistent naming
- [ ] PropTypes or TypeScript

---

## 🧪 TESTING

### Manual Test Cases
1. **Login:** Try wrong password → see error, try correct → login
2. **Add Job:** Leave required fields empty → see errors
3. **Add Job:** Add valid job → see success, job appears in list
4. **Search:** Type in search → see filtered results (after 300ms)
5. **Delete:** Click delete → enter wrong email → see error
6. **Delete:** Enter correct email → job deleted
7. **Contact:** Click contact → modal opens, type message → mailto opens
8. **Private Mode:** Open in incognito → works without crashes
9. **Mobile:** Resize to mobile → see card layout
10. **Error Boundary:** Throw error in component → see error UI

---

## 🚀 CURSOR PROMPT

```
Build a production-ready job listing app with these requirements:

FEATURES:
- Password authentication (test, demo123, matchning2026)
- Add/Delete jobs with validation
- Search with debounce (300ms)
- Email validation (regex)
- Contact via mailto
- Responsive (table desktop, cards mobile)

TECH STACK:
- React 18 + Vite
- Tailwind CSS
- lucide-react icons
- localStorage (error handling for private mode)

ARCHITECTURE:
src/
  components/ (auth, jobs, modals, ui)
  hooks/ (useJobs, useDebounce, useAuth)
  utils/ (storage, validation, helpers)
  config/constants.js
  App.jsx

KEY REQUIREMENTS:
✅ Full error handling (localStorage unavailable, full, invalid JSON)
✅ Accessibility (WCAG AA: labels, ARIA, keyboard nav)
✅ Loading states everywhere
✅ No magic numbers (use constants)
✅ Modular components (<200 lines)
✅ Error Boundary wrapper
✅ Mobile responsive

VALIDATION:
- Required: yrke, lön, erfarenhet, matchareEmail
- Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Max length övrigt: 500 chars

DESIGN:
- Font: Plus Jakarta Sans
- Colors: Blue-Purple gradient
- Responsive: lg breakpoint for table/card switch
- Animations: 200-300ms smooth

CRITICAL:
- Works in private browsing mode
- Handles localStorage full gracefully
- Email verification for delete
- Debounced search
- Success notifications
- Error messages in Swedish

Start with utils → hooks → UI components → feature components → App.jsx

Ask if anything is unclear!
```

---

## 📦 DELIVERABLES

Cursor should produce:
1. ✅ Folder structure as specified
2. ✅ All components implemented
3. ✅ All hooks working
4. ✅ Error handling complete
5. ✅ Accessible (WCAG AA)
6. ✅ Mobile responsive
7. ✅ No console errors
8. ✅ README with setup instructions
9. ✅ .env.example

---

## 🎓 SUCCESS CRITERIA

**The build is complete when:**
- All features work without errors
- Passes manual testing checklist
- Works in private browsing mode
- Accessible with keyboard + screen reader
- Mobile responsive
- Clean, modular code
- Ready to deploy to Vercel

---

## 📚 QUICK START AFTER BUILD

```bash
# After Cursor builds the app:
cd jobbmatchning-app
npm install
npm run dev

# Deploy:
npm run build
vercel --prod
```

---

**READY FOR CURSOR!** 🚀

Copy the "CURSOR PROMPT" section to Cursor Composer and watch it build a perfect app!
