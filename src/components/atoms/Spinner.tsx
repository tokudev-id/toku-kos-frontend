import { cn } from '@/utils/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn(
      'w-5 h-5 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin',
      className
    )} />
  );
}
