/**
 * @file RestrictedPage.tsx
 * @description "Coming Soon / Restricted Access" page shown at /exclusive.
 * Displayed to users who are not on the venue's network during the PlanOut soft launch.
 * Standalone — no app chrome (no nav, header, or footer).
 */

import React from 'react';
import { motion } from 'motion/react';
import { Lock, CalendarDays, MapPin } from 'lucide-react';
import imgLogo from '@/assets/5a332411061613331a1ffc8c7aa2ccf247ff8699.png';

export function RestrictedPage() {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden selection:bg-[#177564]/20 selection:text-slate-900"
      style={{ background: '#f4f8f7' }}
    >
      {/* ── Mesh gradient layer ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Orb 1 — soft primary green, top-left */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '70vw',
            height: '70vw',
            maxWidth: 640,
            maxHeight: 640,
            top: '-20%',
            left: '-20%',
            background: 'radial-gradient(circle, rgba(23,117,100,0.12) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Orb 2 — light mint, top-right */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '55vw',
            height: '55vw',
            maxWidth: 500,
            maxHeight: 500,
            top: '-10%',
            right: '-15%',
            background: 'radial-gradient(circle, rgba(60,212,185,0.15) 0%, transparent 70%)',
            filter: 'blur(56px)',
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />

        {/* Orb 3 — clean white/glow, bottom-center */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '80vw',
            height: '80vw',
            maxWidth: 720,
            maxHeight: 720,
            bottom: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        {/* Orb 4 — subtle warm hint, bottom-right, for depth */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '45vw',
            height: '45vw',
            maxWidth: 400,
            maxHeight: 400,
            bottom: '5%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(240,245,240,0.6) 0%, transparent 70%)',
            filter: 'blur(52px)',
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.7, 0.9, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Orb 5 — tiny bright accent, mid-left */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '30vw',
            height: '30vw',
            maxWidth: 260,
            maxHeight: 260,
            top: '42%',
            left: '-5%',
            background: 'radial-gradient(circle, rgba(23,117,100,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>

      {/* ── Grain / noise texture overlay ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
        }}
      />

      {/* ── Soft light vignette ── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(255,255,255,0.4) 100%)',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[440px] px-6 py-12 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <img
            src={imgLogo}
            alt="PlanOut"
            className="h-8 w-auto object-contain"
            style={{ filter: 'brightness(0) invert(0.12)' }}
          />
        </motion.div>

        {/* Lock badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-[9px] rounded-full border"
            style={{
              background: 'rgba(255,255,255,0.6)',
              borderColor: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 12px rgba(23,117,100,0.06), inset 0 1px 1px rgba(255,255,255,0.9)',
            }}
          >
            <Lock className="w-3.5 h-3.5" style={{ color: '#177564' }} strokeWidth={2.5} />
            <span
              className="text-[12px] tracking-[0.6px] uppercase"
              style={{ color: '#177564', fontWeight: 600 }}
            >
              Restricted Access
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
          style={{
            color: '#0f172a',
            fontSize: 'clamp(24px, 6vw, 32px)',
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '-0.5px',
          }}
        >
          This platform is exclusively for attendees of the{' '}
          <span style={{ color: '#177564' }}>PlanOut Press Launch.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ color: 'rgba(15,23,42,0.6)', fontSize: '15px', lineHeight: 1.6 }}
          className="mb-10 max-w-[340px]"
        >
          Check back later! The new and better PlanOut will be available on{' '}
          <span style={{ color: 'rgba(15,23,42,0.95)', fontWeight: 600 }}>
            April 11 at 2PM.
          </span>
        </motion.p>

        {/* Date + time card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full rounded-[24px] overflow-hidden relative"
          style={{
            background: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.7)',
            backdropFilter: 'blur(40px)',
            boxShadow:
              '0 8px 32px rgba(23,117,100,0.06), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          {/* Subtle inner highlight */}
          <div className="absolute inset-0 pointer-events-none rounded-[24px] border border-white/40 mix-blend-overlay" />

          {/* Top accent bar */}
          <div
            className="h-[3px] w-full relative z-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(23,117,100,0.6) 30%, rgba(60,212,185,0.8) 70%, transparent 100%)',
            }}
          />

          <div className="flex divide-x relative z-10" style={{ borderColor: 'rgba(23,117,100,0.08)' }}>
            {/* Date */}
            <div className="flex-1 flex flex-col items-center gap-2 py-6 px-4">
              <div className="flex items-center gap-1.5" style={{ color: '#177564' }}>
                <CalendarDays className="w-4 h-4" />
                <span
                  className="uppercase tracking-[0.5px]"
                  style={{ fontSize: '10px', fontWeight: 700 }}
                >
                  Date
                </span>
              </div>
              <span
                style={{ color: '#0f172a', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px' }}
              >
                April 11
              </span>
              <span style={{ color: 'rgba(15,23,42,0.5)', fontSize: '12px', fontWeight: 500 }}>Friday, 2026</span>
            </div>

            {/* Time */}
            <div
              className="flex-1 flex flex-col items-center gap-2 py-6 px-4"
              style={{ borderLeftColor: 'rgba(23,117,100,0.08)' }}
            >
              <div className="flex items-center gap-1.5" style={{ color: '#177564' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span
                  className="uppercase tracking-[0.5px]"
                  style={{ fontSize: '10px', fontWeight: 700 }}
                >
                  Time
                </span>
              </div>
              <span
                style={{ color: '#0f172a', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.3px' }}
              >
                2:00 PM
              </span>
              <span style={{ color: 'rgba(15,23,42,0.5)', fontSize: '12px', fontWeight: 500 }}>Philippine Time (PHT)</span>
            </div>
          </div>

          {/* Location row */}
          <div
            className="flex items-center justify-center gap-2 px-4 py-3.5 border-t relative z-10"
            style={{ borderColor: 'rgba(23,117,100,0.08)' }}
          >
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#177564' }} />
            <span style={{ color: 'rgba(15,23,42,0.55)', fontSize: '12px', fontWeight: 500 }}>
              PlanOut Press Conference · Attendees only
            </span>
          </div>
        </motion.div>

        {/* Footer wordmark */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{ color: 'rgba(15,23,42,0.3)', fontSize: '12px', marginTop: '48px', fontWeight: 500 }}
        >
          © 2026 PlanOut · All rights reserved
        </motion.p>
      </div>
    </div>
  );
}
