import React from 'react';

const variants = {
  default: 'bg-zinc-800 text-zinc-400',
  green: 'bg-emerald-500/20 text-emerald-400',
  orange: 'bg-amber-500/20 text-amber-400',
  red: 'bg-red-500/20 text-red-400',
  blue: 'bg-blue-500/20 text-blue-400',
  purple: 'bg-purple-500/20 text-purple-400',
  pink: 'bg-pink-500/20 text-pink-400',
};

export default function Badge({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) {
  return (
    <span
      className={`
        inline-flex items-center
        px-2.5 py-1
        text-xs font-medium
        rounded-full
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
