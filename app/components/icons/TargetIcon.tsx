"use client";

import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface TargetIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface TargetIconProps {
  size?: number;
  className?: string;
}

const TargetIcon = forwardRef<TargetIconHandle, TargetIconProps>(
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
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            animate={controls}
            variants={{
              normal: { scale: 1, opacity: 1 },
              animate: {
                scale: [1, 1.1, 1],
                opacity: [1, 0.7, 1],
                transition: { duration: 0.6, ease: "easeInOut" },
              },
            }}
            style={{ transformOrigin: "12px 12px" }}
          />
          <motion.circle
            cx="12"
            cy="12"
            r="6"
            animate={controls}
            variants={{
              normal: { scale: 1, opacity: 1 },
              animate: {
                scale: [1, 1.15, 1],
                opacity: [1, 0.6, 1],
                transition: { duration: 0.6, ease: "easeInOut", delay: 0.1 },
              },
            }}
            style={{ transformOrigin: "12px 12px" }}
          />
          <motion.circle
            cx="12"
            cy="12"
            r="2"
            animate={controls}
            variants={{
              normal: { scale: 1, opacity: 1 },
              animate: {
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1],
                transition: { duration: 0.6, ease: "easeInOut", delay: 0.2 },
              },
            }}
            style={{ transformOrigin: "12px 12px" }}
          />
        </svg>
      </div>
    );
  }
);

TargetIcon.displayName = "TargetIcon";
export { TargetIcon };
