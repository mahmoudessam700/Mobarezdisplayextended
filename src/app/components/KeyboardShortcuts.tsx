import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Keyboard } from 'lucide-react';

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['Cmd', 'K'], description: 'Open search' },
        { keys: ['Cmd', '1'], description: 'Go to Devices' },
        { keys: ['Cmd', '2'], description: 'Go to Sessions' },
        { keys: ['Cmd', '3'], description: 'Go to Analytics' },
        { keys: ['Cmd', ','], description: 'Open settings' },
      ],
    },
    {
      category: 'Actions',
      items: [
        { keys: ['Cmd', 'N'], description: 'Scan for new devices' },
        { keys: ['Cmd', 'D'], description: 'Disconnect all' },
        { keys: ['Cmd', 'R'], description: 'Refresh connections' },
      ],
    },
    {
      category: 'General',
      items: [
        { keys: ['?'], description: 'Show this help' },
        { keys: ['Esc'], description: 'Close dialog/modal' },
        { keys: ['Cmd', 'Q'], description: 'Quit application' },
      ],
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts with ?
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </div>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="font-semibold mb-3 text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <kbd className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-slate-400">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-xs">?</kbd> anytime to view these shortcuts
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
