import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  intensity: number;
  note: string;
  tags: string[];
  created_at: string;
}

interface TableRow {
  category: string;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  recommended_action: string;
}

const MoodLogger: React.FC = () => {
  const { user } = useAuth();
  
  // Form states
  const [selectedMood, setSelectedMood] = useState('Relaxed');
  const [selectedEmoji, setSelectedEmoji] = useState('😌');
  const [selectedIcon, setSelectedIcon] = useState('sentiment_satisfied');
  const [intensity, setIntensity] = useState(5);
  const [userInput, setUserInput] = useState('');
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Database entries list
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  // Local state for last AI analysis feedback
  const [aiFeedback, setAiFeedback] = useState<TableRow | null>(null);

  const moodTypes = [
    { icon: 'sentiment_very_dissatisfied', emoji: '😢', mood: 'Sad' },
    { icon: 'sentiment_dissatisfied', emoji: '😮‍💨', mood: 'Overwhelmed' },
    { icon: 'sentiment_neutral', emoji: '😐', mood: 'Neutral' },
    { icon: 'sentiment_satisfied', emoji: '😌', mood: 'Relaxed' },
    { icon: 'sentiment_very_satisfied', emoji: '🌟', mood: 'Motivated' }
  ];

  // Fetch entries from Supabase on mount/user change
  const fetchEntries = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (err: any) {
      console.error('Error fetching mood logs:', err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const extractTags = (text: string): string[] => {
    const matches = text.match(/#\w+/g);
    return matches ? matches.map(t => t.slice(1).toLowerCase()) : [];
  };

  const getIntensityLabel = (val: number) => {
    if (val <= 3) return 'Mild';
    if (val <= 7) return 'Moderate';
    return 'Overwhelming';
  };

  const handleSaveEntry = async () => {
    if (!user) {
      setError('You must be logged in to save entries.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    setAiFeedback(null);

    try {
      const tags = extractTags(userInput);

      // 1. Insert into Supabase mood_entries table
      const { error: dbError } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood: selectedMood,
          emoji: selectedEmoji,
          intensity: intensity,
          note: userInput,
          tags: tags
        });

      if (dbError) throw dbError;

      // 2. Query Gemini AI for sentiment analysis if userInput contains text
      if (userInput.trim()) {
        const userPrompt = `Analyze this input: "${userInput}".
Do not return plain text or markdown.
You must return only a strict JSON object with exactly three keys:
"category" (a short label for the emotional category),
"risk_level" (one of: "Low", "Medium", "High", or "Critical"),
and "recommended_action" (a one-sentence action for the user to take).
Return nothing except the JSON object.`;

        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
            import.meta.env.VITE_GEMINI_API_KEY,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: userPrompt }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            try {
              const parsed = JSON.parse(responseText);
              setAiFeedback({
                category: parsed.category || 'Unknown',
                risk_level: parsed.risk_level || 'Low',
                recommended_action: parsed.recommended_action || 'No action',
              });
            } catch {
              // Silently drop parsing errors for AI feedback
            }
          }
        }
      }

      setSuccess('Mood entry saved successfully to database!');
      setUserInput('');
      setIntensity(5);
      
      // Refresh list from database
      await fetchEntries();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-green-600';
      case 'Medium':
        return 'text-amber-500';
      case 'High':
        return 'text-red-600';
      case 'Critical':
        return 'text-red-700 font-bold';
      default:
        return 'text-text-secondary';
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error: dbError } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
      setEntries(entries.filter(e => e.id !== id));
    } catch (err: any) {
      setError('Could not delete entry: ' + err.message);
    }
  };

  const exportCSV = () => {
    if (entries.length === 0) return;

    const headers = 'Date,Mood,Emoji,Intensity,Note,Tags';
    const rows = entries.map(row =>
      `"${new Date(row.created_at).toLocaleDateString()}","${row.mood}","${row.emoji}",${row.intensity},"${row.note.replace(/"/g, '""')}","${row.tags.join(', ')}"`
    );
    const csvContent = '\uFEFF' + headers + '\n' + rows.join('\n');

    const filename = `neuromood_export_${new Date().toISOString().slice(0, 10)}.csv`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex-1 w-full md:ml-64 pt-24 md:pt-12 pb-32 md:pb-12 px-container-padding-mobile md:px-container-padding-desktop flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-stack-lg">
        <div className="text-center space-y-2">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">How are you feeling?</h2>
          <p className="font-body-base text-body-base text-text-muted">Take a moment to check in with yourself.</p>
        </div>

        {/* Input Card */}
        <div className="bg-background-main rounded-xl p-6 md:p-8 shadow-[0_4px_12px_rgba(39,33,60,0.05)] border border-surface-container-high flex flex-col gap-stack-sm relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-fixed rounded-full blur-3xl opacity-30 pointer-events-none"></div>

          {/* Emoji Grid */}
          <div className="flex flex-col gap-stack-sm relative z-10">
            <label className="font-headline-md text-headline-md text-on-surface">Quick Selection</label>
            <div className="grid grid-cols-5 gap-2 md:gap-4 mt-2">
              {moodTypes.map((type) => {
                const isActive = selectedMood === type.mood;
                return (
                  <button
                    key={type.mood}
                    type="button"
                    onClick={() => {
                      setSelectedMood(type.mood);
                      setSelectedEmoji(type.emoji);
                      setSelectedIcon(type.icon);
                    }}
                    className={`group flex flex-col items-center justify-center aspect-square rounded-[2rem] transition-all duration-300 active:scale-95 cursor-pointer ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container shadow-[0_4px_8px_rgba(236,115,87,0.3)] border-2 border-primary-container scale-105'
                        : 'bg-surface-container-highest hover:bg-border-subtle text-secondary'
                    }`}
                    title={type.mood}
                  >
                    <span className={`material-symbols-outlined text-4xl group-hover:scale-110 transition-transform ${isActive ? 'fill' : ''}`}>
                      {type.icon}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="flex flex-col gap-stack-sm relative z-10 pt-4">
            <div className="flex justify-between items-end">
              <label className="font-headline-md text-headline-md text-on-surface">Intensity</label>
              <span className="font-body-base text-body-base text-primary-container font-semibold">
                {intensity} ({getIntensityLabel(intensity)})
              </span>
            </div>
            <div className="w-full flex items-center mt-2">
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary-container bg-surface-variant focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #C0D6DF, #ec7357 ${intensity * 10}%, #f3ded9 ${intensity * 10}%)`
                }}
              />
            </div>
            <div className="flex justify-between w-full px-1">
              <span className="font-label-sm text-label-sm text-text-muted">Mild (1)</span>
              <span className="font-label-sm text-label-sm text-text-muted">Overwhelming (10)</span>
            </div>
          </div>

          {/* Emotional Notes */}
          <div className="flex flex-col gap-base relative z-10 pt-4">
            <div className="flex justify-between items-end">
              <label className="font-headline-md text-headline-md text-on-surface">Journal Notes</label>
              <span className="text-xs text-text-muted">Tip: Add #hashtags to tag your entry!</span>
            </div>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full p-4 rounded-[1.5rem] border border-border-subtle focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none bg-surface-bright resize-none h-40 font-body-base text-body-base text-on-surface placeholder:text-text-muted transition-all shadow-sm"
              placeholder="What's contributing to this feeling? Explain here..."
            ></textarea>
          </div>

          {error && (
            <div className="relative z-10 p-3.5 bg-error-container text-on-error-container rounded-DEFAULT text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="relative z-10 p-3.5 bg-success-growth/10 text-success-growth rounded-DEFAULT text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          {/* Action */}
          <div className="pt-6 relative z-10 flex gap-3">
            <button
              onClick={handleSaveEntry}
              disabled={loading}
              className="flex-1 py-5 rounded-full bg-primary-container hover:bg-[#de6044] disabled:opacity-50 disabled:cursor-not-allowed text-on-primary-container font-headline-md text-headline-md transition-all active:scale-95 shadow-[0_4px_12px_rgba(236,115,87,0.2)] flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <span>Save Entry</span>
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Insight Box (Displayed dynamically after entry creation) */}
        {aiFeedback && (
          <div className="bg-secondary-fixed rounded-DEFAULT p-6 shadow-[0_4px_12px_rgba(39,33,60,0.05)] border border-surface-container-high flex flex-col relative overflow-hidden animate-fade-in">
            <div className="flex items-center gap-2 mb-3 text-secondary">
              <span className="material-symbols-outlined">auto_awesome</span>
              <h3 className="font-headline-md text-headline-md font-semibold">Gemini Real-Time Insight</h3>
            </div>
            <div className="space-y-2 text-on-secondary-fixed-variant">
              <p className="text-sm font-medium">Category: <span className="underline">{aiFeedback.category}</span></p>
              <p className="text-sm font-medium">Risk Level: <span className={getRiskColor(aiFeedback.risk_level)}>{aiFeedback.risk_level}</span></p>
              <p className="text-[17px] leading-relaxed mt-2 italic">
                "{aiFeedback.recommended_action}"
              </p>
            </div>
          </div>
        )}

        {/* Saved Mood Logs Database Table */}
        {entries.length > 0 && (
          <div className="bg-background-main rounded-xl p-6 md:p-8 shadow-[0_4px_12px_rgba(39,33,60,0.05)] border border-surface-container-high relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Your Database Mood Logs</h3>
              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-full bg-primary-container hover:bg-[#de6044] text-on-primary-container font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border-subtle">
                    <th className="text-left p-3 font-headline-md text-headline-md text-on-surface">Time</th>
                    <th className="text-left p-3 font-headline-md text-headline-md text-on-surface">Mood</th>
                    <th className="text-left p-3 font-headline-md text-headline-md text-on-surface">Intensity</th>
                    <th className="text-left p-3 font-headline-md text-headline-md text-on-surface">Note</th>
                    <th className="text-right p-3 font-headline-md text-headline-md text-on-surface">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((row) => (
                    <tr key={row.id} className="border-b border-border-subtle hover:bg-surface-container-low transition-colors">
                      <td className="p-3 font-body-base text-body-base text-text-muted whitespace-nowrap">
                        {new Date(row.created_at).toLocaleDateString()}<br/>
                        {new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3 font-body-base text-body-base text-on-surface font-semibold">
                        <span className="mr-1.5 text-xl">{row.emoji}</span>
                        {row.mood}
                      </td>
                      <td className="p-3 font-body-base text-body-base font-semibold text-primary">
                        {row.intensity}/10
                      </td>
                      <td className="p-3 font-body-base text-body-base text-on-surface max-w-xs truncate" title={row.note}>
                        {row.note || <span className="italic text-text-muted">No journal notes</span>}
                        {row.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {row.tags.map(t => (
                              <span key={t} className="text-[10px] bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteEntry(row.id)}
                          className="p-2 text-error hover:bg-error-container/10 rounded-full transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MoodLogger;
