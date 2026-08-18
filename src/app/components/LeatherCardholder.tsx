import React, { useId } from 'react';

import { MetalCard } from '@/app/components/MetalCard';

export interface LeatherCardholderProps {
  name?: string;
  number?: string;
  date?: string;
  className?: string;
}

const EMBOSSED_LOGO = [
  true, true, true, true,
  true, false, true, false,
  true, true, true, true,
];

function stableId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '');
}

export function LeatherCardholder({
  name = 'JOSH PIGFORD',
  number = '#001',
  date = '27.06.25',
  className = '',
}: LeatherCardholderProps) {
  const filterId = `leather-cardholder-grain-${stableId(useId())}`;

  return (
    <div
      data-component="leather-cardholder"
      data-card-material="saddle-leather"
      role="img"
      aria-label={`${name} leather cardholder`}
      className={`relative h-[330px] w-[230px] overflow-hidden rounded-[20px] border border-[#693a21] shadow-[0_12px_24px_rgba(25,14,8,0.18)] ${className}`}
    >
      <MetalCard
        name={name}
        number={number}
        date={date}
        mode="peek"
        className="absolute left-1/2 top-[-8px] z-10 -translate-x-1/2"
      />

      <div
        className="absolute inset-0 z-20 overflow-hidden rounded-[20px] bg-[#7b4024]"
        style={{
          clipPath: 'polygon(0 16%, 16% 14%, 32% 14%, 50% 18%, 68% 14%, 84% 14%, 100% 16%, 100% 100%, 0 100%)',
          backgroundImage: 'radial-gradient(120% 80% at 48% 0%, rgba(198,119,65,0.82) 0%, rgba(139,74,43,0.42) 38%, rgba(110,59,34,0.88) 100%), linear-gradient(145deg, #9b572e 0%, #7d4125 52%, #6e3b22 100%)',
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16] mix-blend-screen" aria-hidden="true">
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.42" numOctaves="2" seed="12" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" fill="#f4bd8d" filter={`url(#${filterId})`} />
        </svg>

        <span className="pointer-events-none absolute inset-3.5 rounded-[16px] border border-[#c17a48]/25" aria-hidden="true" />

        <div className="absolute inset-x-0 bottom-[76px] flex justify-center" aria-hidden="true">
          <div className="grid grid-cols-4 gap-[3px] rounded-[5px] p-1">
            {EMBOSSED_LOGO.map((visible, index) => (
              <span
                key={index}
                className={`size-[7px] rounded-[2px] bg-[#7b4024] shadow-[inset_0_1px_0_rgba(238,175,120,0.28),inset_0_-1px_1px_rgba(45,22,10,0.46)] ${visible ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
