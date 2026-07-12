'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Captured page-level rendering error:', error);
  }, [error]);

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col items-center justify-center min-h-screen p-6">
      <div className="glass-card p-8 rounded-2xl border border-red-500/30 max-w-md text-center">
        <h2 className="font-display text-xl font-bold text-red-400 mb-4">APPLICATION EXCEPTION</h2>
        <p className="font-mono text-xs text-on-surface-variant mb-6 leading-relaxed">
          A non-fatal rendering exception occurred inside the application view.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            RELOAD MODULE
          </button>
          <a
            href="/"
            className="border border-primary text-primary px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all hover:bg-primary/5 cursor-pointer"
          >
            RESET VIEW
          </a>
        </div>
      </div>
    </div>
  );
}
