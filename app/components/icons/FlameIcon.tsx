"use client";

import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface FlameIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface FlameIconProps {
  size?: number;
  className?: string;
}

const FlameIcon = forwardRef<FlameIconHandle, FlameIconProps>(
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
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.621 -2.333 5.588c0 3.704 3.134 6.706 7 6.706s7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235"
            animate={controls}
            variants={{
              normal: { y: 0, rotate: 0, x: 0 },
              animate: {
                y: [0, -2, -1, -2, 0],
                rotate: [0, 4, -3, 2, 0],
                x: [0, 1, -1, 0.5, 0],
                transition: { duration: 0.6, ease: "easeOut" },
              },
            }}
            style={{ transformOrigin: "50% 100%" }}
          />
        </svg>
      </div>
    );
  }
);

FlameIcon.displayName = "FlameIcon";
export { FlameIcon };
