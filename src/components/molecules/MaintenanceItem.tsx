import { Avatar } from '../atoms/Avatar';
import { Tag } from '../atoms/Tag';
import { cn } from '@/utils/cn';

interface MaintenanceItemProps {
  category: string;
  location: string;
  requestId: string;
  description: string;
  assignee: { name: string; avatar?: string };
  className?: string;
}

export function MaintenanceItem({ category, location, requestId, description, assignee, className }: MaintenanceItemProps) {
  return (
    <div className={cn("p-4 border border-border-default rounded-2xl bg-white hover:border-brand-primary hover:shadow-card transition-all group", className)}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-bg flex items-center justify-center text-text-secondary group-hover:text-brand-primary transition-colors text-xl">
             🛠️
          </div>
          <div>
            <h4 className="font-bold text-sm">{category} | {location}</h4>
            <p className="text-[10px] text-text-secondary uppercase tracking-wider">Request ID: {requestId}</p>
          </div>
        </div>
        <Tag className="bg-brand-primary-soft border-brand-primary/20 text-brand-primary text-[10px]">{description}</Tag>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-border-muted mt-2">
        <div className="flex items-center gap-2">
          <Avatar src={assignee.avatar} name={assignee.name} size="sm" />
          <span className="text-xs font-medium text-text-primary">{assignee.name}</span>
        </div>
        <button className="text-[10px] font-bold text-brand-primary hover:underline uppercase tracking-widest">Detail</button>
      </div>
    </div>
  );
}
