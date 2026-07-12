'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState, useEffect } from 'react';
import { Server, Database, Activity, RefreshCw, Zap, Flame, ShieldAlert } from 'lucide-react';

interface Request {
  id: number;
  progress: number; // 0 to 100
  route: 'cache' | 'db' | 'block';
  status: 'routing' | 'caching' | 'writing' | 'blocked' | 'success';
  node: number;
}

export default function DistributedSystemSimulation() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [cacheHitRate, setCacheHitRate] = useState(85);
  const [trafficLevel, setTrafficLevel] = useState<'normal' | 'peak' | 'race'>('normal');
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    blocked: 0,
    latency: 12 // ms
  });

  // Spawn requests periodically based on traffic level
  useEffect(() => {
    const intervalTime = trafficLevel === 'peak' ? 150 : trafficLevel === 'race' ? 100 : 700;
    const interval = setInterval(() => {
      const isCacheHit = Math.random() * 100 < cacheHitRate;
      const isRace = trafficLevel === 'race';
      
      const newRequest: Request = {
        id: Date.now() + Math.random(),
        progress: 0,
        route: isRace ? 'block' : isCacheHit ? 'cache' : 'db',
        status: 'routing',
        node: Math.floor(Math.random() * 3) + 1
      };

      setRequests((prev) => [...prev.slice(-15), newRequest]);
      setStats((prev) => ({
        ...prev,
        total: prev.total + 1,
        latency: Math.max(2, Math.floor(isRace ? 85 : isCacheHit ? 4 : 22 + Math.random() * 10))
      }));
    }, intervalTime);

    return () => clearInterval(interval);
  }, [trafficLevel, cacheHitRate]);

  // Request progress animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests((prev) =>
        prev
          .map((req) => {
            const nextProgress = req.progress + (trafficLevel === 'peak' ? 8 : 4);
            if (nextProgress >= 100) {
              // Request finished! Update stats
              if (req.status !== 'success') {
                if (req.route === 'block') {
                  setStats((s) => ({ ...s, blocked: s.blocked + 1 }));
                } else {
                  setStats((s) => ({ ...s, success: s.success + 1 }));
                }
              }
              return null;
            }

            let status = req.status;
            if (nextProgress < 30) {
              status = 'routing';
            } else if (nextProgress < 70) {
              status = req.route === 'block' ? 'blocked' : req.route === 'cache' ? 'caching' : 'writing';
            } else {
              status = 'success';
            }

            return {
              ...req,
              progress: nextProgress,
              status
            } as Request;
          })
          .filter(Boolean) as Request[]
      );
    }, 40);

    return () => clearInterval(interval);
  }, [trafficLevel]);

  return (
    <div className="w-full glass-card rounded-2xl p-6 border border-outline-variant/30 flex flex-col justify-between h-full min-h-[420px]" id="system-simulator-card">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider">
              Live System Ingress Simulator
            </span>
          </div>
          <span className="font-mono text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded uppercase tracking-widest font-bold">
            Live telemetry
          </span>
        </div>

        {/* Live SVG Architecture Flow Panel */}
        <div className="relative h-44 bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden flex items-center justify-between p-4 md:p-6 mb-4">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

          {/* Client Node */}
          <div className="flex flex-col items-center z-10">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-on-surface shadow-sm">
              <Zap className={`w-5 h-5 ${trafficLevel !== 'normal' ? 'text-primary animate-bounce' : 'text-on-surface-variant'}`} />
            </div>
            <span className="font-mono text-[9px] text-on-surface-variant mt-1">Ingress Gateway</span>
          </div>

          {/* Connective Line and Flowing Request Packets */}
          <div className="absolute left-[70px] right-[70px] top-[40%] h-0.5 bg-outline-variant/20 pointer-events-none">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`absolute h-2 w-2 rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-lg transition-all duration-75 ${
                  req.status === 'blocked'
                    ? 'bg-red-400 shadow-red-500/40'
                    : req.route === 'cache'
                    ? 'bg-secondary shadow-secondary/40'
                    : 'bg-primary shadow-primary/40'
                }`}
                style={{
                  left: `${req.progress}%`,
                  top: req.node === 1 ? '-10px' : req.node === 3 ? '10px' : '0px'
                }}
              />
            ))}
          </div>

          {/* Middle Server Nodes */}
          <div className="flex flex-col gap-2 z-10">
            {[1, 2, 3].map((nodeNum) => {
              const isNodeActive = requests.some(r => r.node === nodeNum && r.progress > 20 && r.progress < 70);
              return (
                <div 
                  key={nodeNum}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[9px] font-mono transition-all duration-200 bg-surface-container ${
                    isNodeActive 
                      ? 'border-primary text-primary shadow-[0_0_10px_rgba(192,193,255,0.1)]' 
                      : 'border-outline-variant/20 text-on-surface-variant'
                  }`}
                >
                  <Server className="w-3.5 h-3.5" />
                  Node {String.fromCharCode(64 + nodeNum)}
                </div>
              );
            })}
          </div>

          {/* Right Storage Nodes */}
          <div className="flex flex-col gap-3 z-10">
            {/* Cache Storage */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-on-surface transition-all bg-surface-container ${
                requests.some(r => r.route === 'cache' && r.progress >= 60)
                  ? 'border-secondary text-secondary shadow-[0_0_10px_rgba(76,215,246,0.15)]'
                  : 'border-outline-variant/30 text-on-surface-variant'
              }`}>
                <RefreshCw className="w-4 h-4" />
              </div>
              <span className="font-mono text-[9px] text-on-surface-variant hidden md:inline">Redis (Cache)</span>
            </div>

            {/* DB Storage */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-on-surface transition-all bg-surface-container ${
                requests.some(r => r.route === 'db' && r.progress >= 60)
                  ? 'border-primary text-primary shadow-[0_0_10px_rgba(192,193,255,0.15)]'
                  : requests.some(r => r.route === 'block' && r.progress >= 60)
                  ? 'border-red-400 text-red-400 animate-pulse'
                  : 'border-outline-variant/30 text-on-surface-variant'
              }`}>
                <Database className="w-4 h-4" />
              </div>
              <span className="font-mono text-[9px] text-on-surface-variant hidden md:inline">PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* Telemetry Dashboard Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" id="telemetry-dashboard-grid">
          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 text-center">
            <span className="font-mono text-[8px] text-on-surface-variant uppercase block">Total Req</span>
            <span className="font-mono text-xs font-semibold text-on-surface">{stats.total}</span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 text-center">
            <span className="font-mono text-[8px] text-on-surface-variant uppercase block">Cache Hit Rate</span>
            <span className="font-mono text-xs font-semibold text-secondary">{cacheHitRate}%</span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 text-center">
            <span className="font-mono text-[8px] text-on-surface-variant uppercase block">Avg Latency</span>
            <span className="font-mono text-xs font-semibold text-green-400">{stats.latency}ms</span>
          </div>
          <div className="bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20 text-center">
            <span className="font-mono text-[8px] text-on-surface-variant uppercase block">Locks Blocked</span>
            <span className="font-mono text-xs font-semibold text-red-400">{stats.blocked}</span>
          </div>
        </div>
      </div>

      {/* Simulator Interactive Scenarios */}
      <div className="space-y-2">
        <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider block">
          Trigger System Scenarios
        </span>
        <div className="flex flex-wrap gap-2" id="scenario-triggers">
          <button
            id="scenario-normal"
            onClick={() => {
              setTrafficLevel('normal');
              setCacheHitRate(85);
            }}
            className={`flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] font-semibold transition-all cursor-pointer ${
              trafficLevel === 'normal'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Normal (85% Hit)
          </button>

          <button
            id="scenario-peak"
            onClick={() => {
              setTrafficLevel('peak');
              setCacheHitRate(45); // lower hits at peak
            }}
            className={`flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] font-semibold transition-all cursor-pointer ${
              trafficLevel === 'peak'
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Peak (10k req/s)
          </button>

          <button
            id="scenario-race"
            onClick={() => {
              setTrafficLevel('race');
              setCacheHitRate(10); // Cache misses and block
            }}
            className={`flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] font-semibold transition-all cursor-pointer ${
              trafficLevel === 'race'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Row-Lock Concurrency
          </button>
        </div>
      </div>
    </div>
  );
}
