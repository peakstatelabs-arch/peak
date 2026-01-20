"use client";

import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface MapPinCheckIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface MapPinCheckIconProps {
  size?: number;
  className?: string;
}

const MapPinCheckIcon = forwardRef<MapPinCheckIconHandle, MapPinCheckIconProps>(
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
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          initial="normal"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          variants={{
            normal: { y: 0 },
            animate: {
              y: [0, -5, -3],
              transition: { duration: 0.5, times: [0, 0.6, 1] },
            },
          }}
          viewBox="0 0 24 24"
          width={size}
        >
          <path d="M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728" />
          <circle cx="12" cy="10" r="3" />
          <motion.path
            animate={controls}
            d="m16 18 2 2 4-4"
            initial="normal"
            variants={{
              normal: { opacity: 1 },
              animate: {
                opacity: [0, 1],
                pathLength: [0, 1],
                transition: { delay: 0.3, duration: 0.3, opacity: { duration: 0.1, delay: 0.3 } },
              },
            }}
          />
        </motion.svg>
      </div>
    );
  }
);

MapPinCheckIcon.displayName = "MapPinCheckIcon";
export { MapPinCheckIcon };
