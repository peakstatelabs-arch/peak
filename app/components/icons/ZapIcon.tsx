"use client";

import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ZapIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ZapIconProps {
  size?: number;
  className?: string;
}

const ZapIcon = forwardRef<ZapIconHandle, ZapIconProps>(
  ({ size = 24, className = "" }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(() => {
      controls.start("animate");
    }, [controls]);

    const handleMouseLeave = useCallback(() => {
      controls.start("normal");
    }, [controls]);

    return (
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
        >
          <motion.path
            animate={controls}
            d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
            variants={{
              normal: {
                opacity: 1,
                pathLength: 1,
                transition: { duration: 0.6, opacity: { duration: 0.1 } },
              },
              animate: {
                opacity: [0, 1],
                pathLength: [0, 1],
                transition: { duration: 0.6, opacity: { duration: 0.1 } },
              },
            }}
          />
        </svg>
      </div>
    );
  }
);

ZapIcon.displayName = "ZapIcon";
export { ZapIcon };
