import { useState, useEffect, useRef } from 'react';
import { Search, Monitor, BarChart3, Settings, HelpCircle, FileText, Command } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  category: string;
}

export function SearchBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const allItems: SearchResult[] = [
    {
      id: '1',
      title: t('devices'),
      description: 'Manage and connect your devices',
      path: '/dashboard',
      icon: <Monitor className="w-4 h-4" />,
      category: 'Pages',
    },
    {
      id: '2',
      title: t('sessions'),
      description: 'View active connection sessions',
      path: '/dashboard/sessions',
      icon: <BarChart3 className="w-4 h-4" />,
      category: 'Pages',
    },
    {
      id: '3',
      title: t('analytics'),
      description: 'Performance metrics and statistics',
      path: '/dashboard/analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      category: 'Pages',
    },
    {
      id: '4',
      title: t('settings'),
      description: 'Configure application preferences',
      path: '/dashboard/settings',
      icon: <Settings className="w-4 h-4" />,
      category: 'Pages',
    },
    {
      id: '5',
      title: t('account'),
      description: 'Manage your account and subscription',
      path: '/dashboard/account',
      icon: <Settings className="w-4 h-4" />,
      category: 'Pages',
    },
    {
      id: '6',
      title: t('help'),
      description: 'Get help and support',
      path: '/dashboard/help',
      icon: <HelpCircle className="w-4 h-4" />,
      category: 'Pages',
    },
    {
      id: '7',
      title: 'Connect Device',
      description: 'Scan and connect a new device',
      path: '/dashboard',
      icon: <Monitor className="w-4 h-4" />,
      category: 'Actions',
    },
    {
      id: '8',
      title: 'View Documentation',
      description: 'Read the user guide',
      path: '/dashboard/help',
      icon: <FileText className="w-4 h-4" />,
      category: 'Actions',
    },
  ];

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Filter results based on query
  useEffect(() => {
    if (query.trim() === '') {
      setResults(allItems.slice(0, 6));
    } else {
      const filtered = allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query]);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 min-w-[200px] justify-start text-slate-500 dark:text-slate-400"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-800 px-1.5 font-mono text-[10px] font-medium opacity-100 ml-auto">
          <Command className="w-3 h-3" />K
        </kbd>
      </Button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden"
              >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-4 border-b">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search for pages, settings, or actions..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-lg"
                  />
                  <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-slate-100 dark:bg-slate-700 px-2 font-mono text-xs">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="p-2">
                      {/* Group by category */}
                      {['Pages', 'Actions'].map(category => {
                        const categoryResults = results.filter(r => r.category === category);
                        if (categoryResults.length === 0) return null;

                        return (
                          <div key={category} className="mb-4">
                            <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {category}
                            </div>
                            {categoryResults.map((result) => (
                              <button
                                key={result.id}
                                onClick={() => handleSelect(result.path)}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                              >
                                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-500">
                                  {result.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium">{result.title}</div>
                                  <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                    {result.description}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <Search className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                      <p className="text-slate-500">No results found for "{query}"</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t px-4 py-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">↑↓</kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">Enter</kbd>
                      <span>Select</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">ESC</kbd>
                    <span>Close</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
