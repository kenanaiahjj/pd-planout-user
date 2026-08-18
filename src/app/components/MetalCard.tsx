import React, { useId } from 'react';

export type MetalCardMode = 'full' | 'peek';

export interface MetalCardProps {
  name?: string;
  number?: string;
  date?: string;
  mode?: MetalCardMode;
  className?: string;
}

export const BRUSHED_METAL_BACKGROUND = 'linear-gradient(118deg, rgba(255,255,255,0) 18%, rgba(255,255,255,0.34) 46%, rgba(255,255,255,0) 66%), linear-gradient(145deg, #f7f7f8 0%, #d1d2d5 26%, #fafafa 47%, #88898e 59%, #47484c 80%, #25262a 100%)';
export const BRUSHED_METAL_PASS_BACKGROUND = 'radial-gradient(circle at 84% 4%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.5) 18%, transparent 43%), radial-gradient(ellipse 125% 88% at 18% 92%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.24) 48%, transparent 70%), linear-gradient(118deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.08) 24%, rgba(255,255,255,0.48) 48%, rgba(255,255,255,0.04) 67%, rgba(255,255,255,0.34) 100%), linear-gradient(150deg, #f4f5f6 0%, #c8cacf 28%, #f8f8f9 47%, #a4a7ad 71%, #d8dade 100%)';

const EMBOSSED_PILLS = [
  { left: 47, top: 28, width: 31, height: 8 },
  { left: 31, top: 41, width: 42, height: 8.5 },
  { left: 18, top: 56, width: 27, height: 8.5 },
  { left: 52, top: 56, width: 25, height: 8.5 },
  { left: 23, top: 68, width: 33, height: 8.5 },
];

export function MetalCardEmbossedPills({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {EMBOSSED_PILLS.map((pill, index) => (
        <span
          key={index}
          className="absolute rounded-full border border-white/20 bg-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.36),inset_0_-1px_1px_rgba(0,0,0,0.2)] backdrop-blur-[1px]"
          style={{
            left: `${pill.left}%`,
            top: `${pill.top}%`,
            width: `${pill.width}%`,
            height: `${pill.height}%`,
          }}
        />
      ))}
    </div>
  );
}

function stableId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '');
}

export function MetalCardTexture({ className = '' }: { className?: string }) {
  const filterId = `metal-card-grain-${stableId(useId())}`;

  return (
    <svg
      data-material-texture="micro-brushed"
      className={`pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay ${className}`}
      aria-hidden="true"
    >
      <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.72" numOctaves="2" seed="6" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" fill="#ffffff" filter={`url(#${filterId})`} />
    </svg>
  );
}

export function MetalCard({
  name = 'JOSH PIGFORD',
  number = '#001',
  date = '27.06.25',
  mode = 'full',
  className = '',
}: MetalCardProps) {
  const isPeek = mode === 'peek';

  return (
    <article
      data-component="metal-card"
      data-card-material="brushed-metal"
      data-card-mode={mode}
      role="img"
      aria-label={`${number} ${name}`}
      className={`relative isolate overflow-hidden border border-white/70 ${
        isPeek
          ? 'h-[78px] w-[190px] rounded-[20px]'
          : 'h-[305px] w-[230px] rounded-[27px]'
      } shadow-[0_12px_24px_rgba(0,0,0,0.18)] ${className}`}
      style={{
        backgroundImage: BRUSHED_METAL_BACKGROUND,
      }}
    >
      <MetalCardTexture className="opacity-[0.14]" />

      <span
        data-material-highlight="metal-sheen"
        className="pointer-events-none absolute -inset-x-10 top-[38%] h-[22%] rotate-[-18deg] bg-white/20 blur-[12px]"
        aria-hidden="true"
      />

      <div className={`relative z-10 flex h-full flex-col justify-between ${isPeek ? 'p-3' : 'p-5'}`}>
        <div>
          <p className={`font-mono ${isPeek ? 'text-[8px]' : 'text-[10px]'} font-medium tracking-[0.09em] text-[#66686d]`}>{number}</p>
          <p className={`mt-1 font-mono ${isPeek ? 'text-[11px]' : 'text-[14px]'} font-bold uppercase tracking-[0.02em] text-[#242528]`}>{name}</p>
        </div>

        {!isPeek && <MetalCardEmbossedPills />}

        {!isPeek && (
          <p className="font-mono text-[10px] tracking-[0.08em] text-[#c1c2c5]">{date}</p>
        )}
      </div>
    </article>
  );
}
