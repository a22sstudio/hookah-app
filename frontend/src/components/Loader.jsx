import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ size = 'default', className = '' }) {
  const sizes = {
    sm: 'w-5 h-5',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`
        ${sizes[size]}
        border-2 border-zinc-800
        border-t-emerald-500
        rounded-full
        animate-spin
      `} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader size="lg" />
        <p className="text-zinc-500 text-sm">Загрузка...</p>
      </motion.div>
    </div>
  );
}
