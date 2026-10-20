import React from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEW = { once: true, margin: '0px 0px -12% 0px' };

/** Fade and rise into view. */
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={VIEW}
    transition={{ duration: 0.9, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

/** Masked word-by-word reveal for headings. Screen readers get the plain text. */
export const TextReveal: React.FC<{ text: string; as?: 'h1' | 'h2'; className?: string; id?: string; delay?: number }> = ({
  text,
  as = 'h2',
  className,
  id,
  delay = 0,
}) => {
  const Tag = motion[as];
  return (
    <Tag
      id={id}
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      {text.split(' ').map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-top">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '110%', rotate: 4 }, show: { y: '0%', rotate: 0 } }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

/** Curtain wipe with a slow settle of the photograph inside. */
export const ImageReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    className={`overflow-hidden ${className}`}
    initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
    whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    viewport={VIEW}
    transition={{ duration: 1.1, delay, ease: EASE }}
  >
    <motion.div
      className="h-full"
      initial={{ scale: 1.25 }}
      whileInView={{ scale: 1 }}
      viewport={VIEW}
      transition={{ duration: 1.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  </motion.div>
);

/** Thin reading-progress bar under the header. */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-accent" />;
};

/** Endless text band at a constant speed (same CSS loop as the photo strip). */
export const TextMarquee: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
    <div className="marquee flex w-max" style={{ '--marquee-duration': '40s' } as React.CSSProperties}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="pr-12">{text}</span>
      ))}
    </div>
  </div>
);

/** Number that counts up the first time it scrolls into view. */
export const CountUp: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => `${Math.round(v)}${suffix}`);
  React.useEffect(() => {
    if (inView) animate(value, to, { duration: 2, ease: EASE });
  }, [inView, to, value]);
  return (
    <span ref={ref}>
      <motion.span aria-hidden>{text}</motion.span>
      <span className="sr-only">{`${to}${suffix}`}</span>
    </span>
  );
};

/** Wrapper that pulls its child slightly toward the pointer. */
export const Magnetic: React.FC<{ children: React.ReactNode; strength?: number }> = ({ children, strength = 0.3 }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  const reduce = useReducedMotion();
  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.span ref={ref} className="inline-block" style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
};

/** Card that tilts in 3D toward the pointer. */
export const Tilt: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const rx = useSpring(0, { stiffness: 150, damping: 20 });
  const ry = useSpring(0, { stiffness: 150, damping: 20 });
  const reduce = useReducedMotion();
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={() => { rx.set(0); ry.set(0); }}
    >
      {children}
    </motion.div>
  );
};
