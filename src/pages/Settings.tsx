import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignOut = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await signOut();
      if (error) {
        setErrorMsg(error.message);
      } else {
        navigate('/login');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during logout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-20 md:pt-8 pb-28 md:pb-8 px-container-padding-mobile md:px-container-padding-desktop md:ml-64 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-stack-md gap-4">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-text-primary">Settings</h2>
          <p className="text-text-secondary mt-1">Manage your account preferences, configurations, and privacy.</p>
        </div>
      </div>

      <div className="max-w-[800px] flex flex-col gap-6">
        {/* Account Settings Card */}
        <div className="bg-surface rounded-DEFAULT shadow-[0_4px_6px_rgba(39,33,60,0.1)] p-6">
          <h3 className="font-headline-md text-[20px] text-text-primary font-semibold mb-4 flex items-center gap-2 border-b border-border-subtle pb-3">
            <span className="material-symbols-outlined text-primary">account_circle</span>
            Account Profiles
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Email Address</label>
              <input
                disabled
                className="w-full px-4 py-2.5 rounded-DEFAULT border border-border-subtle bg-surface-bright text-text-muted cursor-not-allowed font-body-base"
                type="text"
                value={user?.email || 'Not authenticated'}
              />
              <span className="text-xs text-text-muted mt-1 block">Your email is managed securely via Supabase Auth.</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">User ID</label>
              <input
                disabled
                className="w-full px-4 py-2.5 rounded-DEFAULT border border-border-subtle bg-surface-bright text-text-muted cursor-not-allowed font-mono text-xs"
                type="text"
                value={user?.id || 'N/A'}
              />
            </div>
          </div>
        </div>

        {/* Security / System Settings Card */}
        <div className="bg-surface rounded-DEFAULT shadow-[0_4px_6px_rgba(39,33,60,0.1)] p-6">
          <h3 className="font-headline-md text-[20px] text-text-primary font-semibold mb-4 flex items-center gap-2 border-b border-border-subtle pb-3">
            <span className="material-symbols-outlined text-primary">security</span>
            Preferences & Security
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium text-text-primary">Daily Reminder Push Notifications</h4>
                <p className="text-xs text-text-secondary">Get a gentle nudge at 8:00 PM to log your emotional balance.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" defaultChecked type="checkbox" />
                <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-subtle after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-border-subtle">
              <div>
                <h4 className="font-medium text-text-primary">AI Recommendation Engine</h4>
                <p className="text-xs text-text-secondary">Allow Gemini AI to process your notes to suggest custom breathing routines.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" defaultChecked type="checkbox" />
                <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-subtle after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone / Log Out */}
        <div className="bg-surface rounded-DEFAULT shadow-[0_4px_6px_rgba(39,33,60,0.1)] p-6 border border-error/15">
          <h3 className="font-headline-md text-[20px] text-error font-semibold mb-4 flex items-center gap-2 border-b border-border-subtle pb-3">
            <span className="material-symbols-outlined">gpp_maybe</span>
            Danger Zone
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-medium text-text-primary">Sign Out of NeuroMood</h4>
              <p className="text-xs text-text-secondary">Ends your active session on this device. You will need to log back in to access dashboard.</p>
            </div>
            <button
              disabled={loading}
              onClick={handleSignOut}
              className="px-6 py-3 bg-error text-on-error hover:brightness-95 disabled:opacity-50 rounded-full font-medium transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging out...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  Sign Out
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 bg-error-container text-on-error-container rounded-DEFAULT text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Settings;
