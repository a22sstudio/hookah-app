import React from 'react';

const variants = {
  primary: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20',
  secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700',
  ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800',
  danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
  outline: 'bg-transparent border border-zinc-700 text-white hover:bg-zinc-800',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-sm',
  lg: 'px-6 py-4 text-base',
};

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  ...props 
}) {
  return (
    <button
      className={`
        font-medium
        rounded-xl
        flex items-center justify-center gap-2
        transition-all duration-200
        active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={18} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={18} />}
    </button>
  );
}
