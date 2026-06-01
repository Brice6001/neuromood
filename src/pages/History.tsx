import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface MoodLog {
  id: string;
  mood: string;
  emoji: string;
  intensity: number;
  note: string;
  tags: string[];
  created_at: string;
}

const History: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchLogs = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading mood history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLogs(logs.filter(log => log.id !== id));
    } catch (err: any) {
      setErrorMsg('Failed to delete entry: ' + err.message);
    }
  };

  // Compile unique filter options dynamically from user entries
  const getFilterOptions = () => {
    const moods = Array.from(new Set(logs.map(l => l.mood)));
    const tags = Array.from(new Set(logs.flatMap(l => l.tags)));
    return ['All', ...moods, ...tags];
  };

  const filteredLogs = filter === 'All'
    ? logs
    : logs.filter(log => log.mood === filter || log.tags.includes(filter.toLowerCase()));

  return (
    <main className="pt-20 md:pt-8 pb-28 md:pb-8 px-container-padding-mobile md:px-container-padding-desktop md:ml-64 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-md gap-4">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-text-primary">Mood History</h2>
          <p className="text-text-secondary mt-1">Review your emotional journey and logged thoughts over time.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-DEFAULT text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      {logs.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {getFilterOptions().map((opt) => {
            const isActive = filter === opt;
            return (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {/* History Timeline */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
            <p className="text-text-secondary">Loading history logs...</p>
          </div>
        ) : filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-surface rounded-DEFAULT shadow-[0_4px_6px_rgba(39,33,60,0.1)] p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 bg-surface-container-low rounded-full flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {log.emoji}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-headline-md text-[18px] text-text-primary font-semibold">{log.mood}</h3>
                    <span className="text-sm text-text-muted">
                      {new Date(log.created_at).toLocaleDateString()} at{' '}
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-text-secondary text-body-base leading-relaxed">
                    {log.note || <span className="italic text-text-muted">No journal notes written.</span>}
                  </p>
                  {log.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-1">
                      {log.tags.map(tag => (
                        <span key={tag} className="text-xs bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 self-stretch md:self-auto justify-between md:justify-center border-t md:border-t-0 border-border-subtle pt-3 md:pt-0 w-full md:w-auto">
                <div className="px-3.5 py-1.5 bg-surface-container-low text-primary-container rounded-full text-sm font-semibold border border-primary-fixed/20 shadow-sm">
                  Intensity: {log.intensity}/10
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-sm text-error hover:underline font-medium flex items-center gap-1 self-start md:self-auto cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Delete entry
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-surface rounded-DEFAULT shadow-[0_4px_6px_rgba(39,33,60,0.1)] p-12 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-[64px] text-text-muted mb-4">search_off</span>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No matching entries found</h3>
            <p className="text-text-muted max-w-sm">Try choosing a different filter or log a new mood for today.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default History;
