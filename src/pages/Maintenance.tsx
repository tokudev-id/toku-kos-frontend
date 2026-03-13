import { useState, useEffect } from 'react';
import { 
  Wrench, 
  Search, 
  Clock, 
  AlertTriangle,
  MessageSquare,
  MoreVertical,
  MapPin,
  User
} from 'lucide-react';
import { cn } from '@/utils/cn';

export default function Maintenance() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');

  useEffect(() => {
    // Mocking owner view tickets
    setTickets([
      {
        id: '1',
        title: 'AC Tidak Dingin',
        resident: 'Budi Santoso',
        room: 'A-101',
        property: 'Kosan Asri',
        status: 'OPEN',
        priority: 'HIGH',
        date: '12 Mar 10:30',
        description: 'Sudah 2 hari AC di kamar A-101 hanya keluar angin saja.'
      },
      {
        id: '2',
        title: 'Lampu Teras Mati',
        resident: 'Siti Aminah',
        room: 'B-202',
        property: 'Kosan Asri',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        date: '11 Mar 09:15',
        description: 'Lampu lorong lantai 2 mati, gelap kalau malam.'
      },
      {
        id: '3',
        title: 'Kran Bocor',
        resident: 'Andi Wijaya',
        room: 'C-303',
        property: 'Kosan Indah',
        status: 'RESOLVED',
        priority: 'LOW',
        date: '10 Mar 14:00',
        description: 'Kran di kamar mandi menetes terus.'
      }
    ]);
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-error-50 text-error-700 border-error-100';
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'RESOLVED': return 'bg-success-50 text-success-700 border-success-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT': return <AlertTriangle className="text-error-600" size={14} />;
      case 'HIGH': return <AlertTriangle className="text-amber-600" size={14} />;
      default: return <Clock className="text-slate-400" size={14} />;
    }
  };

  return (
    <div className="space-y-lg animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Perbaikan & Keluhan</h1>
          <p className="text-text-secondary">Kelola tiket perbaikan dari para penghuni.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-lg">
        <div className="bg-surface-card p-lg rounded-2xl border border-border-default shadow-sm border-l-4 border-l-error-500">
          <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">Tiket Baru</p>
          <h3 className="text-3xl font-bold mt-1">5</h3>
        </div>
        <div className="bg-surface-card p-lg rounded-2xl border border-border-default shadow-sm border-l-4 border-l-amber-500">
          <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">Sedang Diproses</p>
          <h3 className="text-3xl font-bold mt-1">2</h3>
        </div>
        <div className="bg-surface-card p-lg rounded-2xl border border-border-default shadow-sm border-l-4 border-l-success-500">
          <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">Selesai (Bulan Ini)</p>
          <h3 className="text-3xl font-bold mt-1">12</h3>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="bg-surface-card rounded-2xl border border-border-default overflow-hidden">
        <div className="px-lg py-md border-b border-border-default flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-1 bg-surface-bg p-1 rounded-xl w-fit">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  activeTab === tab 
                    ? "bg-surface-card text-brand-primary shadow-sm" 
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {tab === 'ALL' ? 'Semua' : tab === 'OPEN' ? 'Terbuka' : tab === 'IN_PROGRESS' ? 'Proses' : 'Selesai'}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input 
              type="text" 
              placeholder="Cari tiket..." 
              className="bg-surface-bg border border-border-default rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all w-full md:w-64"
            />
          </div>
        </div>

        <div className="divide-y divide-border-default">
          {tickets.filter(t => activeTab === 'ALL' || t.status === activeTab).map((ticket) => (
            <div key={ticket.id} className="p-lg hover:bg-surface-bg transition-colors group cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center border",
                    ticket.status === 'OPEN' ? "bg-error-50 text-error-600 border-error-100" : 
                    ticket.status === 'IN_PROGRESS' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                    "bg-success-50 text-success-600 border-success-100"
                  )}>
                    <Wrench size={20} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-lg group-hover:text-brand-primary transition-colors">{ticket.title}</h4>
                      <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1", getStatusStyle(ticket.status))}>
                        {ticket.status.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary">
                      <div className="flex items-center gap-1.5 font-medium text-text-primary">
                        <User size={14} className="text-text-secondary" /> {ticket.resident}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} /> {ticket.property} • {ticket.room}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {getPriorityIcon(ticket.priority)} <span className="uppercase font-bold text-[10px] tracking-wider">{ticket.priority}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-text-secondary font-medium">{ticket.date}</span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-surface-card rounded-lg transition-colors text-text-secondary hover:text-brand-primary">
                      <MessageSquare size={18} />
                    </button>
                    <button className="p-2 hover:bg-surface-card rounded-lg transition-colors text-text-secondary">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
