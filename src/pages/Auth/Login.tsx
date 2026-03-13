import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../api/auth.service';
import { useAuthStore } from '../../store/useAuthStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      setAuth(response.owner, response.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login gagal. Cek kembali email & password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg p-md">
      <div className="w-full max-w-[440px]">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-brand-primary/20">
            T
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Selamat datang kembali</h1>
          <p className="text-text-secondary mt-1">Masuk ke akun TokuKos Anda</p>
        </div>

        {/* Card */}
        <div className="card shadow-xl p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error-50 text-error-700 p-md rounded-xl text-sm border border-error-100">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="input-label" htmlFor="email">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input 
                  id="email"
                  type="email" 
                  placeholder="nama@email.com" 
                  className="input-field pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="input-label" htmlFor="password">Kata Sandi</label>
                <Link to="/forgot-password" title="Forgot Password" className="text-sm text-brand-primary hover:underline font-medium">
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="input-field pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full justify-center h-11"
              disabled={isLoading}
            >
              {isLoading ? "Masuk..." : "Masuk"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-center mt-8 text-text-secondary">
            Belum punya akun?{' '}
            <Link to="/register" className="text-brand-primary hover:underline font-bold">
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
