import { useCallback, useEffect, useState } from 'react';
import { Coins, Plus, Search, Trash2, Type, Pencil } from 'lucide-react';
import { roomService } from '@/api/room.service';
import type { Room } from '@/api/room.service';
import { Pagination } from '@/components/molecules/Pagination';
import { cn } from '@/utils/cn';

interface RoomListProps {
  propertyId: string;
  onAddRoom?: () => void;
  onEditRoom?: (room: Room) => void;
  onDeleteRoom?: (room: Room) => void;
}

const LIMIT = 10;

export function RoomList({ propertyId, onAddRoom, onEditRoom, onDeleteRoom }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = propertyId
        ? await roomService.getRoomsByProperty(
            propertyId,
            page,
            LIMIT,
            search || undefined,
            (typeFilter || undefined) as Room['type'] | undefined,
            (statusFilter || undefined) as Room['status'] | undefined,
          )
        : await roomService.getAllRooms(
            page,
            LIMIT,
            search || undefined,
            (typeFilter || undefined) as Room['type'] | undefined,
            (statusFilter || undefined) as Room['status'] | undefined,
          );

      setRooms(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      setRooms([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, page, search, typeFilter, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [propertyId, search, typeFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRooms();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchRooms]);

  return (
    <div className="card overflow-hidden">
      <div className="p-md border-b border-border-default flex flex-col md:flex-row gap-3 justify-between md:items-center">
        <h3 className="font-bold text-lg">Daftar Kamar</h3>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Cari nomor kamar..."
              className="input-field pl-9 py-1.5 h-9 text-sm min-w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="input-field py-1.5 h-9 text-sm min-w-42"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Semua Tipe</option>
            <option value="STANDARD">Standard</option>
            <option value="DELUXE">Deluxe</option>
            <option value="SUITE">Suite</option>
          </select>

          <select
            className="input-field py-1.5 h-9 text-sm min-w-42"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            <option value="AVAILABLE">Tersedia</option>
            <option value="OCCUPIED">Terisi</option>
            <option value="MAINTENANCE">Pemeliharaan</option>
          </select>

          {onAddRoom && (
            <button onClick={onAddRoom} className="btn-primary h-9 px-3 min-w-42">
              <Plus size={16} />
              Tambah Kamar
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-bg border-b border-border-default">
            <tr>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">No. Kamar</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Tipe</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Harga / Bulan</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Harga / Tahun</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Lantai</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Deposit</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Utilitas</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Fasilitas</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Foto</th>
              <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase">Status</th>
              {(onEditRoom || onDeleteRoom) && (
                <th className="px-md py-3 text-[11px] font-bold text-text-secondary uppercase text-right">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {isLoading ? (
              <tr>
                <td colSpan={onEditRoom || onDeleteRoom ? 11 : 10} className="px-md py-8 text-center text-text-secondary italic">
                  Memuat kamar...
                </td>
              </tr>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
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
                      Rp {Number(room.price_per_month).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-md py-4 text-sm text-text-secondary">
                    {room.price_per_year ? `Rp ${Number(room.price_per_year).toLocaleString()}` : '-'}
                  </td>
                  <td className="px-md py-4 text-sm text-text-secondary">{room.floor || '-'}</td>
                  <td className="px-md py-4 text-sm text-text-secondary">
                    {room.deposit ? `Rp ${Number(room.deposit).toLocaleString()}` : '-'}
                  </td>
                  <td className="px-md py-4 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {room.electricity_included && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-primary-soft text-brand-primary font-medium">Listrik</span>
                      )}
                      {room.water_included && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">Air</span>
                      )}
                      {!room.electricity_included && !room.water_included && (
                        <span className="text-text-secondary">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-md py-4 text-xs">
                    <div className="flex flex-wrap gap-1 max-w-56">
                      {room.facilities && room.facilities.length > 0 ? room.facilities.map((facility) => (
                        <span key={facility} className="px-2 py-0.5 rounded-full bg-slate-100 text-text-secondary font-medium">
                          {facility}
                        </span>
                      )) : <span className="text-text-secondary">-</span>}
                    </div>
                  </td>
                  <td className="px-md py-4">
                    {room.images?.[0]?.url || room.photo_url ? (
                      <img src={room.images?.[0]?.url || room.photo_url} alt={`Foto ${room.room_code}`} className="w-14 h-10 rounded-md object-cover border border-border-default" />
                    ) : (
                      <span className="text-text-secondary text-xs">-</span>
                    )}
                  </td>
                  <td className="px-md py-4 text-xs font-bold uppercase">
                    <span className={cn(
                      'px-2 py-1 rounded-full flex items-center gap-1 w-fit',
                      room.status === 'AVAILABLE' ? 'bg-success/10 text-success'
                        : room.status === 'OCCUPIED' ? 'bg-warning/10 text-warning' : 'bg-slate-100 text-text-secondary',
                    )}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {room.status === 'AVAILABLE' ? 'Tersedia'
                        : room.status === 'OCCUPIED' ? 'Terisi' : 'Pemeliharaan'}
                    </span>
                  </td>
                  {(onEditRoom || onDeleteRoom) && (
                    <td className="px-md py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEditRoom && (
                          <button onClick={() => onEditRoom(room)} className="p-1.5 text-text-secondary hover:text-brand-primary hover:bg-brand-primary-soft rounded-lg transition-colors">
                            <Pencil size={15} />
                          </button>
                        )}
                        {onDeleteRoom && (
                          <button onClick={() => onDeleteRoom(room)} className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={onEditRoom || onDeleteRoom ? 11 : 10} className="px-md py-8 text-center text-text-secondary italic">
                  Tidak ada kamar ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-md border-t border-border-default">
        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>
    </div>
  );
}
