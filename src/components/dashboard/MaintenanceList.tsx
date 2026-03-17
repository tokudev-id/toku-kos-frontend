import type { MaintenanceSummary } from '@/api/dashboard.service';
import { MaintenanceItem } from '@/components/molecules/MaintenanceItem';

interface MaintenanceListProps {
  tickets: MaintenanceSummary[];
}

const priorityLabel: Record<MaintenanceSummary['priority'], string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export function MaintenanceList({ tickets }: MaintenanceListProps) {
  if (tickets.length === 0) {
    return (
      <div className="bg-white p-4 rounded-2xl border border-border-default text-sm text-text-secondary">
        Tidak ada tiket maintenance aktif.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {tickets.map((ticket) => (
        <MaintenanceItem
          key={ticket.id}
          category={priorityLabel[ticket.priority]}
          location={ticket.property_name ?? '-'}
          requestId={ticket.id.slice(0, 8).toUpperCase()}
          description={ticket.title}
          assignee={{ name: ticket.resident_name ?? 'Tanpa Nama' }}
        />
      ))}
    </div>
  );
}
