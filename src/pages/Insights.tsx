import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface MoodLog {
  id: string;
  mood: string;
  emoji: string;
  intensity: number;
  note: string;
  tags: string[];
  created_at: string;
}

interface AIInsight {
  title: string;
  description: string;
  icon: string;
  tag: string;
}

interface AIResponse {
  summary: string;
  insights: AIInsight[];
}

const Insights: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [aiData, setAiData] = useState<AIResponse | null>(null);

  // Background/card color cycles for insights
  const insightStyles = [
    { color: 'bg-primary-fixed text-on-primary-fixed-variant' },
    { color: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
    { color: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' }
  ];

  useEffect(() => {
    if (!user) return;

    const fetchLogsAndAnalyze = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        // Fetch past 7 days of mood entries
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;

        const fetchedLogs = data || [];
        setLogs(fetchedLogs);

        // If >= 3 logs, request analysis from Gemini
        if (fetchedLogs.length >= 3) {
          setAnalyzing(true);
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
          if (!apiKey) {
            throw new Error('Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY in your .env file.');
          }

          const logsPayload = fetchedLogs.map(l => ({
            date: new Date(l.created_at).toLocaleDateString(),
            mood: l.mood,
            intensity: l.intensity,
            note: l.note,
            tags: l.tags
          }));

          const userPrompt = `Analyze these mood logs from the past 7 days:
${JSON.stringify(logsPayload)}

You must respond with a strict JSON object with exactly these keys:
"summary": a 2-3 sentence overview of the user's emotional trends over the week.
"insights": an array of exactly 3 objects, each representing a distinct connection or wellness advice. Each object must have these keys:
  "title": short descriptive title (e.g., "Sleep-Mood Connection"),
  "description": actionable suggestion with context (e.g., "You logged high intensity Sad on Mon when noting bad sleep. Try to wind down..."),
  "icon": a Material symbol name (e.g., "nights_stay", "wb_sunny", "self_improvement", "directions_walk", "spa"),
  "tag": category label (e.g., "Sleep Trend", "Wellness Habit")

Return nothing except the strict JSON object.`;

          const response = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: userPrompt }] }],
                generationConfig: { responseMimeType: 'application/json' },
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to contact Gemini API: ${response.statusText}`);
          }

          const resData = await response.json();
          const responseText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            const parsed = JSON.parse(responseText.trim());
            if (parsed.summary && Array.isArray(parsed.insights)) {
              setAiData(parsed);
            } else {
              throw new Error('Invalid analysis format received from AI.');
            }
          } else {
            throw new Error('No content returned from AI analysis.');
          }
        }
      } catch (err: any) {
        console.error('Error fetching/analyzing logs:', err);
        setErrorMsg(err.message || 'An error occurred during wellness analysis.');
      } finally {
        setLoading(false);
        setAnalyzing(false);
      }
    };

    fetchLogsAndAnalyze();
  }, [user]);

  return (
    <main className="pt-20 md:pt-8 pb-28 md:pb-8 px-container-padding-mobile md:px-container-padding-desktop md:ml-64 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-md gap-4">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-text-primary">AI Wellness Insights</h2>
          <p className="text-text-secondary mt-1">Personalized, data-driven reflections powered by your mood logs.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-DEFAULT text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {loading || analyzing ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          <div className="flex items-center gap-2 text-primary font-medium text-lg">
            <span className="material-symbols-outlined animate-pulse">auto_awesome</span>
            <span>{analyzing ? 'Gemini is analyzing your week...' : 'Loading entries...'}</span>
          </div>
        </div>
      ) : logs.length < 3 ? (
        <div className="bg-surface rounded-DEFAULT shadow-[0_4px_6px_rgba(39,33,60,0.1)] p-12 text-center flex flex-col items-center">
          <span className="material-symbols-outlined text-[64px] text-text-muted mb-4">analytics</span>
          <h3 className="text-xl font-semibold text-text-primary mb-2">Insufficient Logs for Analysis</h3>
          <p className="text-text-muted max-w-md mb-6">
            NeuroMood requires at least 3 mood logs from the past 7 days to run comprehensive Gemini AI insights.
            You currently have logged {logs.length} {logs.length === 1 ? 'entry' : 'entries'}.
          </p>
          <Link
            to="/log"
            className="px-6 py-3 bg-primary-container text-on-primary-container rounded-full font-medium shadow-sm hover:brightness-95 transition-all"
          >
            Log a Mood
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
          {aiData?.insights.map((insight, idx) => {
            const style = insightStyles[idx % insightStyles.length];
            return (
              <div key={idx} className="bg-surface rounded-DEFAULT shadow-[0_4px_6px_rgba(39,33,60,0.1)] p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 ${style.color} rounded-full font-label-sm text-label-sm font-medium`}>
                      {insight.tag}
                    </span>
                    <span className="material-symbols-outlined text-text-muted">auto_awesome</span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-[28px] text-primary">{insight.icon}</span>
                    <h3 className="font-headline-md text-[20px] text-text-primary font-semibold">{insight.title}</h3>
                  </div>
                  <p className="text-text-secondary text-body-base leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Dynamic AI Advice */}
          {aiData?.summary && (
            <div className="bg-secondary-fixed rounded-DEFAULT p-8 flex flex-col justify-between relative overflow-hidden md:col-span-2 lg:col-span-3">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <span className="material-symbols-outlined text-[120px]">psychology</span>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-secondary">
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <h3 className="font-headline-md text-headline-md font-semibold">Weekly Neuro-Summary</h3>
                </div>
                <p className="text-on-secondary-fixed-variant text-[18px] md:text-[20px] leading-relaxed max-w-4xl mb-6">
                  "{aiData.summary}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Insights;
