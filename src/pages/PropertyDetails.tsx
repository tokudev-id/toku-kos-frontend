import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Plus, 
  ChevronLeft, 
  LayoutGrid, 
  Users, 
  CircleDot,
  Type,
  Coins,
  Search,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { propertyService } from '@/api/property.service';
import type { Property } from '@/api/property.service';
import { roomService } from '@/api/room.service';
import type { Room } from '@/api/room.service';
import { cn } from '@/utils/cn';
import { AddRoomModal } from '@/components/AddRoomModal';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit property
  const [editingProperty, setEditingProperty] = useState(false);
  const [propForm, setPropForm] = useState({ name: '', address: '', city: '', province: '', description: '' });
  const [savingProp, setSavingProp] = useState(false);

  // Edit room
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState({ room_code: '', type: 'STANDARD' as Room['type'], price_per_month: 0, floor: '', size: '', deposit: 0, status: 'AVAILABLE' as Room['status'] });
  const [savingRoom, setSavingRoom] = useState(false);

  // Delete room
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
  const [deletingRoomId, setDeletingRoomId] = useState(false);

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  const fetchData = async (propertyId: string) => {
    try {
      const [propData, roomsData] = await Promise.all([
        propertyService.getProperty(propertyId),
        roomService.getRoomsByProperty(propertyId)
      ]);
      setProperty(propData);
      setRooms(roomsData.data);
    } catch (error) {
      console.error('Failed to fetch property details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditProperty = () => {
    if (!property) return;
    setPropForm({ name: property.name, address: property.address, city: property.city || '', province: property.province || '', description: property.description || '' });
    setEditingProperty(true);
  };

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setSavingProp(true);
    try {
      await propertyService.updateProperty(property.id, propForm);
      setEditingProperty(false);
      if (id) fetchData(id);
    } catch (err) { console.error(err); }
    finally { setSavingProp(false); }
  };

  const openEditRoom = (room: Room) => {
    setRoomForm({ room_code: room.room_code, type: room.type, price_per_month: room.price_per_month, floor: room.floor || '', size: room.size || '', deposit: room.deposit || 0, status: room.status });
    setEditingRoom(room);
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;
    setSavingRoom(true);
    try {
      await roomService.updateRoom(editingRoom.id, roomForm);
      setEditingRoom(null);
      if (id) fetchData(id);
    } catch (err) { console.error(err); }
    finally { setSavingRoom(false); }
  };

  const handleDeleteRoom = async () => {
    if (!deletingRoom) return;
    setDeletingRoomId(true);
    try {
      await roomService.deleteRoom(deletingRoom.id);
      setDeletingRoom(null);
      if (id) fetchData(id);
    } catch (err) { console.error(err); }
    finally { setDeletingRoomId(false); }
  };

  const filteredRooms = rooms.filter(r => 
    (r.room_code?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (r.type?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="p-xl animate-pulse text-text-secondary italic">Memuat Detail Properti...</div>;
  if (!property) return <div className="p-xl text-danger">Properti tidak ditemukan.</div>;

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link to="/properties" className="flex items-center gap-2 text-sm text-text-secondary hover:text-brand-primary transition-colors w-fit">
          <ChevronLeft size={16} />
          Kembali ke Daftar Properti
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{property.name}</h2>
            <p className="text-text-secondary">{property.address}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={openEditProperty} className="btn-secondary flex items-center gap-2"><Pencil size={16} /> Edit Info</button>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary">
              <Plus size={20} />
              Tambah Kamar
            </button>
          </div>
        </div>
      </div>

      {/* Property Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <div className="card p-md flex items-center gap-4">
          <div className="p-2 bg-brand-primary-soft text-brand-primary rounded-lg">
            <LayoutGrid size={20} />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">Total Kamar</p>
            <p className="text-lg font-bold">{rooms.length}</p>
          </div>
        </div>
        <div className="card p-md flex items-center gap-4">
          <div className="p-2 bg-success/10 text-success rounded-lg">
            <CircleDot size={20} />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">Tersedia</p>
            <p className="text-lg font-bold text-success">{rooms.filter(r => r.status === 'AVAILABLE').length}</p>
          </div>
        </div>
        <div className="card p-md flex items-center gap-4">
          <div className="p-2 bg-warning/10 text-warning rounded-lg">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase font-bold tracking-tighter">Terisi</p>
            <p className="text-lg font-bold text-warning">{rooms.filter(r => r.status === 'OCCUPIED').length}</p>
          </div>
        </div>
      </div>

      {/* Rooms List Section */}
      <div className="card overflow-hidden">
        <div className="p-md border-b border-border-default flex flex-col md:flex-row gap-4 justify-between items-center">
          <h3 className="font-bold text-lg">Daftar Kamar</h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input 
              type="text" 
              placeholder="Cari nomor kamar..." 
              className="input-field pl-9 py-1.5 h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-bg border-b border-border-default">
              <tr>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">No. Kamar</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Tipe</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Harga / Bulan</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Status</th>
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {filteredRooms.length > 0 ? filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-md py-4 font-bold text-text-primary">{room.room_code}</td>
                  <td className="px-md py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Type size={14} className="text-text-secondary" />
                      {room.type}
                    </div>
                  </td>
                  <td className="px-md py-4">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Coins size={14} className="text-text-secondary" />
                      Rp {room.price_per_month.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-md py-4 text-xs font-bold uppercase">
                    <span className={cn(
                      "px-2 py-1 rounded-full flex items-center gap-1 w-fit",
                      room.status === 'AVAILABLE' ? "bg-success/10 text-success" : 
                      room.status === 'OCCUPIED' ? "bg-warning/10 text-warning" : "bg-slate-100 text-text-secondary"
                    )}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {room.status === 'AVAILABLE' ? 'Tersedia' : 
                       room.status === 'OCCUPIED' ? 'Terisi' : 'Pemeliharaan'}
                    </span>
                  </td>
                  <td className="px-md py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditRoom(room)} className="p-1.5 text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft rounded-lg transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeletingRoom(room)} className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-md py-8 text-center text-text-secondary italic">Tidak ada kamar ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {id && (
        <AddRoomModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => fetchData(id)} 
          propertyId={id} 
        />
      )}

      {/* Edit Property Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border-default">
              <h3 className="text-lg font-bold">Edit Info Properti</h3>
              <button onClick={() => setEditingProperty(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdateProperty} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Properti *</label>
                <input required className="input-field" value={propForm.name} onChange={e => setPropForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alamat *</label>
                <input required className="input-field" value={propForm.address} onChange={e => setPropForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kota</label>
                  <input className="input-field" value={propForm.city} onChange={e => setPropForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Provinsi</label>
                  <input className="input-field" value={propForm.province} onChange={e => setPropForm(f => ({ ...f, province: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea rows={2} className="input-field" value={propForm.description} onChange={e => setPropForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingProperty(false)} className="btn-secondary flex-1">Batal</button>
                <button type="submit" disabled={savingProp} className="btn-primary flex-1">{savingProp ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border-default">
              <h3 className="text-lg font-bold">Edit Kamar {editingRoom.room_code}</h3>
              <button onClick={() => setEditingRoom(null)} className="p-2 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdateRoom} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">No. Kamar *</label>
                  <input required className="input-field" value={roomForm.room_code} onChange={e => setRoomForm(f => ({ ...f, room_code: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tipe</label>
                  <select className="input-field" value={roomForm.type} onChange={e => setRoomForm(f => ({ ...f, type: e.target.value as Room['type'] }))}>
                    <option value="STANDARD">Standard</option>
                    <option value="DELUXE">Deluxe</option>
                    <option value="SUITE">Suite</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Harga/Bulan (Rp) *</label>
                  <input required type="number" min="0" className="input-field" value={roomForm.price_per_month} onChange={e => setRoomForm(f => ({ ...f, price_per_month: +e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deposit (Rp)</label>
                  <input type="number" min="0" className="input-field" value={roomForm.deposit} onChange={e => setRoomForm(f => ({ ...f, deposit: +e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Lantai</label>
                  <input className="input-field" value={roomForm.floor} onChange={e => setRoomForm(f => ({ ...f, floor: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ukuran (mÂ²)</label>
                  <input className="input-field" value={roomForm.size} onChange={e => setRoomForm(f => ({ ...f, size: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="input-field" value={roomForm.status} onChange={e => setRoomForm(f => ({ ...f, status: e.target.value as Room['status'] }))}>
                  <option value="AVAILABLE">Tersedia</option>
                  <option value="OCCUPIED">Terisi</option>
                  <option value="MAINTENANCE">Pemeliharaan</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingRoom(null)} className="btn-secondary flex-1">Batal</button>
                <button type="submit" disabled={savingRoom} className="btn-primary flex-1">{savingRoom ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Room Confirmation */}
      {deletingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-danger/10 text-danger rounded-full flex items-center justify-center"><Trash2 size={18} /></div>
              <h3 className="text-lg font-bold">Hapus Kamar?</h3>
            </div>
            <p className="text-text-secondary text-sm">Kamar <strong>{deletingRoom.room_code}</strong> akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingRoom(null)} className="btn-secondary flex-1">Batal</button>
              <button onClick={handleDeleteRoom} disabled={deletingRoomId} className="flex-1 px-4 py-2 bg-danger text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50">{deletingRoomId ? 'Menghapus...' : 'Ya, Hapus'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
