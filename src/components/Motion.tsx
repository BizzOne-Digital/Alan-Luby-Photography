import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

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
