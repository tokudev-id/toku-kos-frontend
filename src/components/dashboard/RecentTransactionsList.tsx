import type { PaymentReminder } from '@/api/dashboard.service';
import { TransactionItem } from '@/components/molecules/TransactionItem';

interface RecentTransactionsListProps {
  reminders: PaymentReminder[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export function RecentTransactionsList({ reminders }: RecentTransactionsListProps) {
  if (reminders.length === 0) {
    return (
      <div className="bg-white p-4 rounded-2xl border border-border-default text-sm text-text-secondary">
        Tidak ada transaksi terbaru.
      </div>
    );
  }

  return (
    <div className="space-y-1 bg-white p-3 md:p-4 rounded-[32px] border border-border-default shadow-sm">
      {reminders.map((reminder) => (
        <TransactionItem
          key={reminder.invoice_id}
          title={reminder.resident_name ?? reminder.invoice_number}
          subtitle={`${reminder.room_code ?? '-'} • Jatuh tempo ${formatDate(reminder.due_date)}`}
          amount={`Rp ${Number(reminder.total_amount).toLocaleString('id-ID')}`}
        />
      ))}
    </div>
  );
}
