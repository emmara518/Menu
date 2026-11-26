import React, { useCallback, useRef, useState } from 'react';
import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  Transition,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

export type NavDirection = 1 | -1 | 0;

export const TACTILE_SPRING: Transition = {
  type: 'spring',
  stiffness: 480,
  damping: 30,
  mass: 0.65,
};

export const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const SCREEN_TRANSITION_VARIANTS = {
  initial: (direction: NavDirection) => {
    if (direction === 1) {
      return { opacity: 0, x: -28, scale: 0.99 };
    }
    if (direction === -1) {
      return { opacity: 0, x: 28, scale: 0.99 };
    }
    return { opacity: 0, y: 14, scale: 0.99 };
  },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: SMOOTH_EASE,
    },
  },
  exit: (direction: NavDirection) => {
    if (direction === 1) {
      return {
        opacity: 0,
        x: 20,
        scale: 0.992,
        transition: { duration: 0.17, ease: SMOOTH_EASE },
      };
    }
    if (direction === -1) {
      return {
        opacity: 0,
        x: -20,
        scale: 0.992,
        transition: { duration: 0.17, ease: SMOOTH_EASE },
      };
    }
    return {
      opacity: 0,
      y: -10,
      scale: 0.992,
      transition: { duration: 0.17, ease: SMOOTH_EASE },
    };
  },
};

/**
 * Subtle scroll-linked parallax frame for product & category imagery.
 * Animates only compositor transform (`translateY` + overscan `scale`)
 * inside an overflow-clipped container, with spring smoothing and
 * automatic opt-out when reduced motion is enabled.
 */
interface ParallaxMediaProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical parallax travel distance in pixels across viewport traversal */
  range?: number;
  /** Overscan scale factor to prevent edge reveal during parallax travel */
  overscanScale?: number;
  /** Optional subtle zoom progression on scroll */
  scrollScaleDelta?: number;
}

export const ParallaxMedia: React.FC<ParallaxMediaProps> = ({
  children,
  className = '',
  range = 10,
  overscanScale = 1.14,
  scrollScaleDelta = 0.03,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-range, range]);
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [overscanScale, overscanScale + scrollScaleDelta, overscanScale]
  );

  const smoothY = useSpring(rawY, {
    stiffness: 180,
    damping: 26,
    mass: 0.4,
  });

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        style={
          shouldReduceMotion
            ? undefined
            : {
                y: smoothY,
                scale: rawScale,
              }
        }
        className="w-full h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

/**
 * Scroll-linked vertical depth shift for hero & detail focal stages.
 * Anchored cleanly from top-of-page scroll (`start start` -> `end start`)
 * so initial paint at scrollY = 0 sits strictly at rest (y = 0, scale = 1).
 */
interface ParallaxStageProps {
  children: React.ReactNode;
  className?: string;
  /** Downward/upward travel at end of stage exit in px */
  yDistance?: number;
  /** Target scale when scrolled past the stage */
  exitScale?: number;
}

export const ParallaxStage: React.FC<ParallaxStageProps> = ({
  children,
  className = '',
  yDistance = 28,
  exitScale = 0.95,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, yDistance]);
  const rawScale = useTransform(scrollYProgress, [0, 1], [1, exitScale]);

  const smoothY = useSpring(rawY, {
    stiffness: 170,
    damping: 26,
    mass: 0.4,
  });

  const hasExplicitPosition = /\b(absolute|fixed|sticky)\b/.test(className);
  const positionClass = hasExplicitPosition ? '' : 'relative';

  return (
    <div ref={stageRef} className={`${positionClass} ${className}`}>
      <motion.div
        style={
          shouldReduceMotion
            ? undefined
            : {
                y: smoothY,
                scale: rawScale,
              }
        }
        className="w-full h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

export type RippleTone = 'yellow' | 'dark' | 'light' | 'crimson';

const RIPPLE_GLOW_STYLES: Record<
  RippleTone,
  { background: string; boxShadow: string }
> = {
  yellow: {
    background:
      'radial-gradient(circle, rgba(255, 232, 138, 0.78) 0%, rgba(255, 196, 0, 0.44) 44%, rgba(255, 196, 0, 0.12) 68%, transparent 76%)',
    boxShadow: 'inset 0 0 0 1.5px rgba(255, 224, 102, 0.6)',
  },
  dark: {
    background:
      'radial-gradient(circle, rgba(255, 253, 245, 0.72) 0%, rgba(255, 212, 92, 0.36) 44%, rgba(11, 9, 8, 0.14) 68%, transparent 76%)',
    boxShadow: 'inset 0 0 0 1.5px rgba(255, 255, 255, 0.58)',
  },
  light: {
    background:
      'radial-gradient(circle, rgba(255, 250, 242, 0.82) 0%, rgba(247, 232, 214, 0.46) 44%, rgba(255, 214, 120, 0.14) 68%, transparent 76%)',
    boxShadow: 'inset 0 0 0 1.5px rgba(255, 248, 235, 0.68)',
  },
  crimson: {
    background:
      'radial-gradient(circle, rgba(255, 175, 168, 0.76) 0%, rgba(215, 38, 38, 0.46) 44%, rgba(215, 38, 38, 0.12) 68%, transparent 76%)',
    boxShadow: 'inset 0 0 0 1.5px rgba(255, 132, 122, 0.6)',
  },
};

export function useTapRipple() {
  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const nextId = useRef(0);

  const spawnRipple = useCallback((el: HTMLElement, clientX = 0, clientY = 0) => {
    const rect = el.getBoundingClientRect();
    const isKeyboardOrFallback = clientX === 0 && clientY === 0;
    const x = isKeyboardOrFallback ? rect.width / 2 : clientX - rect.left;
    const y = isKeyboardOrFallback ? rect.height / 2 : clientY - rect.top;
    const maxCornerDist = Math.hypot(
      Math.max(x, rect.width - x),
      Math.max(y, rect.height - y)
    );
    const size = Math.max(maxCornerDist * 2.15, 48);

    const id = ++nextId.current;
    setRipples((prev) => [...prev.slice(-3), { id, x, y, size }]);
  }, []);

  const triggerRipple = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      spawnRipple(e.currentTarget, e.clientX, e.clientY);
    },
    [spawnRipple]
  );

  const triggerCenterRipple = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        spawnRipple(e.currentTarget, 0, 0);
      }
    },
    [spawnRipple]
  );

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { ripples, triggerRipple, triggerCenterRipple, removeRipple };
}

export const RippleOverlay: React.FC<{
  ripples: RippleItem[];
  onDone: (id: number) => void;
  tone?: RippleTone;
}> = ({ ripples, onDone, tone = 'yellow' }) => {
  const shouldReduceMotion = useReducedMotion();
  const toneStyle = RIPPLE_GLOW_STYLES[tone];

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] z-20"
    >
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={
              shouldReduceMotion
                ? { scale: 1, opacity: 0.35 }
                : { scale: 0.08, opacity: 0.95 }
            }
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0.22 : 0.52,
              ease: [0.16, 1, 0.3, 1],
            }}
            onAnimationComplete={() => onDone(r.id)}
            style={{
              left: r.x - r.size / 2,
              top: r.y - r.size / 2,
              width: r.size,
              height: r.size,
              background: toneStyle.background,
              boxShadow: toneStyle.boxShadow,
            }}
            className="absolute rounded-full will-change-transform"
          />
        ))}
      </AnimatePresence>
    </span>
  );
};

interface TapRippleButtonProps extends HTMLMotionProps<'button'> {
  rippleTone?: RippleTone;
  tapScale?: number;
  hoverScale?: number;
  children?: React.ReactNode;
}

export const TapRippleButton = React.forwardRef<
  HTMLButtonElement,
  TapRippleButtonProps
>(
  (
    {
      rippleTone = 'yellow',
      tapScale = 0.96,
      hoverScale,
      className = '',
      disabled,
      onPointerDown,
      onKeyDown,
      children,
      ...props
    },
    ref
  ) => {
    const { ripples, triggerRipple, triggerCenterRipple, removeRipple } =
      useTapRipple();

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        whileTap={disabled ? undefined : { scale: tapScale }}
        whileHover={
          disabled || hoverScale === undefined ? undefined : { scale: hoverScale }
        }
        transition={TACTILE_SPRING}
        onPointerDown={(e) => {
          if (!disabled) triggerRipple(e);
          onPointerDown?.(e);
        }}
        onKeyDown={(e) => {
          if (!disabled) triggerCenterRipple(e);
          onKeyDown?.(e);
        }}
        className={`relative ${className}`}
        {...props}
      >
        <RippleOverlay
          ripples={ripples}
          onDone={removeRipple}
          tone={rippleTone}
        />
        {children}
      </motion.button>
    );
  }
);

TapRippleButton.displayName = 'TapRippleButton';

interface TapRippleAnchorProps extends HTMLMotionProps<'a'> {
  rippleTone?: RippleTone;
  tapScale?: number;
  children?: React.ReactNode;
}

export const TapRippleAnchor: React.FC<TapRippleAnchorProps> = ({
  rippleTone = 'dark',
  tapScale = 0.97,
  className = '',
  onPointerDown,
  onKeyDown,
  children,
  ...props
}) => {
  const { ripples, triggerRipple, triggerCenterRipple, removeRipple } =
    useTapRipple();

  return (
    <motion.a
      whileTap={{ scale: tapScale }}
      transition={TACTILE_SPRING}
      onPointerDown={(e) => {
        triggerRipple(e);
        onPointerDown?.(e);
      }}
      onKeyDown={(e) => {
        triggerCenterRipple(e);
        onKeyDown?.(e);
      }}
      className={`relative ${className}`}
      {...props}
    >
      <RippleOverlay
        ripples={ripples}
        onDone={removeRipple}
        tone={rippleTone}
      />
      {children}
    </motion.a>
  );
};
