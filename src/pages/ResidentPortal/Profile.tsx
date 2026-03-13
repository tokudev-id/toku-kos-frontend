import { useState, useEffect } from 'react';
import { Phone, Mail, Calendar, AlertCircle } from 'lucide-react';
import api from '@/api/axios';
import { useAuthStore } from '@/store/useAuthStore';

interface ResidentProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  identity_card_url?: string;
  emergency_contact?: string;
  check_in_date?: string;
  notes?: string;
  status: string;
}

export default function ResidentProfile() {
  const [profile, setProfile] = useState<ResidentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get<ResidentProfile>('/residents/me');
      setProfile(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-100 animate-pulse rounded" />
        <div className="bg-surface-card border border-border-default rounded-2xl h-64 animate-pulse bg-slate-50" />
      </div>
    );
  }

  const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) => (
    value ? (
      <div className="flex items-start gap-3">
        <div className="p-2 bg-brand-primary-soft text-brand-primary rounded-lg shrink-0 mt-0.5">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-xs text-text-secondary font-medium uppercase tracking-wider">{label}</p>
          <p className="font-semibold mt-0.5">{value}</p>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profil Saya</h2>
        <p className="text-text-secondary">Informasi data diri dan hunian Anda.</p>
      </div>

      {/* Avatar & Name */}
      <div className="bg-brand-primary text-white rounded-2xl p-lg shadow-lg shadow-brand-primary/20 flex items-center gap-4">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
          {(profile?.full_name ?? user?.full_name ?? 'R').charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-xl font-bold">{profile?.full_name ?? user?.full_name}</h3>
          <p className="text-white/80 text-sm">{profile?.email ?? user?.email}</p>
          <span className={`mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${profile?.status === 'ACTIVE' ? 'bg-white/20' : 'bg-red-400/30'}`}>
            {profile?.status === 'ACTIVE' ? 'Aktif' : 'Sudah Check-out'}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="bg-surface-card border border-border-default rounded-2xl p-lg space-y-5">
        <h3 className="font-bold text-lg">Data Pribadi</h3>
        <InfoRow icon={Mail} label="Email" value={profile?.email} />
        <InfoRow icon={Phone} label="Nomor HP" value={profile?.phone_number} />
        <InfoRow icon={AlertCircle} label="Kontak Darurat" value={profile?.emergency_contact} />
        <InfoRow icon={Calendar} label="Tanggal Check-in" value={profile?.check_in_date ? new Date(profile.check_in_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : null} />
        {profile?.notes && (
          <div className="bg-surface-bg rounded-xl p-md">
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">Catatan dari Pengelola</p>
            <p className="text-sm">{profile.notes}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-text-secondary text-center">
        Untuk mengubah data, silakan hubungi pengelola kos.
      </p>
    </div>
  );
}
