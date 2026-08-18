/**
 * @file PlanOutPassportCard.tsx
 * @description Universal member passport card with sequenced pocket slide-out and QR enlargement.
 */

import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

import imgPlanOutLogo from '@/assets/5a332411061613331a1ffc8c7aa2ccf247ff8699.png';

function hashPassportCell(value: string, index: number) {
  let hash = 2166136261;
  const input = `${value}:${index}`;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 7 < 3;
}

function PassportQrMini({ value, className }: { value: string; className?: string }) {
  const cells = Array.from({ length: 21 * 21 }, (_, index) => {
    const row = Math.floor(index / 21);
    const col = index % 21;
    const inFinder =
      (row < 7 && col < 7) ||
      (row < 7 && col > 13) ||
      (row > 13 && col < 7);
    const finderBorder =
      inFinder &&
      (row % 14 === 0 ||
        row % 14 === 6 ||
        col % 14 === 0 ||
        col % 14 === 6 ||
        (row % 14 >= 2 && row % 14 <= 4 && col % 14 >= 2 && col % 14 <= 4));

    return inFinder ? finderBorder : hashPassportCell(value, index);
  });

  const cellsPerRow = 21;
  const cellSize = 100 / cellsPerRow;
  const rects: React.ReactNode[] = [];

  for (let r = 0; r < cellsPerRow; r++) {
    for (let c = 0; c < cellsPerRow; c++) {
      const active = cells[r * cellsPerRow + c];
      if (active) {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize * 0.86}
            height={cellSize * 0.86}
            fill="#0f172b"
          />
        );
      }
    }
  }

  return (
    <svg
      data-qr-material="premium"
      viewBox="0 0 100 100"
      shapeRendering="crispEdges"
      className={`h-full w-full aspect-square rounded-[15px] border border-[#d9ebe6] bg-white p-2.5 shadow-[0_14px_28px_-20px_rgba(15,23,42,0.52),inset_0_1px_0_rgba(255,255,255,0.98)] ring-1 ring-[#177564]/10 ${className || ''}`}
    >
      <g>{rects}</g>
    </svg>
  );
}

export function createPassportQrSvg(value: string, label: string, passportCode: string) {
  const size = 640;
  const quiet = 56;
  const cells = 21;
  const cellSize = (size - quiet * 2) / cells;
  const activeRects: string[] = [];

  for (let index = 0; index < cells * cells; index += 1) {
    const row = Math.floor(index / cells);
    const col = index % cells;
    const inFinder =
      (row < 7 && col < 7) ||
      (row < 7 && col > 13) ||
      (row > 13 && col < 7);
    const finderBorder =
      inFinder &&
      (row % 14 === 0 ||
        row % 14 === 6 ||
        col % 14 === 0 ||
        col % 14 === 6 ||
        (row % 14 >= 2 && row % 14 <= 4 && col % 14 >= 2 && col % 14 <= 4));
    const active = inFinder ? finderBorder : hashPassportCell(value, index);

    if (active) {
      activeRects.push(
        `<rect x="${quiet + col * cellSize}" y="${quiet + row * cellSize}" width="${cellSize * 0.82}" height="${cellSize * 0.82}" rx="3" fill="#0f172b"/>`,
      );
    }
  }

  const safeLabel = label.replace(/[<>&"]/g, '');
  const safeCode = passportCode.replace(/[<>&"]/g, '');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 132}" viewBox="0 0 ${size} ${size + 132}">
  <rect width="${size}" height="${size + 132}" rx="44" fill="#f8fafc"/>
  <rect x="24" y="24" width="${size - 48}" height="${size - 48}" rx="34" fill="#ffffff" stroke="#d9ebe6" stroke-width="2"/>
  ${activeRects.join('\n  ')}
  <rect x="${size / 2 - 52}" y="${size / 2 - 52}" width="104" height="104" rx="28" fill="#ffffff" stroke="#d9ebe6" stroke-width="3"/>
  <rect x="${size / 2 - 31}" y="${size / 2 - 31}" width="62" height="62" rx="18" fill="#177564"/>
  <path d="M302 334L320 306L338 334H328L320 321L312 334H302Z" fill="#ffffff"/>
  <text x="${size / 2}" y="${size + 46}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#0f172b">${safeLabel}</text>
  <text x="${size / 2}" y="${size + 84}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="3" fill="#177564">${safeCode}</text>
</svg>`;
}

export function PlanOutPassportCard({
  name,
  image,
  passportCode,
  qrPayload,
  variant = 'full',
  statusLabel,
  statusTone = 'neutral',
  qrSubtitle = 'Scan to view events',
  footerActions,
  identityVisual = 'photo',
  notchBgClass = 'bg-[#eef7f5]',
  forceOpen,
  disableInteractivity,
}: {
  name: string;
  image: string;
  passportCode: string;
  qrPayload: string;
  variant?: 'full' | 'mini';
  statusLabel?: string;
  statusTone?: 'green' | 'amber' | 'neutral';
  qrSubtitle?: string;
  footerActions?: React.ReactNode;
  identityVisual?: 'photo' | 'gradient';
  notchBgClass?: string;
  forceOpen?: boolean;
  disableInteractivity?: boolean;
}) {
  const [qrExpanded, setQrExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(forceOpen ?? false);
  const [isHovered, setIsHovered] = useState(false);
  const [holderScale, setHolderScale] = useState(1);
  const transitionTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const draggedRef = React.useRef(false);
  const holderContainerRef = React.useRef<HTMLDivElement | null>(null);
  const holderDesignWidth = 390;
  const holderDesignHeight = 590;

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const premiumSpring = React.useMemo(() => ({
    type: 'spring',
    stiffness: 260,
    damping: 28,
  }), []);

  const clearTransitionTimeout = useCallback(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  React.useLayoutEffect(() => {
    const holderContainer = holderContainerRef.current;
    if (!holderContainer) return;

    const updateHolderScale = () => {
      const availableWidth = holderContainer.getBoundingClientRect().width;
      if (availableWidth <= 0) return;
      setHolderScale(Math.min(1, availableWidth / holderDesignWidth));
    };

    updateHolderScale();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateHolderScale);
      return () => window.removeEventListener('resize', updateHolderScale);
    }

    const resizeObserver = new ResizeObserver(updateHolderScale);
    resizeObserver.observe(holderContainer);
    return () => resizeObserver.disconnect();
  }, []);

  const textShadowStyle = {
    textShadow: '0 1px 0px rgba(255, 255, 255, 0.8)',
  };

  if (variant === 'mini') {
    const tone = {
      green: 'bg-emerald-500/8 text-[#115e59] border-emerald-500/20',
      amber: 'bg-amber-500/8 text-[#854d0e] border-amber-500/20',
      neutral: 'bg-slate-500/8 text-slate-700 border-slate-500/15',
    }[statusTone];
    const accent = {
      green: 'bg-[#10b981]',
      amber: 'bg-[#f59e0b]',
      neutral: 'bg-[#94a3b8]',
    }[statusTone];

    return (
      <div 
        className="relative overflow-hidden rounded-[20px] border border-white/60 p-4.5 shadow-[0_20px_48px_-28px_rgba(15,23,42,0.22),inset_0_1.5px_2px_rgba(255,255,255,0.7)]"
        style={{
          background: 'linear-gradient(135deg, rgba(250, 250, 250, 0.85) 0%, rgba(228, 228, 231, 0.65) 50%, rgba(212, 212, 216, 0.55) 100%)',
          backdropFilter: 'blur(20px) saturate(120%)',
          WebkitBackdropFilter: 'blur(20px) saturate(120%)',
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#3cd4b9_0%,#177564_100%)] opacity-85" />
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[1.8px] text-[#71717a]" style={textShadowStyle}>
              PlanOut Passport
            </p>
            <p className="mt-1 text-[13px] font-semibold text-[#3f3f46]" style={textShadowStyle}>
              Universal event QR
            </p>
          </div>
          {statusLabel && (
            <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold ${tone}`}>
              {statusLabel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 shrink-0 rounded-[18px] border border-white bg-zinc-100 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.5)]">
            <img src={image} alt={name} className="h-full w-full object-cover rounded-[17px]" />
            <span className={`absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-white ${accent}`} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[20px] font-bold leading-tight tracking-[-0.03em] text-[#09090b] uppercase" style={textShadowStyle}>
              {name}
            </h3>
            <p className="mt-0.5 font-mono text-[11px] font-bold tracking-[0.2px] text-[#71717a]" style={textShadowStyle}>
              {passportCode}
            </p>
            <p className="mt-1.5 text-[12px] font-medium leading-snug text-[#71717a]">
              Show this QR at the gate when your registration is ready.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] border border-white/80 bg-white/55 shadow-[0_12px_24px_-20px_rgba(15,23,42,0.45)]">
            <PassportQrMini value={qrPayload} />
          </div>
        </div>
      </div>
    );
  }

  // Sequenced reveal callback: slide out first, then enlarge
  const handleTriggerReveal = useCallback(() => {
    clearTransitionTimeout();
    if (!isOpen) {
      setIsOpen(true);
      transitionTimeoutRef.current = setTimeout(() => {
        setQrExpanded(true);
      }, 380); // Waits for slide-out spring translation to complete
    } else {
      setQrExpanded(true);
    }
  }, [isOpen, clearTransitionTimeout]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (draggedRef.current) return;
    const target = e.target as HTMLElement;
    const isQrClick = target.closest('.qr-code-button');

    if (!isOpen) {
      handleTriggerReveal();
    } else {
      if (isQrClick) {
        setQrExpanded(true);
      } else {
        clearTransitionTimeout();
        setIsOpen(false);
      }
    }
  }, [isOpen, handleTriggerReveal, clearTransitionTimeout]);

  // When fullscreen QR is closed, automatically slide card back inside the wallet pocket
  const handleCloseExpandedQr = useCallback(() => {
    clearTransitionTimeout();
    setQrExpanded(false);
    transitionTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 350); // Waits for QR to shrink back to card before sliding down
  }, [clearTransitionTimeout]);

  // Animate card up/down:
  // - Open: slips all the way up out of the pocket (-146px)
  // - Closed & Hovered: peeks up slightly so it rises on hover
  // - Closed & Idle: positioned so the QR code is fully visible above the pocket back
  const targetY = isOpen ? -156 : (isHovered ? 18 : 32);

  return (
    <>
      <div
        ref={holderContainerRef}
        className="relative flex w-full justify-center"
        onMouseEnter={() => { if (!disableInteractivity) setIsHovered(true); }}
        onMouseLeave={disableInteractivity ? undefined : handleMouseLeave}
      >
        <div
          className="relative"
          style={{
            width: holderDesignWidth * holderScale,
            height: holderDesignHeight * holderScale,
          }}
        >
          <div
            className="origin-top-left"
            style={{
              width: holderDesignWidth,
              height: holderDesignHeight,
              transform: `scale(${holderScale})`,
            }}
          >
            <motion.div
              className={`relative h-[590px] w-[390px] touch-manipulation select-none overflow-visible ${disableInteractivity ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={disableInteractivity ? undefined : handleCardClick}
          >
          {/* Deep Ambient shadow behind the leather system */}
          <div className="absolute left-0 right-0 top-[104px] z-0 h-[330px] rounded-[38px] bg-[linear-gradient(90deg,#063c36_0%,#0b5d58_48%,#063c36_100%)] shadow-[0_34px_68px_-26px_rgba(4,45,41,0.42),inset_0_1px_1px_rgba(214,255,247,0.16)]" />

          {/* Silver Metal Card (Layer 2 - Middle) */}
          <motion.div
            layoutId="passport-metal-card"
            drag={disableInteractivity ? false : "y"}
            dragConstraints={disableInteractivity ? undefined : { top: -200, bottom: 180 }}
            dragElastic={disableInteractivity ? undefined : 0.2}
            onDragStart={disableInteractivity ? undefined : () => {
              draggedRef.current = true;
            }}
            onDragEnd={disableInteractivity ? undefined : () => {
              clearTransitionTimeout();
              setIsOpen(false);
              setTimeout(() => {
                draggedRef.current = false;
              }, 50);
            }}
            animate={{
              y: targetY,
              scale: isHovered ? 1.015 : 1,
            }}
            transition={premiumSpring}
            className="absolute left-1/2 -ml-[164px] top-0 z-10 h-[386px] w-[328px] rounded-[34px] border border-white/70 bg-[linear-gradient(135deg,#fafafa_0%,#e4e4e7_25%,#a1a1aa_50%,#f4f4f5_75%,#fafafa_100%)] p-5 shadow-[0_30px_54px_-28px_rgba(20,18,14,0.66),inset_0_1.5px_2px_rgba(255,255,255,0.9),inset_0_-34px_60px_rgba(42,45,43,0.16)] overflow-hidden"
          >
            {/* Monospace Milled CNC Chamfer Border Outline */}
            <div className="pointer-events-none absolute inset-[12px] rounded-[26px] border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.62),inset_0_-1px_0.5px_rgba(0,0,0,0.12)]" />
            
            {/* Card Content */}
            <motion.div
              layoutId="passport-card-content"
              layout
              transition={premiumSpring}
              className="relative h-full flex flex-col justify-between z-10"
            >
              <motion.div
                layoutId="passport-header"
                transition={premiumSpring}
                className="flex justify-center items-center"
              >
                <span className="font-mono text-[10px] font-bold tracking-[2px] text-[#3f3f46] uppercase text-center" style={textShadowStyle}>
                  Universal Pass
                </span>
              </motion.div>

              {/* Centered QR Frame */}
              <motion.div
                layoutId="passport-qr-code"
                transition={premiumSpring}
                className="relative mx-auto mt-1 flex h-[148px] w-[148px] items-center justify-center rounded-[29px] border border-white/80 bg-[linear-gradient(145deg,#ffffff_0%,#eef7f5_100%)] shadow-[0_19px_32px_-22px_rgba(10,10,10,0.72),inset_0_1.5px_0_rgba(255,255,255,0.98)] ring-1 ring-[#177564]/10"
              >
                <button
                  type="button"
                  aria-label="Open Passport QR"
                  className="qr-code-button relative z-10 flex h-full w-full items-center justify-center rounded-[27px] overflow-hidden p-3.5"
                >
                  <PassportQrMini value={qrPayload} />
                </button>
              </motion.div>

              <motion.div
                layoutId="passport-details"
                transition={premiumSpring}
                className="text-center pb-2"
              >
                <p className="font-mono text-[13px] font-bold uppercase tracking-[1.5px] text-[#09090b]" style={textShadowStyle}>
                  {name}
                </p>
                <p className="mt-1 font-mono text-[11px] font-bold tracking-[2.5px] text-[#27272a]" style={textShadowStyle}>
                  {passportCode}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Leather Pocket Back (Layer 2.5) */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-[294px] rounded-[38px] bg-[#0b5d58] bg-[linear-gradient(180deg,#0b7067_0%,#075f56_52%,#063c36_100%)] shadow-[0_32px_52px_-30px_rgba(4,45,41,0.58),inset_0_1px_0_rgba(214,255,247,0.22),inset_0_-24px_48px_rgba(0,0,0,0.2)] border border-[#084c46]">
            <div className="pointer-events-none absolute inset-3.5 rounded-[30px] border border-dashed border-[#b8ddd5]/30" />
          </div>

          {/* Footer Actions (Layer 3) */}
          {footerActions && (
            <div className="absolute bottom-[154px] left-[48px] right-[48px] z-30 flex items-end justify-center gap-2">
              {footerActions}
            </div>
          )}

          {/* Leather Pocket Front Lip (Layer 4) with Stamped Wordmark */}
          <div className="absolute bottom-[32px] left-[24px] right-[24px] z-40 h-[132px] rounded-[22px] bg-[#176f63] bg-[linear-gradient(135deg,#176f63_0%,#0a4c46_100%)] shadow-[0_19px_28px_-20px_rgba(3,33,30,0.48),inset_0_1px_0_rgba(225,255,249,0.22),inset_0_-22px_34px_rgba(0,0,0,0.22)] border border-[#0b4f48]">
            <div className="pointer-events-none absolute inset-2.5 rounded-[17px] border border-[#b8ddd5]/25" />
            
            {/* Elegant Debossed Branding system */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-75">
                  <img src={imgPlanOutLogo} alt="" className="h-6 w-auto opacity-30 brightness-0 invert pointer-events-none" />
                  <span className="mt-1 text-[8.5px] font-bold uppercase tracking-[3.5px] text-[#b8ddd5]/70">
                    PlanOut Passport
                  </span>
            </div>
          </div>

            </motion.div>
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay */}
      {createPortal(
        <AnimatePresence>
          {qrExpanded && (
            <motion.div
              layoutId="passport-metal-card"
              transition={premiumSpring}
              className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[linear-gradient(135deg,#fafafa_0%,#e4e4e7_25%,#a1a1aa_50%,#f4f4f5_75%,#fafafa_100%)] p-8 pt-[calc(36px+env(safe-area-inset-top))] pb-[calc(36px+env(safe-area-inset-bottom))] overflow-hidden cursor-pointer"
              onClick={handleCloseExpandedQr}
            >
              {/* Monospace Milled CNC Chamfer Border Outline */}
              <div className="pointer-events-none absolute inset-[16px] rounded-[24px] border border-white/28 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_0.5px_rgba(0,0,0,0.12)]" />

              {/* Card Content */}
              <motion.div
                layoutId="passport-card-content"
                layout
                transition={premiumSpring}
                className="relative h-full flex flex-col justify-between z-10"
              >
                <motion.div
                  layoutId="passport-header"
                  transition={premiumSpring}
                  className="flex justify-center items-center"
                >
                  <span className="font-mono text-[11px] font-bold tracking-[2.5px] text-[#3f3f46] uppercase text-center" style={textShadowStyle}>
                    Universal Pass
                  </span>
                </motion.div>

                {/* Centered QR Frame (Enlarged) */}
                <motion.div
                      layoutId="passport-qr-code"
                      transition={premiumSpring}
                      className="relative mx-auto flex h-[220px] w-[220px] items-center justify-center rounded-[34px] border border-white/80 bg-[linear-gradient(145deg,#ffffff_0%,#eef7f5_100%)] shadow-[0_24px_42px_-28px_rgba(10,10,10,0.76),inset_0_1.5px_0_rgba(255,255,255,0.98)] ring-1 ring-[#177564]/12"
                >
                  <div
                    className="qr-code-button relative z-10 flex h-full w-full items-center justify-center rounded-[32px] overflow-hidden p-5"
                  >
                    <PassportQrMini value={qrPayload} />
                  </div>
                </motion.div>

                <motion.div
                  layoutId="passport-details"
                  transition={premiumSpring}
                  className="text-center pb-2"
                >
                  <p className="font-mono text-[18px] font-bold uppercase tracking-[2.5px] text-[#09090b]" style={textShadowStyle}>
                    {name}
                  </p>
                  <p className="mt-1.5 font-mono text-[12px] font-bold tracking-[3px] text-[#27272a]" style={textShadowStyle}>
                    {passportCode}
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
