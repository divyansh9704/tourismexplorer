import { Compass } from 'lucide-react';

export default function EmptyState({ onReset }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/50 rounded-2xl border border-dashed border-slate-200">
      <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-3">
        <Compass className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-slate-800 text-sm">No Attractions Found</h4>
      <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
        We couldn't find any sights matching this filter near the target location.
      </p>
      <button
        onClick={onReset}
        className="mt-4 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}
