export default function NotFound() {
  return (
    <div className="bg-[#0b1326] text-[#dae2fd] font-sans flex flex-col items-center justify-center min-h-screen p-6">
      <div className="glass-card p-8 rounded-2xl border border-primary/20 max-w-md text-center">
        <h2 className="font-display text-xl font-bold text-primary mb-4">404 - SYSTEM ROUTE NOT FOUND</h2>
        <p className="font-mono text-xs text-on-surface-variant mb-6 leading-relaxed">
          The requested system segment or node could not be resolved in the routing registry.
        </p>
        <a
          href="/"
          className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-mono text-xs font-bold transition-all hover:scale-105 active:scale-95 inline-block cursor-pointer"
        >
          RETURN TO CORE GATWAY
        </a>
      </div>
    </div>
  );
}
