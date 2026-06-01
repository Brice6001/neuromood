import React, { useState, useEffect } from 'react';

interface TableRow {
  category: string;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  recommended_action: string;
}

const MoodLogger: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tableData, setTableData] = useState<TableRow[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('afretec_v2_history');
    if (saved) {
      try {
        setTableData(JSON.parse(saved));
      } catch {
        // Silently fail if localStorage is corrupted
      }
    }
  }, []);

  const saveToLocalStorage = (data: TableRow[]) => {
    localStorage.setItem('afretec_v2_history', JSON.stringify(data));
  };

  const handleAnalyze = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setError('');

    try {
      const userPrompt = `Analyze this input: "${userInput}".
Do not return plain text or markdown.
You must return only a strict JSON object with exactly three keys:
"category" (a short label for the type of input),
"risk_level" (one of: "Low", "Medium", "High", or "Critical"),
and "recommended_action" (a one-sentence action for the user to take).
Return nothing except the JSON object.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + import.meta.env.VITE_GEMINI_API_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) throw new Error('No response from API');

      try {
        const parsed = JSON.parse(responseText);
        const newRow: TableRow = {
          category: parsed.category || 'Unknown',
          risk_level: parsed.risk_level || 'Low',
          recommended_action: parsed.recommended_action || 'No action',
        };
        const updated = [newRow, ...tableData];
        setTableData(updated);
        saveToLocalStorage(updated);
        setUserInput('');
      } catch {
        setError('Could not parse AI response — please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API error. Check console.');
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

  const getRiskIndicator = (level: string) => {
    return level === 'High' || level === 'Critical' ? '⚠ ' : '';
  };

  const clearHistory = () => {
    localStorage.removeItem('afretec_v2_history');
    setTableData([]);
  };

  const exportCSV = () => {
    if (tableData.length === 0) return;

    const headers = 'Category,Risk Level,Recommended Action';
    const rows = tableData.map(row =>
      `"${row.category}","${row.risk_level}","${row.recommended_action.replace(/"/g, '""')}"`
    );
    const csvContent = '\uFEFF' + headers + '\n' + rows.join('\n');

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '-');
    const filename = `afretec_dashboard_${dateStr}_${timeStr}.csv`;

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

        {/* Glassmorphism Container Card */}
        <div className="bg-background-main rounded-xl p-6 md:p-8 shadow-[0_4px_12px_rgba(39,33,60,0.05)] border border-surface-container-high flex flex-col gap-stack-lg relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-fixed rounded-full blur-3xl opacity-30 pointer-events-none"></div>

          {/* Emoji Grid */}
          <div className="flex flex-col gap-stack-sm relative z-10">
            <label className="font-headline-md text-headline-md text-on-surface">Quick Selection</label>
            <div className="grid grid-cols-5 gap-2 md:gap-4 mt-2">
              <button className="group flex flex-col items-center justify-center aspect-square rounded-[2rem] bg-surface-container-highest hover:bg-border-subtle transition-all duration-300 active:scale-95">
                <span className="material-symbols-outlined text-4xl text-secondary group-hover:scale-110 transition-transform">sentiment_very_dissatisfied</span>
              </button>
              <button className="group flex flex-col items-center justify-center aspect-square rounded-[2rem] bg-surface-container-highest hover:bg-border-subtle transition-all duration-300 active:scale-95">
                <span className="material-symbols-outlined text-4xl text-secondary group-hover:scale-110 transition-transform">sentiment_dissatisfied</span>
              </button>
              <button className="group flex flex-col items-center justify-center aspect-square rounded-[2rem] bg-surface-container-highest hover:bg-surface-variant transition-all duration-300 active:scale-95">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:scale-110 transition-transform">sentiment_neutral</span>
              </button>
              <button className="group flex flex-col items-center justify-center aspect-square rounded-[2rem] bg-primary-container shadow-[0_4px_8px_rgba(236,115,87,0.3)] transition-all duration-300 active:scale-95 border-2 border-primary-container scale-105">
                <span className="material-symbols-outlined text-4xl text-on-primary-container fill">sentiment_satisfied</span>
              </button>
              <button className="group flex flex-col items-center justify-center aspect-square rounded-[2rem] bg-surface-container-highest hover:bg-primary-fixed transition-all duration-300 active:scale-95">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:scale-110 transition-transform">sentiment_very_satisfied</span>
              </button>
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="flex flex-col gap-stack-sm relative z-10 pt-4">
            <div className="flex justify-between items-end">
              <label className="font-headline-md text-headline-md text-on-surface">Intensity</label>
              <span className="font-body-base text-body-base text-primary-container font-medium">Moderate</span>
            </div>
            <div className="relative w-full h-12 flex items-center mt-2 group cursor-pointer">
              <div className="w-full h-4 rounded-full bg-gradient-to-r from-border-subtle via-[#e6a89c] to-primary-container shadow-inner"></div>
              <div className="absolute left-[65%] w-8 h-8 rounded-full bg-background-main border-[3px] border-primary-container shadow-[0_2px_4px_rgba(39,33,60,0.2)] transform -translate-x-1/2 group-hover:scale-110 transition-transform flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary-container"></div>
              </div>
            </div>
            <div className="flex justify-between w-full px-1">
              <span className="font-label-sm text-label-sm text-text-muted">Mild</span>
              <span className="font-label-sm text-label-sm text-text-muted">Overwhelming</span>
            </div>
          </div>

          {/* Emotional Notes */}
          <div className="flex flex-col gap-base relative z-10 pt-4">
            <label className="font-headline-md text-headline-md text-on-surface">Journal Notes</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full p-4 rounded-[1.5rem] border border-border-subtle focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none bg-surface-bright resize-none h-40 font-body-base text-body-base text-on-surface placeholder:text-text-muted transition-all shadow-sm"
              placeholder="What's contributing to this feeling? (Optional)"
            ></textarea>
          </div>

          {error && (
            <div className="relative z-10 p-4 rounded-lg bg-red-100 border border-red-300">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Action */}
          <div className="pt-6 relative z-10 flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={loading || !userInput.trim()}
              className="flex-1 py-5 rounded-full bg-primary-container hover:bg-[#de6044] disabled:opacity-50 disabled:cursor-not-allowed text-on-primary-container font-headline-md text-headline-md transition-all active:scale-95 shadow-[0_4px_12px_rgba(236,115,87,0.2)] flex justify-center items-center gap-2"
            >
              <span>{loading ? 'Analyzing...' : 'Save Entry'}</span>
              <span className="material-symbols-outlined text-xl">{loading ? 'hourglass_empty' : 'check_circle'}</span>
            </button>
            <button
              onClick={clearHistory}
              className="px-6 py-5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-medium transition-all"
            >
              Clear History
            </button>
          </div>
        </div>

        {/* Dashboard Table */}
        {tableData.length > 0 && (
          <div className="bg-background-main rounded-xl p-6 md:p-8 shadow-[0_4px_12px_rgba(39,33,60,0.05)] border border-surface-container-high relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Analysis History</h3>
              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-full bg-primary-container hover:bg-[#de6044] text-on-primary-container font-medium text-sm transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Data
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border-subtle">
                    <th className="text-left p-3 font-headline-md text-headline-md text-on-surface">Category</th>
                    <th className="text-left p-3 font-headline-md text-headline-md text-on-surface">Risk Level</th>
                    <th className="text-left p-3 font-headline-md text-headline-md text-on-surface">Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border-subtle hover:bg-surface-container-low transition-colors">
                      <td className="p-3 font-body-base text-body-base text-on-surface">{row.category}</td>
                      <td className={`p-3 font-body-base text-body-base font-medium ${getRiskColor(row.risk_level)}`}>
                        {getRiskIndicator(row.risk_level)}{row.risk_level}
                      </td>
                      <td className="p-3 font-body-base text-body-base text-on-surface">{row.recommended_action}</td>
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
