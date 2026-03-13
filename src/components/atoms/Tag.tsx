import { cn } from '@/utils/cn';

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-1 rounded-md bg-white border border-border-default text-xs font-medium text-text-secondary whitespace-nowrap',
      className
    )}>
      {children}
    </span>
  );
}
