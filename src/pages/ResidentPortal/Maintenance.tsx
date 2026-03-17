import { useState, useEffect } from 'react';
import { Plus, Wrench, Clock, AlertCircle, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function ResidentMaintenance() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  useEffect(() => {
    setTimeout(() => {
      setTickets([
        { 
          id: '1', 
          title: 'AC Tidak Dingin', 
          status: 'OPEN', 
          priority: 'HIGH', 
          date: '12 Mar 2024',
          description: 'Sudah 2 hari AC di kamar A-101 hanya keluar angin saja.'
        },
        { 
          id: '2', 
          title: 'Kran Bocor', 
          status: 'RESOLVED', 
          priority: 'MEDIUM', 
          date: '05 Mar 2024',
          description: 'Kran di kamar mandi menetes terus.'
        },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'RESOLVED': return 'bg-success-50 text-success-600 border-success-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-error-600';
      case 'HIGH': return 'text-amber-600';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Keluhan Sering</h2>
          <p className="text-text-secondary text-sm">Laporkan kendala di kamar Anda.</p>
        </div>
        <button 
          className="btn-primary w-12 h-12 rounded-2xl p-0 flex items-center justify-center shadow-lg shadow-brand-primary/20"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.length === 0 && !isLoading ? (
          <div className="text-center py-12 bg-surface-card rounded-2xl border-2 border-dashed border-border-default">
            <div className="w-16 h-16 bg-surface-bg rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary">
              <Wrench size={32} />
            </div>
            <p className="font-medium text-text-secondary">Belum ada laporan keluhan.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-surface-card border border-border-default rounded-2xl p-lg space-y-4 hover:border-brand-primary transition-colors group relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase", getStatusColor(ticket.status))}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={cn("text-[10px] font-bold uppercase", getPriorityColor(ticket.priority))}>
                      {ticket.priority} Priority
                    </span>
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-brand-primary transition-colors">{ticket.title}</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <Clock size={12} /> {ticket.date}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-text-secondary line-clamp-2">{ticket.description}</p>
              
              <div className="flex items-center justify-between pt-2 border-t border-border-default/50">
                <div className="flex items-center gap-2 text-text-secondary">
                  <ImageIcon size={14} />
                  <span className="text-xs font-medium">1 Foto Laporan</span>
                </div>
                <button className="text-brand-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Detail <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Float Support Note */}
      <div className="p-lg bg-brand-primary/5 rounded-2xl border border-brand-primary/10 flex gap-4 items-center">
        <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl">
          <AlertCircle size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-brand-primary">Butuh bantuan segera?</p>
          <p className="text-xs text-brand-primary/70">Hubungi pengelola kos via WhatsApp untuk keadaan darurat.</p>
        </div>
      </div>
    </div>
  );
}
