import { useEffect, useState, useRef } from 'react';
import { Plus, Building2, MapPin, ChevronRight, Search, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { propertyService } from '@/api/property.service';
import type { Property } from '@/api/property.service';
import { AddPropertyModal } from '@/components/AddPropertyModal';
import { Modal } from '@/components/Modal';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editForm, setEditForm] = useState({ name: '', address: '', city: '', province: '', description: '' });
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Open menu per card
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await propertyService.getProperties();
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEdit = (e: React.MouseEvent, property: Property) => {
    e.preventDefault(); e.stopPropagation();
    setEditForm({ name: property.name, address: property.address, city: property.city || '', province: property.province || '', description: property.description || '' });
    setEditingProperty(property);
    setOpenMenuId(null);
  };

  const openDelete = (e: React.MouseEvent, property: Property) => {
    e.preventDefault(); e.stopPropagation();
    setDeletingProperty(property);
    setOpenMenuId(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    setSaving(true);
    try {
      await propertyService.updateProperty(editingProperty.id, editForm);
      setEditingProperty(null);
      fetchProperties();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deletingProperty) return;
    setDeleting(true);
    try {
      await propertyService.deleteProperty(deletingProperty.id);
      setDeletingProperty(null);
      fetchProperties();
    } catch (err) { console.error(err); }
    finally { setDeleting(false); }
  };

  const filteredProperties = properties.filter((p: Property) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Daftar Properti</h2>
          <p className="text-text-secondary">Kelola kos dan aset properti Anda.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus size={20} />
          Tambah Properti
        </button>
      </div>

      {/* Filter & Search */}
      <div className="card p-md flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Cari nama atau alamat properti..." 
            className="input-field pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {[1, 2, 3].map(i => (
            <div key={i} className="card h-48 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filteredProperties.map((property) => (
            <div key={property.id} className="card group hover:border-brand-primary transition-all flex flex-col justify-between relative">
              {/* Action menu button */}
              <div className="absolute top-3 right-3 z-10" ref={openMenuId === property.id ? menuRef : null}>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenuId(openMenuId === property.id ? null : property.id); }}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-slate-100 transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                {openMenuId === property.id && (
                  <div className="absolute right-0 top-8 w-36 bg-white border border-border-default rounded-xl shadow-lg py-1 z-20">
                    <button onClick={(e) => openEdit(e, property)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-left">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={(e) => openDelete(e, property)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-danger text-left">
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                )}
              </div>

              {/* Main card content — navigates to detail */}
              <Link to={`/properties/${property.id}`} className="flex flex-col flex-1 min-h-0">
                <div>
                  <div className="flex items-start justify-between mb-4 pr-8">
                    <div className="p-3 bg-brand-primary-soft text-brand-primary rounded-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      <Building2 size={24} />
                    </div>
                    <div className="bg-success/10 text-success text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      Aktif
                    </div>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-brand-primary transition-colors">{property.name}</h3>
                  <div className="flex items-center gap-2 text-text-secondary text-sm mt-1">
                    <MapPin size={14} />
                    <span className="line-clamp-1">{property.address}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-default flex items-center justify-between">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">Kamar</p>
                      <p className="text-sm font-bold">{property.total_rooms || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">Tersedia</p>
                      <p className="text-sm font-bold text-success">{property.available_rooms || 0}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-text-secondary group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="card py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-surface-bg rounded-full flex items-center justify-center text-text-secondary">
            <Building2 size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Belum Ada Properti</h3>
            <p className="text-text-secondary max-w-xs">Anda belum menambahkan kos atau properti apa pun. Mulai kelola kos pertama Anda sekarang.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={20} />
            Tambah Properti Pertama
          </button>
        </div>
      )}

      <AddPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProperties}
      />

      {/* Edit Property Modal */}
      <Modal
        isOpen={!!editingProperty}
        onClose={() => setEditingProperty(null)}
        title="Edit Properti"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUpdate} className="p-2 space-y-4">
          <div>
            <label className="label-field">Nama Properti *</label>
            <input required className="input-field" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="label-field">Alamat *</label>
            <input required className="input-field" value={editForm.address} onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Kota</label>
              <input className="input-field" value={editForm.city} onChange={e => setEditForm(f => ({ ...f, city: e.target.value }))} />
            </div>
            <div>
              <label className="label-field">Provinsi</label>
              <input className="input-field" value={editForm.province} onChange={e => setEditForm(f => ({ ...f, province: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label-field">Deskripsi</label>
            <textarea rows={2} className="input-field" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setEditingProperty(null)} className="btn-secondary flex-1 justify-center">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingProperty}
        onClose={() => setDeletingProperty(null)}
        title="Hapus Properti?"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger/10 text-danger rounded-full flex items-center justify-center"><Trash2 size={18} /></div>
          </div>
          <p className="text-text-secondary text-sm">
            Properti <strong>{deletingProperty?.name}</strong> akan dihapus permanen beserta semua data kamarnya. Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setDeletingProperty(null)} className="btn-secondary flex-1 justify-center">Batal</button>
            <button onClick={handleDelete} disabled={deleting} className="btn-primary bg-danger hover:bg-danger/90 border-danger flex-1 justify-center">
              {deleting ? 'Menghapus...' : 'Ya, Hapus Properti'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
