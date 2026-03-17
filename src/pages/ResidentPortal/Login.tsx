import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/api/auth.service';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export default function ResidentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.loginResident({ email, password });
      setAuth(response.resident, response.access_token);
      navigate('/resident');
    } catch (err: any) {
      setError(err.message || 'Login gagal. Cek kembali email & password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-bg flex items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-[420px] space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-3">
          <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-primary/10 text-brand-primary">
            <LogIn size={30} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Portal Penghuni</h1>
          <p className="text-text-secondary">Masuk untuk melihat tagihan dan status kamar Anda.</p>
        </div>

        <div className="w-full rounded-2xl border border-border-default bg-surface-card p-6 shadow-xl sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-error-100 bg-error-50 px-4 py-3 text-sm text-error-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-secondary">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@email.com"
                  autoComplete="email"
                  className="w-full h-12 rounded-xl border border-border-default bg-surface-card pl-11 pr-4 text-text-primary placeholder:text-text-secondary/70 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-sm font-medium text-text-primary" htmlFor="password">
                  Password
                </label>
                <Link
                  to="/resident/forgot-password"
                  className="text-sm font-medium text-brand-primary hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-secondary">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-12 rounded-xl border border-border-default bg-surface-card pl-11 pr-4 text-text-primary placeholder:text-text-secondary/70 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-primary px-4 text-base font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
              {!isLoading && <ArrowRight size={18} className="ml-2" />}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Bukan penghuni?{' '}
            <Link to="/login" className="font-bold text-brand-primary hover:underline">
              Masuk sebagai Owner
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
