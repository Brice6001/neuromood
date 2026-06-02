import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Account created successfully! Please check your email to confirm registration, then log in.');
          setEmail('');
          setPassword('');
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-container-padding-mobile md:p-container-padding-desktop antialiased w-full h-full absolute inset-0 z-50">
      <main className="w-full max-w-[1024px] bg-background-main rounded-xl shadow-[0_4px_6px_rgba(39,33,60,0.1)] flex overflow-hidden min-h-[600px]">
        {/* Left Side */}
        <div className="hidden md:flex w-1/2 relative bg-surface-container-high flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Decorative background"
              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSa-QBQPbenHfwaD7J9ZguS_rEdZLdfZxPD969xbR352ikPJX4qATflkkFXutc0m49RURgHXeuEJP8lY7HajesZkC0AE75mtYQD4JEVBexkGkxrMQrMwKjin7ir-CseDWGE6-CIoL9FsfRW2vjAaNQhv_eEuv-zq65Ln-jI-q1JSPlYftvcuPwQ0OJD_RQv5k1tY0NbKvMkO7-9nW_KybaEQS3UqIsXmiGgKsqUYkZ_jGQezkSbO3Jb54VDnbtzMCOclDSPs63hNo"
            />
          </div>
          <div className="relative z-10 p-12 text-center flex flex-col items-center gap-stack-sm">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center shadow-lg mb-4">
              <span className="material-symbols-outlined text-primary-container text-[32px] fill">psychology</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">NeuroMood</h2>
            <p className="font-body-base text-body-base text-text-secondary max-w-sm mt-2">
              Your dedicated wellness partner. Track, reflect, and grow with AI-driven insights designed to support your mental journey.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <div className="md:hidden flex items-center gap-3 mb-stack-md">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-container text-[24px] fill">psychology</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface font-semibold">NeuroMood</h1>
          </div>

          <div className="mb-stack-lg">
            <h2 className="font-headline-lg text-headline-lg text-text-primary mb-2">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="font-body-base text-body-base text-text-muted">
              {isSignUp
                ? 'Enter your details to register a new account.'
                : 'Please enter your details to access your account.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-DEFAULT text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-success-growth/10 text-success-growth rounded-DEFAULT text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
            <div className="flex flex-col gap-base">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-medium ml-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-text-muted text-[20px]">mail</span>
                </div>
                <input
                  className="w-full pl-12 pr-4 py-3 rounded-DEFAULT border border-border-subtle bg-surface-bright font-body-base text-body-base text-on-surface placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-base">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-medium ml-1" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-text-muted text-[20px]">lock</span>
                </div>
                <input
                  className="w-full pl-12 pr-12 py-3 rounded-DEFAULT border border-border-subtle bg-surface-bright font-body-base text-body-base text-on-surface placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-text-muted hover:text-on-surface transition-colors text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input className="w-4 h-4 rounded border-border-subtle text-primary-container focus:ring-primary-container" type="checkbox" />
                  <span className="font-label-sm text-label-sm text-text-secondary">Remember me</span>
                </label>
                <a className="font-label-sm text-label-sm text-primary-container font-medium hover:underline" href="#">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-stack-sm w-full py-4 rounded-full bg-primary-container text-on-primary-container font-body-base text-body-base font-medium shadow-sm hover:brightness-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                  <span>{isSignUp ? 'Signing Up...' : 'Logging In...'}</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? 'Sign Up' : 'Log In'}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-stack-lg text-center">
            <p className="font-body-base text-body-base text-text-muted">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-primary-container font-medium hover:underline ml-1 cursor-pointer bg-transparent border-none p-0"
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
