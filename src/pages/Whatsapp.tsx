import { useState, useEffect } from 'react';
import {
  MessageSquare, Send, Search, CheckCircle2, XCircle, AlertCircle,
  CheckSquare, Square, Users, Wifi, WifiOff,
} from 'lucide-react';
import { whatsappService } from '@/api/whatsapp.service';
import type { BlastResult, WaStatus } from '@/api/whatsapp.service';
import { residentService } from '@/api/resident.service';
import type { Resident } from '@/api/resident.service';

export default function Whatsapp() {
  const [status, setStatus] = useState<WaStatus | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<BlastResult[] | null>(null);
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statusData, residentsData] = await Promise.all([
        whatsappService.getStatus(),
        residentService.getResidents(1, 200),
      ]);
      setStatus(statusData);
      setResidents(residentsData.data);
    } catch (e) {
      console.error(e);
    }
  };

  const residentsWithPhone = residents.filter(r => r.phone && r.status !== 'CHECKOUT');
  const filtered = residentsWithPhone.filter(r =>
    r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.phone || '').includes(searchQuery)
  );

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(r => r.id)));
    }
  };

  const handleSend = async () => {
    if (!message.trim() || selected.size === 0) return;
    setSending(true);
    setResults(null);
    try {
      const recipients = residents
        .filter(r => selected.has(r.id) && r.phone)
        .map(r => ({ phone: r.phone!, name: r.full_name }));

      const res = await whatsappService.blast(recipients, message);
      setSentCount(res.sent);
      setFailedCount(res.failed);
      setResults(res.results);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const selectedResidents = residents.filter(r => selected.has(r.id));

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">WhatsApp Manager</h2>
        <p className="text-text-secondary">Kirim pesan blast ke penghuni melalui WhatsApp.</p>
      </div>

      {/* Status Card */}
      <div className={`card p-md flex items-center gap-4 border-l-4 ${status?.configured ? 'border-l-success' : 'border-l-warning'}`}>
        <div className={`p-3 rounded-xl ${status?.configured ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
          {status?.configured ? <Wifi size={22} /> : <WifiOff size={22} />}
        </div>
        <div>
          <p className="font-bold">{status?.configured ? 'Terhubung' : 'Belum Dikonfigurasi'}</p>
          <p className="text-sm text-text-secondary">{status?.message || 'Memuat status...'}</p>
        </div>
        {!status?.configured && (
          <div className="ml-auto text-xs text-text-secondary bg-slate-50 border border-border-default px-3 py-2 rounded-lg font-mono">
            Set WHATSAPP_ACCESS_TOKEN & WHATSAPP_PHONE_NUMBER_ID in .env
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-lg">
        {/* Recipient Selector */}
        <div className="lg:col-span-3 card overflow-hidden">
          <div className="p-md border-b border-border-default">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold flex items-center gap-2"><Users size={16} /> Pilih Penerima</h3>
              <span className="text-sm text-text-secondary">{selected.size} dipilih dari {residentsWithPhone.length}</span>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={15} />
                <input
                  type="text"
                  placeholder="Cari penghuni..."
                  className="input-field pl-9 h-9 text-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button onClick={selectAll} className="btn-secondary text-sm px-3 py-1.5 h-9 whitespace-nowrap">
                {selected.size === filtered.length && filtered.length > 0 ? 'Batal Semua' : 'Pilih Semua'}
              </button>
            </div>
          </div>

          <div className="divide-y divide-border-default max-h-[400px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-text-secondary italic text-sm">
                Tidak ada penghuni aktif dengan nomor telepon.
              </div>
            ) : filtered.map(resident => (
              <label key={resident.id} className="flex items-center gap-3 px-md py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                <button
                  onClick={() => toggleSelect(resident.id)}
                  className={`shrink-0 text-brand-primary transition-colors ${!selected.has(resident.id) && 'text-slate-300'}`}
                >
                  {selected.has(resident.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                </button>
                <div className="w-8 h-8 rounded-full bg-brand-primary-soft text-brand-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {resident.full_name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{resident.full_name}</p>
                  <p className="text-xs text-text-secondary">{resident.phone}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Message Compose */}
        <div className="lg:col-span-2 flex flex-col gap-md">
          <div className="card p-md flex-1 flex flex-col">
            <h3 className="font-bold flex items-center gap-2 mb-4"><MessageSquare size={16} /> Tulis Pesan</h3>
            <textarea
              className="input-field flex-1 resize-none min-h-[200px] text-sm"
              placeholder="Tulis pesan blast di sini...&#10;&#10;Contoh:&#10;Halo {nama},&#10;Tagihan sewa bulan ini sudah jatuh tempo. Mohon segera melakukan pembayaran."
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <div className="mt-3 flex items-center justify-between text-sm text-text-secondary">
              <span>{message.length} karakter</span>
              <span>{selected.size} penerima</span>
            </div>
          </div>

          {/* Preview */}
          {selected.size > 0 && (
            <div className="card p-md">
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-2">Preview Penerima</p>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {selectedResidents.slice(0, 5).map(r => (
                  <p key={r.id} className="text-sm">• {r.full_name} ({r.phone})</p>
                ))}
                {selected.size > 5 && <p className="text-sm text-text-secondary">... dan {selected.size - 5} lainnya</p>}
              </div>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={sending || selected.size === 0 || !message.trim() || !status?.configured}
            className="btn-primary w-full justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <><span className="animate-spin mr-2">⏳</span> Mengirim...</>
            ) : (
              <><Send size={18} /> Kirim ke {selected.size} Penerima</>
            )}
          </button>

          {!status?.configured && (
            <p className="text-xs text-center text-warning flex items-center justify-center gap-1">
              <AlertCircle size={13} /> WhatsApp belum dikonfigurasi
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="card overflow-hidden">
          <div className="p-md border-b border-border-default flex items-center justify-between">
            <h3 className="font-bold">Hasil Pengiriman</h3>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1 text-success"><CheckCircle2 size={15} /> {sentCount} berhasil</span>
              <span className="flex items-center gap-1 text-danger"><XCircle size={15} /> {failedCount} gagal</span>
            </div>
          </div>
          <div className="divide-y divide-border-default max-h-64 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between px-md py-3">
                <span className="text-sm font-medium">{r.phone}</span>
                {r.success ? (
                  <span className="text-success flex items-center gap-1 text-sm"><CheckCircle2 size={14} /> Terkirim</span>
                ) : (
                  <span className="text-danger flex items-center gap-1 text-sm"><XCircle size={14} /> {r.error || 'Gagal'}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
