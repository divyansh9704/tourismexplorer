export default function SkeletonLoader() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
          <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
          <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
