import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, X, ChevronDown, ChevronUp, Trash2, Briefcase, Star, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  PASSWORD: 'demo123',
  TRUNCATE_LENGTH: 60,
  SUCCESS_DURATION: 3000,
};

const INITIAL_FORM = {
  yrke: '',
  foretag: '',
  omfattning: '',
  lon: '',
  erfarenhet: '',
  utbildning: '',
  ovrigt: '',
  ansvarig_matchare: '',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return { text: text || '', needsTruncate: false };
  return { text: text.substring(0, maxLength) + '...', needsTruncate: true };
};

// ============================================================================
// COMPONENTS
// ============================================================================

// Login Screen
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === CONFIG.PASSWORD) {
      onLogin();
    } else {
      setError('Felaktigt lösenord');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-700 rounded-xl mb-4">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Jobbmatchning</h1>
            <p className="text-slate-500 text-sm">Ange lösenord för att fortsätta till sidan</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Lösenord"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              Logga in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Loading Screen
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Laddar jobb...</p>
      </div>
    </div>
  );
}

// Success Toast
function SuccessToast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, CONFIG.SUCCESS_DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white border border-green-200 rounded-xl shadow-lg px-5 py-4 flex items-center gap-3">
        <span className="text-slate-700 font-medium">{message}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteModal({ onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Radera inlägg</h3>
        <p className="text-slate-600 mb-6">Är du säker på att du vill radera?</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Avbryt
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Raderar...
              </>
            ) : (
              'Radera'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Form Field Component
function FormField({ label, field, required, multiline, value, error, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          rows={3}
          className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all resize-none ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
          }`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className={`w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100'
          }`}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Add Job Modal
function AddJobModal({ onSubmit, onClose, isSubmitting }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.yrke.trim()) newErrors.yrke = 'Obligatoriskt fält';
    if (!form.lon.trim()) newErrors.lon = 'Obligatoriskt fält';
    if (!form.omfattning.trim()) newErrors.omfattning = 'Obligatoriskt fält';
    if (!form.ansvarig_matchare.trim()) newErrors.ansvarig_matchare = 'Obligatoriskt fält';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Lägg till jobb</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Yrke" field="yrke" required value={form.yrke} error={errors.yrke} onChange={handleChange} />
            <FormField label="Företag" field="foretag" value={form.foretag} error={errors.foretag} onChange={handleChange} />
            <FormField label="Omfattning" field="omfattning" required value={form.omfattning} error={errors.omfattning} onChange={handleChange} />
            <FormField label="Lön" field="lon" required value={form.lon} error={errors.lon} onChange={handleChange} />
            <FormField label="Erfarenhet" field="erfarenhet" value={form.erfarenhet} error={errors.erfarenhet} onChange={handleChange} />
            <FormField label="Utbildning" field="utbildning" value={form.utbildning} error={errors.utbildning} onChange={handleChange} />
          </div>
          <FormField label="Övrigt" field="ovrigt" multiline value={form.ovrigt} error={errors.ovrigt} onChange={handleChange} />
          <FormField label="Ansvarig matchare" field="ansvarig_matchare" required value={form.ansvarig_matchare} error={errors.ansvarig_matchare} onChange={handleChange} />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-blue-700 text-white rounded-xl font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Lägger till...
                </>
              ) : (
                'Lägg till'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Expandable Cell (for table)
function ExpandableCell({ text }) {
  const [expanded, setExpanded] = useState(false);
  const { text: displayText, needsTruncate } = truncateText(text, CONFIG.TRUNCATE_LENGTH);

  if (!text) return <span className="text-slate-400">-</span>;

  return (
    <div>
      <span className="text-slate-700">{expanded ? text : displayText}</span>
      {needsTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-1 text-blue-600 hover:text-blue-800 inline-flex items-center"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}

// Job Table (Desktop)
function JobTable({ jobs, onDelete }) {
  const columns = [
    { key: 'yrke', label: 'Yrke' },
    { key: 'foretag', label: 'Företag' },
    { key: 'omfattning', label: 'Omfattning' },
    { key: 'lon', label: 'Lön' },
    { key: 'erfarenhet', label: 'Erfarenhet' },
    { key: 'utbildning', label: 'Utbildning' },
    { key: 'ovrigt', label: 'Övrigt' },
    { key: 'ansvarig_matchare', label: 'Ansvarig matchare' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-semibold text-slate-700"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 w-20">
                
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm align-top">
                    <ExpandableCell text={job[col.key]} />
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDelete(job.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Radera"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Job Card (Mobile)
function JobCard({ job, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const details = [
    { label: 'Omfattning', value: job.omfattning },
    { label: 'Erfarenhet', value: job.erfarenhet },
    { label: 'Utbildning', value: job.utbildning },
    { label: 'Övrigt', value: job.ovrigt },
    { label: 'Ansvarig matchare', value: job.ansvarig_matchare },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-slate-800 text-lg">{job.yrke || '-'}</h3>
          <button
            onClick={() => onDelete(job.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors -mr-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-1 text-sm">
          <p className="text-slate-600">
            <span className="text-slate-500">Företag:</span> {job.foretag || '-'}
          </p>
          <p className="text-slate-600">
            <span className="text-slate-500">Lön:</span> {job.lon || '-'}
          </p>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-sm">
            {details.map(({ label, value }) => (
              <p key={label} className="text-slate-600">
                <span className="text-slate-500">{label}:</span> {value || '-'}
              </p>
            ))}
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-800 py-2 border-t border-slate-100"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Visa mindre
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Visa mer
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Empty State
function EmptyState({ onAddClick }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
        <Briefcase className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Inga jobb än</h3>
      <p className="text-slate-500 mb-6">Lägg till första jobbet</p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
      >
        <Plus className="w-5 h-5" />
        Lägg till jobb
      </button>
    </div>
  );
}

// No Results State
function NoResults({ query }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
        <Search className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Inga resultat</h3>
      <p className="text-slate-500">Hittade inga jobb som matchar "{query}"</p>
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('authenticated') === 'true';
  });
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load jobs from Supabase
  const loadJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load jobs on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadJobs();
    }
  }, [isAuthenticated]);

  // Filter jobs based on search
  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return jobs;
    const query = searchQuery.toLowerCase();
    return jobs.filter(job =>
      Object.values(job).some(value =>
        typeof value === 'string' && value.toLowerCase().includes(query)
      )
    );
  }, [jobs, searchQuery]);

  // Add job handler
  const handleAddJob = async (formData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .insert([formData]);

      if (error) throw error;

      await loadJobs();
      setShowAddModal(false);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error adding job:', error);
      alert('Kunde inte lägga till jobbet. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete job handler
  const handleDeleteJob = async () => {
    if (!deleteJobId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', deleteJobId);

      if (error) throw error;

      await loadJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Kunde inte radera jobbet. Försök igen.');
    } finally {
      setIsDeleting(false);
      setDeleteJobId(null);
    }
  };

  // Login handler
  const handleLogin = () => {
    localStorage.setItem('authenticated', 'true');
    setIsAuthenticated(true);
  };

  // Login screen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Main app
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Lediga Jobb Listan</h1>
            </div>

            <div className="flex flex-1 items-center gap-3 sm:justify-end">
              <div className="relative flex-1 sm:flex-initial sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sök på nyckelord"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-medium transition-colors whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Lägg till jobb</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {jobs.length === 0 ? (
          <EmptyState onAddClick={() => setShowAddModal(true)} />
        ) : filteredJobs.length === 0 ? (
          <NoResults query={searchQuery} />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <JobTable jobs={filteredJobs} onDelete={setDeleteJobId} />
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} onDelete={setDeleteJobId} />
              ))}
            </div>

            {/* Job count */}
            <p className="text-sm text-slate-500 mt-4 text-center sm:text-left">
              Visar {filteredJobs.length} av {jobs.length} jobb
            </p>
          </>
        )}
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddJobModal
          onSubmit={handleAddJob}
          onClose={() => setShowAddModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {deleteJobId && (
        <DeleteModal
          onConfirm={handleDeleteJob}
          onCancel={() => setDeleteJobId(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* Success Toast */}
      {showSuccess && (
        <SuccessToast
          message="Tack ⭐"
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
