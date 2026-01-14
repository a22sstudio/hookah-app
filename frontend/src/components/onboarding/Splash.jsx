import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Splash({ onComplete }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        {/* Smoke Logo */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          className="text-emerald-400"
        >
          <motion.path
            d="M40 10C40 10 30 20 30 30C30 40 40 45 40 55C40 65 30 70 30 70"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M50 15C50 15 45 22 45 30C45 38 50 42 50 50C50 58 45 62 45 65"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
          />
          <motion.path
            d="M32 18C32 18 28 24 28 32C28 40 32 44 32 52"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          />
          <motion.circle
            cx="40"
            cy="65"
            r="8"
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          />
        </svg>
        
        <motion.span
          className="text-xl font-semibold tracking-wide text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          Hookah App
        </motion.span>
      </motion.div>
    </div>
  );
}
