/**
 * @file IOSKeyboard.tsx
 * @description A pixel-accurate iOS soft keyboard simulation for desktop
 *   browser mobile previews. Real touch devices use the native keyboard.
 *   It renders at `position: fixed` and is mounted outside any CSS-transform
 *   wrappers via AppProviderLayout so fixed-positioning always works correctly.
 *
 *   Supports three views:
 *   - Alpha  → QWERTY with shift, 123 toggle
 *   - Numbers → 1-0 row + punctuation (from 123 button)
 *   - Pad    → Pure number pad (for inputMode="numeric" / type="tel")
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type KbView = 'alpha' | 'numbers' | 'pad';
type KbType = 'default' | 'email' | 'numeric' | 'tel';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const KEYBOARD_SIMULATION_STORAGE_KEY = 'planout.keyboard.simulation';

function readSimulationOverride(): boolean | null {
  if (typeof window === 'undefined') return null;

  const normalize = (value: string | null) => value?.trim().toLowerCase() || '';
  const queryValue = normalize(
    new URLSearchParams(window.location.search).get('keyboard') ||
      new URLSearchParams(window.location.search).get('iosKeyboard'),
  );

  if (['1', 'true', 'on', 'sim', 'simulate', 'simulated', 'test'].includes(queryValue)) return true;
  if (['0', 'false', 'off', 'native', 'none'].includes(queryValue)) return false;

  try {
    const stored = normalize(window.localStorage.getItem(KEYBOARD_SIMULATION_STORAGE_KEY));
    if (['1', 'true', 'on', 'sim', 'simulate', 'simulated', 'test'].includes(stored)) return true;
    if (['0', 'false', 'off', 'native', 'none'].includes(stored)) return false;
  } catch {
    // Storage can be unavailable in embedded or private contexts.
  }

  return null;
}

function hasNativeTouchKeyboard() {
  if (typeof window === 'undefined') return false;

  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const hasTouch = maxTouchPoints > 0 || 'ontouchstart' in window;
  const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const userAgent = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const looksLikeMobileDevice = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(userAgent);
  const iPadDesktopMode = platform === 'MacIntel' && maxTouchPoints > 1;

  return hasTouch && (hasCoarsePointer || looksLikeMobileDevice || iPadDesktopMode);
}

function shouldUseKeyboardSimulation() {
  if (typeof window === 'undefined') return false;
  const override = readSimulationOverride();
  if (override != null) return override;
  return window.innerWidth < 768 && !hasNativeTouchKeyboard();
}

/** Trigger React's onChange for controlled inputs via the native value setter. */
function dispatchNativeChange(
  el: HTMLInputElement | HTMLTextAreaElement,
  newValue: string,
) {
  const proto =
    el.tagName === 'TEXTAREA'
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  if (setter) {
    setter.call(el, newValue);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

// ---------------------------------------------------------------------------
// Style constants
// ---------------------------------------------------------------------------

const KB_BG = '#CDD1D6';
const KEY_BG = '#FFFFFF';
const DARK_BG = '#ADB5BD';
const KEY_SHADOW = '0px 1px 0px rgba(0,0,0,0.32)';
const KEY_RADIUS = '5px';

// ---------------------------------------------------------------------------
// Primitive key components
// ---------------------------------------------------------------------------

interface KeyProps {
  label: React.ReactNode;
  onPress: () => void;
  bg?: string;
  textSize?: string;
  style?: React.CSSProperties;
  className?: string;
}

function KbKey({ label, onPress, bg = KEY_BG, textSize = '17px', style = {}, className = '' }: KeyProps) {
  return (
    <button
      type="button"
      onPointerDown={(e) => { e.preventDefault(); onPress(); }}
      className={`flex items-center justify-center h-[42px] rounded-[5px] text-black select-none cursor-pointer transition-opacity active:opacity-40 ${className}`}
      style={{
        background: bg,
        boxShadow: KEY_SHADOW,
        borderRadius: KEY_RADIUS,
        fontSize: textSize,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
        fontWeight: 400,
        ...style,
      }}
    >
      {label}
    </button>
  );
}

function BackspaceIcon() {
  return (
    <svg width="22" height="17" viewBox="0 0 22 17" fill="none">
      <path
        d="M9 1H20C20.5523 1 21 1.44772 21 2V15C21 15.5523 20.5523 16 20 16H9L1.5 8.5L9 1Z"
        stroke="#000"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 6L13.5 11M13.5 6L9 11" stroke="#000" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ShiftIcon({ active }: { active: boolean }) {
  return (
    <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
      <path
        d="M8.5 1L16 8.5H12V18H5V8.5H1L8.5 1Z"
        fill={active ? '#000' : 'none'}
        stroke="#000"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Alpha keyboard (QWERTY)
// ---------------------------------------------------------------------------

const ROW1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
const ROW2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
const ROW3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

interface AlphaKbProps {
  isCaps: boolean;
  onCaps: () => void;
  onKey: (k: string) => void;
  onSwitchToNumbers: () => void;
  kbType: KbType;
}

function AlphaKeyboard({ isCaps, onCaps, onKey, onSwitchToNumbers, kbType }: AlphaKbProps) {
  const ch = (k: string) => (isCaps ? k.toUpperCase() : k);

  return (
    <div
      className="flex flex-col select-none"
      style={{ background: KB_BG, padding: '8px 4px 0 4px', gap: '10px' }}
    >
      {/* Row 1 */}
      <div className="flex gap-[5px]">
        {ROW1.map((k) => (
          <KbKey key={k} label={ch(k)} onPress={() => onKey(k)} className="flex-1" />
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex gap-[5px]" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
        {ROW2.map((k) => (
          <KbKey key={k} label={ch(k)} onPress={() => onKey(k)} className="flex-1" />
        ))}
      </div>

      {/* Row 3 — shift, letters, backspace */}
      <div className="flex gap-[5px] items-center">
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); onCaps(); }}
          className="flex items-center justify-center h-[42px] select-none cursor-pointer active:opacity-40 transition-opacity"
          style={{
            width: '42px',
            background: isCaps ? '#555559' : DARK_BG,
            boxShadow: KEY_SHADOW,
            borderRadius: KEY_RADIUS,
            flexShrink: 0,
          }}
        >
          <ShiftIcon active={isCaps} />
        </button>
        {ROW3.map((k) => (
          <KbKey key={k} label={ch(k)} onPress={() => onKey(k)} className="flex-1" />
        ))}
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); onKey('backspace'); }}
          className="flex items-center justify-center h-[42px] select-none cursor-pointer active:opacity-40 transition-opacity"
          style={{
            width: '42px',
            background: DARK_BG,
            boxShadow: KEY_SHADOW,
            borderRadius: KEY_RADIUS,
            flexShrink: 0,
          }}
        >
          <BackspaceIcon />
        </button>
      </div>

      {/* Row 4 — 123, space, (@ for email), return */}
      <div className="flex gap-[5px] items-center" style={{ paddingBottom: '8px' }}>
        <KbKey
          label="123"
          onPress={onSwitchToNumbers}
          bg={DARK_BG}
          textSize="15px"
          style={{ width: '84px', fontWeight: 500, flexShrink: 0 }}
        />
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); onKey('space'); }}
          className="flex-1 flex items-center justify-center h-[42px] text-black select-none cursor-pointer active:opacity-40 transition-opacity"
          style={{
            background: KEY_BG,
            boxShadow: KEY_SHADOW,
            borderRadius: KEY_RADIUS,
            fontSize: '17px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          }}
        >
          space
        </button>
        {kbType === 'email' && (
          <KbKey
            label="@"
            onPress={() => onKey('@')}
            bg={DARK_BG}
            textSize="17px"
            style={{ width: '40px', flexShrink: 0 }}
          />
        )}
        <KbKey
          label={kbType === 'email' ? 'done' : 'return'}
          onPress={() => onKey('return')}
          bg={DARK_BG}
          textSize="15px"
          style={{
            width: kbType === 'email' ? '64px' : '84px',
            fontWeight: 500,
            flexShrink: 0,
          }}
        />
      </div>

      {/* iOS home indicator spacing */}
      <div style={{ height: '10px', background: KB_BG }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Numbers + punctuation keyboard (123 view from alpha)
// ---------------------------------------------------------------------------

const NUM_ROW1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const PUNCT_ROW = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'];
const SYM_ROW   = ['.', ',', '?', '!', "'"];

interface NumbersKbProps {
  onKey: (k: string) => void;
  onSwitchToAlpha: () => void;
}

function NumbersKeyboard({ onKey, onSwitchToAlpha }: NumbersKbProps) {
  return (
    <div
      className="flex flex-col select-none"
      style={{ background: KB_BG, padding: '8px 4px 0 4px', gap: '10px' }}
    >
      {/* Row 1 — 0–9 */}
      <div className="flex gap-[5px]">
        {NUM_ROW1.map((k) => (
          <KbKey key={k} label={k} onPress={() => onKey(k)} className="flex-1" />
        ))}
      </div>

      {/* Row 2 — punctuation */}
      <div className="flex gap-[5px]">
        {PUNCT_ROW.map((k) => (
          <KbKey key={k} label={k} onPress={() => onKey(k)} className="flex-1" />
        ))}
      </div>

      {/* Row 3 — symbols + backspace */}
      <div className="flex gap-[5px] items-center">
        <KbKey
          label="#+"
          onPress={() => {}} // could add a third symbols view — noop for now
          bg={DARK_BG}
          textSize="15px"
          style={{ width: '42px', flexShrink: 0, fontWeight: 500 }}
        />
        {SYM_ROW.map((k) => (
          <KbKey key={k} label={k} onPress={() => onKey(k)} className="flex-1" />
        ))}
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); onKey('backspace'); }}
          className="flex items-center justify-center h-[42px] select-none cursor-pointer active:opacity-40 transition-opacity"
          style={{
            width: '42px',
            background: DARK_BG,
            boxShadow: KEY_SHADOW,
            borderRadius: KEY_RADIUS,
            flexShrink: 0,
          }}
        >
          <BackspaceIcon />
        </button>
      </div>

      {/* Row 4 — ABC, space, return */}
      <div className="flex gap-[5px] items-center" style={{ paddingBottom: '8px' }}>
        <KbKey
          label="ABC"
          onPress={onSwitchToAlpha}
          bg={DARK_BG}
          textSize="15px"
          style={{ width: '84px', fontWeight: 500, flexShrink: 0 }}
        />
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); onKey('space'); }}
          className="flex-1 flex items-center justify-center h-[42px] text-black select-none cursor-pointer active:opacity-40 transition-opacity"
          style={{
            background: KEY_BG,
            boxShadow: KEY_SHADOW,
            borderRadius: KEY_RADIUS,
            fontSize: '17px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
          }}
        >
          space
        </button>
        <KbKey
          label="return"
          onPress={() => onKey('return')}
          bg={DARK_BG}
          textSize="15px"
          style={{ width: '84px', fontWeight: 500, flexShrink: 0 }}
        />
      </div>

      <div style={{ height: '10px', background: KB_BG }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pure number pad (for inputMode="numeric" | type="tel")
// ---------------------------------------------------------------------------

interface PadKbProps {
  onKey: (k: string) => void;
  kbType: KbType;
}

const PAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

function PadKeyboard({ onKey, kbType }: PadKbProps) {
  return (
    <div
      className="flex flex-col select-none"
      style={{ background: KB_BG, padding: '8px 4px 0 4px', gap: '10px' }}
    >
      {PAD_ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-[5px]">
          {row.map((k) => (
            <KbKey key={k} label={k} onPress={() => onKey(k)} textSize="22px" className="flex-1" />
          ))}
        </div>
      ))}

      {/* Bottom row */}
      <div className="flex gap-[5px] items-center" style={{ paddingBottom: '8px' }}>
        {kbType === 'tel' ? (
          <KbKey label="*" onPress={() => onKey('*')} textSize="22px" className="flex-1" />
        ) : (
          <div className="flex-1" />
        )}
        <KbKey label="0" onPress={() => onKey('0')} textSize="22px" className="flex-1" />
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); onKey('backspace'); }}
          className="flex-1 flex items-center justify-center h-[42px] select-none cursor-pointer active:opacity-40 transition-opacity"
          style={{
            background: DARK_BG,
            boxShadow: KEY_SHADOW,
            borderRadius: KEY_RADIUS,
          }}
        >
          <BackspaceIcon />
        </button>
      </div>

      <div style={{ height: '10px', background: KB_BG }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export function IOSKeyboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<KbView>('alpha');
  const [kbType, setKbType] = useState<KbType>('default');
  const [isCaps, setIsCaps] = useState(true);
  const activeElRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // -------------------------------------------------------------------------
  // Focus tracking
  // -------------------------------------------------------------------------

  useEffect(() => {
    const onFocusin = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') return;

      if (!shouldUseKeyboardSimulation()) {
        setIsVisible(false);
        activeElRef.current = null;
        return;
      }

      const el = target as HTMLInputElement | HTMLTextAreaElement;
      activeElRef.current = el;

      const inputMode = el.getAttribute('inputmode') || el.getAttribute('inputMode') || '';
      const type = (el as HTMLInputElement).type || 'text';

      if (inputMode === 'numeric' || inputMode === 'decimal' || type === 'number') {
        setKbType('numeric');
        setView('pad');
      } else if (type === 'tel' || inputMode === 'tel') {
        setKbType('tel');
        setView('pad');
      } else if (type === 'email' || inputMode === 'email') {
        setKbType('email');
        setView('alpha');
      } else {
        setKbType('default');
        setView('alpha');
      }

      setIsVisible(true);

      // Scroll the focused element above the keyboard after it animates in
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 320);
    };

    const onFocusout = () => {
      // Delay so we don't hide if focus moves to another input
      setTimeout(() => {
        const active = document.activeElement;
        if (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA') return;
        setIsVisible(false);
        activeElRef.current = null;
      }, 180);
    };

    document.addEventListener('focusin', onFocusin);
    document.addEventListener('focusout', onFocusout);
    return () => {
      document.removeEventListener('focusin', onFocusin);
      document.removeEventListener('focusout', onFocusout);
    };
  }, []);

  // -------------------------------------------------------------------------
  // Key press handler
  // -------------------------------------------------------------------------

  const handleKey = useCallback(
    (key: string) => {
      const el = activeElRef.current;
      if (!el) return;

      const value = el.value;
      const start = (el as HTMLInputElement).selectionStart ?? value.length;
      const end = (el as HTMLInputElement).selectionEnd ?? value.length;

      let newValue: string;
      let newCursor: number;

      if (key === 'backspace') {
        if (start !== end) {
          newValue = value.slice(0, start) + value.slice(end);
          newCursor = start;
        } else if (start > 0) {
          newValue = value.slice(0, start - 1) + value.slice(start);
          newCursor = start - 1;
        } else {
          return;
        }
      } else if (key === 'return') {
        if (el.tagName === 'TEXTAREA') {
          newValue = value.slice(0, start) + '\n' + value.slice(end);
          newCursor = start + 1;
          dispatchNativeChange(el, newValue);
          requestAnimationFrame(() => {
            try {
              (el as HTMLInputElement).setSelectionRange(newCursor, newCursor);
            } catch {
              // read-only or not supported
            }
          });
          return;
        } else {
          // Trigger Enter key event so form submit / next-field handlers fire
          el.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
          );
          el.blur();
          activeElRef.current = null;
          setIsVisible(false);
          return;
        }
      } else if (key === 'space') {
        newValue = value.slice(0, start) + ' ' + value.slice(end);
        newCursor = start + 1;
      } else {
        // Special chars keep their own case; letters follow isCaps
        const specialChars = new Set([
          '@', '.', ',', '!', '?', "'", '"', '-', '/', ':', ';',
          '(', ')', '$', '&', '#', '+', '*',
        ]);
        const char = specialChars.has(key) ? key : isCaps ? key.toUpperCase() : key;
        newValue = value.slice(0, start) + char + value.slice(end);
        newCursor = start + 1;

        // iOS auto-lowercases after typing the first character
        if (isCaps && !specialChars.has(key) && view === 'alpha') {
          setIsCaps(false);
        }
      }

      dispatchNativeChange(el, newValue);
      requestAnimationFrame(() => {
        try {
          (el as HTMLInputElement).setSelectionRange(newCursor, newCursor);
        } catch {
          // no-op
        }
      });
    },
    [isCaps, view],
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="ios-keyboard"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 38, stiffness: 500, mass: 0.8 }}
          // fixed + very high z-index; this component must live OUTSIDE any
          // CSS-transform wrapper or position:fixed breaks.
          className="fixed bottom-0 left-0 right-0 z-[99999] md:hidden"
          // Prevent pointer events from blurring the active input
          onPointerDown={(e) => e.preventDefault()}
        >
          {view === 'alpha' && (
            <AlphaKeyboard
              isCaps={isCaps}
              onCaps={() => setIsCaps((c) => !c)}
              onKey={handleKey}
              onSwitchToNumbers={() => setView('numbers')}
              kbType={kbType}
            />
          )}
          {view === 'numbers' && (
            <NumbersKeyboard
              onKey={handleKey}
              onSwitchToAlpha={() => setView('alpha')}
            />
          )}
          {view === 'pad' && (
            <PadKeyboard
              onKey={handleKey}
              kbType={kbType}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
