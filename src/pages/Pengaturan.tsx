import { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import { settingsService } from '@/api/settings.service';
import type { OwnerSettings } from '@/api/settings.service';

export default function Pengaturan() {
  const [settings, setSettings] = useState<OwnerSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getSettings();
      setSettings(data ?? {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof OwnerSettings, value: string | number) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-lg">
        <div className="h-8 w-48 bg-slate-100 animate-pulse rounded" />
        <div className="card h-64 animate-pulse bg-slate-50" />
      </div>
    );
  }

  return (
    <div className="space-y-lg mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-primary-soft text-brand-primary rounded-lg">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Pengaturan</h2>
          <p className="text-text-secondary">Atur profil bisnis dan aturan penagihan kos Anda.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-lg">
        {/* Business Profile */}
        <div className="card p-lg space-y-md">
          <h3 className="font-bold text-lg border-b border-border-default pb-3">Profil Bisnis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="label-field">Nama Brand / Kos</label>
              <input
                type="text"
                className="input-field"
                placeholder="cth. Kosan Makmur"
                value={settings.brand_name ?? ''}
                onChange={(e) => update('brand_name', e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Email Kontak</label>
              <input
                type="email"
                className="input-field"
                placeholder="email@example.com"
                value={settings.contact_email ?? ''}
                onChange={(e) => update('contact_email', e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Nomor WhatsApp</label>
              <input
                type="text"
                className="input-field"
                placeholder="62812xxxx"
                value={settings.whatsapp_number ?? ''}
                onChange={(e) => update('whatsapp_number', e.target.value)}
              />
            </div>
            <div>
              <label className="label-field">Rekening Bank</label>
              <input
                type="text"
                className="input-field"
                placeholder="BCA 1234567890 a.n. Budi"
                value={settings.bank_account ?? ''}
                onChange={(e) => update('bank_account', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Billing Rules */}
        <div className="card p-lg space-y-md">
          <h3 className="font-bold text-lg border-b border-border-default pb-3">Aturan Penagihan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label className="label-field">Tanggal Tagihan Setiap Bulan</label>
              <input
                type="number"
                className="input-field"
                min={1}
                max={28}
                placeholder="1-28"
                value={settings.billing_date ?? ''}
                onChange={(e) => update('billing_date', Number(e.target.value))}
              />
              <p className="text-xs text-text-secondary mt-1">Tanggal 1–28, tagihan otomatis dibuat tiap bulan.</p>
            </div>
            <div>
              <label className="label-field">Jenis Denda Keterlambatan</label>
              <select
                className="input-field"
                value={settings.penalty_type ?? 'flat'}
                onChange={(e) => update('penalty_type', e.target.value)}
              >
                <option value="flat">Flat (Rp per hari)</option>
                <option value="percentage">Persentase (% per hari)</option>
              </select>
            </div>
            <div>
              <label className="label-field">
                {settings.penalty_type === 'percentage' ? 'Denda per Hari (%)' : 'Denda per Hari (Rp)'}
              </label>
              <input
                type="number"
                className="input-field"
                min={0}
                value={settings.penalty_per_day ?? ''}
                onChange={(e) => update('penalty_per_day', Number(e.target.value))}
                placeholder={settings.penalty_type === 'percentage' ? 'cth. 1' : 'cth. 5000'}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>
            <Save size={18} />
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
          {saved && <p className="text-success text-sm font-medium">Pengaturan berhasil disimpan!</p>}
        </div>
      </form>
    </div>
  );
}
