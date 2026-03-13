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
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-lg">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-2xl text-brand-primary mb-2">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Portal Penghuni</h1>
          <p className="text-text-secondary">Masuk untuk melihat tagihan dan status kamar Anda.</p>
        </div>

        <div className="bg-surface-card rounded-2xl p-xl shadow-xl border border-border-default">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error-50 text-error-700 p-md rounded-xl text-sm border border-error-100 animate-in shake duration-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="input-label" htmlFor="email">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  id="email"
                  type="email" 
                  placeholder="name@email.com" 
                  className="input-field pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="input-label" htmlFor="password">Password</label>
                <Link to="/resident/forgot-password" className="text-sm font-medium text-brand-primary hover:underline">Lupa password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="input-field pl-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full h-12 text-base font-bold"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk Sekarang"}
              {!isLoading && <ArrowRight size={18} className="ml-2" />}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-text-secondary text-sm">
            Bukan penghuni? <Link to="/login" className="text-brand-primary font-bold hover:underline">Masuk sebagai Owner</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
