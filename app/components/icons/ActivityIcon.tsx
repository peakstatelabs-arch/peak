"use client";

import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ActivityIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ActivityIconProps {
  size?: number;
  className?: string;
}

const ActivityIcon = forwardRef<ActivityIconHandle, ActivityIconProps>(
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
            d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
            initial="normal"
            variants={{
              normal: {
                opacity: 1,
                pathLength: 1,
                pathOffset: 0,
                transition: { duration: 0.4, opacity: { duration: 0.1 } },
              },
              animate: {
                opacity: [0, 1],
                pathLength: [0, 1],
                pathOffset: [1, 0],
                transition: { duration: 0.6, ease: "linear", opacity: { duration: 0.1 } },
              },
            }}
          />
        </svg>
      </div>
    );
  }
);

ActivityIcon.displayName = "ActivityIcon";
export { ActivityIcon };
