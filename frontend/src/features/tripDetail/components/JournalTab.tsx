import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { JournalEntry } from '../../../types/tripDetail';

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export function JournalTab({ entries: initialEntries }: { entries: JournalEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const handleAdd = () => {
    if (!title.trim()) return;
    setEntries((prev) => [
      { id: `local-${Date.now()}`, date: new Date().toISOString().slice(0, 10), title, note },
      ...prev
    ]);
    setTitle('');
    setNote('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-5">
      {isAdding ? (
        <Card className="space-y-3">
          <Input placeholder="What happened today?" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            rows={3}
            placeholder="Add a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-sm text-dark placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}>
              Save entry
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-4 text-sm font-medium text-gray-400 transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="size-4" />
          Add a journal entry
        </button>
      )}

      {entries.length === 0 && !isAdding ? (
        <p className="py-10 text-center text-sm text-gray-400">No entries yet — this is where the trip's story lives.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Card>
                <p className="font-mono text-xs text-gray-400">{dateFormatter.format(new Date(entry.date))}</p>
                <h3 className="mt-1 font-display text-base font-semibold text-dark">{entry.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{entry.note}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
