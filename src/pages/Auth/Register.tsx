import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building2, ArrowRight } from 'lucide-react';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate register
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg p-md">
      <div className="w-full max-w-[480px]">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8 text-center px-4">
          <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-brand-primary/20">
            T
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Mulai kelola kos Anda lebih rapi</h1>
          <p className="text-text-secondary mt-1">Daftar TokuKos sekarang, gratis versi trial 14 hari.</p>
        </div>

        {/* Card */}
        <div className="card shadow-xl p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="input-label" htmlFor="fullName">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input 
                  id="fullName"
                  type="text" 
                  placeholder="Misal: Budi Budiman" 
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="input-label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input 
                  id="email"
                  type="email" 
                  placeholder="budi@example.com" 
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="input-label" htmlFor="company">Nama Usaha / Kosan</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input 
                  id="company"
                  type="text" 
                  placeholder="Misal: Kosan Asri" 
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="input-label" htmlFor="password">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input 
                  id="password"
                  type="password" 
                  placeholder="Minimal 8 karakter" 
                  className="input-field pl-10"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full justify-center h-11 mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Daftar Sekarang"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-center mt-8 text-text-secondary">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-brand-primary hover:underline font-bold">
              Masuk di sini
            </Link>
          </p>
        </div>
        
        <p className="text-center mt-6 text-xs text-text-secondary max-w-[400px] mx-auto">
          Dengan mendaftar, Anda menyetujui Ketentuan Layanan dan Kebijakan Privasi TokuKos.
        </p>
      </div>
    </div>
  );
}
