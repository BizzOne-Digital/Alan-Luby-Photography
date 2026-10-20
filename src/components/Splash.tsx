import React, { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react';
import { photoById } from '../data/photography';

const EASE = [0.76, 0, 0.24, 1] as const;
const DURATION = 2.4;
const FLASH = ['jws-24957', 'dsc-7539', 'dsc-16185', 'dsc-81284', 'dsc-11003'].map(photoById);
const NAME = 'Alan Luby';

const shouldShow = () => {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem('splash-seen');
  } catch {
    return false;
  }
};

const SHOW_ON_LOAD = shouldShow();
const splashEndsAt = SHOW_ON_LOAD ? performance.now() + (DURATION + 0.5) * 1000 : 0;

/** Seconds until the splash curtain has opened, so page intros can wait for it. */
export const introDelay = () => Math.max(0, (splashEndsAt - performance.now()) / 1000);

/** Intro shown once per browser session. Click or Escape skips it. */
export const Splash: React.FC = () => {
  const [visible, setVisible] = useState(SHOW_ON_LOAD);
  const [frame, setFrame] = useState(0);
  const progress = useMotionValue(0);
  const counter = useTransform(progress, (v) => String(Math.round(v)).padStart(3, '0'));
  const bar = useTransform(progress, [0, 100], [0, 1]);

  useEffect(() => {
    if (!visible) return;
    try { sessionStorage.setItem('splash-seen', '1'); } catch { /* storage blocked: splash simply shows again */ }
    document.documentElement.style.overflow = 'hidden';
    const count = animate(progress, 100, { duration: DURATION, ease: [0.65, 0, 0.35, 1] });
    const flick = setInterval(() => setFrame((f) => Math.min(f + 1, FLASH.length - 1)), (DURATION * 1000) / FLASH.length);
    const done = setTimeout(() => setVisible(false), DURATION * 1000 + 200);
    const skip = (e: KeyboardEvent) => e.key === 'Escape' && setVisible(false);
    window.addEventListener('keydown', skip);
    return () => {
      count.stop();
      clearInterval(flick);
      clearTimeout(done);
      window.removeEventListener('keydown', skip);
      document.documentElement.style.overflow = '';
    };
  }, [visible, progress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          role="status"
          aria-label="Loading Alan Luby Photography"
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[100] cursor-pointer text-paper"
          exit={{ pointerEvents: 'none' }}
          transition={{ duration: 1 }}
        >
          {/* Split curtain: the two halves part on exit */}
          <motion.div className="absolute inset-x-0 top-0 h-[calc(50%+1px)] bg-ink" exit={{ y: '-100%' }} transition={{ duration: 0.9, ease: EASE }} />
          <motion.div className="absolute inset-x-0 bottom-0 h-[calc(50%+1px)] bg-ink" exit={{ y: '100%' }} transition={{ duration: 0.9, ease: EASE }} />

          <motion.div className="relative flex h-full flex-col items-center justify-center" exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4 }}>
            {/* Photo flicker: each frame wipes in over the last, like a burst of exposures */}
            <div className="relative aspect-[4/5] w-[min(62vw,19rem)] overflow-hidden">
              {FLASH.slice(0, frame + 1).map((p, i) => (
                <motion.img
                  key={p.id}
                  src={`/images/work/${p.id}-640.webp`}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: p.focus }}
                  initial={{ clipPath: i % 2 ? 'inset(0 0 0 100%)' : 'inset(100% 0 0 0)', scale: 1.4, rotate: i % 2 ? -3 : 3 }}
                  animate={{ clipPath: 'inset(0 0 0 0%)', scale: 1, rotate: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                />
              ))}
              {/* Shutter flash on every frame change */}
              <motion.div key={`flash-${frame}`} className="absolute inset-0 bg-paper" initial={{ opacity: 0.55 }} animate={{ opacity: 0 }} transition={{ duration: 0.35 }} />
            </div>

            <h2 className="mt-8 flex overflow-hidden font-display text-[clamp(2.75rem,10vw,6.5rem)] leading-none" aria-hidden>
              {NAME.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: '110%', rotate: 8 }}
                  animate={{ y: '0%', rotate: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
            </h2>
            <motion.p
              className="mt-3 text-sm tracking-[0.3em] text-paper/70"
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              PHOTOGRAPHY
            </motion.p>
          </motion.div>

          <div className="absolute inset-x-5 bottom-6 flex items-end justify-between text-sm text-paper/60 sm:inset-x-10 sm:bottom-10">
            <span>Events · Portraits · Sports · Performance</span>
            <motion.span className="font-display text-4xl tabular-nums text-paper sm:text-6xl">{counter}</motion.span>
          </div>
          <motion.div className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-accent" style={{ scaleX: bar }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
