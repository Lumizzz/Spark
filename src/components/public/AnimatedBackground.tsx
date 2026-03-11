'use client';
import React from 'react';

import { useEffect, useRef, useState, useCallback } from 'react';

type Mode = 'nebula' | 'grid' | 'aurora';

interface Orb { x: number; y: number; r: number; vx: number; vy: number; hue: number; sat: number; }

// ── NEBULA MODE ─────────────────────────────────────────────
function useNebulaCanvas(canvasRef: React.RefObject<HTMLCanvasElement>, active: boolean) {
  const orbsRef = useRef<Orb[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMouse);

    // Create large slow orbs
    orbsRef.current = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 200 + Math.random() * 300,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      hue: [260, 240, 280, 200, 300, 220][i],
      sat: 60 + Math.random() * 30,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;

      orbsRef.current.forEach((orb: Orb, i: number) => {
        // Drift toward mouse slightly
        const dxm = mx - orb.x;
        const dym = my - orb.y;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        orb.vx += (dxm / dm) * 0.0015;
        orb.vy += (dym / dm) * 0.0015;

        // Dampen
        orb.vx *= 0.995;
        orb.vy *= 0.995;
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce soft
        if (orb.x < -orb.r) orb.x = canvas.width + orb.r;
        if (orb.x > canvas.width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = canvas.height + orb.r;
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r;

        const grd = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        grd.addColorStop(0, `hsla(${orb.hue}, ${orb.sat}%, 55%, 0.18)`);
        grd.addColorStop(0.5, `hsla(${orb.hue}, ${orb.sat}%, 50%, 0.07)`);
        grd.addColorStop(1, `hsla(${orb.hue}, ${orb.sat}%, 45%, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, canvasRef]);
}

// ── GRID WARP MODE ──────────────────────────────────────────
function GridWarp({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMouse);

    const SPACING = 45;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;
      const { x: mx, y: my } = mouseRef.current;
      const cols = Math.ceil(canvas.width / SPACING) + 2;
      const rows = Math.ceil(canvas.height / SPACING) + 2;

      ctx.strokeStyle = 'rgba(124, 58, 237, 0.15)';
      ctx.lineWidth = 0.5;

      // Warp grid points
      const getPoint = (gx: number, gy: number) => {
        const bx = gx * SPACING;
        const by = gy * SPACING;
        const dx = bx - mx;
        const dy = by - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const warp = Math.max(0, 1 - dist / 280) * 35;
        const angle = Math.atan2(dy, dx);
        const wave = Math.sin(gx * 0.4 + t) * Math.cos(gy * 0.4 + t) * 4;
        return {
          x: bx - Math.cos(angle) * warp + wave,
          y: by - Math.sin(angle) * warp + wave,
        };
      };

      // Draw horizontal lines
      for (let gy = 0; gy <= rows; gy++) {
        ctx.beginPath();
        for (let gx = 0; gx <= cols; gx++) {
          const { x, y } = getPoint(gx, gy);
          if (gx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // Draw vertical lines
      for (let gx = 0; gx <= cols; gx++) {
        ctx.beginPath();
        for (let gy = 0; gy <= rows; gy++) {
          const { x, y } = getPoint(gx, gy);
          if (gy === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Mouse glow dot
      if (mx > 0) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
        grd.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
        grd.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />;
}

// ── AURORA MODE ─────────────────────────────────────────────
function AuroraLayer({ active }: { active: boolean }) {
  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ${active ? 'opacity-100' : 'opacity-0'}`}>
      {/* Band 1 */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.06) 30%, rgba(59,130,246,0.08) 50%, rgba(16,185,129,0.04) 70%, transparent 100%)',
        animation: 'aurora-band1 12s ease-in-out infinite alternate',
        transform: 'skewY(-3deg)',
      }} />
      {/* Band 2 */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(168,85,247,0.05) 25%, rgba(99,102,241,0.07) 55%, transparent 100%)',
        animation: 'aurora-band2 18s ease-in-out infinite alternate',
        transform: 'skewY(2deg)',
      }} />
      {/* Shimmer */}
      <div className="absolute inset-0" style={{
        background: 'repeating-linear-gradient(90deg, transparent, rgba(139,92,246,0.02) 1px, transparent 2px)',
        backgroundSize: '80px 100%',
        animation: 'aurora-shimmer 6s linear infinite',
      }} />
    </div>
  );
}

const MODE_LABELS: { mode: Mode; icon: string; label: string }[] = [
  { mode: 'nebula', icon: '◉', label: 'Nebula' },
  { mode: 'grid', icon: '⊞', label: 'Grid' },
  { mode: 'aurora', icon: '≋', label: 'Aurora' },
];

export default function AnimatedBackground() {
  const [mode, setMode] = useState<Mode>('nebula');
  const [showPicker, setShowPicker] = useState(false);
  const [mounted, setMounted] = useState(false);
  const nebulaRef = useRef<HTMLCanvasElement>(null);

  useNebulaCanvas(nebulaRef, mode === 'nebula');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('bg-mode') as Mode | null;
    if (saved && ['nebula', 'grid', 'aurora'].includes(saved)) setMode(saved);
  }, []);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
    setShowPicker(false);
    localStorage.setItem('bg-mode', m);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Base deep dark */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(20,10,40,0.8) 0%, transparent 60%)' }} />

        {/* NEBULA */}
        <canvas ref={nebulaRef} className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${mode === 'nebula' ? 'opacity-100' : 'opacity-0'}`} />

        {/* GRID WARP */}
        <GridWarp active={mode === 'grid'} />

        {/* AURORA */}
        <AuroraLayer active={mode === 'aurora'} />

        {/* Always-on: grain + faint grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Mode switcher — bottom right, always visible */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <div className="relative">
          {showPicker && (
            <div className="absolute bottom-12 right-0 mb-2 flex flex-col gap-1 items-end" style={{ animation: 'command-in 0.15s ease forwards' }}>
              {MODE_LABELS.map(({ mode: m, icon, label }) => (
                <button key={m} onClick={() => switchMode(m)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-xl border transition-all
                    ${mode === m
                      ? 'bg-violet-600/30 border-violet-500/50 text-violet-200'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}>
                  <span className="text-base leading-none">{icon}</span> {label}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => setShowPicker((p: boolean) => !p)}
            className="w-9 h-9 rounded-full backdrop-blur-xl border border-white/10 bg-black/30 text-slate-500 hover:text-white hover:border-violet-500/40 transition-all flex items-center justify-center text-sm"
            title="Change background style">
            {MODE_LABELS.find((m: typeof MODE_LABELS[0]) => m.mode === mode)?.icon || '◉'}
          </button>
        </div>
      </div>
    </>
  );
}
