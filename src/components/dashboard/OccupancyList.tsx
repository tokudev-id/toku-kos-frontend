import type { OccupancyEntry } from '@/api/dashboard.service';

interface OccupancyListProps {
  entries: OccupancyEntry[];
}

export function OccupancyList({ entries }: OccupancyListProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white p-4 rounded-2xl border border-border-default text-sm text-text-secondary">
        Belum ada data hunian per properti.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border-default p-4 md:p-5 space-y-4">
      {entries.map((entry) => (
        <div key={entry.property_id} className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-text-primary">{entry.property_name}</p>
            <p className="text-xs text-text-secondary">
              {entry.occupied_rooms}/{entry.total_rooms} kamar ({entry.occupancy_rate}%)
            </p>
          </div>
          <div className="w-full h-2 rounded-full bg-border-muted overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full"
              style={{ width: `${entry.occupancy_rate}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
