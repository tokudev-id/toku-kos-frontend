import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { expenseService } from '@/api/expense.service';
import type { Expense, CreateExpenseDto, ExpenseCategory } from '@/api/expense.service';
import { propertyService } from '@/api/property.service';
import type { Property } from '@/api/property.service';

const CATEGORIES: ExpenseCategory[] = ['Listrik', 'Air', 'Internet', 'Perawatan', 'Kebersihan', 'Lainnya'];

const CATEGORY_CLASSES: Record<ExpenseCategory, string> = {
  Listrik: 'bg-yellow-100 text-yellow-700',
  Air: 'bg-blue-100 text-blue-700',
  Internet: 'bg-purple-100 text-purple-700',
  Perawatan: 'bg-orange-100 text-orange-700',
  Kebersihan: 'bg-green-100 text-green-700',
  Lainnya: 'bg-slate-100 text-slate-600',
};

function formatCurrency(amount: number) {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function Pengeluaran() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | ''>('');
  const [form, setForm] = useState<CreateExpenseDto>({
    title: '',
    category: 'Lainnya',
    amount: 0,
    expense_date: new Date().toISOString().split('T')[0],
    property_id: '',
    description: '',
  });

  useEffect(() => {
    fetchExpenses();
    fetchProperties();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await expenseService.getExpenses();
      setExpenses(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await propertyService.getProperties(1, 100);
      setProperties(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await expenseService.createExpense({ ...form, property_id: form.property_id || undefined });
      setShowModal(false);
      resetForm();
      fetchExpenses();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pengeluaran ini?')) return;
    try {
      await expenseService.deleteExpense(id);
      fetchExpenses();
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      category: 'Lainnya',
      amount: 0,
      expense_date: new Date().toISOString().split('T')[0],
      property_id: '',
      description: '',
    });
  };

  const filtered = expenses.filter((exp) => {
    const matchCategory = !filterCategory || exp.category === filterCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || exp.title.toLowerCase().includes(q) || exp.property?.name?.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const totalThisMonth = expenses
    .filter((e) => {
      const d = new Date(e.expense_date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Pengeluaran</h2>
          <p className="text-text-secondary">Catat dan pantau pengeluaran operasional kos.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Tambah Pengeluaran
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <div className="card p-md border-l-4 border-l-danger">
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Total Bulan Ini</p>
          <p className="text-xl font-bold mt-1">{formatCurrency(totalThisMonth)}</p>
        </div>
        <div className="card p-md border-l-4 border-l-warning">
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Total Pengeluaran</p>
          <p className="text-xl font-bold mt-1">{expenses.length} transaksi</p>
        </div>
        <div className="card p-md border-l-4 border-l-brand-primary">
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider">Semua Properti</p>
          <p className="text-xl font-bold mt-1">{properties.length} properti</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-md flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Cari judul atau properti..."
            className="input-field pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="input-field h-11 pr-8 appearance-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ExpenseCategory | '')}
          >
            <option value="">Semua Kategori</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="p-md border-b border-border-default flex items-center justify-between">
          <h3 className="font-bold">Daftar Pengeluaran</h3>
          <span className="text-sm text-text-secondary">{filtered.length} item</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-bg border-b border-border-default">
              <tr>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Judul</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Properti</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Kategori</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Jumlah</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Tanggal</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i}><td colSpan={6} className="px-md py-4"><div className="h-4 bg-slate-100 animate-pulse rounded" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-md py-8 text-center text-text-secondary">Belum ada pengeluaran.</td></tr>
              ) : (
                filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-md py-4">
                      <div>
                        <p className="font-semibold text-sm">{exp.title}</p>
                        {exp.description && <p className="text-xs text-text-secondary mt-0.5">{exp.description}</p>}
                      </div>
                    </td>
                    <td className="px-md py-4 text-sm text-text-secondary">{exp.property?.name ?? 'Umum'}</td>
                    <td className="px-md py-4">
                      <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold', CATEGORY_CLASSES[exp.category])}>
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-md py-4 font-bold text-sm">{formatCurrency(exp.amount)}</td>
                    <td className="px-md py-4 text-sm text-text-secondary">{new Date(exp.expense_date).toLocaleDateString('id-ID')}</td>
                    <td className="px-md py-4 text-right">
                      <button onClick={() => handleDelete(exp.id)} className="text-danger hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
            <div className="p-lg border-b border-border-default flex items-center justify-between">
              <h3 className="font-bold text-lg">Tambah Pengeluaran</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-text-secondary">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-lg space-y-md">
              <div>
                <label className="label-field">Judul</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="cth. Tagihan Listrik April"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="label-field">Kategori</label>
                  <select
                    className="input-field"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-field">Properti (opsional)</label>
                  <select
                    className="input-field"
                    value={form.property_id ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, property_id: e.target.value }))}
                  >
                    <option value="">Semua / Umum</option>
                    {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="label-field">Jumlah (Rp)</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                    min={1}
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="label-field">Tanggal</label>
                  <input
                    type="date"
                    className="input-field"
                    required
                    value={form.expense_date}
                    onChange={(e) => setForm((f) => ({ ...f, expense_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="label-field">Deskripsi (opsional)</label>
                <textarea
                  className="input-field h-20 resize-none"
                  placeholder="Keterangan tambahan"
                  value={form.description ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Batal</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
