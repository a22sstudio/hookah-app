import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'default',
  hover = false,
  onClick,
  ...props 
}) {
  const variants = {
    default: 'bg-zinc-900 border border-zinc-800',
    elevated: 'bg-zinc-800/50 border border-zinc-700/50',
    glass: 'bg-zinc-800/30 backdrop-blur-xl border border-zinc-700/30',
    gradient: 'bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-5',
  };

  return (
    <div
      className={`
        rounded-2xl
        transition-all duration-200
        ${variants[variant]}
        ${paddings[padding]}
        ${hover ? 'hover:bg-zinc-800 hover:border-zinc-600' : ''}
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
