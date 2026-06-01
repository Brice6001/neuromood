import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  intensity: number;
  note: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [profileName, setProfileName] = useState('');
  const [latestEntry, setLatestEntry] = useState<MoodEntry | null>(null);
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch user's profile full_name
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profileData?.full_name) {
          setProfileName(profileData.full_name);
        } else {
          // Default to email local part
          setProfileName(user.email ? user.email.split('@')[0] : 'User');
        }

        // 2. Fetch latest mood entries (up to 3 for recent history)
        const { data: moodLogs, error: moodError } = await supabase
          .from('mood_entries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (!moodError && moodLogs) {
          setRecentEntries(moodLogs);
          if (moodLogs.length > 0) {
            setLatestEntry(moodLogs[0]);
          }
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Format date helper
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  return (
    <main className="pt-20 md:pt-8 pb-28 md:pb-8 px-container-padding-mobile md:px-container-padding-desktop md:ml-64 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-md gap-4">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-text-primary capitalize">
            Good day, {profileName}
          </h2>
          <p className="text-text-secondary mt-1">Here is your wellness overview for today.</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button className="p-3 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg shadow-sm border border-border-subtle">
            {profileName.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-md">
        
        {/* Current Mood Status Card */}
        <div className="bg-surface rounded-DEFAULT shadow-[0_4px_6px_rgba(39,33,60,0.1)] p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-headline-md text-headline-md text-text-primary">Current Mood</h3>
            <span className="px-3 py-1 bg-surface-container-low text-primary rounded-full font-label-sm text-label-sm font-medium">
              {latestEntry ? `Updated ${formatTimeAgo(latestEntry.created_at)}` : 'No logs yet'}
            </span>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="w-20 h-20 bg-secondary-fixed rounded-full flex items-center justify-center text-4xl shadow-inner">
              {latestEntry ? latestEntry.emoji : '😌'}
            </div>
            <div>
              <p className="font-headline-lg text-headline-lg text-text-primary">
                {latestEntry ? latestEntry.mood : 'Calm & Focused'}
              </p>
              <p className="text-success-growth font-medium flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
                {latestEntry ? `Intensity ${latestEntry.intensity}/10` : 'Ready to start logging'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Wellness Insight Card */}
        <div className="bg-secondary-fixed rounded-DEFAULT p-6 flex flex-col relative overflow-hidden xl:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-[80px]">auto_awesome</span>
          </div>
          <div className="flex items-center gap-2 mb-4 text-secondary relative z-10">
            <span className="material-symbols-outlined">psychology</span>
            <h3 className="font-headline-md text-headline-md font-semibold">AI Insight</h3>
          </div>
          <p className="text-on-secondary-fixed-variant relative z-10 text-[17px] leading-relaxed mb-6">
            {latestEntry?.note 
              ? `Based on your recent note "${latestEntry.note.substring(0, 50)}...", consider scheduling a brief 10-minute walk or journaling session to balance your energy.`
              : "Welcome to NeuroMood! Once you log your emotional state and write down your notes in the Mood Logger, Gemini AI will analyze your journals to provide personalized recommendations here."}
          </p>
          <Link to="/insights" className="mt-auto self-start px-6 py-2 bg-surface text-primary rounded-full font-medium shadow-sm hover:shadow-md transition-shadow relative z-10">
            View Details
          </Link>
        </div>

        {/* Mood Trend Line Chart */}
        <div className="bg-surface rounded-DEFAULT shadow-[0_4px_6px_rgba(39,33,60,0.1)] p-6 md:col-span-2 xl:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-text-primary">Mood Trend</h3>
            <div className="flex gap-4 font-label-sm text-label-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                <span>Energy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success-growth"></div>
                <span>Calmness</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative min-h-[200px] flex items-end pt-4">
            {/* Y Axis Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full border-b border-border-subtle h-0"></div>
              <div className="w-full border-b border-border-subtle h-0"></div>
              <div className="w-full border-b border-border-subtle h-0"></div>
              <div className="w-full border-b border-border-subtle h-0"></div>
            </div>
            {/* Mock SVG Chart */}
            <svg className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path className="stroke-success-growth" d="M0,30 Q10,25 20,28 T40,15 T60,20 T80,10 T100,5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              <path className="stroke-primary-container" d="M0,20 Q15,10 25,18 T45,25 T65,15 T85,28 T100,20" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
          </div>
          <div className="flex justify-between w-full mt-4 text-text-muted font-label-sm text-label-sm px-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* Recent History List */}
        <div className="bg-surface rounded-DEFAULT shadow-[0_4px_6px_rgba(39,33,60,0.1)] p-6 md:col-span-2 xl:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-text-primary">Recent History</h3>
            <Link to="/history" className="text-primary font-medium text-sm hover:underline">See All</Link>
          </div>
          <div className="flex flex-col">
            {recentEntries.length > 0 ? (
              recentEntries.map((row) => (
                <div key={row.id} className="py-4 border-b last:border-b-0 border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center text-xl shadow-inner">
                      {row.emoji}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{row.mood}</p>
                      <p className="text-xs text-text-secondary">
                        {new Date(row.created_at).toLocaleDateString()} at {new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-surface-container-low text-primary-container rounded-full text-xs font-semibold border border-primary-fixed/20">
                    Intensity: {row.intensity}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-text-muted text-sm">
                <span className="material-symbols-outlined text-4xl mb-2 block">history</span>
                No entries logged yet.
                <Link to="/log" className="text-primary-container block font-medium mt-2 hover:underline">
                  Log your first mood
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
};

export default Dashboard;
