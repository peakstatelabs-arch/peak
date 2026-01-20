"use client";

import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface FlaskIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface FlaskIconProps {
  size?: number;
  className?: string;
}

const FlaskIcon = forwardRef<FlaskIconHandle, FlaskIconProps>(
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
          <motion.g
            animate={controls}
            variants={{
              normal: { rotate: 0 },
              animate: {
                rotate: [0, 6, -6, 3, -3, 0],
                transition: { duration: 0.8 },
              },
            }}
            style={{ transformOrigin: "center bottom" }}
          >
            <path d="M9 2v7.15A6 6 0 0 0 7.13 14l-2.1 4.2a2 2 0 0 0 1.79 2.8h10.36a2 2 0 0 0 1.79-2.8l-2.1-4.2A6 6 0 0 0 15 9.15V2" />
            <path d="M9 2h6" />
            <motion.path
              d="M12 14v2"
              animate={controls}
              variants={{
                normal: { opacity: 1 },
                animate: {
                  opacity: [1, 0.5, 1],
                  transition: { duration: 0.4, delay: 0.2 },
                },
              }}
            />
            <motion.path
              d="M10 17h4"
              animate={controls}
              variants={{
                normal: { opacity: 1 },
                animate: {
                  opacity: [1, 0.5, 1],
                  transition: { duration: 0.4, delay: 0.3 },
                },
              }}
            />
          </motion.g>
        </svg>
      </div>
    );
  }
);

FlaskIcon.displayName = "FlaskIcon";
export { FlaskIcon };
