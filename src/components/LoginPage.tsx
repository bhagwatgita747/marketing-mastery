import { useState, FormEvent } from 'react';
import { useTheme } from '../hooks/useTheme';

interface LoginPageProps {
  onLogin: (username: string, password: string) => { success: boolean; error?: string };
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const result = onLogin(username, password);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark ? 'bg-[#0a0a12]' : 'bg-gradient-to-br from-slate-50 to-slate-100'
    }`}>
      {/* Dark mode animated blobs */}
      {isDark && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
      )}

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
            isDark
              ? 'bg-gradient-to-br from-accent-500 to-accent-600 shadow-glow-green'
              : 'bg-primary-600'
          }`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Marketing Mastery
          </h1>
          <p className={`mt-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
            Learn marketing the smart way
          </p>
        </div>

        {/* Login Form */}
        <div className={`rounded-2xl shadow-lg p-8 transition-all duration-300 ${
          isDark
            ? 'glass-strong'
            : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Welcome back
            </h2>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              <div className="theme-toggle-thumb">
                {isDark ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className={`block text-sm font-medium mb-1.5 ${
                isDark ? 'text-white/70' : 'text-slate-700'
              }`}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg transition-all ${
                  isDark
                    ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20'
                    : 'border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                }`}
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-1.5 ${
                isDark ? 'text-white/70' : 'text-slate-700'
              }`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg transition-all ${
                  isDark
                    ? 'bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20'
                    : 'border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                }`}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className={`px-4 py-3 rounded-lg text-sm ${
                isDark
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-red-50 text-red-600'
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-glow-green'
                  : 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <p className={`text-center text-sm mt-6 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
          Personalized learning for marketing professionals
        </p>
      </div>
    </div>
  );
}
