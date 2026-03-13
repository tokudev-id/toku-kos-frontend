import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { cn } from '@/utils/cn';
import { inventoryService } from '@/api/inventory.service';
import type { InventoryTemplate, CreateInventoryTemplateDto, ItemCondition } from '@/api/inventory.service';

const CONDITIONS: ItemCondition[] = ['baik', 'rusak ringan', 'rusak berat', 'hilang'];

const CONDITION_CLASSES: Record<ItemCondition, string> = {
  baik: 'bg-success/10 text-success',
  'rusak ringan': 'bg-warning/10 text-warning',
  'rusak berat': 'bg-orange-100 text-orange-700',
  hilang: 'bg-danger/10 text-danger',
};

export default function Inventaris() {
  const [templates, setTemplates] = useState<InventoryTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateInventoryTemplateDto>({
    name: '',
    qty: 1,
    condition: 'baik',
    purchase_price: undefined,
    notes: '',
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const data = await inventoryService.getTemplates();
      setTemplates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await inventoryService.updateTemplate(editingId, form);
      } else {
        await inventoryService.createTemplate(form);
      }
      setShowModal(false);
      resetForm();
      fetchTemplates();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (t: InventoryTemplate) => {
    setEditingId(t.id);
    setForm({ name: t.name, qty: t.qty, condition: t.condition, purchase_price: t.purchase_price, notes: t.notes });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus item inventaris ini?')) return;
    try {
      await inventoryService.deleteTemplate(id);
      fetchTemplates();
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', qty: 1, condition: 'baik', purchase_price: undefined, notes: '' });
  };

  return (
    <div className="space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Inventaris</h2>
          <p className="text-text-secondary">Kelola daftar perabot dan fasilitas kamar kos.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Tambah Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
        {CONDITIONS.map((cond) => {
          const count = templates.filter((t) => t.condition === cond).length;
          return (
            <div key={cond} className={cn('card p-md', CONDITION_CLASSES[cond].replace('text-', 'border-l-4 border-l-').split(' ')[0])}>
              <p className="text-xs text-text-secondary uppercase font-bold tracking-wider capitalize">{cond}</p>
              <p className="text-xl font-bold mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Grid of Items */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {[1, 2, 3].map((i) => <div key={i} className="card h-40 animate-pulse bg-slate-50" />)}
        </div>
      ) : templates.length === 0 ? (
        <div className="card p-xl flex flex-col items-center text-center text-text-secondary gap-3">
          <Package size={48} className="opacity-30" />
          <p className="font-medium">Belum ada item inventaris.</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>Tambah Item Pertama</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {templates.map((t) => (
            <div key={t.id} className="card p-md flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-sm text-text-secondary">Qty: {t.qty}</p>
                </div>
                <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold capitalize', CONDITION_CLASSES[t.condition])}>
                  {t.condition}
                </span>
              </div>
              {t.purchase_price && (
                <p className="text-sm text-text-secondary">Harga Beli: Rp {t.purchase_price.toLocaleString('id-ID')}</p>
              )}
              {t.notes && <p className="text-xs text-text-secondary italic">{t.notes}</p>}
              <div className="flex gap-2 pt-1 justify-end">
                <button onClick={() => handleEdit(t)} className="btn-secondary text-xs px-3 py-1 gap-1">
                  <Pencil size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-danger hover:text-red-700 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
            <div className="p-lg border-b border-border-default flex items-center justify-between">
              <h3 className="font-bold text-lg">{editingId ? 'Edit Item' : 'Tambah Item Inventaris'}</h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-text-secondary">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-lg space-y-md">
              <div>
                <label className="label-field">Nama Item</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="cth. Kasur Single, Lemari 2 Pintu"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="label-field">Jumlah</label>
                  <input
                    type="number"
                    className="input-field"
                    min={1}
                    value={form.qty ?? 1}
                    onChange={(e) => setForm((f) => ({ ...f, qty: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="label-field">Kondisi</label>
                  <select
                    className="input-field"
                    value={form.condition ?? 'baik'}
                    onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value as ItemCondition }))}
                  >
                    {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label-field">Harga Beli (opsional)</label>
                <input
                  type="number"
                  className="input-field"
                  min={0}
                  placeholder="Rp 0"
                  value={form.purchase_price ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, purchase_price: e.target.value ? Number(e.target.value) : undefined }))}
                />
              </div>
              <div>
                <label className="label-field">Catatan (opsional)</label>
                <textarea
                  className="input-field h-20 resize-none"
                  placeholder="Keterangan tambahan"
                  value={form.notes ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Batal</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
