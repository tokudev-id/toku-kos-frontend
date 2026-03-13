import { Avatar } from '../atoms/Avatar';
import { cn } from '@/utils/cn';

interface TransactionItemProps {
  image?: string;
  title: string;
  subtitle: string;
  amount: string;
  className?: string;
}

export function TransactionItem({ image, title, subtitle, amount, className }: TransactionItemProps) {
  return (
    <div className={cn("flex items-center justify-between p-3 hover:bg-surface-bg rounded-xl transition-colors cursor-pointer group", className)}>
      <div className="flex items-center gap-4">
        <Avatar src={image} name={title} size="md" className="rounded-xl border-none shadow-sm" />
        <div>
          <h4 className="font-bold text-sm group-hover:text-brand-primary transition-colors">{title}</h4>
          <p className="text-xs text-text-secondary">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-sm text-brand-primary">{amount}</p>
      </div>
    </div>
  );
}
