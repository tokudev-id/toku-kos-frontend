export function BillingSkeleton() {
  return (
    <div className="space-y-lg">
      <div className="h-8 w-48 bg-slate-100 animate-pulse rounded" />
      <div className="grid grid-cols-1 gap-md md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="card h-64 animate-pulse bg-slate-50" />
        ))}
      </div>
    </div>
  );
}
