import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building2, ArrowRight, LoaderCircle, Phone } from 'lucide-react';
import { authService } from '../../api/auth.service';
import { useAuthStore } from '../../store/useAuthStore';

type RegisterForm = {
  full_name: string;
  email: string;
  company_name: string;
  phone_number: string;
  password: string;
};

type FieldErrors = Partial<Record<keyof RegisterForm, string>>;

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    full_name: '',
    email: '',
    company_name: '',
    phone_number: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const updateField = (key: keyof RegisterForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const getFieldError = (message: string): FieldErrors => {
    const next: FieldErrors = {};
    const normalized = message.toLowerCase();

    if (normalized.includes('full_name')) {
      next.full_name = message;
    }
    if (normalized.includes('email')) {
      next.email = message;
    }
    if (normalized.includes('company_name')) {
      next.company_name = message;
    }
    if (normalized.includes('phone_number')) {
      next.phone_number = message;
    }
    if (normalized.includes('password')) {
      next.password = message;
    }

    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const payload = {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        ...(form.phone_number.trim() ? { phone_number: form.phone_number.trim() } : {}),
        ...(form.company_name.trim() ? { company_name: form.company_name.trim() } : {}),
      };

      const response = await authService.register(payload);
      setAuth(response.owner, response.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.message || 'Pendaftaran gagal. Silakan cek kembali data Anda.';
      const nextFieldErrors = getFieldError(message);
      setFieldErrors(nextFieldErrors);

      if (Object.keys(nextFieldErrors).length === 0) {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
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
            {error && (
              <div className="bg-error-50 text-error-700 p-md rounded-xl text-sm border border-error-100">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="input-label" htmlFor="full_name">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input 
                  id="full_name"
                  type="text" 
                  placeholder="Misal: Budi Budiman" 
                  className="input-field pl-10"
                  value={form.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  required
                />
              </div>
              {fieldErrors.full_name && <p className="text-sm text-error-700">{fieldErrors.full_name}</p>}
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
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  required
                />
              </div>
              {fieldErrors.email && <p className="text-sm text-error-700">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="input-label" htmlFor="company_name">Nama Usaha / Kosan</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input 
                  id="company_name"
                  type="text" 
                  placeholder="Misal: Kosan Asri" 
                  className="input-field pl-10"
                  value={form.company_name}
                  onChange={(e) => updateField('company_name', e.target.value)}
                />
              </div>
              {fieldErrors.company_name && <p className="text-sm text-error-700">{fieldErrors.company_name}</p>}
            </div>

            <div className="space-y-2">
              <label className="input-label" htmlFor="phone_number">Nomor Telepon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input
                  id="phone_number"
                  type="tel"
                  placeholder="0812xxxxxxx"
                  className="input-field pl-10"
                  value={form.phone_number}
                  onChange={(e) => updateField('phone_number', e.target.value)}
                />
              </div>
              {fieldErrors.phone_number && <p className="text-sm text-error-700">{fieldErrors.phone_number}</p>}
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
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {fieldErrors.password && <p className="text-sm text-error-700">{fieldErrors.password}</p>}
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full justify-center h-11 mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRight size={18} />
                </>
              )}
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
