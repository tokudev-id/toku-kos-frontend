import { cn } from '@/utils/cn';

interface ChartCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, action, children, className }: ChartCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-border-default shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-lg">{title}</h3>
        {action && (
          <div className="flex items-center">
            {action}
          </div>
        )}
      </div>
      <div className="flex-1 min-h-[240px]">
        {children}
      </div>
    </div>
  );
}
